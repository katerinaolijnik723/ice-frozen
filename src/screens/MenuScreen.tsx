import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { Coins, Play, Sparkles, Trophy } from 'lucide-react-native';

import { assets } from '../assets';
import AppTitle from '../components/AppTitle';
import AuroraBackdrop from '../components/AuroraBackdrop';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import StatCard from '../components/StatCard';
import { theme } from '../constants/theme';
import { formatNum } from '../utils/format';

const LEGEND = [
  { src: assets.sprite1, tag: '+10' },
  { src: assets.sprite2, tag: '+25' },
  { src: assets.sprite3, tag: 'x3' },
  { src: assets.sprite4, tag: '-1' },
  { src: assets.sprite5, tag: '-1' },
];

export default function MenuScreen({
  onStart,
  best,
  totalCaught,
  balance,
}: {
  onStart: () => void;
  best: number;
  totalCaught: number;
  balance: number;
}) {
  const sheetY = useRef(new Animated.Value(120)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const float = useRef(new Animated.Value(0)).current;
  const [showRules, setShowRules] = useState(false);
  const leaving = useRef(false);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(sheetY, {
        toValue: 0,
        tension: theme.animation.sheet.tension,
        friction: theme.animation.sheet.friction,
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [fade, float, sheetY]);

  const handleStart = useCallback(() => {
    if (leaving.current) {
      return;
    }
    leaving.current = true;
    Animated.parallel([
      Animated.timing(sheetY, {
        toValue: 140,
        duration: 260,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 260,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onStart();
    });
  }, [onStart, screenOpacity, sheetY]);

  const toggleRules = useCallback(() => {
    setShowRules(v => !v);
  }, []);

  const heroY = float.interpolate({ inputRange: [0, 1], outputRange: [0, -7] });
  const showStats = best > 0 || totalCaught > 0;

  return (
    <Animated.View style={[styles.root, { opacity: screenOpacity }]} pointerEvents="box-none">
      <AuroraBackdrop variant="ice">
        <ScreenHeader
          rightSlot={
            <View style={styles.badge}>
              <View style={styles.badgeIcon}>
                <Coins size={18} color={theme.colors.text.secondary} />
              </View>
              <Text style={styles.badgeText} numberOfLines={1}>
                {formatNum(balance)}
              </Text>
            </View>
          }
        />

        <View style={styles.hero} pointerEvents="none">
          <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
          <Animated.Image
            source={assets.sprite1}
            resizeMode="contain"
            style={[styles.heroFish, { transform: [{ translateY: heroY }] }]}
          />
        </View>

        <Animated.View
          pointerEvents="box-none"
          style={[styles.sheet, theme.shadows.sheet, { transform: [{ translateY: sheetY }] }]}>
          <View style={styles.grab} pointerEvents="none" />

          <Animated.View style={{ opacity: fade }} pointerEvents="box-none">
            <AppTitle text="ICE FROZEN" size={34} spacing={4} onDark={false} />
            <Text style={styles.tagline} numberOfLines={1}>
              ONE TAP - PERFECT TIMING
            </Text>

            <View style={styles.legend} pointerEvents="none">
              {LEGEND.map((item, i) => (
                <View key={i} style={styles.legendItem}>
                  <Image source={item.src} style={styles.legendImg} resizeMode="contain" />
                  <Text style={styles.legendTag} numberOfLines={1}>
                    {item.tag}
                  </Text>
                </View>
              ))}
            </View>

            {showStats ? (
              <View style={styles.statRow}>
                <View style={styles.statSlot}>
                  <StatCard
                    renderIcon={({ size, color }) => <Trophy size={size} color={color} />}
                    value={best}
                    label="BEST"
                    valueColor={theme.colors.ocean.wave}
                  />
                </View>
                <View style={styles.statSlot}>
                  <StatCard
                    renderIcon={({ size, color }) => <Sparkles size={size} color={color} />}
                    value={totalCaught}
                    label="CAUGHT"
                    valueColor={theme.colors.ocean.deep}
                  />
                </View>
              </View>
            ) : null}

            {showRules ? (
              <View style={styles.rules}>
                <Text style={styles.ruleLine}>1. TAP DROP HOOK WHEN A FISH CROSSES THE LANE.</Text>
                <Text style={styles.ruleLine}>2. GOLD FISH PAYS TRIPLE AND FREEZES THE SHOAL.</Text>
                <Text style={styles.ruleLine}>3. CANS AND BOOTS COST ONE LIFE EACH.</Text>
              </View>
            ) : null}

            <Text style={styles.hint} numberOfLines={1}>
              3 LIVES - AVOID THE TRASH
            </Text>

            <PrimaryButton
              title="START FISHING"
              onPress={handleStart}
              renderIcon={({ size, color }) => <Play size={size} color={color} />}
            />

            <SecondaryButton
              title={showRules ? 'HIDE RULES' : 'HOW TO PLAY'}
              onPress={toggleRules}
              onDark={false}
              style={styles.secondary}
            />
          </Animated.View>
        </Animated.View>
      </AuroraBackdrop>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
  badge: {
    height: 40,
    minWidth: 96,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  badgeIcon: { width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  badgeText: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '800',
    color: theme.colors.text.secondary,
    fontVariant: ['tabular-nums'],
  },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 8 },
  logo: { width: 104, height: 104, marginBottom: 4 },
  heroFish: { width: 132, height: 132 },
  sheet: {
    backgroundColor: 'rgba(255,255,255,0.86)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 28,
  },
  grab: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.ui.border,
  },
  tagline: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  legend: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendItem: { alignItems: 'center', justifyContent: 'center', width: 52 },
  legendImg: { width: 38, height: 38 },
  legendTag: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.text.muted,
  },
  statRow: { flexDirection: 'row', alignItems: 'stretch', gap: 12, marginTop: 14 },
  statSlot: { flex: 1 },
  rules: {
    marginTop: 14,
    padding: 12,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(0,166,203,0.08)',
    borderWidth: 1,
    borderColor: '#9DCEDB',
    gap: 6,
  },
  ruleLine: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.text.secondary,
  },
  hint: {
    marginTop: 16,
    marginBottom: 10,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  secondary: { marginTop: 10 },
});
