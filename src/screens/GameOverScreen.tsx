import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Home, RotateCcw } from 'lucide-react-native';

import AuroraBackdrop from '../components/AuroraBackdrop';
import PrimaryButton from '../components/PrimaryButton';
import ResultCard from '../components/ResultCard';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import { theme } from '../constants/theme';
import type { RoundStats } from '../hooks/useRoundState';

const SCREEN_W = Dimensions.get('window').width;
const CARD_W = Math.min(SCREEN_W - 40, 400);

export default function GameOverScreen({
  stats,
  onReplay,
  onMenu,
}: {
  stats: RoundStats;
  onReplay: () => void;
  onMenu: () => void;
}) {
  return (
    <View style={styles.root}>
      <AuroraBackdrop variant="result">
        <ScreenHeader title="RUN COMPLETE" />

        <View style={styles.body}>
          <ResultCard
            score={stats.score}
            caught={stats.caught}
            goldenCaught={stats.goldenCaught}
            depth={stats.depth}
            width={CARD_W}
          />
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            title="DROP AGAIN"
            onPress={onReplay}
            renderIcon={({ size, color }) => <RotateCcw size={size} color={color} />}
          />
          <SecondaryButton
            title="MAIN MENU"
            onPress={onMenu}
            renderIcon={({ size, color }) => <Home size={size} color={color} />}
            style={styles.secondary}
          />
        </View>
      </AuroraBackdrop>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.ocean.deepAbyss },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  actions: { paddingHorizontal: 20, paddingBottom: 36 },
  secondary: { marginTop: 12 },
});
