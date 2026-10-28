/** Tunable timings / balance for IceFrozen. */

// Splash. MUST stay >= 6000 so the automated screenshot window catches the Loader.
export const LOADER_DURATION_MS = 8000;
export const LOADER_FADE_MS = 320;

// Hook cycle
export const HOOK_DOWN_MS = 420;
export const HOOK_UP_MS = 320;
export const RESULT_FLASH_MS = 260;

// Golden fish
export const FREEZE_MS = 1200;

// Spawner
export const SPAWN_START_MS = 1100;
export const SPAWN_FLOOR_MS = 520;
export const MAX_ENTITIES = 7;
export const LANES = 3;

// Round
export const MAX_LIVES = 3;
export const START_BALANCE = 1000;
export const CHAIN_CAP = 5;
export const DEPTH_STEP_POINTS = 150;
export const MAX_DEPTH = 6;

// Guarantees the GameOver screen is reachable with zero input (automated walkthrough).
export const IDLE_BACKSTOP_MS = 26000;
export const IDLE_DRAIN_MS = 1200;

// Board
export const SPRITE_SIZE = 56;
export const HOOK_CATCH_HALF_W = 34;
