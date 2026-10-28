import { useCallback, useEffect, useRef, useState } from 'react';

import { IDLE_BACKSTOP_MS, IDLE_DRAIN_MS, MAX_LIVES } from '../constants/config';
import { depthFor, nextChain, pointsFor, type Kind } from '../game/rules';

export type RoundStats = {
  score: number;
  caught: number;
  goldenCaught: number;
  depth: number;
};

/**
 * Score / lives / chain / depth plus the idle backstop that guarantees the
 * GameOver screen is reachable with zero player input.
 */
export function useRoundState(onGameOver: (stats: RoundStats) => void) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [chain, setChain] = useState(1);
  const [caught, setCaught] = useState(0);
  const [goldenCaught, setGoldenCaught] = useState(0);
  const [idleArmed, setIdleArmed] = useState(true);

  const chainRef = useRef(1);
  const endedRef = useRef(false);
  const statsRef = useRef<RoundStats>({ score: 0, caught: 0, goldenCaught: 0, depth: 1 });

  const depth = depthFor(score);
  statsRef.current = { score, caught, goldenCaught, depth };

  const registerCatch = useCallback((kind: Kind): number => {
    const pts = pointsFor(kind, chainRef.current);
    chainRef.current = nextChain(chainRef.current);
    setChain(chainRef.current);
    setScore(s => s + pts);
    setCaught(c => c + 1);
    if (kind === 'golden') {
      setGoldenCaught(g => g + 1);
    }
    return pts;
  }, []);

  const registerTrash = useCallback(() => {
    chainRef.current = 1;
    setChain(1);
    setLives(l => Math.max(0, l - 1));
  }, []);

  const registerMiss = useCallback(() => {
    chainRef.current = 1;
    setChain(1);
  }, []);

  /** Any real tap disarms the backstop permanently - it is never re-armed. */
  const cancelIdleBackstop = useCallback(() => {
    setIdleArmed(false);
  }, []);

  useEffect(() => {
    if (!idleArmed) {
      return;
    }
    let drain: ReturnType<typeof setInterval> | null = null;
    const arm = setTimeout(() => {
      drain = setInterval(() => {
        setLives(l => (l <= 0 ? 0 : l - 1));
      }, IDLE_DRAIN_MS);
    }, IDLE_BACKSTOP_MS);
    return () => {
      clearTimeout(arm);
      if (drain) {
        clearInterval(drain);
      }
    };
  }, [idleArmed]);

  useEffect(() => {
    if (lives > 0 || endedRef.current) {
      return;
    }
    endedRef.current = true;
    const t = setTimeout(() => {
      onGameOver(statsRef.current);
    }, 460);
    return () => {
      clearTimeout(t);
    };
  }, [lives, onGameOver]);

  return {
    score,
    lives,
    chain,
    caught,
    goldenCaught,
    depth,
    registerCatch,
    registerTrash,
    registerMiss,
    cancelIdleBackstop,
  };
}
