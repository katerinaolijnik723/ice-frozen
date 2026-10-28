import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

import { HOOK_DOWN_MS, HOOK_UP_MS } from '../constants/config';

export type HookPhase = 'idle' | 'dropping' | 'reeling';

const REST_LINE = 8;

/**
 * Hook animation + the per-frame hit test.
 * `headY` rides the native driver (transform), `lineH` the JS driver (height) -
 * two different Animated.Values, so no value ever has two drivers.
 */
export function useHookDrop() {
  const headY = useRef(new Animated.Value(0)).current;
  const lineH = useRef(new Animated.Value(REST_LINE)).current;
  const headYRef = useRef(0);
  const [phase, setPhase] = useState<HookPhase>('idle');
  const busyRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const sub = headY.addListener(({ value }) => {
      headYRef.current = value;
    });
    return () => {
      headY.removeListener(sub);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [headY]);

  const reel = useCallback(() => {
    setPhase('reeling');
    Animated.parallel([
      Animated.timing(headY, {
        toValue: 0,
        duration: HOOK_UP_MS,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(lineH, {
        toValue: REST_LINE,
        duration: HOOK_UP_MS,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start(() => {
      busyRef.current = false;
      setPhase('idle');
    });
  }, [headY, lineH]);

  /**
   * @param depthPx  how far the head travels
   * @param onFrame  called ~60x/s with the live head offset; return true to
   *                 resolve the drop immediately (something was hooked)
   */
  const drop = useCallback(
    (depthPx: number, onFrame: (y: number) => boolean) => {
      if (busyRef.current) {
        return;
      }
      busyRef.current = true;
      setPhase('dropping');

      let settled = false;
      const down = Animated.parallel([
        Animated.timing(headY, {
          toValue: depthPx,
          duration: HOOK_DOWN_MS,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(lineH, {
          toValue: depthPx + REST_LINE,
          duration: HOOK_DOWN_MS,
          easing: Easing.in(Easing.quad),
          useNativeDriver: false,
        }),
      ]);

      const settle = () => {
        if (settled) {
          return;
        }
        settled = true;
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        down.stop();
        reel();
      };

      timerRef.current = setInterval(() => {
        if (settled) {
          return;
        }
        if (onFrame(headYRef.current)) {
          settle();
        }
      }, 16);

      down.start(({ finished }) => {
        if (finished) {
          settle();
        }
      });
    },
    [headY, lineH, reel],
  );

  return { headY, lineH, phase, drop, isBusy: phase !== 'idle' };
}
