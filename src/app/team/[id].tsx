import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { Text } from '@/components/ui';
import { getContestDetail } from '@/screens/contests/detailMocks';
import { getTeam } from '@/screens/teams';

// TODO: 팀 상세 화면 작업 때 screens/teams/ 아래 TeamDetailScreen으로 분리
export default function TeamDetailRoute() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const team = id ? getTeam(id) : undefined;

  if (!team) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text variant="titleLg">존재하지 않는 팀이에요.</Text>
      </View>
    );
  }
  const contest = getContestDetail(team.contestId);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {contest && <Text color="textMuted">{contest.title}</Text>}
      <Text variant="titleLg">{team.name}</Text>
      <Text>{team.description}</Text>
    </View>
  );
}
