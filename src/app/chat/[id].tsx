import * as Clipboard from 'expo-clipboard';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatRoomScreen, isChatField } from '@/screens/chat';
import { color, space } from '@/theme';

type ChatRoomParams = {
  id?: string | string[];
  name?: string | string[];
  field?: string | string[];
  offer?: string | string[];
};

const firstParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default function ChatRoomRoute() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<ChatRoomParams>();
  const id = firstParam(params.id);
  const name = firstParam(params.name);
  const fieldParam = firstParam(params.field);
  const offer = firstParam(params.offer);
  const field = isChatField(fieldParam) ? fieldParam : '기획';
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/chat');
  };

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
        key={id}
        partner={name}
        partnerField={field}
        scenario={offer === 'true' ? '제안' : '문의'}
        topInset={insets.top}
        bottomInset={Math.max(insets.bottom, space[3])}
        onBack={handleBack}
        onLeave={() => router.dismissTo('/chat')}
        onCopy={(text) => Clipboard.setStringAsync(text)}
      />
    </>
  );
}
