import { View } from 'react-native';
import { router } from 'expo-router';

import { Button, Text } from '@/components/ui';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text variant="titleLg">홈</Text>
      <Button label="공모전 목록 보기" onPress={() => router.push('/contest')} />
    </View>
  );
}
