export type HorseType =
  | "Andaluz"
  | "Frisón"
  | "Criollo"
  | "Cuarto de Milla"
  | "Árabe"
  | "Appaloosa"
  | "Mustang"
  | "Poni";

export interface HorseDef {
  id: string;
  name: string;
  type: HorseType;
  colorLabel: string;
  coat: string;
  mane: string;
  speed: 1 | 2 | 3 | 4 | 5;
  strength: 1 | 2 | 3 | 4 | 5;
  calm: 1 | 2 | 3 | 4 | 5;
  spawn: { x: number; z: number };
  scale: number;
  spots: boolean;
  blaze: boolean;
  socks: boolean;
  patches: boolean;
  flavor: string;
}

export const HORSES: HorseDef[] = [
  {
    id: "luna",
    name: "Luna",
    type: "Andaluz",
    colorLabel: "tordo",
    coat: "#9aa3aa",
    mane: "#ece8e2",
    speed: 4,
    strength: 3,
    calm: 5,
    spawn: { x: -18, z: -14 },
    scale: 1.02,
    spots: false,
    blaze: true,
    socks: true,
    patches: false,
    flavor: "Elegante y serena. Observa el valle desde las lomas.",
  },
  {
    id: "trueno",
    name: "Trueno",
    type: "Frisón",
    colorLabel: "negro",
    coat: "#1a191c",
    mane: "#0d0c0e",
    speed: 3,
    strength: 5,
    calm: 2,
    spawn: { x: 24, z: 18 },
    scale: 1.16,
    spots: false,
    blaze: false,
    socks: false,
    patches: false,
    flavor: "Imponente y nervioso. Se gana con paciencia.",
  },
  {
    id: "canela",
    name: "Canela",
    type: "Criollo",
    colorLabel: "alazán",
    coat: "#8a4024",
    mane: "#3a2014",
    speed: 3,
    strength: 4,
    calm: 4,
    spawn: { x: -30, z: 16 },
    scale: 0.98,
    spots: false,
    blaze: true,
    socks: false,
    patches: false,
    flavor: "Fuerte y leal, nacido para el campo abierto.",
  },
  {
    id: "sol",
    name: "Sol",
    type: "Cuarto de Milla",
    colorLabel: "palomino",
    coat: "#d7b36a",
    mane: "#f2ead8",
    speed: 5,
    strength: 3,
    calm: 3,
    spawn: { x: 28, z: -20 },
    scale: 1.0,
    spots: false,
    blaze: false,
    socks: true,
    patches: false,
    flavor: "El más veloz del valle. Ama las rectas largas.",
  },
  {
    id: "nube",
    name: "Nube",
    type: "Árabe",
    colorLabel: "blanco",
    coat: "#efe6d6",
    mane: "#f7f1e6",
    speed: 5,
    strength: 2,
    calm: 4,
    spawn: { x: -8, z: 32 },
    scale: 0.94,
    spots: false,
    blaze: false,
    socks: false,
    patches: false,
    flavor: "Ligera como el viento de la tarde.",
  },
  {
    id: "manchas",
    name: "Manchas",
    type: "Appaloosa",
    colorLabel: "pinto",
    coat: "#e7dcc8",
    mane: "#2b2218",
    speed: 3,
    strength: 3,
    calm: 3,
    spawn: { x: 16, z: -32 },
    scale: 1.0,
    spots: true,
    blaze: true,
    socks: true,
    patches: false,
    flavor: "Curiosa y juguetona. Siempre aparece de reojo.",
  },
  {
    id: "moka",
    name: "Moka",
    type: "Mustang",
    colorLabel: "bayo",
    coat: "#6e4a28",
    mane: "#1f1610",
    speed: 4,
    strength: 4,
    calm: 2,
    spawn: { x: 36, z: 6 },
    scale: 1.04,
    spots: false,
    blaze: false,
    socks: false,
    patches: false,
    flavor: "Libre y desconfiada. El valle es suyo.",
  },
  {
    id: "copo",
    name: "Copo",
    type: "Poni",
    colorLabel: "crema",
    coat: "#e6d4ae",
    mane: "#c4a070",
    speed: 2,
    strength: 2,
    calm: 5,
    spawn: { x: -34, z: -8 },
    scale: 0.72,
    spots: false,
    blaze: true,
    socks: true,
    patches: false,
    flavor: "Pequeña, dulce y muy tranquila.",
  },
];

export const TOTAL_HORSES = HORSES.length;

export const HORSE_BY_ID = Object.fromEntries(HORSES.map((h) => [h.id, h])) as Record<
  string,
  HorseDef
>;
