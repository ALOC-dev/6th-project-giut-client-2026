import { useCallback } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { color, radius, useMotion } from '@/theme';

import { Press } from './Press';

export type SearchButtonProps = {
  onPress: () => void;
  size?: number;
  tint?: string;
  style?: StyleProp<ViewStyle>;
};

const HOP = [
  { scale: 0.8, rotate: -20, duration: 157 },
  { scale: 1.15, rotate: 8, duration: 158 },
  { scale: 1, rotate: 0, duration: 135 },
] as const;

const hopEase = Easing.bezier(0.3, 1.4, 0.5, 1);
const outEase = Easing.out(Easing.quad);

export function SearchButton({ onPress, size = 24, tint = color.ink, style }: SearchButtonProps) {
  const { reduced } = useMotion();
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const shine = useSharedValue(0);

  const hop = useCallback(() => {
    if (!reduced) {
      scale.set(
        withSequence(
          ...HOP.map((keyframe) =>
            withTiming(keyframe.scale, {
              duration: keyframe.duration,
              easing: hopEase,
            }),
          ),
        ),
      );
      rotate.set(
        withSequence(
          ...HOP.map((keyframe) =>
            withTiming(keyframe.rotate, {
              duration: keyframe.duration,
              easing: hopEase,
            }),
          ),
        ),
      );
      shine.set(0);
      shine.set(withTiming(1, { duration: 450, easing: outEase }));
    }

    onPress();
  }, [onPress, reduced, rotate, scale, shine]);

  const lensStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  const glintStyle = useAnimatedStyle(() => {
    const progress = shine.value;
    const opacity =
      progress === 0 || progress === 1
        ? 0
        : progress < 0.4
          ? (progress / 0.4) * 0.9
          : (1 - (progress - 0.4) / 0.6) * 0.9;

    return {
      opacity,
      transform: [
        { translateX: -3 + progress * 6 },
        { translateY: 3 - progress * 6 },
        { rotate: '-45deg' },
      ],
    };
  });

  return (
    <Press
      onPress={hop}
      accessibilityRole="button"
      accessibilityLabel="검색"
      scaleOnPress={false}
      style={[{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, style]}
    >
      <Animated.View style={[{ width: size, height: size }, lensStyle]}>
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx={11} cy={11} r={7} stroke={tint} strokeWidth={1.8} strokeLinecap="round" />
          <Path d="m20 20-3.5-3.5" stroke={tint} strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              left: size * 0.29,
              top: size * 0.29,
              width: size * 0.21,
              height: 2,
              borderRadius: radius.full,
              backgroundColor: color.brand,
            },
            glintStyle,
          ]}
        />
      </Animated.View>
    </Press>
  );
}
