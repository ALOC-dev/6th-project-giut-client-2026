import { router, usePathname, type Href } from 'expo-router';
import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import { View } from 'react-native';

import { BottomNavigation, type BottomNavigationItem } from '@/components/ui';
import { useBottomNavigationInset } from '@/hooks/useBottomNavigationInset';
import { space } from '@/theme';

type TabKey = 'home' | 'team' | 'giuthub' | 'chat' | 'my';

const TAB_ITEMS = [
  {
    key: 'home',
    label: '홈',
    icon: { ios: 'house', android: 'home', web: 'home' },
    activeIcon: { ios: 'house.fill', android: 'home', web: 'home' },
  },
  {
    key: 'team',
    label: '팀',
    icon: { phosphor: 'circles-three' },
  },
  {
    key: 'giuthub',
    label: '기웃허브',
    icon: { image: require('../../../assets/images/giut-symbol.png') },
  },
  {
    key: 'chat',
    label: '채팅',
    icon: { ios: 'text.bubble', android: 'chat', web: 'chat' },
    activeIcon: { ios: 'text.bubble.fill', android: 'chat', web: 'chat' },
  },
  {
    key: 'my',
    label: '마이',
    icon: { ios: 'person', android: 'person_outline', web: 'person_outline' },
    activeIcon: { ios: 'person.fill', android: 'person', web: 'person' },
  },
] satisfies BottomNavigationItem[];

const TAB_PATHS: Record<TabKey, Href> = {
  home: '/',
  team: '/team',
  giuthub: '/giuthub',
  chat: '/chat',
  my: '/my',
};

export default function TabsLayout() {
  const pathname = usePathname();
  const { bottomOffset } = useBottomNavigationInset();

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
          paddingBottom: bottomOffset,
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
