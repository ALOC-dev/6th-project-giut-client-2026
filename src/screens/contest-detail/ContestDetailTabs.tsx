import { CaretRightIcon } from 'phosphor-react-native/src/icons/CaretRight';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { Press, Text } from '@/components/ui';
import { color, radius, shadow, space } from '@/theme';

export type ContestDetailTab<K extends string> = {
  key: K;
  label: string;
  count?: number;
};

type ContestDetailTabBarProps<K extends string> = {
  tabs: ContestDetailTab<K>[];
  value: K;
  onChange: (key: K) => void;
  onLayout?: (e: LayoutChangeEvent) => void;
};

// 폴더 모양 탭. 스크롤하면 화면 위에 붙어 있어요(sticky).
export function ContestDetailTabBar<K extends string>({
  tabs,
  value,
  onChange,
  onLayout,
}: ContestDetailTabBarProps<K>) {
  return (
    <View style={S.tabBar} onLayout={onLayout}>
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
              style={[S.tab, on ? S.tabOn : S.tabOff]}
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

type ContestDetailPanelProps = {
  title?: string; // 탭이 없을 때(개인 참가) 카드 위 제목
  joinLeftTab?: boolean; // 첫 번째 탭이 선택돼서 카드 왼쪽 위 모서리를 탭과 이어 붙일 때
  onLayout?: (e: LayoutChangeEvent) => void;
  children: React.ReactNode;
};

// 흰 카드. 탭 아래에서 상세 내용과 모집 중인 팀을 함께 담아요.
export function ContestDetailPanel({
  title,
  joinLeftTab = false,
  onLayout,
  children,
}: ContestDetailPanelProps) {
  return (
    <View style={[S.panelWrap, title !== undefined && S.panelWrapTitled]} onLayout={onLayout}>
      {title !== undefined && (
        <Text variant="titleMd" style={S.panelTitle}>
          {title}
        </Text>
      )}
      <View style={[S.panel, joinLeftTab && S.panelJoined]}>{children}</View>
    </View>
  );
}

type ContestDetailSectionProps = {
  title?: string;
  count?: number;
  onPressMore?: () => void; // 있으면 제목 오른쪽에 "전체보기 >"를 보여줘요
  onLayout?: (e: LayoutChangeEvent) => void;
  children: React.ReactNode;
};

// 카드 안의 한 구역. 제목이 있으면 위에 구분선과 제목을 보여줘요.
export function ContestDetailSection({
  title,
  count,
  onPressMore,
  onLayout,
  children,
}: ContestDetailSectionProps) {
  return (
    <View onLayout={onLayout} style={title !== undefined && S.section}>
      {title !== undefined && (
        <View style={S.sectionHeader}>
          <Text variant="titleSm">
            {title}
            {count !== undefined && (
              <Text variant="titleSm" color="brand">
                {` ${count}`}
              </Text>
            )}
          </Text>
          {onPressMore && (
            <Press
              onPress={onPressMore}
              accessibilityRole="button"
              accessibilityLabel={`${title} 전체보기`}
              touchSize={20}
              style={S.more}
            >
              <Text variant="caption" color="textMuted">
                전체보기
              </Text>
              <CaretRightIcon size={14} color={color.textMuted} />
            </Press>
          )}
        </View>
      )}
      {children}
    </View>
  );
}

const S = StyleSheet.create({
  tabBar: {
    paddingTop: space[5],
    paddingHorizontal: space[4],
    backgroundColor: color.surfaceSunken, // 위에 붙었을 때 아래 내용이 비치지 않도록
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
  tabOff: {
    backgroundColor: color.lineSoft,
    paddingVertical: space[2] + 2, // 선택 안 된 탭은 조금 낮게
  },
  tabTextOn: {
    fontWeight: '800',
  },
  count: {
    fontWeight: '800',
  },

  panelWrap: {
    marginHorizontal: space[4],
  },
  panelWrapTitled: {
    marginTop: space[5],
  },
  panelTitle: {
    marginBottom: space[3],
    marginLeft: space[1],
  },
  panel: {
    minHeight: 160,
    borderRadius: radius['2xl'],
    borderCurve: 'continuous',
    backgroundColor: color.surface,
    ...shadow.card,
  },
  panelJoined: {
    borderTopLeftRadius: 0, // 첫 번째 탭과 카드가 매끄럽게 이어지도록
  },

  section: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.line,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[5],
    paddingTop: space[5],
  },
  more: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
