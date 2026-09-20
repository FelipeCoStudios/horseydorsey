export const WORLD_HALF = 44;
export const BARN_INTERACT = 6.4;
export const HORSE_INTERACT = 3.6;
export const REGISTER_RANGE = 9;

export function heightAt(x: number, z: number): number {
  const d = Math.hypot(x, z);
  const flatten = Math.min(1, Math.max(0, (d - 9) / 10));
  const h =
    Math.sin(x * 0.075) * Math.cos(z * 0.055) * 1.55 +
    Math.sin(x * 0.032 + 1.4) * Math.cos(z * 0.038) * 2.05 +
    Math.sin((x + z) * 0.09) * 0.45;
  const pond = Math.hypot(x + 22, z - 10);
  const basin = pond < 6 ? -0.55 * (1 - pond / 6) : 0;
  return h * flatten + basin;
}

function mulberry32(seed: number) {
  return function rand() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Prop {
  x: number;
  z: number;
  r: number;
  s: number;
  rot: number;
}

export const TREES: Prop[] = [];
export const ROCKS: Prop[] = [];
export const BUSHES: Prop[] = [];
export const FENCE_POSTS: { x: number; z: number }[] = [];

(function scatter() {
  const rand = mulberry32(42);
  for (let i = 0; i < 48 && TREES.length < 36; i++) {
    const x = (rand() * 2 - 1) * (WORLD_HALF - 4);
    const z = (rand() * 2 - 1) * (WORLD_HALF - 4);
    if (Math.hypot(x, z) < 14) continue;
    if (Math.hypot(x + 22, z - 10) < 8) continue;
    TREES.push({
      x,
      z,
      r: 1.1,
      s: 0.85 + rand() * 0.55,
      rot: rand() * Math.PI * 2,
    });
  }
  for (let i = 0; i < 28; i++) {
    const x = (rand() * 2 - 1) * (WORLD_HALF - 3);
    const z = (rand() * 2 - 1) * (WORLD_HALF - 3);
    if (Math.hypot(x, z) < 10) continue;
    ROCKS.push({
      x,
      z,
      r: 0.7,
      s: 0.5 + rand() * 0.7,
      rot: rand() * Math.PI,
    });
  }
  for (let i = 0; i < 22; i++) {
    const x = (rand() * 2 - 1) * (WORLD_HALF - 5);
    const z = (rand() * 2 - 1) * (WORLD_HALF - 5);
    if (Math.hypot(x, z) < 12) continue;
    BUSHES.push({
      x,
      z,
      r: 0.6,
      s: 0.7 + rand() * 0.5,
      rot: rand() * Math.PI * 2,
    });
  }

  const pad = 11;
  for (let i = -pad; i <= pad; i += 2.2) {
    FENCE_POSTS.push({ x: i, z: -pad });
    FENCE_POSTS.push({ x: i, z: pad });
    FENCE_POSTS.push({ x: -pad, z: i });
    FENCE_POSTS.push({ x: pad, z: i });
  }
})();

const BARN_MIN_X = -4.6;
const BARN_MAX_X = 4.6;
const BARN_MIN_Z = -5.2;
const BARN_MAX_Z = 3.2;

export function collideMove(
  x: number,
  z: number,
  nx: number,
  nz: number,
  radius: number,
): { x: number; z: number } {
  const limit = WORLD_HALF - 1.4;
  nx = Math.max(-limit, Math.min(limit, nx));
  nz = Math.max(-limit, Math.min(limit, nz));

  const hitsBarn = (px: number, pz: number) =>
    px > BARN_MIN_X - radius &&
    px < BARN_MAX_X + radius &&
    pz > BARN_MIN_Z - radius &&
    pz < BARN_MAX_Z + radius;

  let xOut = nx;
  let zOut = nz;
  if (hitsBarn(nx, nz)) {
    if (!hitsBarn(x, nz)) xOut = x;
    else if (!hitsBarn(nx, z)) zOut = z;
    else {
      xOut = x;
      zOut = z;
    }
  }

  for (const t of TREES) {
    const dx = xOut - t.x;
    const dz = zOut - t.z;
    const min = radius + t.r * t.s;
    const d2 = dx * dx + dz * dz;
    if (d2 < min * min && d2 > 0.0001) {
      const d = Math.sqrt(d2);
      const push = (min - d) / d;
      xOut += dx * push;
      zOut += dz * push;
    }
  }

  xOut = Math.max(-limit, Math.min(limit, xOut));
  zOut = Math.max(-limit, Math.min(limit, zOut));
  return { x: xOut, z: zOut };
}

export const STALLS: { x: number; z: number; yaw: number }[] = [
  { x: -7.4, z: -3.2, yaw: Math.PI * 0.5 },
  { x: -7.4, z: 0.2, yaw: Math.PI * 0.5 },
  { x: -7.4, z: 3.4, yaw: Math.PI * 0.5 },
  { x: 7.4, z: -3.2, yaw: -Math.PI * 0.5 },
  { x: 7.4, z: 0.2, yaw: -Math.PI * 0.5 },
  { x: 7.4, z: 3.4, yaw: -Math.PI * 0.5 },
  { x: -3.2, z: -7.6, yaw: 0 },
  { x: 3.2, z: -7.6, yaw: 0 },
];
