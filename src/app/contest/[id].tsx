import { View } from 'react-native';

import { Button, Text } from '@/components/ui';
import { getContest } from '@/mocks/contests';
import { getTeamsByContest } from '@/mocks/teams';
import { router, useLocalSearchParams } from 'expo-router';

export default function ContestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const contest = getContest(id);
  if (!contest) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text variant="titleLg">존재하지 않는 공모전이에요.</Text>
      </View>
    );
  }
  const teams = getTeamsByContest(contest.id);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text variant="titleLg">{contest.title}</Text>
      <Text color="textMuted">{contest.host}</Text>
      {teams.map((team) => (
        <Button
          key={team.id}
          label={team.name}
          onPress={() => router.push({ pathname: '/team/[id]', params: { id: team.id } })}
        />
      ))}
    </View>
  );
}
