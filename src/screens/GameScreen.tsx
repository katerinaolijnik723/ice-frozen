import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

import AuroraBackdrop from '../components/AuroraBackdrop';
import ControlBar from '../components/ControlBar';
import HookLine from '../components/HookLine';
import IceHoleBoard from '../components/IceHoleBoard';
import LivesRow from '../components/LivesRow';
import ScorePopup from '../components/ScorePopup';
import ScreenHeader from '../components/ScreenHeader';
import Swimmer from '../components/Swimmer';
import {
  FREEZE_MS,
  HOOK_CATCH_HALF_W,
  HOOK_DOWN_MS,
  LANES,
  MAX_LIVES,
  SPRITE_SIZE,
} from '../constants/config';
import { theme } from '../constants/theme';
import { computeBoard, hookDepthFor, laneCenterY, type BoardGeom } from '../game/geometry';
import { isTrash, waterGradientFor } from '../game/rules';
import { useFishSpawner, type Entity } from '../hooks/useFishSpawner';
import { useHookDrop } from '../hooks/useHookDrop';
import { useRoundState, type RoundStats } from '../hooks/useRoundState';
import { formatNum } from '../utils/format';

const SCREEN_W = Dimensions.get('window').width;
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const CONTROLS_RESERVE = 152;

type Popup = { key: number; points: number; golden: boolean; x: number; y: number };

export default function GameScreen({
  onGameOver,
  onExit,
}: {
  onGameOver: (stats: RoundStats) => void;
  onExit: () => void;
}) {
  const [areaH, setAreaH] = useState(0);
  const [armedLane, setArmedLane] = useState(0);
  const [frozen, setFrozen] = useState(false);
  const [popup, setPopup] = useState<Popup | null>(null);

  const armedLaneRef = useRef(0);
  const geomRef = useRef<BoardGeom | null>(null);
  const posRef = useRef<Record<number, number>>({});
  const hitRef = useRef(false);
  const missTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const freezeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popupKeyRef = useRef(1);

  const shake = useRef(new Animated.Value(0)).current;
  const flash = useRef(new Animated.Value(0)).current;
  const scorePulse = useRef(new Animated.Value(1)).current;

  const round = useRoundState(onGameOver);
  const {
    score,
    lives,
    chain,
    depth,
    registerCatch,
    registerTrash,
    registerMiss,
    cancelIdleBackstop,
  } = round;

  const spawner = useFishSpawner({ enabled: lives > 0, depth });
  const { entities, entitiesRef, remove, markCaught } = spawner;

  const { headY, lineH, phase, drop } = useHookDrop();
  const dropping = phase !== 'idle';

  const geom = useMemo<BoardGeom | null>(() => {
    if (areaH <= 0) {
      return null;
    }
    // areaH is the border box - strip the room reserved for the floating controls.
    return computeBoard(SCREEN_W, areaH - CONTROLS_RESERVE - 8);
  }, [areaH]);
  geomRef.current = geom;

  const waterColors = useMemo(() => waterGradientFor(depth), [depth]);

  useEffect(() => {
    return () => {
      if (missTimerRef.current) {
        clearTimeout(missTimerRef.current);
      }
      if (freezeTimerRef.current) {
        clearTimeout(freezeTimerRef.current);
      }
    };
  }, []);

  // score pill pulse
  useEffect(() => {
    if (score <= 0) {
      return;
    }
    scorePulse.setValue(1.12);
    Animated.spring(scorePulse, {
      toValue: 1,
      tension: 180,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [score, scorePulse]);

  const onAreaLayout = useCallback((e: LayoutChangeEvent) => {
    const h = Math.round(e.nativeEvent.layout.height);
    setAreaH(prev => (Math.abs(prev - h) > 1 ? h : prev));
  }, []);

  const runShake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
    flash.setValue(1);
    Animated.timing(flash, {
      toValue: 0,
      duration: 280,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [flash, shake]);

  const resolveHit = useCallback(
    (entity: Entity) => {
      hitRef.current = true;
      markCaught(entity.id);
      const g = geomRef.current;

      if (isTrash(entity.kind)) {
        registerTrash();
        runShake();
        return;
      }

      const pts = registerCatch(entity.kind);
      if (g) {
        popupKeyRef.current += 1;
        setPopup({
          key: popupKeyRef.current,
          points: pts,
          golden: entity.kind === 'golden',
          x: g.innerW / 2,
          y: laneCenterY(g.laneH, entity.lane),
        });
      }

      const next = (armedLaneRef.current + 1) % LANES;
      armedLaneRef.current = next;
      setArmedLane(next);

      if (entity.kind === 'golden') {
        setFrozen(true);
        if (freezeTimerRef.current) {
          clearTimeout(freezeTimerRef.current);
        }
        freezeTimerRef.current = setTimeout(() => {
          setFrozen(false);
        }, FREEZE_MS);
      }
    },
    [markCaught, registerCatch, registerTrash, runShake],
  );

  /** Runs ~60x/s while the hook descends. Reads live x from refs, never state. */
  const onFrame = useCallback(
    (y: number) => {
      const g = geomRef.current;
      if (!g) {
        return false;
      }
      const lane = armedLaneRef.current;
      // Only the second half of the descent can hook something - a generous
      // ~110ms window, so the catch reads as "the hook reached the lane".
      if (y < hookDepthFor(g.laneH, lane) * 0.55) {
        return false;
      }
      const list = entitiesRef.current;
      const centerX = g.innerW / 2;
      for (let i = 0; i < list.length; i++) {
        const e = list[i];
        if (e.caught || e.lane !== lane) {
          continue;
        }
        const x = posRef.current[e.id];
        if (typeof x !== 'number') {
          continue;
        }
        if (Math.abs(x + SPRITE_SIZE / 2 - centerX) <= HOOK_CATCH_HALF_W) {
          resolveHit(e);
          return true;
        }
      }
      return false;
    },
    [entitiesRef, resolveHit],
  );

  const handleDrop = useCallback(() => {
    const g = geomRef.current;
    if (!g || dropping || lives <= 0) {
      return;
    }
    cancelIdleBackstop();
    hitRef.current = false;
    drop(hookDepthFor(g.laneH, armedLaneRef.current), onFrame);

    if (missTimerRef.current) {
      clearTimeout(missTimerRef.current);
    }
    missTimerRef.current = setTimeout(() => {
      if (!hitRef.current) {
        registerMiss();
      }
    }, HOOK_DOWN_MS + 80);
  }, [cancelIdleBackstop, drop, dropping, lives, onFrame, registerMiss]);

  const handleExpire = useCallback(
    (id: number) => {
      remove(id);
    },
    [remove],
  );

  return (
    <View style={styles.root}>
      <AuroraBackdrop variant="game">
        <ScreenHeader
          bordered
          leftSlot={
            <Pressable
              onPress={onExit}
              hitSlop={HIT}
              accessibilityRole="button"
              accessibilityLabel="Back to menu"
              style={styles.backBtn}>
              <ArrowLeft size={22} color={theme.colors.text.onDarkSoft} />
            </Pressable>
          }
          centerSlot={
            <View style={styles.centerStack} pointerEvents="none">
              <LivesRow lives={lives} max={MAX_LIVES} />
              <Text style={styles.depthText} numberOfLines={1}>
                {'DEPTH ' + depth}
              </Text>
            </View>
          }
          rightSlot={
            <View style={styles.scorePill} pointerEvents="none">
              <Text style={styles.scoreLabel} numberOfLines={1}>
                SCORE
              </Text>
              <Animated.Text
                style={[styles.scoreValue, { transform: [{ scale: scorePulse }] }]}
                numberOfLines={1}>
                {formatNum(score)}
              </Animated.Text>
            </View>
          }
        />

        <View style={styles.area} onLayout={onAreaLayout} pointerEvents="box-none">
          {geom ? (
            <IceHoleBoard
              geom={geom}
              waterColors={waterColors}
              armedLane={armedLane}
              frozen={frozen}
              shake={shake}
              flash={flash}
              onTapWater={handleDrop}
              hookNode={
                <HookLine
                  centerX={geom.innerW / 2}
                  rimH={geom.rimH}
                  headY={headY}
                  lineH={lineH}
                />
              }>
              {entities.map(e => (
                <Swimmer
                  key={e.id}
                  id={e.id}
                  kind={e.kind}
                  lane={e.lane}
                  laneH={geom.laneH}
                  dir={e.dir}
                  duration={e.duration}
                  innerW={geom.innerW}
                  frozen={frozen}
                  caught={e.caught}
                  posRef={posRef}
                  onExpire={handleExpire}
                />
              ))}
              {popup ? (
                <ScorePopup
                  key={popup.key}
                  points={popup.points}
                  golden={popup.golden}
                  x={popup.x}
                  y={popup.y}
                />
              ) : null}
            </IceHoleBoard>
          ) : null}
        </View>

        <ControlBar
          chain={chain}
          armedLane={armedLane}
          dropping={dropping}
          onDrop={handleDrop}
        />
      </AuroraBackdrop>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.ocean.deepAbyss },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerStack: { alignItems: 'center', justifyContent: 'center', gap: 4 },
  depthText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.text.onDarkMuted,
  },
  scorePill: { alignItems: 'flex-end', justifyContent: 'center', minWidth: 64 },
  scoreLabel: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.text.onDarkMuted,
  },
  scoreValue: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: CONTROLS_RESERVE,
    paddingTop: 8,
  },
});
