import { View } from 'react-native';

import { Text } from '@/components/ui';

export default function ChatScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text variant="titleLg">채팅</Text>
    </View>
  );
}
