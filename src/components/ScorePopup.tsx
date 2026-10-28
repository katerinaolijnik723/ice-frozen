import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text } from 'react-native';

import { theme } from '../constants/theme';

/** Floating "+N" chip. Remount it with a fresh key to replay. */
export default function ScorePopup({
  points,
  golden,
  x,
  y,
}: {
  points: number;
  golden: boolean;
  x: number;
  y: number;
}) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(t, {
      toValue: 1,
      duration: 520,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });
    anim.start();
    return () => {
      anim.stop();
    };
  }, [t]);

  const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [0, -36] });
  const opacity = t.interpolate({ inputRange: [0, 0.6, 1], outputRange: [1, 0.9, 0] });
  const color = golden ? theme.colors.ocean.goldFish : theme.colors.ocean.wave;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.chip,
        { left: x - 44, top: y - 16, borderColor: color + '88', opacity, transform: [{ translateY }] },
      ]}>
      <Text style={[styles.text, { color }]} numberOfLines={1}>
        {'+' + points}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    position: 'absolute',
    width: 88,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'rgba(1,58,94,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '900',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
});
