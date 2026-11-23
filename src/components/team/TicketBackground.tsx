import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { color, radius } from '@/theme';

type TicketBackgroundProps = {
  notchFromRight: number; // 오른쪽 끝에서 홈(반원)까지의 거리
  notchRadius?: number;
};

const CORNER = radius.xl;
const STROKE = 1;

// 위아래가 반원으로 파인 티켓 모양 테두리 (SVG)
export function TicketBackground({ notchFromRight, notchRadius = 9 }: TicketBackgroundProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { width: w, height: h } = size;

  const s = STROKE / 2;
  const r = CORNER;
  const n = notchRadius;
  const cx = w - notchFromRight;

  const d = [
    `M ${s + r} ${s}`,
    `H ${cx - n}`,
    `A ${n} ${n} 0 0 0 ${cx + n} ${s}`, // 위쪽 홈 (아래로 파임)
    `H ${w - s - r}`,
    `A ${r} ${r} 0 0 1 ${w - s} ${s + r}`,
    `V ${h - s - r}`,
    `A ${r} ${r} 0 0 1 ${w - s - r} ${h - s}`,
    `H ${cx + n}`,
    `A ${n} ${n} 0 0 0 ${cx - n} ${h - s}`, // 아래쪽 홈 (위로 파임)
    `H ${s + r}`,
    `A ${r} ${r} 0 0 1 ${s} ${h - s - r}`,
    `V ${s + r}`,
    `A ${r} ${r} 0 0 1 ${s + r} ${s}`,
    'Z',
  ].join(' ');

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setSize({ width, height });
      }}
    >
      {w > 0 && (
        <Svg width={w} height={h}>
          <Path d={d} fill={color.surface} stroke={color.line} strokeWidth={STROKE} />
        </Svg>
      )}
    </View>
  );
}
