import { useCallback, useEffect, useRef, useState } from 'react';

import { LANES, MAX_ENTITIES } from '../constants/config';
import { pickKind, spawnIntervalFor, travelDurationFor, type Kind } from '../game/rules';

export type Entity = {
  id: number;
  kind: Kind;
  lane: number;
  dir: 1 | -1;
  duration: number;
  caught: boolean;
};

/**
 * Emits swimmers into random lanes. Only the entity LIST lives in state -
 * every live x position stays in a ref owned by the Swimmer itself.
 */
export function useFishSpawner({ enabled, depth }: { enabled: boolean; depth: number }) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const idRef = useRef(1);
  const entitiesRef = useRef<Entity[]>([]);
  entitiesRef.current = entities;

  useEffect(() => {
    if (!enabled) {
      return;
    }
    let timer: ReturnType<typeof setTimeout> | null = null;

    const spawn = () => {
      setEntities(prev => {
        if (prev.length >= MAX_ENTITIES) {
          return prev;
        }
        const id = idRef.current;
        idRef.current += 1;
        const kind = pickKind();
        const taken = prev.map(e => e.lane);
        let lane = Math.floor(Math.random() * LANES);
        for (let i = 0; i < LANES; i++) {
          const candidate = (lane + i) % LANES;
          if (taken.filter(l => l === candidate).length < 2) {
            lane = candidate;
            break;
          }
        }
        const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
        return prev.concat([
          { id, kind, lane, dir, duration: travelDurationFor(kind, depth), caught: false },
        ]);
      });
    };

    const schedule = (delay: number) => {
      timer = setTimeout(() => {
        spawn();
        schedule(spawnIntervalFor(depth) + Math.round(Math.random() * 200));
      }, delay);
    };

    schedule(300);
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [enabled, depth]);

  const remove = useCallback((id: number) => {
    setEntities(prev => prev.filter(e => e.id !== id));
  }, []);

  const markCaught = useCallback((id: number) => {
    setEntities(prev => prev.map(e => (e.id === id ? { ...e, caught: true } : e)));
  }, []);

  return { entities, entitiesRef, remove, markCaught };
}
