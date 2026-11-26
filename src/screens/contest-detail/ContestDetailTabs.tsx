import { CaretRightIcon } from 'phosphor-react-native';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { Press, Text } from '@/components/ui';
import { color, radius, shadow, space } from '@/theme';

type ContestDetailPanelProps = {
  title?: string; // 탭이 없을 때 카드 위 제목
  joinLeftTab?: boolean; // 첫 탭 선택 시 카드 왼쪽 위 모서리를 탭과 이어 붙임
  onLayout?: (e: LayoutChangeEvent) => void;
  children: React.ReactNode;
};

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
  onPressMore?: () => void; // 있으면 "전체보기 >" 표시
  onLayout?: (e: LayoutChangeEvent) => void;
  children: React.ReactNode;
};

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
    borderTopLeftRadius: 0,
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
