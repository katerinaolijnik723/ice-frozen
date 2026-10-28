import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';
import type { IconRenderer } from './PrimaryButton';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const ICON = 24;

export default function SecondaryButton({
  title,
  onPress,
  renderIcon,
  onDark = true,
  style,
}: {
  title: string;
  onPress: () => void;
  renderIcon?: IconRenderer;
  onDark?: boolean;
  style?: object;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.97,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const tint = onDark ? '#D1E7EE' : theme.colors.text.secondary;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={[styles.press, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.fill, onDark ? styles.dark : styles.light, { transform: [{ scale }] }]}>
        <View style={styles.row} pointerEvents="none">
          {renderIcon ? (
            <View style={styles.iconBox}>{renderIcon({ size: ICON, color: tint })}</View>
          ) : null}
          <Text style={[styles.label, { color: tint }]} numberOfLines={1}>
            {title}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', height: 48 },
  fill: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dark: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.16)',
  },
  light: {
    backgroundColor: 'rgba(0,166,203,0.10)',
    borderColor: '#9DCEDB',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  iconBox: { width: ICON, height: ICON, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 13, lineHeight: ICON, fontWeight: '800', letterSpacing: 1.5 },
});
