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
const GAP = 3;

// 팀원 한 명 = 조각 하나(역할 색), 빈자리 = 회색 조각
export function TeamMemberRing({ members, capacity, size = 60 }: TeamMemberRingProps) {
  const r = (size - STROKE) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * r;

  // 정원이 잘못된 값(0, 음수 등)이어도 원이 깨지지 않게
  const hasValidCapacity = Number.isFinite(capacity) && capacity > 0;
  // 팀원이 정원보다 많으면 초과분도 보이게
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
