import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="contest/[id]" options={{ headerShown: true, title: '공모전', headerBackButtonDisplayMode: 'minimal' }} />
        <Stack.Screen name="team/[id]" options={{ headerShown: true, title: '팀', headerBackButtonDisplayMode:'minimal' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
