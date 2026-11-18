import { View } from 'react-native';

import { Text } from '@/components/ui';
import { useBottomNavigationInset } from '@/hooks/useBottomNavigationInset';

export default function MyPageScreen() {
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
      <Text variant="titleLg">마이</Text>
    </View>
  );
}
