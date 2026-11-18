import { View } from 'react-native';

import { Text } from '@/components/ui';
import { useBottomNavigationInset } from '@/hooks/useBottomNavigationInset';

export default function TeamScreen() {
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
      <Text variant="titleLg">팀</Text>
    </View>
  );
}
