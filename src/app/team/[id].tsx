import { View } from 'react-native';

import { Text } from '@/components/ui';
import { getContest } from '@/mocks/contests';
import { getTeam } from '@/mocks/teams';
import { useLocalSearchParams } from 'expo-router';

export default function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const team = getTeam(id);
  if (!team) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text variant="titleLg">존재하지 않는 팀이에요.</Text>
      </View>
    );
  }
  const contest = getContest(team.contestId);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {contest && <Text color="textMuted">{contest.title}</Text>}
      <Text variant="titleLg">{team.name}</Text>
      <Text>{team.description}</Text>
    </View>
  );
}
