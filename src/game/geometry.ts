import { LANES } from '../constants/config';

export const BOARD_PAD = 6;
export const BOARD_BORDER = 2;
/** PAD + BORDER - the single frame constant the whole board is measured from. */
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER; // 8
export const RIM_H = 56;

export type BoardGeom = {
  width: number;
  height: number;
  innerW: number;
  waterH: number;
  laneH: number;
  rimH: number;
  centerX: number;
};

export function computeBoard(screenW: number, areaH: number): BoardGeom {
  const width = Math.min(screenW - 32, 380);
  const innerW = width - 2 * BOARD_FRAME;
  const maxH = Math.max(240, areaH - 24);
  const wanted = Math.round(innerW * 1.15) + RIM_H;
  const height = Math.min(wanted, maxH);
  const waterH = height - RIM_H;
  const laneH = Math.max(48, Math.floor((waterH - 2 * BOARD_FRAME) / LANES));
  return {
    width,
    height,
    innerW,
    waterH,
    laneH,
    rimH: RIM_H,
    centerX: innerW / 2,
  };
}

/** Y of a lane centre, relative to the inner (padded) water column. */
export function laneCenterY(laneH: number, lane: number): number {
  return laneH * lane + laneH / 2;
}

export function laneTopY(laneH: number, lane: number): number {
  return laneH * lane;
}

/** How far the hook head has to travel (board coords) to reach a lane centre. */
export function hookDepthFor(laneH: number, lane: number): number {
  return BOARD_FRAME + laneCenterY(laneH, lane);
}
