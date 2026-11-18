import { View } from 'react-native';

import { Button, Text } from '@/components/ui';
import { useBottomNavigationInset } from '@/hooks/useBottomNavigationInset';
import { CONTESTS } from '@/mocks/contests';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { contentPaddingBottom } = useBottomNavigationInset();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: contentPaddingBottom,
      }}
    >
      <Text variant="titleLg">홈</Text>
      {CONTESTS.map((contest) => (
        <Button
          key={contest.id}
          label={contest.title}
          onPress={() => router.push({ pathname: '/contest/[id]', params: { id: contest.id } })}
        />
      ))}
    </View>
  );
}
