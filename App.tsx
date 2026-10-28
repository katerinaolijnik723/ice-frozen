import React, { useCallback, useRef, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

import { START_BALANCE } from './src/constants/config';
import { theme } from './src/constants/theme';
import type { RoundStats } from './src/hooks/useRoundState';
import GameOverScreen from './src/screens/GameOverScreen';
import GameScreen from './src/screens/GameScreen';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';

type Screen = 'loader' | 'menu' | 'game' | 'gameover';

const EMPTY_STATS: RoundStats = { score: 0, caught: 0, goldenCaught: 0, depth: 1 };

export default function App() {
  const [screen, setScreen] = useState<Screen>('loader');
  const [stats, setStats] = useState<RoundStats>(EMPTY_STATS);
  const [best, setBest] = useState(0);
  const [totalCaught, setTotalCaught] = useState(0);
  const [balance, setBalance] = useState(START_BALANCE);
  const runKey = useRef(1);

  const goMenu = useCallback(() => {
    setScreen('menu');
  }, []);

  const goGame = useCallback(() => {
    runKey.current += 1;
    setScreen('game');
  }, []);

  const handleGameOver = useCallback((s: RoundStats) => {
    setStats(s);
    setBest(b => (s.score > b ? s.score : b));
    setTotalCaught(c => c + s.caught);
    setBalance(v => v + s.score);
    setScreen('gameover');
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      {screen === 'loader' ? <LoaderScreen onDone={goMenu} /> : null}
      {screen === 'menu' ? (
        <MenuScreen
          onStart={goGame}
          best={best}
          totalCaught={totalCaught}
          balance={balance}
        />
      ) : null}
      {screen === 'game' ? (
        <GameScreen key={runKey.current} onGameOver={handleGameOver} onExit={goMenu} />
      ) : null}
      {screen === 'gameover' ? (
        <GameOverScreen stats={stats} onReplay={goGame} onMenu={goMenu} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.ocean.deepAbyss },
});
