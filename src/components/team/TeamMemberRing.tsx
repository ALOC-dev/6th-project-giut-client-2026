import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

import { Text } from '@/components/ui';
import { color, role } from '@/theme';
import type { Member } from '@/screens/teams';

type TeamMemberRingProps = {
  members: Member[];
  capacity: number;
  size?: number;
};

const STROKE = 5;
const GAP = 3; // 칸 사이 간격(px)

// 정원을 조각으로 나눈 원. 팀원 한 명 = 조각 하나 (역할 색), 빈자리는 회색 조각이에요.
export function TeamMemberRing({ members, capacity, size = 60 }: TeamMemberRingProps) {
  const r = (size - STROKE) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * r;

  // API에서 정원이 0·음수·숫자 아님으로 와도 원이 깨지지 않게 막아요
  const hasValidCapacity = Number.isFinite(capacity) && capacity > 0;
  // 조각 수: 정원보다 팀원이 많으면(데이터 오류) 팀원 수만큼 그려서 초과분도 보이게 해요
  const slotCount = Math.max(hasValidCapacity ? Math.floor(capacity) : 0, members.length, 1);
  const slot = circumference / slotCount;

  return (
    <View
      style={{ width: size, height: size }}
      accessible
      accessibilityLabel={
        hasValidCapacity ? `정원 ${capacity}명 중 ${members.length}명 참여` : '정원 정보 없음'
      }
    >
      <Svg width={size} height={size}>
        {/* 정원 수만큼 조각을 그려요. 12시 방향부터 시계 방향으로,
            팀원이 있는 조각은 역할 색, 빈자리 조각은 회색이에요. */}
        <G rotation={-90} origin={`${center}, ${center}`}>
          {Array.from({ length: slotCount }, (_, i) => {
            const member = members[i];
            return (
              <Circle
                key={i}
                cx={center}
                cy={center}
                r={r}
                stroke={member ? role[member.role].base : color.lineSoft}
                strokeWidth={STROKE}
                fill="none"
                strokeDasharray={`${Math.max(slot - GAP, 1)} ${circumference}`}
                strokeDashoffset={-(i * slot + GAP / 2)}
              />
            );
          })}
        </G>
      </Svg>

      <View style={S.label} pointerEvents="none">
        <Text variant="caption" style={S.count}>
          {members.length}/{hasValidCapacity ? capacity : '-'}
          <Text variant="micro" color="textSecondary">
            {' 명'}
          </Text>
        </Text>
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  label: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    fontWeight: '800',
  },
});
