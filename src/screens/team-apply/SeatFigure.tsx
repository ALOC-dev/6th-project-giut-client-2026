import { useEffect, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { useMotion } from '@/theme';

type SeatFigureProps = {
  color: string;
  tint: string;
  selected: boolean;
  size?: number;
  radius?: number;
  animated?: boolean;
};

function getFigureGeometry(size: number) {
  const scale = size / 46;
  const head = 16 * scale;
  const bodyWidth = 28 * scale;
  const bodyHeight = 14 * scale;
  const gap = 3 * scale;
  const strokeWidth = 2;
  const centerX = size / 2;
  const bodyTop = size - bodyHeight;
  const headTop = bodyTop - gap - head;
  const bodyRadius = bodyHeight - strokeWidth / 2;

  return {
    strokeWidth,
    head: {
      x: centerX - head / 2 + strokeWidth / 2,
      y: headTop + strokeWidth / 2,
      size: head - strokeWidth,
    },
    body: `M ${centerX - bodyWidth / 2 + strokeWidth / 2} ${size} V ${bodyTop + bodyHeight} A ${bodyRadius} ${bodyRadius} 0 0 1 ${centerX + bodyWidth / 2 - strokeWidth / 2} ${bodyTop + bodyHeight} V ${size}`,
  };
}

export function SeatFigure({
  color: figureColor,
  tint,
  selected,
  size = 46,
  radius = 15,
  animated = true,
}: SeatFigureProps) {
  const { reduced } = useMotion();
  const [progress] = useState(() => new Animated.Value(selected ? 1 : 0));
  const geometry = getFigureGeometry(size);

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: selected ? 1 : 0,
      duration: animated && !reduced ? 250 : 0,
      easing: Easing.bezier(0.34, 1.56, 0.64, 1),
      useNativeDriver: true,
    });

    animation.start();
    return () => animation.stop();
  }, [animated, progress, reduced, selected]);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: tint,
        overflow: 'hidden',
      }}
    >
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Rect
          x={geometry.head.x}
          y={geometry.head.y}
          width={geometry.head.size}
          height={geometry.head.size}
          rx={geometry.head.size / 2}
          fill="none"
          stroke={figureColor}
          strokeWidth={geometry.strokeWidth}
          strokeDasharray="3 2.4"
        />
        <Path
          d={geometry.body}
          fill="none"
          stroke={figureColor}
          strokeWidth={geometry.strokeWidth}
          strokeDasharray="3 2.4"
        />
      </Svg>

      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: progress.interpolate({
            inputRange: [0, 0.4, 1],
            outputRange: [0, 1, 1],
            extrapolate: 'clamp',
          }),
          transform: [
            { translateY: size / 2 },
            {
              scale: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.6, 1],
              }),
            },
            { translateY: -size / 2 },
          ],
        }}
      >
        <Svg width={size} height={size}>
          <Rect
            x={geometry.head.x}
            y={geometry.head.y}
            width={geometry.head.size}
            height={geometry.head.size}
            rx={geometry.head.size / 2}
            fill={figureColor}
            stroke={figureColor}
            strokeWidth={geometry.strokeWidth}
          />
          <Path
            d={geometry.body}
            fill={figureColor}
            stroke={figureColor}
            strokeWidth={geometry.strokeWidth}
          />
        </Svg>
      </Animated.View>
    </View>
  );
}
