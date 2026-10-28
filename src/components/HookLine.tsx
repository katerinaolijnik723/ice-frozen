import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { BOARD_FRAME } from '../game/geometry';

const HEAD = 26;

/**
 * Line + J-hook head. Two separate Animated.Values on purpose:
 * the head rides `headY` on the native driver (transform), the line grows via
 * `lineH` on the JS driver (height is a layout prop - never native).
 */
export default function HookLine({
  centerX,
  rimH,
  headY,
  lineH,
}: {
  centerX: number;
  rimH: number;
  headY: Animated.Value;
  lineH: Animated.Value;
}) {
  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.root, { top: rimH - 10, left: BOARD_FRAME + centerX - HEAD / 2 }]}>
      <Animated.View style={[styles.line, { height: lineH, left: HEAD / 2 - 1 }]} />
      <Animated.View style={[styles.head, { transform: [{ translateY: headY }] }]}>
        <Svg width={HEAD} height={HEAD}>
          <Circle cx={HEAD / 2} cy={HEAD / 2 + 4} r={8} fill="#00A6CB" opacity={0.35} />
          <Path
            d={`M ${HEAD / 2} 0 L ${HEAD / 2} ${HEAD / 2 + 1} A 6 6 0 1 1 ${HEAD / 2 - 7} ${
              HEAD / 2 + 1
            }`}
            stroke="#E8F4F8"
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'absolute', width: HEAD },
  line: {
    position: 'absolute',
    top: 0,
    width: 2,
    backgroundColor: '#D1E7EE',
    opacity: 0.85,
    borderRadius: 1,
  },
  head: { position: 'absolute', top: -2, left: 0, width: HEAD, height: HEAD },
});
