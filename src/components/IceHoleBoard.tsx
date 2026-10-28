import React, { memo, useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Ellipse } from 'react-native-svg';

import { LANES } from '../constants/config';
import { theme } from '../constants/theme';
import { BOARD_PAD, type BoardGeom } from '../game/geometry';
import FrostOverlay from './FrostOverlay';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type BubbleSpec = { id: number; x: number; r: number; delay: number; duration: number };

const Bubbles = memo(function Bubbles({ innerW, innerH }: { innerW: number; innerH: number }) {
  const specs = useMemo<BubbleSpec[]>(() => {
    const out: BubbleSpec[] = [];
    for (let i = 0; i < 12; i++) {
      out.push({
        id: i,
        x: Math.round(((i * 73) % 100) / 100 * Math.max(1, innerW - 10)),
        r: 2 + (i % 4),
        delay: i * 320,
        duration: 4200 + ((i * 283) % 3400),
      });
    }
    return out;
  }, [innerW]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {specs.map(s => (
        <Bubble key={s.id} spec={s} innerH={innerH} />
      ))}
    </View>
  );
});

function Bubble({ spec, innerH }: { spec: BubbleSpec; innerH: number }) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(spec.delay),
        Animated.timing(t, {
          toValue: 1,
          duration: spec.duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [t, spec.delay, spec.duration]);

  const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [innerH, -12] });
  const opacity = t.interpolate({ inputRange: [0, 0.15, 0.85, 1], outputRange: [0, 1, 1, 0] });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 0,
        left: spec.x,
        width: spec.r * 2,
        height: spec.r * 2,
        borderRadius: spec.r,
        backgroundColor: 'rgba(255,255,255,0.14)',
        opacity,
        transform: [{ translateY }],
      }}
    />
  );
}

export default function IceHoleBoard({
  geom,
  waterColors,
  armedLane,
  frozen,
  shake,
  flash,
  onTapWater,
  children,
  hookNode,
}: {
  geom: BoardGeom;
  waterColors: string[];
  armedLane: number;
  frozen: boolean;
  shake: Animated.Value;
  flash: Animated.Value;
  onTapWater: () => void;
  children?: React.ReactNode;
  hookNode?: React.ReactNode;
}) {
  const { width, height, innerW, laneH, rimH } = geom;
  const innerH = laneH * LANES;

  const lanes: number[] = [];
  for (let i = 0; i < LANES; i++) {
    lanes.push(i);
  }

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.board, { width, height, transform: [{ translateX: shake }] }]}>
      {/* --- water column --- */}
      <View style={[styles.water, { top: rimH }]}>
        <LinearGradient
          colors={waterColors}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.waterFill}
        />
        <View style={[styles.inner, { left: BOARD_PAD, top: BOARD_PAD, width: innerW, height: innerH }]}>
          {lanes.map(i => (
            <View
              key={i}
              pointerEvents="none"
              style={[
                styles.lane,
                { top: laneH * i, height: laneH },
                i === armedLane ? styles.laneArmed : null,
              ]}
            />
          ))}
          <Bubbles innerW={innerW} innerH={innerH} />
          {children}
        </View>
      </View>

      {/* --- ice rim with the hole --- */}
      <View style={[styles.rim, { height: rimH }]} pointerEvents="none">
        <LinearGradient
          colors={theme.gradients.rim}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.rimFill}
        />
        <Svg width={width} height={rimH} style={StyleSheet.absoluteFill}>
          <Ellipse
            cx={width / 2}
            cy={rimH - 20}
            rx={Math.max(24, innerW * 0.23)}
            ry={22}
            fill={theme.colors.ocean.deepAbyss}
            stroke="#FFFFFF"
            strokeWidth={3}
          />
        </Svg>
      </View>

      {hookNode}

      <FrostOverlay active={frozen} />

      <Animated.View pointerEvents="none" style={[styles.flash, { opacity: flash }]} />

      {/* tapping the water drops the hook too - the one-tap feel */}
      <Pressable
        onPress={onTapWater}
        hitSlop={HIT}
        accessibilityRole="button"
        accessibilityLabel="Drop the hook"
        style={[styles.tap, { top: rimH, width, height: height - rimH }]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  board: { alignSelf: 'center', position: 'relative' },
  water: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.14)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  waterFill: { ...StyleSheet.absoluteFillObject },
  inner: { position: 'absolute' },
  lane: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  laneArmed: {
    backgroundColor: 'rgba(0,166,203,0.10)',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: '#00A6CB',
    borderRightColor: '#00A6CB',
  },
  rim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  rimFill: { ...StyleSheet.absoluteFillObject },
  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,70,70,0.18)',
    borderRadius: 20,
  },
  tap: { position: 'absolute', left: 0 },
});
