import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ArrowDownCircle } from 'lucide-react-native';

import { theme } from '../constants/theme';
import PrimaryButton from './PrimaryButton';

/** G2 floating controls - never overlaps the water column (GameArea reserves room). */
export default function ControlBar({
  chain,
  armedLane,
  dropping,
  onDrop,
}: {
  chain: number;
  armedLane: number;
  dropping: boolean;
  onDrop: () => void;
}) {
  return (
    <View style={styles.bar} pointerEvents="box-none">
      <View style={styles.chips} pointerEvents="none">
        <View style={styles.chip}>
          <Text style={styles.chipText} numberOfLines={1}>
            {'CHAIN x' + chain}
          </Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipText} numberOfLines={1}>
            {'LANE ' + (armedLane + 1)}
          </Text>
        </View>
      </View>
      <PrimaryButton
        title={dropping ? 'REELING...' : 'DROP HOOK'}
        disabled={dropping}
        onPress={onDrop}
        renderIcon={({ size, color }) => <ArrowDownCircle size={size} color={color} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 28,
    backgroundColor: 'rgba(1,58,94,0.78)',
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 14,
  },
  chips: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 12,
  },
  chip: {
    height: 26,
    paddingHorizontal: 12,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: theme.colors.text.onDarkMuted,
  },
});
