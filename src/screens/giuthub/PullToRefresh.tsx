import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Text } from '@/components/ui';
import { color, radius, space, useMotion } from '@/theme';

import { Handshake } from './HubLoading';

const REFRESH_THRESHOLD = 64;
const MAX_PULL_DISTANCE = 120;
const PULL_DAMPING = 0.5;
const REFRESH_HEIGHT = 68;
const SETTLE_DURATION = 80;
const ART_WIDTH = 50;
const ART_HEIGHT = 42;
const VIEWBOX_WIDTH = 100;
const VIEWBOX_HEIGHT = 84;
const ART_SCALE = ART_WIDTH / VIEWBOX_WIDTH;
const PULL_ARMS_PATH = 'M17 72 C17 44 33 37 42 49 L50 58 L58 49 C67 37 83 44 83 72';

export function usePullToRefresh({
  onRefresh,
  onRefreshStart,
}: {
  onRefresh?: () => void;
  onRefreshStart?: () => void;
}) {
  const { reduced } = useMotion();
  const [height] = useState(() => new Animated.Value(0));
  const [scale] = useState(() => new Animated.Value(1));
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [atTop, setAtTop] = useState(true);

  const animateScale = useCallback(
    (value: number) => {
      if (reduced) {
        scale.setValue(value);
        return;
      }

      Animated.timing(scale, {
        toValue: value,
        duration: 200,
        easing: Easing.bezier(0.34, 1.56, 0.64, 1),
        useNativeDriver: true,
      }).start();
    },
    [reduced, scale],
  );

  const settle = useCallback(
    (value: number, onComplete?: () => void) => {
      if (reduced) {
        height.setValue(value);
        onComplete?.();
        return;
      }

      Animated.timing(height, {
        toValue: value,
        duration: SETTLE_DURATION,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) onComplete?.();
      });
    },
    [height, reduced],
  );

  useEffect(() => {
    animateScale(ready ? 1.08 : 1);
  }, [animateScale, ready]);

  const refresh = useCallback(() => {
    if (!onRefresh || refreshing) return;

    setRefreshing(true);
    settle(REFRESH_HEIGHT);
    onRefreshStart?.();
    onRefresh();
  }, [onRefresh, onRefreshStart, refreshing, settle]);

  const responder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gesture) =>
          Boolean(onRefresh) &&
          atTop &&
          !refreshing &&
          gesture.dy > 6 &&
          Math.abs(gesture.dy) > Math.abs(gesture.dx) * 1.5,
        onMoveShouldSetPanResponderCapture: (_event, gesture) =>
          Boolean(onRefresh) &&
          atTop &&
          !refreshing &&
          gesture.dy > 6 &&
          Math.abs(gesture.dy) > Math.abs(gesture.dx) * 1.5,
        onPanResponderMove: (_event, gesture) => {
          const nextHeight = Math.max(0, Math.min(MAX_PULL_DISTANCE, gesture.dy * PULL_DAMPING));
          const nextProgress = Math.min(1, nextHeight / REFRESH_THRESHOLD);
          const nextReady = nextHeight >= REFRESH_THRESHOLD;

          height.setValue(nextHeight);
          setProgress(nextProgress);

          setReady(nextReady);
        },
        onPanResponderRelease: (_event, gesture) => {
          const nextHeight = Math.max(0, Math.min(MAX_PULL_DISTANCE, gesture.dy * PULL_DAMPING));

          if (nextHeight >= REFRESH_THRESHOLD) {
            refresh();
            return;
          }

          settle(0);
          setProgress(0);
          setReady(false);
        },
        onPanResponderTerminate: () => {
          settle(0);
          setProgress(0);
          setReady(false);
        },
      }),
    [atTop, height, onRefresh, refresh, refreshing, settle],
  );

  const done = useCallback(
    (onSettled?: () => void) => {
      setRefreshing(false);
      setReady(false);
      setProgress(0);
      settle(0, onSettled);
    },
    [settle],
  );

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextAtTop = event.nativeEvent.contentOffset.y <= 0;
    setAtTop((current) => (current === nextAtTop ? current : nextAtTop));
  }, []);

  return {
    panHandlers: responder.panHandlers,
    onScroll,
    refresh,
    done,
    indicator: {
      height,
      scale,
      progress,
      ready,
      refreshing,
    },
  };
}

type PullIndicatorProps = {
  height: Animated.Value;
  scale: Animated.Value;
  progress: number;
  ready: boolean;
  refreshing: boolean;
};

export function PullIndicator({ height, scale, progress, ready, refreshing }: PullIndicatorProps) {
  const { reduced } = useMotion();
  const fillHeight = (VIEWBOX_HEIGHT - (80 - progress * 76)) * ART_SCALE;
  const cardGap = height.interpolate({
    inputRange: [0, 12, REFRESH_THRESHOLD],
    outputRange: [0, 0, space[4]],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.container, { height, marginBottom: cardGap }]}>
      <View style={styles.content}>
        {refreshing ? (
          <Handshake reduced={reduced} size={ART_WIDTH * 1.08} startAt={0.62 / 2.6} />
        ) : (
          <Animated.View style={[styles.art, { transform: [{ scale }] }]}>
            <Svg
              width={ART_WIDTH}
              height={ART_HEIGHT}
              viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
            >
              <PullSymbol tone={color.brandTint} />
            </Svg>
            <View style={[styles.fill, { height: fillHeight }]}>
              <View style={styles.fillArt}>
                <Svg
                  width={ART_WIDTH}
                  height={ART_HEIGHT}
                  viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                >
                  <PullSymbol tone={color.brand} />
                </Svg>
              </View>
            </View>
          </Animated.View>
        )}

        {!refreshing ? (
          <Text variant="meta" style={{ color: ready ? color.brand : color.textMuted }}>
            {ready ? '놓으면 새로고침' : '당겨서 새로고침'}
          </Text>
        ) : null}
      </View>
    </Animated.View>
  );
}

export function PullRefreshGuide({ onDismiss }: { onDismiss: () => void }) {
  const { reduced } = useMotion();
  const [entry] = useState(() => new Animated.Value(reduced ? 1 : 0));
  const [bounce] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (reduced) {
      entry.setValue(1);
      bounce.setValue(0);
      return;
    }

    Animated.timing(entry, {
      toValue: 1,
      duration: 300,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: 1,
          duration: 650,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 650,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(700),
      ]),
    );

    loop.start();
    return () => loop.stop();
  }, [bounce, entry, reduced]);

  const translateY = entry.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] });
  const arrowTranslateY = bounce.interpolate({ inputRange: [0, 1], outputRange: [-2, 3] });

  return (
    <Animated.View style={[styles.guide, { opacity: entry, transform: [{ translateY }] }]}>
      <Animated.View style={[styles.guideIcon, { transform: [{ translateY: arrowTranslateY }] }]}>
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" accessible={false}>
          <Path
            d="M12 4v14m0 0-5-5m5 5 5-5"
            stroke={color.brand}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>

      <View style={styles.guideText}>
        <Text variant="label">새 팀원을 다시 확인할 수 있어요</Text>
        <Text variant="caption" color="textSecondary">
          화면을 아래로 당겨 새로고침해 보세요
        </Text>
      </View>

      <Pressable
        onPress={onDismiss}
        accessibilityRole="button"
        accessibilityLabel="새로고침 안내 닫기"
        hitSlop={space[3]}
        style={styles.guideClose}
      >
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" accessible={false}>
          <Path
            d="m7 7 10 10M17 7 7 17"
            stroke={color.textMuted}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
      </Pressable>
    </Animated.View>
  );
}

function PullSymbol({ tone }: { tone: string }) {
  return (
    <>
      <Path
        d={PULL_ARMS_PATH}
        stroke={tone}
        strokeWidth={15}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Circle cx={27} cy={17} r={10.5} fill={tone} />
      <Circle cx={73} cy={17} r={10.5} fill={tone} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  content: {
    alignItems: 'center',
    gap: space[2],
    paddingBottom: space[1],
  },
  art: {
    width: ART_WIDTH,
    height: ART_HEIGHT,
  },
  fill: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
  },
  fillArt: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: ART_WIDTH,
    height: ART_HEIGHT,
  },
  guide: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    marginBottom: space[4],
    paddingVertical: space[3],
    paddingLeft: space[3],
    paddingRight: space[2],
    borderRadius: radius.xl,
    backgroundColor: color.brandSoft,
  },
  guideIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: color.brandTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideText: {
    flex: 1,
    minWidth: 0,
    gap: space[1],
  },
  guideClose: {
    width: 36,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
