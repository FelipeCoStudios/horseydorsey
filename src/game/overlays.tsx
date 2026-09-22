import { useCallback, useRef } from "react";
import { Apple, BookOpen, Brush, Heart, Home, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { care, exitRace, newGame, startGame } from "./sim";
import { setPhase, useGame, type HorseCard } from "./store";
import { queueInteract, queueJournal, setTouchAxes } from "./input";
import { unlockAudio } from "./audio";

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
      <div className="flex gap-1" aria-label={`${label} ${value} de 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={cn("h-1.5 w-4 rounded-full", i < value ? "bg-primary" : "bg-line")} />
        ))}
      </div>
    </div>
  );
}

function Hint({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-line bg-raised/80 px-3 py-1 text-xs text-muted">{children}</span>
  );
}

export function StartScreen() {
  const phase = useGame((s) => s.phase);
  if (phase !== "title") return null;
  return (
    <div className="pointer-events-auto absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-bg via-bg/75 to-transparent px-5 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))] sm:justify-end sm:px-10">
      <div className="mx-auto w-full max-w-lg animate-[rise_var(--motion-slow)_var(--ease-smooth-out)] rounded-xl border border-line bg-bg/82 p-6 sm:mx-0 sm:p-8">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">Valle del establo</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] text-fg text-balance sm:text-5xl">
          Valentina y el establo de Pepola
        </h1>
        <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-muted sm:text-base">
          Recorre el valle, descubre cada caballo y cuídalo. Cuando esté feliz, regístralo en el establo de tu
          hermano Pepola.
        </p>
        <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button
            size="xl"
            className="w-full sm:w-auto"
            onClick={() => {
              unlockAudio();
              startGame();
            }}
          >
            <Play className="size-4" />
            Jugar
          </Button>
          <div className="flex flex-wrap gap-2">
            <Hint>WASD caminar</Hint>
            <Hint>E cuidar</Hint>
            <Hint>J diario</Hint>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hud() {
  const phase = useGame((s) => s.phase);
  const discovered = useGame((s) => s.discovered);
  const registered = useGame((s) => s.registered);
  const total = useGame((s) => s.total);
  const prompt = useGame((s) => s.prompt);
  const toast = useGame((s) => s.toast);
  const careId = useGame((s) => s.careId);
  if (phase === "title") return null;

  return (
    <>
      <div className="pointer-events-none absolute left-4 top-[max(1rem,env(safe-area-inset-top))] right-4 flex items-start justify-between gap-3">
        <div className="pointer-events-auto rounded-xl border border-line bg-bg/82 px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-subtle">Establo de Pepola</p>
          <p className="mt-1 font-display text-xl tabular-nums text-fg">
            {registered}
            <span className="text-muted"> / {total}</span>
          </p>
          <p className="text-xs text-muted">{discovered} descubiertos</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="pointer-events-auto size-12 bg-bg/82"
            aria-label="Diario del establo"
            onClick={() => setPhase(phase === "journal" ? "playing" : "journal")}
          >
            <BookOpen className="size-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="pointer-events-auto size-12 bg-bg/82"
            aria-label={phase === "paused" ? "Reanudar" : "Pausa"}
            onClick={() => setPhase(phase === "paused" ? "playing" : "paused")}
          >
            {phase === "paused" ? <Play className="size-5" /> : <Pause className="size-5" />}
          </Button>
        </div>
      </div>

      {prompt && phase === "playing" && !careId ? (
        <div className="pointer-events-none absolute bottom-[7.5rem] left-1/2 z-10 w-[min(92vw,28rem)] -translate-x-1/2 sm:bottom-10">
          <div className="rounded-lg border border-line bg-bg/86 px-4 py-2.5 text-center text-sm text-fg">{prompt}</div>
        </div>
      ) : null}

      {toast ? (
        <div className="pointer-events-none absolute left-1/2 top-28 z-20 w-[min(92vw,26rem)] -translate-x-1/2">
          <div className="rounded-lg border border-line bg-raised px-4 py-3 text-center text-sm text-fg">{toast}</div>
        </div>
      ) : null}
    </>
  );
}

function CareActions() {
  const careId = useGame((s) => s.careId);
  const cooldown = useGame((s) => s.careCooldown);
  const card = useGame((s) => s.horses.find((h) => h.def.id === careId) ?? null);
  if (!careId || !card) return null;

  const busy = cooldown > 0;
  const full = card.happiness >= 100;

  return (
    <div className="pointer-events-auto absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-20 w-[min(96vw,28rem)] -translate-x-1/2">
      <div className="rounded-xl border border-line bg-bg p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-2xl text-fg">{card.def.name}</p>
            <p className="text-sm text-muted">
              {card.def.type} · {card.def.colorLabel}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => useGame.setState({ careId: null })}>
            Cerrar
          </Button>
        </div>
        <p className="mt-2 text-sm text-subtle">{card.def.flavor}</p>
        <div className="mt-3 space-y-2">
          <StatRow label="Velocidad" value={card.def.speed} />
          <StatRow label="Fuerza" value={card.def.strength} />
          <StatRow label="Calma" value={card.def.calm} />
        </div>
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-xs text-muted">
            <span>Felicidad</span>
            <span className="tabular-nums">{Math.round(card.happiness)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-[var(--motion-fast)]"
              style={{ width: `${card.happiness}%` }}
            />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Button variant="care" disabled={busy || full} onClick={() => care("brush")}>
            <Brush className="size-4" />
            Cepillar
          </Button>
          <Button variant="care" disabled={busy || full} onClick={() => care("pet")}>
            <Heart className="size-4" />
            Cariño
          </Button>
          <Button variant="care" disabled={busy || full} onClick={() => care("feed")}>
            <Apple className="size-4" />
            Alimentar
          </Button>
        </div>
        {full ? (
          <p className="mt-3 text-center text-sm text-primary">
            {card.following ? "Te sigue al establo de Pepola." : "Lista para el establo."}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function HorseJournalCard({ card }: { card: HorseCard }) {
  return (
    <article className={cn("rounded-xl border border-line bg-raised p-4", !card.discovered && "opacity-70")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-display text-lg text-fg">{card.discovered ? card.def.name : "Sin descubrir"}</h3>
        {card.registered ? (
          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[11px] font-medium text-primary">
            En el establo
          </span>
        ) : card.discovered ? (
          <span className="text-[11px] text-muted">En el valle</span>
        ) : null}
      </div>
      {card.discovered ? (
        <>
          <p className="mt-1 text-xs uppercase tracking-wide text-subtle">
            {card.def.type} · {card.def.colorLabel}
          </p>
          <p className="mt-2 text-sm text-muted">{card.def.flavor}</p>
          <div className="mt-3 space-y-1.5">
            <StatRow label="Velocidad" value={card.def.speed} />
            <StatRow label="Fuerza" value={card.def.strength} />
            <StatRow label="Calma" value={card.def.calm} />
          </div>
        </>
      ) : (
        <p className="mt-2 text-sm text-subtle">Explora el valle para encontrarlo.</p>
      )}
    </article>
  );
}

export function Journal() {
  const phase = useGame((s) => s.phase);
  const horses = useGame((s) => s.horses);
  if (phase !== "journal") return null;
  return (
    <div className="pointer-events-auto absolute inset-0 z-30 overflow-y-auto bg-bg/88 px-4 py-[max(1.5rem,env(safe-area-inset-top))]">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-subtle">Diario</p>
            <h2 className="font-display text-3xl text-fg">Caballos del valle</h2>
          </div>
          <Button variant="secondary" onClick={() => setPhase("playing")}>
            Cerrar
          </Button>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {horses.map((c) => (
            <HorseJournalCard key={c.def.id} card={c} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PauseMenu() {
  const phase = useGame((s) => s.phase);
  if (phase !== "paused") return null;
  return (
    <div className="pointer-events-auto absolute inset-0 z-30 flex items-center justify-center bg-bg/70 px-5">
      <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-6">
        <h2 className="font-display text-3xl text-fg">Pausa</h2>
        <p className="mt-2 text-sm text-muted">El valle te espera cuando vuelvas.</p>
        <div className="mt-6 flex flex-col gap-2">
          <Button size="lg" onClick={() => setPhase("playing")}>
            Reanudar
          </Button>
          <Button variant="secondary" size="lg" onClick={() => setPhase("journal")}>
            Diario
          </Button>
          <Button variant="ghost" size="lg" onClick={() => newGame()}>
            Nueva partida
          </Button>
        </div>
      </div>
    </div>
  );
}

export function WinScreen() {
  const phase = useGame((s) => s.phase);
  if (phase !== "win") return null;
  return (
    <div className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-bg/75 px-5">
      <div className="w-full max-w-md rounded-xl border border-line bg-surface p-6 text-center">
        <Home className="mx-auto size-8 text-primary" />
        <h2 className="mt-3 font-display text-3xl text-fg text-balance">El establo está completo</h2>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted">
          Pepola mira los corrales y sonríe. Valentina reunió a los ocho caballos del valle.
        </p>
        <Button className="mt-6" size="lg" onClick={() => newGame()}>
          Jugar de nuevo
        </Button>
      </div>
    </div>
  );
}


export function RaceOverlay() {
  const phase=useGame(s=>s.phase), time=useGame(s=>s.raceTime), best=useGame(s=>s.raceBest), cp=useGame(s=>s.raceCheckpoint), cd=useGame(s=>s.raceCountdown);
  if(phase!=="race") return null; const finished=cp>=6;
  return <div className="pointer-events-none absolute inset-0 z-30"><div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-xl border border-line bg-bg/88 px-5 py-3 text-center"><p className="text-[10px] uppercase tracking-[.22em] text-primary">Hipismo cronometrado</p><p className="font-display text-3xl tabular-nums text-fg">{time.toFixed(2)} s</p><p className="text-xs text-muted">Checkpoint {Math.min(cp,5)} / 5</p></div>{cd>0?<div className="absolute inset-0 flex items-center justify-center"><div className="rounded-2xl border border-line bg-bg/90 px-10 py-7 text-center"><p className="font-display text-6xl text-fg">{Math.ceil(cd)}</p><p className="mt-2 text-sm text-muted">¡Prepárate!</p></div></div>:null}{finished?<div className="pointer-events-auto absolute inset-x-4 bottom-8 mx-auto max-w-sm rounded-xl border border-line bg-surface p-5 text-center"><p className="text-xs uppercase tracking-[.2em] text-primary">Meta</p><h2 className="mt-1 font-display text-3xl text-fg">¡Carrera terminada!</h2><p className="mt-2 text-sm text-muted">Tiempo: <strong>{time.toFixed(2)} s</strong></p>{best!=null?<p className="text-xs text-subtle">Mejor tiempo: {best.toFixed(2)} s</p>:null}<div className="mt-4"><Button variant="secondary" className="pointer-events-auto w-full" onClick={exitRace}>Volver al valle</Button></div></div>:<div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-line bg-bg/80 px-4 py-2 text-xs text-muted">W acelera · A/D gira · Esc salir</div>}</div>;
}

export function TouchControls() {
  const phase = useGame((s) => s.phase);
  const origin = useRef<{ x: number; y: number; id: number } | null>(null);
  const stick = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLDivElement>(null);

  const end = useCallback(() => {
    origin.current = null;
    setTouchAxes(0, 0);
    if (knob.current) knob.current.style.transform = "translate(0px, 0px)";
  }, []);

  const move = useCallback((x: number, y: number) => {
    const o = origin.current;
    if (!o) return;
    const dx = x - o.x;
    const dy = y - o.y;
    const max = 42;
    const m = Math.hypot(dx, dy);
    const s = m > max ? max / m : 1;
    const kx = dx * s;
    const ky = dy * s;
    if (knob.current) knob.current.style.transform = `translate(${kx}px, ${ky}px)`;
    const steer = -(kx / max);
    const throttle = -(ky / max);
    setTouchAxes(steer, throttle);
  }, []);

  if (phase !== "playing") return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
      <div
        ref={stick}
        className="pointer-events-auto relative size-32 rounded-full border border-line bg-bg/55"
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          origin.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
        }}
        onPointerMove={(e) => {
          if (!origin.current || origin.current.id !== e.pointerId) return;
          move(e.clientX, e.clientY);
        }}
        onPointerUp={end}
        onPointerCancel={end}
      >
        <div
          ref={knob}
          className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg/30"
        />
      </div>
      <div className="pointer-events-auto mb-2 flex flex-col gap-2">
        <Button
          variant="secondary"
          className="h-14 min-w-28 bg-bg/75"
          onPointerDown={(e) => {
            e.preventDefault();
            queueInteract();
          }}
        >
          Cuidar
        </Button>
        <Button
          variant="ghost"
          className="h-12 min-w-28 bg-bg/55"
          onPointerDown={(e) => {
            e.preventDefault();
            queueJournal();
          }}
        >
          Diario
        </Button>
      </div>
    </div>
  );
}

export function CarePanel() {
  const phase = useGame((s) => s.phase);
  if (phase !== "playing") return null;
  return <CareActions />;
}
