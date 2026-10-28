import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet } from 'react-native';

import { SPRITE_SIZE } from '../constants/config';
import { SPRITE_FOR_KIND, type Kind } from '../game/rules';

export type SwimmerProps = {
  id: number;
  kind: Kind;
  lane: number;
  laneH: number;
  dir: 1 | -1;
  duration: number;
  innerW: number;
  frozen: boolean;
  caught: boolean;
  posRef: React.MutableRefObject<Record<number, number>>;
  onExpire: (id: number) => void;
};

const MARGIN = SPRITE_SIZE + 20;

/**
 * One drifting sprite. Position lives in an Animated.Value mirrored into a ref -
 * never in component state (a 60fps setState would stall the whole board).
 */
export default function Swimmer({
  id,
  kind,
  lane,
  laneH,
  dir,
  duration,
  innerW,
  frozen,
  caught,
  posRef,
  onExpire,
}: SwimmerProps) {
  const startX = dir === 1 ? -MARGIN : innerW + MARGIN - SPRITE_SIZE;
  const endX = dir === 1 ? innerW + MARGIN - SPRITE_SIZE : -MARGIN;

  const x = useRef(new Animated.Value(startX)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const curX = useRef(startX);
  const expired = useRef(false);

  // Mirror the live x into a plain ref so the hit test can read it per frame.
  useEffect(() => {
    posRef.current[id] = startX;
    const sub = x.addListener(({ value }) => {
      curX.current = value;
      posRef.current[id] = value;
    });
    return () => {
      x.removeListener(sub);
      delete posRef.current[id];
    };
  }, [id, x, posRef, startX]);

  // Drift. Re-runs on freeze/unfreeze, resuming from the current position.
  useEffect(() => {
    if (caught) {
      return;
    }
    if (frozen) {
      x.stopAnimation(v => {
        curX.current = v;
      });
      return;
    }
    const total = Math.abs(endX - startX);
    const left = Math.abs(endX - curX.current);
    const ms = total > 0 ? Math.max(120, Math.round(duration * (left / total))) : duration;
    const anim = Animated.timing(x, {
      toValue: endX,
      duration: ms,
      easing: Easing.linear,
      useNativeDriver: true,
    });
    anim.start(({ finished }) => {
      if (finished && !expired.current) {
        expired.current = true;
        onExpire(id);
      }
    });
    return () => {
      anim.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frozen, caught]);

  // Catch pop: 1 -> 1.25 -> 0, then remove.
  useEffect(() => {
    if (!caught) {
      return;
    }
    x.stopAnimation();
    const anim = Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.25,
        duration: 110,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0,
        duration: 150,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]);
    anim.start(() => {
      if (!expired.current) {
        expired.current = true;
        onExpire(id);
      }
    });
    return () => {
      anim.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caught]);

  const top = laneH * lane + (laneH - SPRITE_SIZE) / 2;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        {
          top,
          transform: [{ translateX: x }, { scaleX: dir === 1 ? 1 : -1 }, { scale }],
        },
      ]}>
      <Image source={SPRITE_FOR_KIND[kind]} style={styles.img} resizeMode="contain" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    width: SPRITE_SIZE,
    height: SPRITE_SIZE,
  },
  img: { width: SPRITE_SIZE, height: SPRITE_SIZE },
});
