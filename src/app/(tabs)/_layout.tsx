import { router, usePathname } from 'expo-router';
import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNavigation } from '@/components/ui';
import { TAB_ITEMS, TAB_PATHS, type TabKey } from '@/constants/navigation';
import { space } from '@/theme';

export default function TabsLayout() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const currentTab =
    (Object.keys(TAB_PATHS) as TabKey[]).find((key) => TAB_PATHS[key] === pathname) ?? 'home';

  return (
    <Tabs>
      <TabSlot />

      <TabList style={{ display: 'none' }}>
        <TabTrigger name="home" href="/" />
        <TabTrigger name="team" href="/team" />
        <TabTrigger name="giuthub" href="/giuthub" />
        <TabTrigger name="chat" href="/chat" />
        <TabTrigger name="my" href="/my" />
      </TabList>

      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingBottom: insets.bottom > 0 ? space[5] : 0,
        }}
      >
        <BottomNavigation
          items={TAB_ITEMS}
          value={currentTab}
          style={{ marginHorizontal: space[6] }}
          onChange={(key) => router.navigate(TAB_PATHS[key as TabKey])}
        />
      </View>
    </Tabs>
  );
}
