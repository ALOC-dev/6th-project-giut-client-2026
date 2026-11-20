import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { color, radius, useMotion } from '@/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type IconProps = {
  size?: number;
  color?: string;
};

export type AnimatedFilterIconProps = IconProps & {
  animationKey?: number;
};

export function AnimatedFilterIcon({
  size = 18,
  color: iconColor = color.ink,
  animationKey = 0,
}: AnimatedFilterIconProps) {
  const { reduced, easing, duration } = useMotion();
  const topHandleX = useSharedValue(16);
  const bottomHandleX = useSharedValue(8);

  useEffect(() => {
    if (animationKey === 0 || reduced) return;

    const moveTo = (to: number, moveDuration: number) =>
      withTiming(to, { duration: moveDuration, easing: easing.spring });

    topHandleX.value = withSequence(moveTo(8, duration.d1), moveTo(18, 140), moveTo(16, 120));
    bottomHandleX.value = withDelay(
      60,
      withSequence(moveTo(17, duration.d1), moveTo(6, 140), moveTo(8, 120)),
    );
  }, [animationKey, bottomHandleX, duration.d1, easing.spring, reduced, topHandleX]);

  const topHandleProps = useAnimatedProps(() => ({ cx: topHandleX.value }));
  const bottomHandleProps = useAnimatedProps(() => ({ cx: bottomHandleX.value }));

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 7h18M3 17h18"
        stroke={iconColor}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.35}
      />
      <Path d="M3 7h11" stroke={iconColor} strokeWidth={2} strokeLinecap="round" />
      <AnimatedCircle
        animatedProps={topHandleProps}
        cy={7}
        r={2.4}
        fill={color.surface}
        stroke={iconColor}
        strokeWidth={2}
      />
      <Path d="M10 17h11" stroke={iconColor} strokeWidth={2} strokeLinecap="round" />
      <AnimatedCircle
        animatedProps={bottomHandleProps}
        cy={17}
        r={2.4}
        fill={color.surface}
        stroke={iconColor}
        strokeWidth={2}
      />
    </Svg>
  );
}

const BOOKMARK_DOTS = [0, 60, 120, 180, 240, 300].map((degrees, index) => {
  const radians = (degrees * Math.PI) / 180;
  const distance = index % 2 ? 15 : 19;
  return {
    dx: Math.sin(radians) * distance,
    dy: -Math.cos(radians) * distance,
  };
});

export function AnimatedBookmarkIcon({ saved }: { saved: boolean }) {
  const { reduced, easing, duration } = useMotion();
  const firstRender = useRef(true);
  const scale = useSharedValue(1);
  const burst = useSharedValue(1);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (reduced) return;

    if (saved) {
      scale.value = withSequence(
        withTiming(0.6, { duration: duration.d1 * 0.65, easing: easing.inOut }),
        withTiming(1.3, { duration: duration.d1 * 0.7, easing: easing.spring }),
        withTiming(1, { duration: duration.d1 * 0.65, easing: easing.spring }),
      );
      burst.value = withSequence(
        withTiming(0, { duration: 0 }),
        withDelay(60, withTiming(1, { duration: duration.d6, easing: easing.out })),
      );
      return;
    }

    scale.value = withSequence(
      withTiming(0.75, { duration: 100, easing: easing.inOut }),
      withTiming(1, { duration: 150, easing: easing.spring }),
    );
  }, [burst, duration, easing, reduced, saved, scale]);

  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: 0.6 * (1 - burst.value),
    transform: [{ scale: 0.2 + burst.value * 1.4 }],
    borderWidth: 6 * (1 - burst.value),
  }));

  return (
    <View style={animatedBookmarkStyles.wrap}>
      <Animated.View style={[animatedBookmarkStyles.ring, ringStyle]} pointerEvents="none" />
      {BOOKMARK_DOTS.map((dot, index) => (
        <BookmarkBurstDot key={index} dx={dot.dx} dy={dot.dy} progress={burst} />
      ))}
      <Animated.View style={iconStyle}>
        <BookmarkIcon filled={saved} />
      </Animated.View>
    </View>
  );
}

function BookmarkBurstDot({
  dx,
  dy,
  progress,
}: {
  dx: number;
  dy: number;
  progress: { value: number };
}) {
  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [
      { translateX: dx * progress.value },
      { translateY: dy * progress.value },
      { scale: 1 - progress.value },
    ],
  }));

  return <Animated.View style={[animatedBookmarkStyles.dot, style]} pointerEvents="none" />;
}

const animatedBookmarkStyles = StyleSheet.create({
  wrap: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: radius.full,
    borderColor: color.brand,
    opacity: 0,
  },
  dot: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: radius.full,
    backgroundColor: color.brand,
    opacity: 0,
  },
});

export function TeamIcon({ size = 13, color: iconColor = color.ink }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={iconColor}>
      <Circle cx={9} cy={7.5} r={4} />
      <Path d="M1.5 20.5a7.5 7.5 0 0 1 15 0V21h-15z" />
      <Circle cx={17} cy={8.5} r={3.2} />
      <Path d="M17.5 13.2a6.3 6.3 0 0 1 5 6.3V21h-4.4v-.5a9 9 0 0 0-2.6-6.4 6 6 0 0 1 2-.9z" />
    </Svg>
  );
}

export function EyeIcon({ size = 14, color: iconColor = color.textFaint }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={iconColor}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <Circle cx={12} cy={12} r={3} />
    </Svg>
  );
}

export function BookmarkIcon({ size = 20, filled = false }: { size?: number; filled?: boolean }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? color.brand : 'none'}
      stroke={filled ? color.brand : color.textMuted}
      strokeWidth={1.8}
      strokeLinejoin="round"
    >
      <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </Svg>
  );
}

export function ChevronIcon({
  size = 12,
  color: iconColor = color.ink,
  dir = 'down',
}: IconProps & { dir?: 'down' | 'left' | 'right' }) {
  const path = dir === 'down' ? 'm6 9 6 6 6-6' : dir === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6';

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={iconColor}
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d={path} />
    </Svg>
  );
}

export function CheckIcon({ size = 12, color: iconColor = color.surface }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={iconColor}
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="m5 12 5 5 9-10" />
    </Svg>
  );
}

export function PlusIcon({ size = 20, color: iconColor = color.surface }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={iconColor}
      strokeWidth={2.4}
      strokeLinecap="round"
    >
      <Path d="M12 5v14M5 12h14" />
    </Svg>
  );
}
