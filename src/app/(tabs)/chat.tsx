import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatListScreen, type OpenedRoom } from '@/screens/chat';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const openRoom = (room: OpenedRoom) => {
    router.push({
      pathname: '/chat/[id]',
      params: {
        id: room.id,
        name: room.name,
        color: room.color,
        tint: room.tint,
        offer: room.offer ? 'true' : 'false',
      },
    });
  };

  return (
    <ChatListScreen
      topInset={insets.top}
      onOpen={openRoom}
      onBrowse={() => router.navigate('/contest')}
    />
  );
}
