import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';

import { Press, Text } from '@/components/ui';
import { color, radius, space, useMotion } from '@/theme';

const FIGURE_WIDTH = 104;
const FIGURE_HEIGHT = 88;
const VIEWBOX_WIDTH = 100;
const VIEWBOX_HEIGHT = 84;
const SCALE = Math.min(FIGURE_WIDTH / VIEWBOX_WIDTH, FIGURE_HEIGHT / VIEWBOX_HEIGHT);
const OFFSET_X = (FIGURE_WIDTH - VIEWBOX_WIDTH * SCALE) / 2;
const OFFSET_Y = (FIGURE_HEIGHT - VIEWBOX_HEIGHT * SCALE) / 2;
const CYCLE_DURATION = 2400;

const transformOrigin = (x: number, y: number) =>
  `${(OFFSET_X + x * SCALE).toFixed(2)}px ${(OFFSET_Y + y * SCALE).toFixed(2)}px`;

type HubEmptyProps = {
  kind: 'filter' | 'none';
  onRegister?: () => void;
};

export function HubEmpty({ kind, onRegister }: HubEmptyProps) {
  const { reduced } = useMotion();
  const [fade] = useState(() => new Animated.Value(reduced ? 1 : 0));
  const empty = kind === 'none';

  useEffect(() => {
    if (reduced) {
      fade.setValue(1);
      return;
    }

    Animated.timing(fade, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [fade, reduced]);

  return (
    <Animated.View style={[styles.container, { opacity: fade }]}>
      <SearchingFigure />

      <Text variant="titleMd" style={styles.title}>
        {empty ? '아직 둘러볼 사람이 없어요' : '조건에 맞는 사람이 없어요'}
      </Text>

      {empty ? (
        <Text variant="body" color="textSecondary" style={styles.description}>
          {'첫 번째로 프로필을 올리고\n함께할 팀원 제안을 받아보세요.'}
        </Text>
      ) : (
        <Text variant="body" color="textSecondary" style={styles.description}>
          검색어나 필터 조건을 바꿔보세요.
        </Text>
      )}

      {empty && onRegister ? (
        <Press
          onPress={onRegister}
          accessibilityRole="button"
          accessibilityLabel="내 프로필 등록하기"
          style={styles.registerButton}
        >
          <Text variant="label" color="surface">
            내 프로필 등록하기
          </Text>
        </Press>
      ) : null}
    </Animated.View>
  );
}

function SearchingFigure() {
  const { reduced } = useMotion();
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (reduced) {
      progress.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: CYCLE_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    loop.start();
    return () => loop.stop();
  }, [progress, reduced]);

  const armRotation = progress.interpolate({
    inputRange: [
      0, 0.4, 0.43, 0.46, 0.49, 0.52, 0.545, 0.57, 0.595, 0.62, 0.645, 0.67, 0.695, 0.72, 0.75,
      0.78, 0.81, 0.84, 1,
    ],
    outputRange: [
      '0deg',
      '0deg',
      '-3.62deg',
      '-14deg',
      '-24.38deg',
      '-28deg',
      '-25.42deg',
      '-18deg',
      '-10.58deg',
      '-8deg',
      '-10.58deg',
      '-18deg',
      '-25.42deg',
      '-28deg',
      '-24.38deg',
      '-14deg',
      '-3.62deg',
      '0deg',
      '0deg',
    ],
  });
  const questionRotation = progress.interpolate({
    inputRange: [
      0, 0.4, 0.4375, 0.475, 0.5125, 0.55, 0.5875, 0.625, 0.6625, 0.7, 0.775, 0.85, 0.925, 1,
    ],
    outputRange: [
      '0deg',
      '0deg',
      '-1.29deg',
      '-5deg',
      '-8.71deg',
      '-10deg',
      '-7.68deg',
      '-1deg',
      '5.68deg',
      '8deg',
      '6.97deg',
      '4deg',
      '1.03deg',
      '0deg',
    ],
  });
  const questionTranslateY = Animated.multiply(
    progress.interpolate({
      inputRange: [0, 0.4, 0.4375, 0.475, 0.5125, 0.55, 0.5875, 0.625, 0.6625, 0.7, 1],
      outputRange: [0, 0, -0.39, -1.5, -2.61, -3, -2.61, -1.5, -0.39, 0, 0],
    }),
    SCALE,
  );
  const questionOpacity = progress.interpolate({
    inputRange: [0, 0.4, 0.4375, 0.475, 0.5125, 0.55, 0.6625, 0.775, 0.8875, 1],
    outputRange: [0.9, 0.9, 0.913, 0.95, 0.987, 1, 0.987, 0.95, 0.913, 0.9],
  });

  return (
    <View style={styles.figure} accessible={false}>
      <Svg
        width={FIGURE_WIDTH}
        height={FIGURE_HEIGHT}
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        fill="none"
      >
        <Path
          d="M58 49 C67 37 83 44 83 72"
          stroke={color.line}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray="6 7"
        />
        <Circle
          cx={73}
          cy={17}
          r={10}
          stroke={color.line}
          strokeWidth={3}
          strokeDasharray="5 5.5"
        />
        <Path
          d="M17 72 C17 44 33 37 42 49"
          stroke={color.brand}
          strokeWidth={15}
          strokeLinecap="round"
        />
        <Circle cx={27} cy={17} r={10.5} fill={color.brand} />
      </Svg>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.figureLayer,
          {
            transformOrigin: transformOrigin(42, 49),
            transform: [{ rotate: armRotation }],
          },
        ]}
      >
        <Svg
          width={FIGURE_WIDTH}
          height={FIGURE_HEIGHT}
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          fill="none"
        >
          <Path d="M42 49 L50 58" stroke={color.brand} strokeWidth={15} strokeLinecap="round" />
        </Svg>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.figureLayer,
          {
            transformOrigin: transformOrigin(73, 17),
            opacity: questionOpacity,
            transform: [{ translateY: questionTranslateY }, { rotate: questionRotation }],
          },
        ]}
      >
        <Svg
          width={FIGURE_WIDTH}
          height={FIGURE_HEIGHT}
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          fill="none"
        >
          <SvgText
            x={73}
            y={22.5}
            textAnchor="middle"
            fontSize={15}
            fontWeight="800"
            fill={color.textFaint}
          >
            ?
          </SvgText>
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 420,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space[5],
    paddingBottom: space[8],
  },
  figure: {
    width: FIGURE_WIDTH,
    height: FIGURE_HEIGHT,
  },
  figureLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  title: {
    marginTop: space[5],
    textAlign: 'center',
  },
  description: {
    marginTop: space[2],
    textAlign: 'center',
  },
  registerButton: {
    minWidth: 200,
    height: 48,
    marginTop: space[6],
    paddingHorizontal: space[6],
    borderRadius: radius.lg,
    backgroundColor: color.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
