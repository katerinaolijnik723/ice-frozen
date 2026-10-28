import { assets } from '../assets';
import {
  CHAIN_CAP,
  DEPTH_STEP_POINTS,
  MAX_DEPTH,
  SPAWN_FLOOR_MS,
  SPAWN_START_MS,
} from '../constants/config';

export type Kind = 'common' | 'fast' | 'golden' | 'can' | 'boot';

type Weight = { kind: Kind; w: number };

export const SPAWN_WEIGHTS: Weight[] = [
  { kind: 'common', w: 46 },
  { kind: 'fast', w: 20 },
  { kind: 'golden', w: 9 },
  { kind: 'can', w: 13 },
  { kind: 'boot', w: 12 },
];

const TOTAL_WEIGHT = SPAWN_WEIGHTS.reduce((acc, it) => acc + it.w, 0);

export function pickKind(): Kind {
  let roll = Math.random() * TOTAL_WEIGHT;
  for (let i = 0; i < SPAWN_WEIGHTS.length; i++) {
    roll -= SPAWN_WEIGHTS[i].w;
    if (roll <= 0) {
      return SPAWN_WEIGHTS[i].kind;
    }
  }
  return 'common';
}

export function isTrash(kind: Kind): boolean {
  return kind === 'can' || kind === 'boot';
}

const BASE_POINTS: Record<Kind, number> = {
  common: 10,
  fast: 25,
  golden: 30,
  can: 0,
  boot: 0,
};

/** Golden pays triple; everything else is multiplied by the current chain. */
export function pointsFor(kind: Kind, chain: number): number {
  if (isTrash(kind)) {
    return 0;
  }
  const mult = kind === 'golden' ? 3 : Math.max(1, Math.min(CHAIN_CAP, chain));
  return BASE_POINTS[kind] * mult;
}

export function nextChain(chain: number): number {
  return Math.min(CHAIN_CAP, chain + 1);
}

export function depthFor(score: number): number {
  return Math.min(MAX_DEPTH, 1 + Math.floor(score / DEPTH_STEP_POINTS));
}

/** How long one swimmer needs to cross the full board, in ms. */
export function travelDurationFor(kind: Kind, depth: number): number {
  const base =
    kind === 'fast' ? 2400 : kind === 'golden' ? 3400 : kind === 'common' ? 3800 : 4200;
  const mul = Math.pow(1.12, Math.max(0, depth - 1));
  return Math.max(900, Math.round(base / mul));
}

export function spawnIntervalFor(depth: number): number {
  const ms = Math.round(SPAWN_START_MS * Math.pow(0.9, Math.max(0, depth - 1)));
  return Math.max(SPAWN_FLOOR_MS, ms);
}

export const SPRITE_FOR_KIND = {
  common: assets.sprite1,
  fast: assets.sprite2,
  golden: assets.sprite3,
  can: assets.sprite4,
  boot: assets.sprite5,
} as const;

export const LABEL_FOR_KIND: Record<Kind, string> = {
  common: 'FISH  +10',
  fast: 'FAST  +25',
  golden: 'GOLD  x3',
  can: 'CAN  -1 LIFE',
  boot: 'BOOT  -1 LIFE',
};

/** Water column gradient darkens as the player goes deeper. */
export const DEPTH_GRADIENTS: string[][] = [
  ['#00558B', '#013A5E'],
  ['#01467A', '#012B47'],
  ['#013A5E', '#00121F'],
];

export function waterGradientFor(depth: number): string[] {
  const idx = Math.min(DEPTH_GRADIENTS.length - 1, Math.floor((depth - 1) / 2));
  return DEPTH_GRADIENTS[idx];
}
