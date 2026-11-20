import { useCallback, useEffect, useRef, useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { color, radius, space, useMotion } from '@/theme';
import { Text } from './Text';

export type ToastProps = {
  message: string;
  visible: boolean;
  bottom?: number;
};

export const TOAST_MS = 1600;

export function Toast({ message, visible, bottom = 108 }: ToastProps) {
  const { duration, easing, reduced } = useMotion();
  const p = useSharedValue(0);

  useEffect(() => {
    p.value = reduced
      ? visible
        ? 1
        : 0
      : withTiming(visible ? 1 : 0, {
          duration: visible ? duration.d3 : duration.d2,
          easing: visible ? easing.out : easing.exit,
        });
  }, [visible, reduced, duration.d2, duration.d3, easing.out, easing.exit, p]);

  const anim = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [{ translateY: (1 - p.value) * 12 }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      accessibilityElementsHidden={!visible}
      importantForAccessibility={visible ? 'yes' : 'no-hide-descendants'}
      style={[
        {
          position: 'absolute',
          bottom,
          left: 0,
          right: 0,
          alignItems: 'center',
          zIndex: 45,
        },
        anim,
      ]}
    >
      <Text
        variant="caption"
        style={{
          color: color.surface,
          backgroundColor: color.surfaceInverse,
          paddingVertical: space[2.5],
          paddingHorizontal: space[4],
          borderRadius: radius.full,
          overflow: 'hidden',
        }}
      >
        {message}
      </Text>
    </Animated.View>
  );
}

export function useToast() {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((next: string) => {
    if (timer.current) clearTimeout(timer.current);
    setMessage(next);
    setVisible(true);
    timer.current = setTimeout(() => setVisible(false), TOAST_MS);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return { show, props: { message, visible } };
}
