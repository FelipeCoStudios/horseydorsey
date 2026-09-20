import { create } from "zustand";
import { HORSES, TOTAL_HORSES, type HorseDef } from "./data";

export type Phase = "title" | "playing" | "paused" | "journal" | "win";

export interface HorseCard {
  def: HorseDef;
  happiness: number;
  discovered: boolean;
  registered: boolean;
  following: boolean;
}

export interface GameUI {
  phase: Phase;
  nearbyId: string | null;
  careId: string | null;
  pepolaNear: boolean;
  inRegisterZone: boolean;
  followingCount: number;
  discovered: number;
  registered: number;
  total: number;
  toast: string | null;
  prompt: string | null;
  horses: HorseCard[];
  careCooldown: number;
}

const emptyCards = (): HorseCard[] =>
  HORSES.map((def) => ({
    def,
    happiness: 0,
    discovered: false,
    registered: false,
    following: false,
  }));

export const useGame = create<GameUI>(() => ({
  phase: "title",
  nearbyId: null,
  careId: null,
  pepolaNear: false,
  inRegisterZone: false,
  followingCount: 0,
  discovered: 0,
  registered: 0,
  total: TOTAL_HORSES,
  toast: null,
  prompt: null,
  horses: emptyCards(),
  careCooldown: 0,
}));

export function setPhase(phase: Phase) {
  useGame.setState({ phase });
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;
export function showToast(message: string) {
  useGame.setState({ toast: message });
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    useGame.setState({ toast: null });
  }, 2600);
}
