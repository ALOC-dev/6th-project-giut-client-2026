import { BellIcon } from 'phosphor-react-native';
import { useEffect } from 'react';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useMotion } from '@/theme';

// [각도, 걸리는 시간(ms)]. 헤더 알림 종(BellButton)과 같은 흔들림
const RING = [
  [18, 105],
  [-15, 105],
  [11, 105],
  [-7, 105],
  [3, 105],
  [0, 175],
] as const;

const START_DELAY = 600;
// 한 번 흔들린 뒤 쉬는 시간
const REST = 2200;

const easeOut = Easing.out(Easing.quad);

type RingingBellProps = {
  ringing: boolean;
  size: number;
  color: string;
};

export function RingingBell({ ringing, size, color }: RingingBellProps) {
  const { reduced } = useMotion();
  const rotate = useSharedValue(0);

  useEffect(() => {
    if (!ringing || reduced) {
      rotate.set(0);
      return;
    }

    rotate.set(
      withDelay(
        START_DELAY,
        withRepeat(
          withSequence(
            ...RING.map(([to, duration]) => withTiming(to, { duration, easing: easeOut })),
            withDelay(REST, withTiming(0, { duration: 0 })),
          ),
          -1,
        ),
      ),
    );

    return () => cancelAnimation(rotate);
  }, [reduced, ringing, rotate]);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.View style={[{ width: size, height: size, transformOrigin: '50% 8%' }, style]}>
      <BellIcon size={size} color={color} weight="bold" />
    </Animated.View>
  );
}
