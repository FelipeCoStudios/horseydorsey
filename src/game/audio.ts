let ctx: AudioContext | null = null;

export function unlockAudio() {
  if (typeof window === "undefined") return;
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
}

function tone(freq: number, dur: number, type: OscillatorType, gain = 0.05, slide?: number) {
  if (!ctx) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slide), t + dur);
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export function playCare(kind: "brush" | "pet" | "feed") {
  unlockAudio();
  if (kind === "brush") tone(520, 0.12, "triangle", 0.04, 340);
  else if (kind === "pet") {
    tone(660, 0.16, "sine", 0.045);
    tone(880, 0.2, "sine", 0.03);
  } else {
    tone(240, 0.14, "square", 0.03, 180);
    tone(360, 0.18, "sine", 0.035);
  }
}

export function playDiscover() {
  unlockAudio();
  tone(392, 0.18, "sine", 0.05);
  setTimeout(() => tone(523, 0.22, "sine", 0.05), 90);
  setTimeout(() => tone(659, 0.28, "sine", 0.045), 180);
}

export function playRegister() {
  unlockAudio();
  tone(330, 0.16, "triangle", 0.05);
  setTimeout(() => tone(494, 0.2, "triangle", 0.045), 110);
  setTimeout(() => tone(660, 0.32, "sine", 0.04), 220);
}

export function playUi() {
  unlockAudio();
  tone(480, 0.08, "sine", 0.03);
}
