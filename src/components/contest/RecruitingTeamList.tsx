import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { RecruitingTeamCard } from '@/components/team/RecruitingTeamCard';
import { Text } from '@/components/ui';
import { space } from '@/theme';
import type { Team } from '@/types/team';

type RecruitingTeamListProps = {
  teams: Team[];
};

// 모집 중인 팀 목록
export function RecruitingTeamList({ teams }: RecruitingTeamListProps) {
  // TODO: API 연결 전까지 화면 안에서만 저장 상태를 기억해요
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const toggleBookmark = (teamId: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(teamId)) next.delete(teamId);
      else next.add(teamId);
      return next;
    });
  };

  const goTeam = (teamId: string) =>
    router.push({ pathname: '/team/[id]', params: { id: teamId } });

  if (teams.length === 0) {
    return (
      <View style={S.empty}>
        <Text variant="bodyStrong">아직 모집 중인 팀이 없어요</Text>
        <Text variant="caption" color="textMuted">
          팀 구성하기를 눌러 팀을 만들어 보세요
        </Text>
      </View>
    );
  }

  return (
    <View style={S.list}>
      {teams.map((team) => (
        <RecruitingTeamCard
          key={team.id}
          team={team}
          bookmarked={bookmarkedIds.has(team.id)}
          onPress={() => goTeam(team.id)}
          onPressBookmark={() => toggleBookmark(team.id)}
          // TODO: 지원하기 화면이 생기면 연결. 지금은 팀 상세로 이동해요.
          onPressApply={() => goTeam(team.id)}
        />
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
  list: {
    gap: space[3],
    padding: space[4],
  },
});
