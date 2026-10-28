import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { assets } from '../assets';
import AppTitle from '../components/AppTitle';
import AuroraBackdrop from '../components/AuroraBackdrop';
import { LOADER_DURATION_MS, LOADER_FADE_MS } from '../constants/config';
import { theme } from '../constants/theme';

const BAR_W = 200;

/**
 * Splash. Deliberately the DARKEST screen in the app - same art as the Menu,
 * opposite luminance band, no chips and no CTA.
 */
export default function LoaderScreen({ onDone }: { onDone: () => void }) {
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const cardScale = useRef(new Animated.Value(0.82)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;
  const barW = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardScale, {
        toValue: 1,
        tension: 42,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1300,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();

    // width is a layout prop - JS driver only.
    const bar = Animated.timing(barW, {
      toValue: BAR_W,
      duration: LOADER_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    });
    bar.start();

    const t = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: LOADER_FADE_MS,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        onDone();
      });
    }, LOADER_DURATION_MS);

    return () => {
      clearTimeout(t);
      loop.stop();
      bar.stop();
    };
  }, [barW, cardOpacity, cardScale, float, onDone, screenOpacity]);

  const translateY = float.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });

  return (
    <Animated.View style={[styles.root, { opacity: screenOpacity }]} pointerEvents="box-none">
      <AuroraBackdrop variant="deep">
        <View style={styles.center}>
          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.card,
              theme.shadows.glow,
              { opacity: cardOpacity, transform: [{ scale: cardScale }] },
            ]}>
            <Animated.Image
              source={assets.logo}
              resizeMode="contain"
              style={[styles.logo, { transform: [{ translateY }] }]}
            />
          </Animated.View>

          <View style={styles.titleBox}>
            <AppTitle text="ICE FROZEN" size={40} spacing={6} />
          </View>
          <Text style={styles.subtitle} numberOfLines={1}>
            DROP THE HOOK. CATCH THE SHOAL.
          </Text>

          <View style={styles.track}>
            <Animated.View style={[styles.fillWrap, { width: barW }]}>
              <LinearGradient
                colors={theme.gradients.progress}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.fill}
              />
            </Animated.View>
          </View>
          <Text style={styles.loading} numberOfLines={1}>
            LOADING...
          </Text>
        </View>
      </AuroraBackdrop>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.ocean.deepAbyss },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  card: {
    width: 200,
    height: 200,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: 148, height: 148 },
  titleBox: { width: '100%', marginTop: 28 },
  subtitle: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 2.4,
    color: '#B8DBE5',
    opacity: 0.85,
    textAlign: 'center',
  },
  track: {
    marginTop: 36,
    width: BAR_W,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  fillWrap: { height: 5, borderRadius: 3, overflow: 'hidden' },
  fill: { flex: 1 },
  loading: {
    marginTop: 14,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 3,
    color: '#9DCEDB',
  },
});
