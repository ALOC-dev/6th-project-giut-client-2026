import { useCallback, useEffect } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { color, useMotion } from '@/theme';

import { Press } from './Press';

export type BellButtonProps = {
  unread?: boolean;
  onPress: () => void;
  size?: number;
  tint?: string;
  style?: StyleProp<ViewStyle>;
};

const RING = [
  [18, 105],
  [-15, 105],
  [11, 105],
  [-7, 105],
  [3, 105],
  [0, 175],
] as const;

const CLAP = [
  [-2, 120],
  [2, 120],
  [-1, 120],
  [0, 240],
] as const;

const easeOut = Easing.out(Easing.quad);

export function BellButton({
  unread = false,
  onPress,
  size = 24,
  tint = color.ink,
  style,
}: BellButtonProps) {
  const { reduced } = useMotion();
  const rotate = useSharedValue(0);
  const clapperX = useSharedValue(0);
  const dotScale = useSharedValue(unread ? 1 : 0);

  useEffect(() => {
    if (reduced) {
      dotScale.set(unread ? 1 : 0);
      return;
    }

    dotScale.set(withDelay(
      unread ? 0 : 250,
      withTiming(unread ? 1 : 0, {
        duration: 350,
        easing: Easing.bezier(0.5, -0.8, 0.7, 1),
      }),
    ));
  }, [dotScale, reduced, unread]);

  const ring = useCallback(() => {
    if (!reduced) {
      rotate.set(withSequence(
        ...RING.map(([to, duration]) => withTiming(to, { duration, easing: easeOut })),
      ));
      clapperX.set(withSequence(
        ...CLAP.map(([to, duration]) => withTiming(to, { duration, easing: easeOut })),
      ));
    }

    onPress();
  }, [clapperX, onPress, reduced, rotate]);

  const bellStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  const clapperStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: clapperX.value }],
  }));

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
  }));

  const dotSize = Math.round(size * 0.29);

  return (
    <Press
      onPress={ring}
      accessibilityRole="button"
      accessibilityLabel={unread ? '알림, 안 읽은 알림 있음' : '알림'}
      scaleOnPress={false}
      style={[
        { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
        style,
      ]}
    >
      <Animated.View
        style={[
          { width: size, height: size, transformOrigin: '50% 8%' },
          bellStyle,
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"
            stroke={tint}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        <Animated.View
          pointerEvents="none"
          style={[{ position: 'absolute', inset: 0 }, clapperStyle]}
        >
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
              d="M10.3 21a1.94 1.94 0 0 0 3.4 0"
              stroke={tint}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Animated.View>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            top: 10,
            right: 10,
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: color.brand,
            borderWidth: 1.5,
            borderColor: color.surface,
          },
          dotStyle,
        ]}
      />
    </Press>
  );
}
