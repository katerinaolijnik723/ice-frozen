import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';
import { formatNum } from '../utils/format';
import type { IconRenderer } from './PrimaryButton';

const ICON = 24;
const WRAP = 44;

/**
 * Pill used on Menu AND GameOver - identical geometry everywhere.
 * `width: '100%'` (NOT flex:1) so it never collapses inside a flex:1 slot.
 * Icons come from lucide (fixed 24x24 vector box) - never AI sprites with
 * mismatched internal aspect ratios.
 */
export default function StatCard({
  renderIcon,
  value,
  label,
  valueColor,
  onDark = false,
}: {
  renderIcon: IconRenderer;
  value: number;
  label: string;
  valueColor: string;
  onDark?: boolean;
}) {
  return (
    <View
      style={[
        styles.card,
        onDark ? styles.cardDark : styles.cardLight,
        { borderColor: valueColor + '55' },
      ]}>
      <View style={[styles.iconWrap, { backgroundColor: valueColor + '22' }]}>
        {renderIcon({ size: ICON, color: valueColor })}
      </View>
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1}>
        {formatNum(value)}
      </Text>
      <Text
        style={[styles.label, onDark ? styles.labelDark : styles.labelLight]}
        numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLight: { backgroundColor: '#FFFFFF' },
  cardDark: { backgroundColor: 'rgba(255,255,255,0.07)' },
  iconWrap: {
    width: WRAP,
    height: WRAP,
    borderRadius: WRAP / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  labelLight: { color: theme.colors.text.muted },
  labelDark: { color: theme.colors.text.onDarkMuted },
});
