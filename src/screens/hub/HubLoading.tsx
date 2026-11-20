import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { Text } from '@/components/ui';
import { color, useMotion } from '@/theme';

import { LOADING_CAPTIONS } from './constants';

const LOOP_DURATION = 2600;
const TYPE_INTERVAL = 55;
const CAPTION_HOLD_DURATION = 1600;
const VIEWBOX_WIDTH = 100;
const VIEWBOX_HEIGHT = 84;
const LEFT_ARM_PATH = 'M18 70 C18 46 30 38 40 48 Q45 53.5 50 54';
const RIGHT_ARM_PATH = 'M82 70 C82 46 70 38 60 48 Q55 53.5 50 54';
const SPARK_PATH = 'M50 36V28M39 39l-4.5-4.5M61 39l4.5-4.5';

const ARM_X_INPUT = [
  0, 0.06, 0.105, 0.15, 0.195, 0.24, 0.33, 0.42, 0.51, 0.6, 0.69, 0.82, 0.85, 0.88, 0.91, 0.94, 1,
];
const ARM_X_OUTPUT = [
  -16, -16, -13.608, -5.537, -1.006, 0, 0, 0, 0, 0, 0, 0, -2.392, -10.463, -14.994, -16, -16,
];
const ARM_ROTATION_INPUT = [
  0, 0.06, 0.105, 0.15, 0.195, 0.24, 0.263, 0.285, 0.307, 0.33, 0.352, 0.375, 0.398, 0.42, 0.443,
  0.465, 0.487, 0.51, 0.532, 0.555, 0.578, 0.6, 0.623, 0.645, 0.667, 0.69, 0.82, 0.85, 0.88, 0.91,
  0.94, 1,
];
const ARM_ROTATION_OUTPUT = [
  '-9deg',
  '-9deg',
  '-7.65deg',
  '-3.11deg',
  '-0.57deg',
  '0deg',
  '0.75deg',
  '3.27deg',
  '4.69deg',
  '5deg',
  '3.8deg',
  '-0.23deg',
  '-2.5deg',
  '-3deg',
  '-1.8deg',
  '2.23deg',
  '4.5deg',
  '5deg',
  '3.8deg',
  '-0.23deg',
  '-2.5deg',
  '-3deg',
  '-2.55deg',
  '-1.04deg',
  '-0.19deg',
  '0deg',
  '0deg',
  '-1.35deg',
  '-5.89deg',
  '-8.43deg',
  '-9deg',
  '-9deg',
];
const NOD_INPUT = [
  0, 0.2, 0.217, 0.235, 0.253, 0.27, 0.287, 0.305, 0.323, 0.34, 0.7, 0.713, 0.725, 0.738, 0.75,
  0.762, 0.775, 0.787, 0.8, 1,
];
const NOD_OUTPUT = [
  0, 0, -0.897, -3.924, -5.623, -6, -5.103, -2.076, -0.377, 0, 0, -0.448, -1.962, -2.811, -3,
  -2.552, -1.038, -0.189, 0, 0,
];
const SPARK_OPACITY_INPUT = [0, 0.22, 0.24, 0.26, 0.28, 0.3, 0.34, 0.38, 0.42, 0.46, 1];
const SPARK_OPACITY_OUTPUT = [0, 0, 0.149, 0.654, 0.937, 1, 0.851, 0.346, 0.063, 0, 0];
const SPARK_SCALE_INPUT = [0, 0.22, 0.24, 0.26, 0.28, 0.3, 0.34, 0.38, 0.42, 0.46, 1];
const SPARK_SCALE_OUTPUT = [0.4, 0.4, 0.49, 0.792, 0.962, 1, 1.052, 1.229, 1.328, 1.35, 1.35];

const mirrorDegrees = (values: readonly string[]) =>
  values.map((value) => (value.startsWith('-') ? value.slice(1) : `-${value}`));
const mirrorNumbers = (values: readonly number[]) => values.map((value) => -value);

export type HubLoadingProps = {
  size?: number;
};

export function HubLoading({ size = 96 }: HubLoadingProps) {
  const { reduced } = useMotion();

  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel="불러오는 중">
      <Handshake reduced={reduced} size={size} />
      <TypingCaption reduced={reduced} />
    </View>
  );
}

export function Handshake({
  reduced,
  size = 96,
  startAt = 0,
}: {
  reduced: boolean;
  size?: number;
  startAt?: number;
}) {
  const [progress] = useState(() => new Animated.Value(0));
  const ratio = size / VIEWBOX_WIDTH;
  const height = VIEWBOX_HEIGHT * ratio;
  const padding = 16 * ratio;

  useEffect(() => {
    if (reduced) {
      progress.setValue(Math.max(0, 0.5 - startAt));
      return;
    }

    progress.setValue(0);
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: LOOP_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    loop.start();
    return () => loop.stop();
  }, [progress, reduced, startAt]);

  const phase = Animated.modulo(Animated.add(progress, startAt), 1);

  const leftX = phase.interpolate({
    inputRange: ARM_X_INPUT,
    outputRange: ARM_X_OUTPUT.map((value) => value * ratio),
  });
  const rightX = phase.interpolate({
    inputRange: ARM_X_INPUT,
    outputRange: mirrorNumbers(ARM_X_OUTPUT).map((value) => value * ratio),
  });
  const leftRotation = phase.interpolate({
    inputRange: ARM_ROTATION_INPUT,
    outputRange: [...ARM_ROTATION_OUTPUT],
  });
  const rightRotation = phase.interpolate({
    inputRange: ARM_ROTATION_INPUT,
    outputRange: mirrorDegrees(ARM_ROTATION_OUTPUT),
  });
  const nod = phase.interpolate({
    inputRange: NOD_INPUT,
    outputRange: NOD_OUTPUT.map((value) => value * ratio),
  });
  const sparkOpacity = phase.interpolate({
    inputRange: SPARK_OPACITY_INPUT,
    outputRange: [...SPARK_OPACITY_OUTPUT],
  });
  const sparkScale = phase.interpolate({
    inputRange: SPARK_SCALE_INPUT,
    outputRange: [...SPARK_SCALE_OUTPUT],
  });
  const leftOrigin = `${18 * ratio}px ${72 * ratio}px`;
  const rightOrigin = `${82 * ratio}px ${72 * ratio}px`;

  return (
    <View style={{ width: size + padding * 2, height }} accessible={false}>
      <PersonSide
        path={LEFT_ARM_PATH}
        centerX={27}
        translateX={leftX}
        rotation={leftRotation}
        nod={nod}
        origin={leftOrigin}
        size={size}
        height={height}
        left={padding}
      />
      <PersonSide
        path={RIGHT_ARM_PATH}
        centerX={73}
        translateX={rightX}
        rotation={rightRotation}
        nod={nod}
        origin={rightOrigin}
        size={size}
        height={height}
        left={padding}
      />

      <Animated.View
        style={[
          styles.layer,
          { left: padding, opacity: sparkOpacity, transform: [{ scale: sparkScale }] },
        ]}
        pointerEvents="none"
      >
        <Svg width={size} height={height} viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}>
          <Path
            d={SPARK_PATH}
            stroke="#4C8DFF"
            strokeWidth={3.2}
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

function PersonSide({
  path,
  centerX,
  translateX,
  rotation,
  nod,
  origin,
  size,
  height,
  left,
}: {
  path: string;
  centerX: number;
  translateX: Animated.AnimatedInterpolation<number>;
  rotation: Animated.AnimatedInterpolation<string>;
  nod: Animated.AnimatedInterpolation<number>;
  origin: string;
  size: number;
  height: number;
  left: number;
}) {
  return (
    <Animated.View
      style={[
        styles.layer,
        {
          left,
          transformOrigin: origin,
          transform: [{ translateX }, { rotate: rotation }],
        },
      ]}
    >
      <Svg width={size} height={height} viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}>
        <Gradient />
        <Path
          d={path}
          stroke="url(#giutHubGradient)"
          strokeWidth={15}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
      <Animated.View style={[styles.layer, { transform: [{ translateY: nod }] }]}>
        <Svg width={size} height={height} viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}>
          <Gradient />
          <Circle cx={centerX} cy={17} r={11} fill="url(#giutHubGradient)" />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

function Gradient() {
  return (
    <Defs>
      <LinearGradient
        id="giutHubGradient"
        x1="10"
        y1="10"
        x2="90"
        y2="80"
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset="0" stopColor="#4C8DFF" />
        <Stop offset="1" stopColor={color.brandStrong} />
      </LinearGradient>
    </Defs>
  );
}

export function TypingCaption({ reduced }: { reduced: boolean }) {
  const [captionIndex, setCaptionIndex] = useState(0);
  const [visibleLength, setVisibleLength] = useState(0);
  const [caretOpacity] = useState(() => new Animated.Value(1));
  const caption = LOADING_CAPTIONS[captionIndex];

  useEffect(() => {
    if (reduced) return;

    if (visibleLength < caption.length) {
      const timer = setTimeout(() => setVisibleLength((current) => current + 1), TYPE_INTERVAL);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setCaptionIndex((current) => (current + 1) % LOADING_CAPTIONS.length);
      setVisibleLength(0);
    }, CAPTION_HOLD_DURATION);

    return () => clearTimeout(timer);
  }, [caption, reduced, visibleLength]);

  useEffect(() => {
    if (reduced) {
      caretOpacity.setValue(1);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(caretOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(caretOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();
    return () => loop.stop();
  }, [caretOpacity, reduced]);

  return (
    <View style={styles.caption}>
      <Text variant="body" color="textSecondary">
        {reduced ? caption : caption.slice(0, visibleLength)}
      </Text>
      <Animated.View style={[styles.caret, { opacity: caretOpacity }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  caption: {
    minHeight: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  caret: {
    width: 2,
    height: 16,
    borderRadius: 1,
    backgroundColor: color.brand,
  },
});
