import { View } from 'react-native';

import { Text } from '@/components/ui';

export default function MyPageScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text variant="titleLg">마이</Text>
    </View>
  );
}
