import { Children, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';

import { Text } from '@/components/ui';
import { color, radius, space } from '@/theme';

const CORNER = radius['2xl'];
const NOTCH = 10; // 양옆 반원 홈 반지름
const FOOTER_HEIGHT = 28;
const FOOTER_WORDS = 5;

type TeamTicketProps = {
  children: ReactNode; // 각 자식이 한 구역. 구역 사이에 홈과 점선이 생겨요
};

// 구역 사이 양옆이 반원으로 파이고, 맨 아래에 GIUT 띠가 있는 세로 티켓 카드
export function TeamTicket({ children }: TeamTicketProps) {
  const sections = Children.toArray(children);
  const [size, setSize] = useState({ width: 0, height: 0 });
  // 구역 경계(각 구역 아래쪽)의 y 위치
  const [sectionBottoms, setSectionBottoms] = useState<number[]>([]);

  const setSectionBottom = (index: number, bottom: number) =>
    setSectionBottoms((prev) => {
      if (prev[index] === bottom) return prev;
      const next = [...prev];
      next[index] = bottom;
      return next;
    });

  // 마지막 구역 아래는 GIUT 띠라 홈이 없어요
  const notchYs = sectionBottoms.slice(0, sections.length - 1).filter((y) => y > 0);

  return (
    <View
      style={S.wrap}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setSize({ width, height });
      }}
    >
      {size.width > 0 && (
        <Svg width={size.width} height={size.height} style={S.background} pointerEvents="none">
          <Path d={ticketPath(size.width, size.height, notchYs)} fill={color.surface} />
          {notchYs.map((y) => (
            <Line
              key={y}
              x1={NOTCH + space[2]}
              x2={size.width - NOTCH - space[2]}
              y1={y}
              y2={y}
              stroke={color.line}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          ))}
        </Svg>
      )}

      {sections.map((section, index) => (
        <View
          key={index}
          onLayout={(e) => {
            const { y, height } = e.nativeEvent.layout;
            setSectionBottom(index, y + height);
          }}
        >
          {section}
        </View>
      ))}

      <View style={S.footer} accessible={false}>
        {Array.from({ length: FOOTER_WORDS }, (_, i) => (
          <Text key={i} variant="micro" color="surface" style={S.footerText}>
            GIUT
          </Text>
        ))}
      </View>
    </View>
  );
}

// 둥근 모서리 + 양옆 홈이 있는 테두리 경로 (시계 방향)
function ticketPath(w: number, h: number, notchYs: number[]) {
  const r = CORNER;
  const n = NOTCH;
  const right = notchYs.map((y) => `V ${y - n} A ${n} ${n} 0 0 0 ${w} ${y + n}`).join(' ');
  const left = [...notchYs]
    .reverse()
    .map((y) => `V ${y + n} A ${n} ${n} 0 0 0 0 ${y - n}`)
    .join(' ');

  return [
    `M ${r} 0`,
    `H ${w - r}`,
    `A ${r} ${r} 0 0 1 ${w} ${r}`,
    right,
    `V ${h - r}`,
    `A ${r} ${r} 0 0 1 ${w - r} ${h}`,
    `H ${r}`,
    `A ${r} ${r} 0 0 1 0 ${h - r}`,
    left,
    `V ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
    'Z',
  ].join(' ');
}

const S = StyleSheet.create({
  wrap: {
    marginHorizontal: space[4],
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  footer: {
    height: FOOTER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: color.brand,
    borderBottomLeftRadius: CORNER,
    borderBottomRightRadius: CORNER, // SVG 테두리와 모서리 모양이 같도록 borderCurve는 안 써요
  },
  footerText: {
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 1,
    opacity: 0.85,
  },
});
