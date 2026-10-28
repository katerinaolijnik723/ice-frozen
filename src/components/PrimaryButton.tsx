import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { theme } from '../constants/theme';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const ICON = 24;

export type IconRenderer = (props: { size: number; color: string }) => React.ReactNode;

/**
 * h60 gradient CTA. Pressable is the PARENT, the Animated.View is a CHILD -
 * the only press pattern that keeps onPress alive on Android release builds.
 */
export default function PrimaryButton({
  title,
  onPress,
  renderIcon,
  disabled = false,
  colors,
  style,
}: {
  title: string;
  onPress: () => void;
  renderIcon?: IconRenderer;
  disabled?: boolean;
  colors?: string[];
  style?: object;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.96,
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

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      disabled={disabled}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={[styles.press, theme.shadows.cta, disabled ? styles.disabled : null, style]}>
      <Animated.View style={[styles.fill, { transform: [{ scale }] }]} pointerEvents="box-none">
        <LinearGradient
          colors={colors ? colors : theme.gradients.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fill}>
          <View style={styles.row} pointerEvents="none">
            {renderIcon ? (
              <View style={styles.iconBox}>{renderIcon({ size: ICON, color: '#FFFFFF' })}</View>
            ) : null}
            <Text style={styles.label} numberOfLines={1}>
              {title}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    height: 60,
    borderRadius: theme.radius.lg,
    // Android needs an opaque background for `elevation` to cast a shadow.
    backgroundColor: '#00558B',
  },
  disabled: { opacity: 0.45 },
  fill: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  iconBox: { width: ICON, height: ICON, alignItems: 'center', justifyContent: 'center' },
  label: {
    fontSize: 18,
    lineHeight: ICON,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#FFFFFF',
  },
});
