const keys = new Set<string>();
let injected: string[] | null = null;
let touchSteer = 0;
let touchThrottle = 0;
let padSteer = 0;
let padThrottle = 0;
let interactQueued = false;
let journalQueued = false;
let prevInteract = false;
let prevEsc = false;
let prevJ = false;
let prevPadA = false;
let prevPadY = false;

const GAME_KEYS = new Set([
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "ArrowUp",
  "ArrowLeft",
  "ArrowDown",
  "ArrowRight",
  "KeyE",
  "KeyJ",
  "Space",
  "Escape",
]);

let attached = false;

function onKeyDown(e: KeyboardEvent) {
  if (GAME_KEYS.has(e.code)) e.preventDefault();
  if (e.repeat) return;
  keys.add(e.code);
}

function onKeyUp(e: KeyboardEvent) {
  keys.delete(e.code);
}

function onBlur() {
  keys.clear();
}

function onVisibility() {
  if (document.hidden) keys.clear();
}

export function attachInput() {
  if (attached || typeof window === "undefined") return;
  attached = true;
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);
  document.addEventListener("visibilitychange", onVisibility);
}

export function detachInput() {
  if (!attached) return;
  attached = false;
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("keyup", onKeyUp);
  window.removeEventListener("blur", onBlur);
  document.removeEventListener("visibilitychange", onVisibility);
}

function down(code: string): boolean {
  if (injected) return injected.includes(code);
  return keys.has(code);
}

export function getSteer(): number {
  let s = 0;
  if (down("KeyA") || down("ArrowLeft")) s += 1;
  if (down("KeyD") || down("ArrowRight")) s -= 1;
  s += touchSteer + padSteer;
  return Math.max(-1, Math.min(1, s));
}

export function getThrottle(): number {
  let t = 0;
  if (down("KeyW") || down("ArrowUp")) t += 1;
  if (down("KeyS") || down("ArrowDown")) t -= 1;
  t += touchThrottle + padThrottle;
  return Math.max(-1, Math.min(1, t));
}

export function setTouchAxes(steer: number, throttle: number) {
  touchSteer = Math.max(-1, Math.min(1, steer));
  touchThrottle = Math.max(-1, Math.min(1, throttle));
}

export function queueInteract() {
  interactQueued = true;
}

export function queueJournal() {
  journalQueued = true;
}

export function consumeInteract(): boolean {
  const key = down("KeyE") || down("Space");
  const edge = key && !prevInteract;
  prevInteract = key;
  if (edge) return true;
  if (interactQueued) {
    interactQueued = false;
    return true;
  }
  return false;
}

export function consumeJournal(): boolean {
  const key = down("KeyJ");
  const edge = key && !prevJ;
  prevJ = key;
  if (edge) return true;
  if (journalQueued) {
    journalQueued = false;
    return true;
  }
  return false;
}

export function consumeEscape(): boolean {
  const key = down("Escape");
  const edge = key && !prevEsc;
  prevEsc = key;
  return edge;
}

export function setInjectedKeys(codes: string[]) {
  injected = codes.length ? codes : null;
}

function radialDeadzone(x: number, y: number, dz = 0.18) {
  const m = Math.hypot(x, y);
  if (m < dz) return { x: 0, y: 0 };
  const scale = (m - dz) / (1 - dz) / m;
  return { x: x * scale, y: y * scale };
}

export function pollGamepad() {
  padSteer = 0;
  padThrottle = 0;
  if (injected) return;
  if (typeof navigator === "undefined" || !navigator.getGamepads) return;
  const pads = navigator.getGamepads();
  for (const pad of pads) {
    if (!pad || pad.mapping !== "standard") continue;
    const stick = radialDeadzone(pad.axes[0] ?? 0, pad.axes[1] ?? 0);
    padSteer = -stick.x;
    padThrottle = -stick.y;
    const a = !!pad.buttons[0]?.pressed;
    const y = !!pad.buttons[3]?.pressed;
    if (a && !prevPadA) interactQueued = true;
    if (y && !prevPadY) journalQueued = true;
    prevPadA = a;
    prevPadY = y;
    break;
  }
}
