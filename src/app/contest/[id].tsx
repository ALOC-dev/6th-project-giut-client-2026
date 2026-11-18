import { View } from 'react-native';

import { Button, Text } from '@/components/ui';
import { router, useLocalSearchParams } from 'expo-router';

export default function ContestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text variant="titleLg">공모전{id} 상세 페이지</Text>
      <Button
        label="팀 상세 보기"
        onPress={() => router.push({ pathname: '/team/[id]', params: { id: '7' } })}
      />
    </View>
  );
}
