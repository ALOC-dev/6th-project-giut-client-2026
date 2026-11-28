import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* 아래에서 올라와 화면 전체를 덮어요. 쓰던 내용이 날아가지 않게 쓸어내려 닫기는 막혀 있어요 */}
        <Stack.Screen
          name="profile-edit"
          options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
