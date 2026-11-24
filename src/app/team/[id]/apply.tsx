import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Press, Text } from '@/components/ui';
import { getContestDetail } from '@/screens/contests/detailMocks';
import { createApplyTeam, TeamApplyScreen } from '@/screens/team-apply';
import { getTeam, isTeamClosed } from '@/screens/teams';
import { color, radius, space } from '@/theme';

export default function TeamApplyRoute() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const team = id ? getTeam(id) : undefined;
  const contest = team ? getContestDetail(team.contestId) : undefined;
  const closed = team ? isTeamClosed(team) : false;

  if (!team || !contest || closed) {
    return (
      <>
        <Stack.Screen options={{ gestureEnabled: false }} />
        <View style={styles.notFound}>
          <Text variant="titleLg">
            {closed ? '모집이 마감된 팀이에요.' : '지원할 팀을 찾지 못했어요.'}
          </Text>
          <Text variant="body" color="textBody" style={styles.description}>
            {closed
              ? '현재는 이 팀에 지원서를 보낼 수 없어요.'
              : '이전 화면으로 돌아가 다시 확인해 주세요.'}
          </Text>
          <Press
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="이전 화면으로 돌아가기"
            style={styles.backButton}
          >
            <Text variant="button" color="surface">
              돌아가기
            </Text>
          </Press>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ gestureEnabled: false }} />
      <TeamApplyScreen
        team={createApplyTeam(team, contest.title)}
        onExit={() => router.back()}
        // TODO: 지원서 생성 API 연동 후 draft를 요청 형식으로 변환해 전송
        onSubmit={async () => {}}
        onDone={() => router.replace('/team')}
      />
    </>
  );
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space[5],
    backgroundColor: color.surface,
  },
  description: { marginTop: space[2], textAlign: 'center' },
  backButton: {
    height: 52,
    marginTop: space[6],
    paddingHorizontal: space[8],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xl,
    backgroundColor: color.brand,
  },
});
