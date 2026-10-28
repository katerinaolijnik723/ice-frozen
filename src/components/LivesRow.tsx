import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Heart } from 'lucide-react-native';

import { theme } from '../constants/theme';

const SIZE = 20;

export default function LivesRow({ lives, max }: { lives: number; max: number }) {
  const slots: number[] = [];
  for (let i = 0; i < max; i++) {
    slots.push(i);
  }
  return (
    <View style={styles.row} accessibilityLabel={'Lives left: ' + lives}>
      {slots.map(i => {
        const alive = i < lives;
        return (
          <View key={i} style={styles.slot}>
            <Heart
              size={SIZE}
              color={alive ? theme.colors.ocean.wave : 'rgba(255,255,255,0.22)'}
              fill={alive ? theme.colors.ocean.wave : 'transparent'}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  slot: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
});
