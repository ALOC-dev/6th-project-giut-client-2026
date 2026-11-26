import * as Clipboard from 'expo-clipboard';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatRoomScreen, isChatField } from '@/screens/chat';
import { color, space } from '@/theme';

export default function ChatRoomRoute() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    id: string;
    name?: string;
    field?: string;
    offer?: string;
  }>();
  const field = isChatField(params.field) ? params.field : '기획';

  return (
    <>
      <Stack.Screen
        options={{
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: color.surface },
          gestureEnabled: true,
        }}
      />
      <ChatRoomScreen
        partner={params.name}
        partnerField={field}
        scenario={params.offer === 'true' ? '제안' : '문의'}
        topInset={insets.top}
        bottomInset={Math.max(insets.bottom, space[3])}
        onBack={() => router.back()}
        onLeave={() => router.dismissTo('/chat')}
        onCopy={(text) => Clipboard.setStringAsync(text)}
      />
    </>
  );
}
