import type { BottomNavigationItem } from "@/components/ui";
import type { Href } from "expo-router";

export const TAB_ITEMS=[
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
    icon: { image: require('../../assets/images/giut-symbol.png') },
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

export type TabKey = 'home' | 'team' | 'giuthub' | 'chat' | 'my'

export const TAB_PATHS: Record<TabKey, Href>={
    home: '/',
    team: '/team',
    giuthub: '/giuthub',
    chat: '/chat',
    my: '/my',
};
