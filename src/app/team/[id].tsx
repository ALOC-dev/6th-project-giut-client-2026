import { View } from 'react-native';

import { Text } from '@/components/ui';
import { useLocalSearchParams } from 'expo-router';

export default function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text variant="titleLg">팀{id} 상세 페이지</Text>
    </View>
  );
}
