import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';

/**
 * ONE header component reused on Menu / Game / GameOver.
 * Screens differ only by the slots they hand in - never by inline header markup.
 */
export default function ScreenHeader({
  leftSlot,
  centerSlot,
  rightSlot,
  title,
  bordered = false,
}: {
  leftSlot?: React.ReactNode;
  centerSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  title?: string;
  bordered?: boolean;
}) {
  return (
    <View style={[styles.root, bordered ? styles.bordered : null]} pointerEvents="box-none">
      <View style={styles.side} pointerEvents="box-none">
        {leftSlot ? leftSlot : null}
      </View>
      <View style={styles.center} pointerEvents="box-none">
        {centerSlot ? centerSlot : null}
        {title ? <Text style={styles.title}>{title}</Text> : null}
      </View>
      <View style={[styles.side, styles.sideRight]} pointerEvents="box-none">
        {rightSlot ? rightSlot : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: 44,
    height: 116,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  bordered: {
    backgroundColor: 'rgba(1,58,94,0.42)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.10)',
  },
  side: { minWidth: 64, alignItems: 'flex-start', justifyContent: 'center' },
  sideRight: { alignItems: 'flex-end' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 3,
    color: theme.colors.text.onDarkMuted,
  },
});
