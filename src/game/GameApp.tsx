import { useEffect, useState } from "react";
import { GameCanvas } from "./Scene";
import { CarePanel, Hud, Journal, PauseMenu, StartScreen, TouchControls, WinScreen, RaceOverlay } from "./overlays";
import { attachInput, detachInput } from "./input";
import { installControlsProbe, resetSim } from "./sim";

export function GameApp() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    attachInput();
    resetSim(true);
    installControlsProbe();
    return () => detachInput();
  }, []);

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-bg text-fg">
      {mounted ? (
        <div className="absolute inset-0">
          <GameCanvas />
        </div>
      ) : (
        <div className="absolute inset-0 bg-bg" />
      )}
      <div className="pointer-events-none absolute inset-0">
        <StartScreen />
        <Hud />
        <CarePanel />
        <TouchControls />
        <Journal />
        <PauseMenu />
        <WinScreen />
        <RaceOverlay />
      </div>
    </main>
  );
}
