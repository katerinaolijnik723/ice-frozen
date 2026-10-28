import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle } from 'react-native-svg';

import { assets } from '../assets';
import { theme } from '../constants/theme';

export type BackdropVariant = 'deep' | 'ice' | 'game' | 'result';

type Blob = { size: number; color: string; opacity: number; style: object };

const BLOBS: Blob[] = [
  { size: 220, color: '#00A6CB', opacity: 0.28, style: { top: -60, left: -70 } },
  { size: 180, color: '#9DCEDB', opacity: 0.2, style: { top: 180, right: -60 } },
  { size: 260, color: '#00558B', opacity: 0.35, style: { bottom: -90, left: 40 } },
];

const BLOB_SCALE: Record<BackdropVariant, number> = {
  deep: 1,
  ice: 0.55,
  game: 0.55,
  result: 0.9,
};

/**
 * The single source of per-screen luminance: same art (bg_game) on every screen,
 * a different gradient band + aurora strength per variant.
 */
export default function AuroraBackdrop({
  variant,
  children,
}: {
  variant: BackdropVariant;
  children: React.ReactNode;
}) {
  const colors = theme.gradients[variant];
  const dim = BLOB_SCALE[variant];

  return (
    <ImageBackground source={assets.bgGame} style={styles.root} resizeMode="cover">
      <LinearGradient
        colors={colors}
        start={variant === 'deep' ? { x: 0.1, y: 0 } : { x: 0.5, y: 0 }}
        end={variant === 'deep' ? { x: 0.9, y: 1 } : { x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {BLOBS.map((b, i) => (
          <View key={i} style={[styles.blob, b.style, { width: b.size, height: b.size }]}>
            <Svg width={b.size} height={b.size}>
              <Circle
                cx={b.size / 2}
                cy={b.size / 2}
                r={b.size / 2}
                fill={b.color}
                opacity={b.opacity * dim}
              />
              <Circle
                cx={b.size / 2}
                cy={b.size / 2}
                r={b.size / 3}
                fill={b.color}
                opacity={b.opacity * dim * 0.8}
              />
            </Svg>
          </View>
        ))}
      </View>
      <View style={styles.content}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.ocean.deepAbyss },
  blob: { position: 'absolute' },
  content: { flex: 1 },
});
