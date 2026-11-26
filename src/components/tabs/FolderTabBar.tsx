import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { Press, Text } from '@/components/ui';
import { color, radius, space } from '@/theme';

export type FolderTab<K extends string> = {
  key: K;
  label: string;
  count?: number;
};

type FolderTabBarProps<K extends string> = {
  tabs: readonly FolderTab<K>[];
  value: K;
  variant?: 'filled' | 'outlined'; // 회색 배경이면 filled, 흰 배경이면 outlined
  onChange: (key: K) => void;
  onLayout?: (e: LayoutChangeEvent) => void;
};

// 폴더 모양 탭 (스크롤하면 위에 고정). 공모전 상세, 마이페이지에서 써요
export function FolderTabBar<K extends string>({
  tabs,
  value,
  variant = 'filled',
  onChange,
  onLayout,
}: FolderTabBarProps<K>) {
  const outlined = variant === 'outlined';

  return (
    <View style={[S.tabBar, outlined && S.tabBarOutlined]} onLayout={onLayout}>
      <View style={S.tabRow} accessibilityRole="tablist">
        {tabs.map((tab) => {
          const on = tab.key === value;
          return (
            <Press
              key={tab.key}
              onPress={() => onChange(tab.key)}
              scaleOnPress={false}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              style={[S.tab, on ? S.tabOn : S.tabOff, on && outlined && S.tabOnOutlined]}
            >
              <Text variant="caption" color={on ? 'ink' : 'textMuted'} style={on && S.tabTextOn}>
                {tab.label}
                {tab.count !== undefined && (
                  <Text variant="caption" color={on ? 'brand' : 'textMuted'} style={S.count}>
                    {` ${tab.count}`}
                  </Text>
                )}
              </Text>
            </Press>
          );
        })}
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  tabBar: {
    paddingTop: space[5],
    paddingHorizontal: space[4],
    backgroundColor: color.surfaceSunken,
  },
  tabBarOutlined: {
    borderBottomWidth: 1,
    borderBottomColor: color.line,
    backgroundColor: color.surface,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: space[1],
  },
  tab: {
    paddingHorizontal: space[5],
    paddingVertical: space[3],
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderCurve: 'continuous',
  },
  tabOn: {
    backgroundColor: color.surface,
  },
  // 테두리 1만큼 여백을 줄여 filled와 크기가 같고, 아래 선을 1만큼 덮어서 내용과 이어져 보여요
  tabOnOutlined: {
    marginBottom: -1,
    paddingTop: space[3] - 1,
    paddingBottom: space[3] + 1,
    paddingHorizontal: space[5] - 1,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: color.line,
  },
  tabOff: {
    backgroundColor: color.lineSoft,
    paddingVertical: space[2] + 2,
  },
  tabTextOn: {
    fontWeight: '800',
  },
  count: {
    fontWeight: '800',
  },
});
