import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { Sparkles, Star } from 'lucide-react-native';

import { assets } from '../assets';
import { theme } from '../constants/theme';
import { formatNum } from '../utils/format';
import AppTitle from './AppTitle';
import StatCard from './StatCard';

const COUNT_STEPS = 16;
const COUNT_MS = 700;

export default function ResultCard({
  score,
  caught,
  goldenCaught,
  depth,
  width,
}: {
  score: number;
  caught: number;
  goldenCaught: number;
  depth: number;
  width: number;
}) {
  const scale = useRef(new Animated.Value(0.88)).current;
  const [shown, setShown] = useState(0);

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.animation.spring.tension,
      friction: theme.animation.spring.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  // Count-up, throttled to 16 discrete setState steps (not one per frame).
  useEffect(() => {
    if (score <= 0) {
      setShown(0);
      return;
    }
    let step = 0;
    const id = setInterval(() => {
      step += 1;
      if (step >= COUNT_STEPS) {
        setShown(score);
        clearInterval(id);
        return;
      }
      setShown(Math.round((score * step) / COUNT_STEPS));
    }, Math.round(COUNT_MS / COUNT_STEPS));
    return () => {
      clearInterval(id);
    };
  }, [score]);

  const heading = score >= 300 ? 'GREAT CATCH!' : 'ICE OUT!';
  const showStats = caught > 0 || goldenCaught > 0;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.card, { width, transform: [{ scale }] }]}>
      {goldenCaught > 0 ? (
        <Image source={assets.sprite3} style={styles.golden} resizeMode="contain" />
      ) : (
        <Image source={assets.logo} style={styles.golden} resizeMode="contain" />
      )}

      <View style={styles.headingBox}>
        <AppTitle text={heading} size={32} spacing={3} />
      </View>

      <Text style={styles.scoreLabel}>SCORE</Text>
      <Text style={styles.score} numberOfLines={1}>
        {formatNum(shown)}
      </Text>

      <Text style={styles.depth} numberOfLines={1}>
        {'REACHED DEPTH ' + depth}
      </Text>

      {showStats ? (
        <View style={styles.statRow}>
          <View style={styles.statSlot}>
            <StatCard
              onDark
              renderIcon={({ size, color }) => <Sparkles size={size} color={color} />}
              value={caught}
              label="CAUGHT"
              valueColor={theme.colors.ocean.wave}
            />
          </View>
          <View style={styles.statSlot}>
            <StatCard
              onDark
              renderIcon={({ size, color }) => <Star size={size} color={color} />}
              value={goldenCaught}
              label="GOLDEN"
              valueColor={theme.colors.ocean.goldFish}
            />
          </View>
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.xxl,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#00A6CB',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  golden: { width: 110, height: 110, marginBottom: 12 },
  headingBox: { width: '100%', alignItems: 'center', marginBottom: 14 },
  scoreLabel: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 3,
    color: theme.colors.text.onDarkMuted,
  },
  score: {
    fontSize: 52,
    lineHeight: 60,
    fontWeight: '900',
    letterSpacing: 1,
    color: theme.colors.ocean.wave,
    fontVariant: ['tabular-nums'],
  },
  depth: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.onDarkSoft,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
    marginTop: 20,
    width: '100%',
  },
  statSlot: { flex: 1 },
});
