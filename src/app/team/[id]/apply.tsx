import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { getContestDetail } from '@/screens/contests/detailMocks';
import { createApplyTeam, TeamApplyScreen } from '@/screens/team-apply';
import { getTeam } from '@/screens/teams';
import { color } from '@/theme';

export default function TeamApplyRoute() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const team = id ? getTeam(id) : undefined;
  const contest = team ? getContestDetail(team.contestId) : undefined;

  if (!team || !contest) {
    return (
      <View style={styles.notFound}>
        <Text variant="titleLg">지원할 팀을 찾지 못했어요.</Text>
      </View>
    );
  }

  return (
    <TeamApplyScreen
      team={createApplyTeam(team, contest.title)}
      onExit={() => router.back()}
      // TODO: 지원서 생성 API 연동 후 draft를 요청 형식으로 변환해 전송
      onSubmit={async () => {}}
      onDone={() => router.replace('/team')}
    />
  );
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.surface,
  },
});
