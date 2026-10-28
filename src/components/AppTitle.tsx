import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { theme } from '../constants/theme';

/** The shared heavy letter-spaced wordmark. */
export default function AppTitle({
  text,
  size = 34,
  onDark = true,
  spacing = 4,
}: {
  text: string;
  size?: number;
  onDark?: boolean;
  spacing?: number;
}) {
  return (
    <Text
      style={[
        styles.base,
        {
          fontSize: size,
          letterSpacing: spacing,
          color: onDark ? theme.colors.text.onDark : theme.colors.text.secondary,
        },
        onDark ? styles.glow : null,
      ]}
      numberOfLines={1}
      adjustsFontSizeToFit
      accessibilityRole="header">
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: { fontWeight: '900', textAlign: 'center' },
  glow: { textShadowColor: '#00A6CB', textShadowRadius: 18, textShadowOffset: { width: 0, height: 0 } },
});
