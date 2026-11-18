import { View } from 'react-native';

import { Button, Text } from '@/components/ui';
import { useBottomNavigationInset } from '@/hooks/useBottomNavigationInset';
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
      <Button
        label="공모전 상세 보기"
        onPress={() => router.push({ pathname: '/contest/[id]', params: { id: '1' } })}
      />
    </View>
  );
}
