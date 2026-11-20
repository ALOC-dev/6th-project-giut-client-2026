import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing } from 'react-native';

import { useMotion } from '@/theme';

const DURATION = 460;
const ROW_STAGGER_INTERVAL = 110;
const COLUMN_STAGGER_INTERVAL = 28;
const COLUMN_COUNT = 2;
const MAX_STAGGER_ROWS = 4;

type CardEnterProps = {
  index: number;
  generation?: number;
  children: ReactNode;
};

export function CardEnter({ index, generation = 0, children }: CardEnterProps) {
  const { reduced } = useMotion();
  const [progress] = useState(() => new Animated.Value(reduced ? 1 : 0));

  useEffect(() => {
    if (reduced) {
      progress.setValue(1);
      return;
    }

    progress.setValue(0);
    const rowIndex = Math.floor(index / COLUMN_COUNT);
    const columnIndex = index % COLUMN_COUNT;
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: DURATION,
      delay:
        Math.min(rowIndex, MAX_STAGGER_ROWS - 1) * ROW_STAGGER_INTERVAL +
        columnIndex * COLUMN_STAGGER_INTERVAL,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: true,
    });

    animation.start();
    return () => animation.stop();
  }, [generation, index, progress, reduced]);

  return (
    <Animated.View
      style={{
        width: '48%',
        minWidth: 0,
        opacity: progress,
        transform: [
          {
            translateY: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [22, 0],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}
