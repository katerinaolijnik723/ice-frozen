import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

import { FREEZE_MS } from '../constants/config';

/** The pale wash that reads "the shoal is frozen" during a golden catch. */
export default function FrostOverlay({ active }: { active: boolean }) {
  const op = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      Animated.timing(op, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
      return;
    }
    const anim = Animated.sequence([
      Animated.timing(op, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.delay(Math.max(0, FREEZE_MS - 480)),
      Animated.timing(op, {
        toValue: 0,
        duration: 260,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]);
    anim.start();
    return () => {
      anim.stop();
    };
  }, [active, op]);

  return <Animated.View pointerEvents="none" style={[styles.wash, { opacity: op }]} />;
}

const styles = StyleSheet.create({
  wash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(232,244,248,0.32)',
  },
});
