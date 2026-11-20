import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Press, Text } from '@/components/ui';
import { color, space } from '@/theme';
import type { Team } from '@/types/team';

type RecruitingTeamListProps = {
  teams: Team[];
};

// 모집 중인 팀 목록
// TODO: 시안 확인 후 팀 카드 UI로 교체 예정. 지금은 이동 확인용 간단한 목록이에요.
export function RecruitingTeamList({ teams }: RecruitingTeamListProps) {
  if (teams.length === 0) {
    return (
      <View style={S.empty}>
        <Text variant="bodyStrong">아직 모집 중인 팀이 없어요</Text>
        <Text variant="caption" color="textMuted">
          첫 번째로 팀을 만들어보세요
        </Text>
      </View>
    );
  }

  return (
    <View>
      {teams.map((team, index) => (
        <Press
          key={team.id}
          style={[S.row, index === teams.length - 1 && S.rowLast]}
          onPress={() => router.push({ pathname: '/team/[id]', params: { id: team.id } })}
          scaleOnPress={false}
        >
          <Text variant="bodyStrong">{team.name}</Text>
          <Text variant="caption" color="textMuted">
            {team.members.length} / {team.capacity}명
          </Text>
        </Press>
      ))}
    </View>
  );
}

const S = StyleSheet.create({
  empty: {
    alignItems: 'center',
    gap: space[1],
    paddingVertical: space[8],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: space[5],
    paddingVertical: space[4],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.line,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
});
