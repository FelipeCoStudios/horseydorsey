import { HORSES } from "./data";

export const SAVE_VERSION = 1;
const KEY = "pepola-establo-v1";
const BACKUP = "pepola-establo-v1.bak";

export interface SavedHorse {
  id: string;
  x: number;
  z: number;
  yaw: number;
  happiness: number;
  discovered: boolean;
  registered: boolean;
  following: boolean;
}

export interface SaveData {
  version: number;
  player: { x: number; z: number; yaw: number };
  horses: SavedHorse[];
}

function defaults(): SaveData {
  return {
    version: SAVE_VERSION,
    player: { x: 0, z: 16, yaw: 0 },
    horses: HORSES.map((h) => ({
      id: h.id,
      x: h.spawn.x,
      z: h.spawn.z,
      yaw: Math.random() * Math.PI * 2,
      happiness: 0,
      discovered: false,
      registered: false,
      following: false,
    })),
  };
}

function migrate(raw: SaveData): SaveData {
  const base = defaults();
  const horses = base.horses.map((d) => {
    const found = raw.horses?.find((h) => h.id === d.id);
    return found ? { ...d, ...found, id: d.id } : d;
  });
  return {
    version: SAVE_VERSION,
    player: { ...base.player, ...raw.player },
    horses,
  };
}

export function loadSave(): SaveData {
  const fallback = defaults();
  if (typeof localStorage === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as SaveData;
    if (!parsed || typeof parsed !== "object") return fallback;
    return migrate(parsed);
  } catch {
    try {
      const bak = localStorage.getItem(BACKUP);
      if (bak) return migrate(JSON.parse(bak) as SaveData);
    } catch {
      /* ignore */
    }
    return fallback;
  }
}

export function writeSave(data: SaveData) {
  if (typeof localStorage === "undefined") return;
  try {
    const prev = localStorage.getItem(KEY);
    if (prev) localStorage.setItem(BACKUP, prev);
    localStorage.setItem(KEY, JSON.stringify({ ...data, version: SAVE_VERSION }));
  } catch {
    /* private mode / quota */
  }
}

export function clearSave() {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(BACKUP);
  } catch {
    /* ignore */
  }
}
