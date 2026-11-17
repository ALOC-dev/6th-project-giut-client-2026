import { Pressable, type PressableProps, type ViewStyle, type StyleProp } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming,
} from 'react-native-reanimated';
import { useMotion, HIT_SLOP_44 } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type PressProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  scaleOnPress?: boolean;
  touchSize?: number;
};

export function Press({
  style,
  touchSize,
  hitSlop,
  children,
  scaleOnPress = true,
  ...rest
}: PressProps) {
  const { press } = useMotion();
  const s = useSharedValue(1);

  const animated = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  const to = (v: number) =>
    withTiming(v, { duration: press.duration, easing: press.easing });

  return (
    <AnimatedPressable
      {...rest}
      hitSlop={hitSlop ?? (touchSize ? HIT_SLOP_44(touchSize) : undefined)}
      onPressIn={(e) => { s.set(to(scaleOnPress ? press.scale : 1)); rest.onPressIn?.(e); }}
      onPressOut={(e) => { s.set(to(1)); rest.onPressOut?.(e); }}
      style={[style, animated]}
    >
      {children as React.ReactNode}
    </AnimatedPressable>
  );
}
