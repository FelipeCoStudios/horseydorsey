import { HORSES, HORSE_BY_ID, TOTAL_HORSES } from "./data";
import {
  HORSE_INTERACT,
  REGISTER_RANGE,
  STALLS,
  collideMove,
  heightAt,
} from "./world";
import {
  attachInput,
  consumeEscape,
  consumeInteract,
  consumeJournal,
  getSteer,
  getThrottle,
  pollGamepad,
  queueInteract,
  setInjectedKeys,
} from "./input";
import { loadSave, writeSave, clearSave, type SaveData } from "./save";
import { playCare, playDiscover, playRegister } from "./audio";
import { setPhase, showToast, useGame, type Phase } from "./store";

export interface HorseSim {
  id: string;
  x: number;
  z: number;
  yaw: number;
  speed: number;
  walkPhase: number;
  happiness: number;
  discovered: boolean;
  registered: boolean;
  following: boolean;
  wanderX: number;
  wanderZ: number;
  wanderT: number;
  stall: number;
}

export interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  max: number;
  size: number;
  color: string;
}

export const sim = {
  player: { x: 0, z: 16, yaw: 0, speed: 0, walkPhase: 0 },
  horses: [] as HorseSim[],
  particles: [] as Particle[],
  time: 0,
  careCooldown: 0,
  saveAcc: 0,
  uiAcc: 0,
  ready: false,
  raceHorseId: "luna" as string, raceTime: 0, raceCheckpoint: 1,
  raceCountdown: 0, raceFinished: false, raceSlow: 0,
};

const WALK = 7.4;
const TURN = 2.45;
const RACE_TURN = 2.1;
const RACE_ROUTE = [
  { x: 0, z: 16 }, { x: 16, z: 16 }, { x: 16, z: -16 },
  { x: -16, z: -16 }, { x: -16, z: 16 }, { x: 0, z: 16 },
];
const FIXED = 1 / 60;
let accumulator = 0;

function makeHorse(id: string, partial?: Partial<HorseSim>): HorseSim {
  const def = HORSE_BY_ID[id];
  return {
    id,
    x: def.spawn.x,
    z: def.spawn.z,
    yaw: Math.PI * 0.25,
    speed: 0,
    walkPhase: 0,
    happiness: 0,
    discovered: false,
    registered: false,
    following: false,
    wanderX: def.spawn.x,
    wanderZ: def.spawn.z,
    wanderT: 1 + Math.random() * 3,
    stall: -1,
    ...partial,
  };
}

sim.horses = HORSES.map((h) => makeHorse(h.id));

export function resetSim(fromSave = true) {
  const data = fromSave ? loadSave() : null;
  sim.player = data
    ? { x: data.player.x, z: data.player.z, yaw: data.player.yaw, speed: 0, walkPhase: 0 }
    : { x: 0, z: 16, yaw: 0, speed: 0, walkPhase: 0 };
  sim.horses = HORSES.map((h, i) => {
    const s = data?.horses.find((x) => x.id === h.id);
    return makeHorse(h.id, s ? { ...s, stall: s.registered ? i : -1, speed: 0, walkPhase: 0, wanderT: 2 } : undefined);
  });
  sim.particles = [];
  sim.time = 0;
  sim.careCooldown = 0;
  sim.raceTime = 0; sim.raceCheckpoint = 1; sim.raceCountdown = 0;
  sim.raceFinished = false; sim.raceSlow = 0;
  sim.raceHorseId = sim.horses.find((h) => h.registered)?.id ?? "luna";
  sim.ready = true;
  pushUI();
}

function snapshot(): SaveData {
  return {
    version: 1,
    player: { x: sim.player.x, z: sim.player.z, yaw: sim.player.yaw },
    horses: sim.horses.map((h) => ({
      id: h.id,
      x: h.x,
      z: h.z,
      yaw: h.yaw,
      happiness: h.happiness,
      discovered: h.discovered,
      registered: h.registered,
      following: h.following,
    })),
  };
}

export function persist() {
  writeSave(snapshot());
}

function spawnBurst(x: number, y: number, z: number, color: string, n = 8) {
  for (let i = 0; i < n; i++) {
    if (sim.particles.length > 36) sim.particles.shift();
    const a = Math.random() * Math.PI * 2;
    sim.particles.push({
      x,
      y,
      z,
      vx: Math.cos(a) * (0.6 + Math.random()),
      vy: 1.4 + Math.random() * 1.4,
      vz: Math.sin(a) * (0.6 + Math.random()),
      life: 0.7 + Math.random() * 0.4,
      max: 1,
      size: 0.08 + Math.random() * 0.08,
      color,
    });
  }
}

function nearbyHorse(): HorseSim | null {
  const p = sim.player;
  let best: HorseSim | null = null;
  let bestD = HORSE_INTERACT;
  for (const h of sim.horses) {
    if (h.registered) continue;
    const d = Math.hypot(h.x - p.x, h.z - p.z);
    if (d < bestD) {
      bestD = d;
      best = h;
    }
  }
  return best;
}

function pepolaNear(): boolean {
  return Math.hypot(sim.player.x - 2.4, sim.player.z - 5.2) < 4.2;
}

function inRegisterZone(): boolean {
  return Math.hypot(sim.player.x, sim.player.z) < REGISTER_RANGE;
}

function currentPhase(): Phase {
  return useGame.getState().phase;
}

function promptFor(near: HorseSim | null, careId: string | null): string | null {
  const phase = currentPhase();
  if (phase !== "playing") return null;
  if (careId) {
    const h = sim.horses.find((x) => x.id === careId);
    if (!h) return null;
    const def = HORSE_BY_ID[h.id];
    if (h.happiness >= 100 && inRegisterZone()) {
      return `E · Registrar a ${def.name} en el establo`;
    }
    if (h.happiness >= 100) return `Lleva a ${def.name} con Pepola`;
    return `Cuida a ${def.name}`;
  }
  if (near) {
    const def = HORSE_BY_ID[near.id];
    if (near.happiness >= 100) return `E · ${def.name} te sigue`;
    return `E · Cuidar a ${def.name}`;
  }
  if (inRegisterZone() && sim.horses.some((h) => h.following && !h.registered)) {
    return "E · Registrar caballos con Pepola";
  }
  if (pepolaNear()) return "E · Hablar con Pepola";
  return "Busca caballos en el valle";
}

function pushUI() {
  const near = nearbyHorse();
  const ui = useGame.getState();
  let careId = ui.careId && sim.horses.some((h) => h.id === ui.careId && !h.registered)
    ? ui.careId
    : null;
  if (careId) {
    const h = sim.horses.find((x) => x.id === careId);
    if (h && Math.hypot(h.x - sim.player.x, h.z - sim.player.z) > 5.8) {
      careId = null;
    }
  }
  const discovered = sim.horses.filter((h) => h.discovered).length;
  const registered = sim.horses.filter((h) => h.registered).length;
  useGame.setState({
    nearbyId: near?.id ?? null,
    careId,
    pepolaNear: pepolaNear(),
    inRegisterZone: inRegisterZone(),
    followingCount: sim.horses.filter((h) => h.following && !h.registered).length,
    discovered,
    registered,
    total: TOTAL_HORSES,
    prompt: promptFor(near, careId),
    careCooldown: sim.careCooldown,
    raceTime: sim.raceTime, raceBest: ui.raceBest, raceCheckpoint: sim.raceCheckpoint, raceCountdown: sim.raceCountdown,
    horses: sim.horses.map((h) => ({
      def: HORSE_BY_ID[h.id],
      happiness: h.happiness,
      discovered: h.discovered,
      registered: h.registered,
      following: h.following,
    })),
  });
}

function faceToward(fromX: number, fromZ: number, toX: number, toZ: number, yaw: number, rate: number, dt: number) {
  const target = Math.atan2(-(toX - fromX), -(toZ - fromZ));
  let d = target - yaw;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  const max = rate * dt;
  if (d > max) d = max;
  if (d < -max) d = -max;
  return yaw + d;
}

function stepPlayer(dt: number) {
  const p = sim.player;
  const steer = getSteer();
  const throttle = getThrottle();
  p.yaw += steer * TURN * dt;

  const target = throttle * (throttle >= 0 ? WALK : WALK * 0.55);
  const k = throttle !== 0 ? 14 : 20;
  p.speed += (target - p.speed) * Math.min(1, k * dt);
  if (Math.abs(p.speed) < 0.04 && throttle === 0) p.speed = 0;

  const fx = -Math.sin(p.yaw);
  const fz = -Math.cos(p.yaw);
  const moved = collideMove(p.x, p.z, p.x + fx * p.speed * dt, p.z + fz * p.speed * dt, 0.45);
  p.x = moved.x;
  p.z = moved.z;
  p.walkPhase += Math.abs(p.speed) * dt * 2.4;
}

function stepHorses(dt: number) {
  const p = sim.player;
  const followers = sim.horses.filter((h) => h.following && !h.registered);
  const careId = useGame.getState().careId;
  const playing = currentPhase() === "playing";

  for (const h of sim.horses) {
    const def = HORSE_BY_ID[h.id];
    if (h.registered) {
      const stall = STALLS[h.stall] ?? STALLS[0];
      h.x += (stall.x - h.x) * Math.min(1, 3 * dt);
      h.z += (stall.z - h.z) * Math.min(1, 3 * dt);
      h.yaw = faceToward(h.x, h.z, stall.x + Math.sin(stall.yaw), stall.z + Math.cos(stall.yaw), h.yaw, 2, dt);
      h.speed = 0;
      h.walkPhase += dt * 0.8;
      continue;
    }

    if (h.following) {
      const idx = followers.indexOf(h);
      const side = idx % 2 === 0 ? -1 : 1;
      const row = Math.floor(idx / 2) + 1;
      const fx = -Math.sin(p.yaw);
      const fz = -Math.cos(p.yaw);
      const rx = Math.cos(p.yaw);
      const rz = -Math.sin(p.yaw);
      const tx = p.x - fx * (2.6 + row * 2.1) + rx * side * 1.5;
      const tz = p.z - fz * (2.6 + row * 2.1) + rz * side * 1.5;
      const dx = tx - h.x;
      const dz = tz - h.z;
      const dist = Math.hypot(dx, dz);
      const followSpeed = Math.min(WALK * 1.05, dist * 2.2);
      if (dist > 0.35) {
        h.x += (dx / dist) * followSpeed * dt;
        h.z += (dz / dist) * followSpeed * dt;
        h.yaw = faceToward(h.x, h.z, p.x, p.z, h.yaw, 4, dt);
        h.speed = followSpeed;
      } else {
        h.speed = 0;
      }
      h.walkPhase += h.speed * dt * 2.2;
      continue;
    }

    if (careId === h.id) {
      h.speed = 0;
      h.yaw = faceToward(h.x, h.z, p.x, p.z, h.yaw, 3, dt);
      h.walkPhase += dt * 0.7;
      continue;
    }

    const distP = Math.hypot(h.x - p.x, h.z - p.z);
    const shy = def.calm <= 2 && h.happiness < 40 && playing && distP < 7;

    h.wanderT -= dt;
    if (h.wanderT <= 0 || shy) {
      if (shy) {
        const ang = Math.atan2(h.x - p.x, h.z - p.z);
        h.wanderX = h.x + Math.sin(ang) * 8;
        h.wanderZ = h.z + Math.cos(ang) * 8;
        h.wanderT = 1.2;
      } else {
        const a = Math.random() * Math.PI * 2;
        const r = 4 + Math.random() * 7;
        h.wanderX = def.spawn.x + Math.cos(a) * r;
        h.wanderZ = def.spawn.z + Math.sin(a) * r;
        h.wanderT = 3 + Math.random() * 5;
      }
    }

    const dx = h.wanderX - h.x;
    const dz = h.wanderZ - h.z;
    const dist = Math.hypot(dx, dz);
    const walk = (1.6 + (5 - def.calm) * 0.25) * (shy ? 1.6 : 1);
    if (dist > 0.5) {
      h.x += (dx / dist) * walk * dt;
      h.z += (dz / dist) * walk * dt;
      h.yaw = faceToward(h.x, h.z, h.wanderX, h.wanderZ, h.yaw, 2.4, dt);
      h.speed = walk;
    } else {
      h.speed = 0;
    }
    h.walkPhase += h.speed * dt * 2.1;
  }
}

function stepParticles(dt: number) {
  for (const q of sim.particles) {
    q.life -= dt;
    q.x += q.vx * dt;
    q.y += q.vy * dt;
    q.z += q.vz * dt;
    q.vy -= 1.8 * dt;
  }
  sim.particles = sim.particles.filter((q) => q.life > 0);
}

function registerFollowers() {
  let n = 0;
  for (const h of sim.horses) {
    if (!h.following || h.registered) continue;
    if (!h.discovered) continue;
    h.registered = true;
    h.following = false;
    h.stall = sim.horses.findIndex((x) => x.id === h.id);
    n += 1;
    const def = HORSE_BY_ID[h.id];
    spawnBurst(h.x, heightAt(h.x, h.z) + 1.4, h.z, "#8fa084", 10);
    showToast(`${def.name} entra al establo de Pepola`);
  }
  if (n > 0) {
    playRegister();
    persist();
    if (sim.horses.every((h) => h.registered)) {
      setTimeout(() => setPhase("win"), 700);
    }
  }
}


function raceHorse(): HorseSim { return sim.horses.find((h) => h.id === sim.raceHorseId) ?? sim.horses[0]!; }

export function startRace() {
  if (currentPhase() !== "playing" || !pepolaNear()) return;
  const horse = raceHorse(); const start = RACE_ROUTE[0];
  sim.player = { x: start.x, z: start.z, yaw: -Math.PI / 2, speed: 0, walkPhase: 0 };
  Object.assign(horse, { x: start.x, z: start.z, yaw: sim.player.yaw, speed: 0, walkPhase: 0 });
  sim.raceTime = 0; sim.raceCheckpoint = 1; sim.raceCountdown = 3; sim.raceFinished = false;
  setPhase("race"); showToast(`Pepola: ¡A correr con ${HORSE_BY_ID[horse.id].name}!`);
}

export function exitRace() {
  const horse = raceHorse(); sim.player = { x: 2.4, z: 8.8, yaw: Math.PI, speed: 0, walkPhase: 0 };
  Object.assign(horse, { x: sim.player.x, z: sim.player.z, speed: 0, walkPhase: 0 });
  sim.raceFinished = false; setPhase("playing");
}

function stepRace(dt: number) {
  const horse = raceHorse(); const def = HORSE_BY_ID[horse.id];
  if (sim.raceCountdown > 0) { sim.raceCountdown = Math.max(0, sim.raceCountdown - dt); horse.speed = 0; return; }
  if (sim.raceFinished) return;
  sim.player.yaw += getSteer() * RACE_TURN * dt;
  const throttle = Math.max(0, getThrottle()); const maxSpeed = 8.2 + def.speed * 0.9;
  horse.speed += (throttle * maxSpeed - horse.speed) * Math.min(1, (throttle ? 5.5 : 8) * dt);
  if (horse.speed < 0.03) horse.speed = 0;
  const fx = -Math.sin(sim.player.yaw), fz = -Math.cos(sim.player.yaw);
  const moved = collideMove(sim.player.x, sim.player.z, sim.player.x + fx * horse.speed * dt, sim.player.z + fz * horse.speed * dt, 0.62);
  sim.player.x = moved.x; sim.player.z = moved.z; sim.player.speed = horse.speed; sim.player.walkPhase += horse.speed * dt * 1.8;
  horse.x = sim.player.x; horse.z = sim.player.z; horse.yaw = sim.player.yaw; horse.walkPhase = sim.player.walkPhase;
  sim.raceTime += dt;
  const target = RACE_ROUTE[sim.raceCheckpoint];
  if (target && Math.hypot(sim.player.x-target.x, sim.player.z-target.z) < 4.2) {
    sim.raceCheckpoint++;
    if (sim.raceCheckpoint >= RACE_ROUTE.length) {
      sim.raceFinished = true; const best = useGame.getState().raceBest;
      useGame.setState({ raceTime: sim.raceTime, raceBest: best == null ? sim.raceTime : Math.min(best, sim.raceTime), raceCheckpoint: sim.raceCheckpoint });
      showToast(`¡Meta! Tiempo: ${sim.raceTime.toFixed(2)} s`);
    }
  }
  useGame.setState({ raceTime: sim.raceTime, raceCheckpoint: sim.raceCheckpoint, raceCountdown: sim.raceCountdown });
}

function interact() {
  const phase = currentPhase();
  if (phase !== "playing") return;
  const ui = useGame.getState();
  const near = nearbyHorse();

  if (ui.careId) {
    const h = sim.horses.find((x) => x.id === ui.careId);
    if (h && h.happiness >= 100 && inRegisterZone()) {
      h.following = true;
      registerFollowers();
      useGame.setState({ careId: null });
      return;
    }
    useGame.setState({ careId: null });
    return;
  }

  if (near) {
    useGame.setState({ careId: near.id });
    return;
  }

  if (inRegisterZone() && sim.horses.some((h) => h.following && !h.registered)) {
    registerFollowers();
    return;
  }

  if (pepolaNear()) startRace();
}

export function care(kind: "brush" | "pet" | "feed") {
  if (currentPhase() !== "playing") return;
  if (sim.careCooldown > 0) return;
  const id = useGame.getState().careId;
  if (!id) return;
  const h = sim.horses.find((x) => x.id === id);
  if (!h || h.registered) return;
  const def = HORSE_BY_ID[h.id];
  const amt = kind === "feed" ? 28 : kind === "brush" ? 22 : 18;
  const before = h.happiness;
  h.happiness = Math.min(100, h.happiness + amt);
  sim.careCooldown = 0.38;
  const y = heightAt(h.x, h.z) + 1.5;
  spawnBurst(h.x, y, h.z, kind === "pet" ? "#e8b4b4" : kind === "feed" ? "#c4a574" : "#d7c4a8", 7);
  playCare(kind);

  if (before < 100 && h.happiness >= 100 && !h.discovered) {
    h.discovered = true;
    h.following = true;
    playDiscover();
    showToast(`Valentina descubre a ${def.name}`);
    persist();
  } else if (h.happiness >= 100 && !h.following) {
    h.following = true;
  }
  pushUI();
}

export function startGame() {
  attachInput();
  if (!sim.ready) resetSim(true);
  setPhase("playing");
}

export function newGame() {
  clearSave();
  resetSim(false);
  sim.player = { x: 0, z: 16, yaw: 0, speed: 0, walkPhase: 0 };
  setPhase("playing");
  persist();
}

export function tick(delta: number) {
  const dtFrame = Math.min(delta, 0.1);
  sim.time += dtFrame;
  pollGamepad();

  const phase = currentPhase();

  if (consumeEscape()) {
    if (phase === "playing") setPhase("paused");
    else if (phase === "paused" || phase === "journal") setPhase("playing");
    else if (phase === "race") exitRace();
  }
  if (consumeJournal()) {
    if (phase === "playing") setPhase("journal");
    else if (phase === "journal") setPhase("playing");
  }

  accumulator += dtFrame;
  if (accumulator > 0.25) accumulator = 0.25;
  while (accumulator >= FIXED) {
    const dt = FIXED;
    if (phase === "playing") {
      stepPlayer(dt);
      if (consumeInteract()) interact();
    } else if (phase === "race") {
      stepRace(dt);
    } else { consumeInteract(); }
    if (phase !== "race") stepHorses(dt);
    stepParticles(dt);
    if (sim.careCooldown > 0) sim.careCooldown = Math.max(0, sim.careCooldown - dt);
    accumulator -= FIXED;
  }

  sim.saveAcc += dtFrame;
  if (sim.saveAcc > 8) {
    sim.saveAcc = 0;
    if (phase === "playing") persist();
  }
  sim.uiAcc += dtFrame;
  if (sim.uiAcc > 0.12) {
    sim.uiAcc = 0;
    pushUI();
  }
}

export function installControlsProbe() {
  if (typeof window === "undefined") return;
  window.__controlsTest = {
    getYaw: () => sim.player.yaw,
    getSpeed: () => sim.player.speed,
    setKeys: (codes: string[]) => setInjectedKeys(codes),
    setSteer: (v: number) => {
      if (v > 0.2) setInjectedKeys(["KeyA"]);
      else if (v < -0.2) setInjectedKeys(["KeyD"]);
      else setInjectedKeys([]);
    },
  };
  window.__qa = {
    teleport: (x: number, z: number) => {
      sim.player.x = x;
      sim.player.z = z;
    },
    horse: (id: string) => sim.horses.find((h) => h.id === id),
    interact: () => queueInteract(),
  };
}

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      setKeys?: (codes: string[]) => void;
      setSteer?: (v: number) => void;
    };
    __qa?: {
      teleport: (x: number, z: number) => void;
      horse: (id: string) => HorseSim | undefined;
      interact: () => void;
    };
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("visibilitychange", () => {
    if (document.hidden) persist();
  });
  window.addEventListener("pagehide", () => persist());
}
