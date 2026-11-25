import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { getRoleKey, type CodeName, type PortfolioItem } from '@/screens/mypage';
import { ROLE_LABEL } from '@/screens/teams';
import { color, radius, role, space } from '@/theme';
import { formatMonthPeriod } from '@/utils/date';

type PortfolioInfoSectionProps = {
  item: PortfolioItem;
};

// 제목, 진행 기간, 참여 형태, 담당 내역. 값이 없는 줄은 숨겨요
export function PortfolioInfoSection({ item }: PortfolioInfoSectionProps) {
  const period = formatMonthPeriod(item.projectStartDate, item.projectEndDate);

  return (
    <View style={S.wrap}>
      <Text variant="titleLg" accessibilityRole="header" style={S.title}>
        {item.title}
      </Text>

      {period !== '' && (
        <Row label="진행 기간">
          <Text>{period}</Text>
        </Row>
      )}
      {item.teamSize !== null && (
        <Row label="참여 형태">
          <Text>{item.teamSize === 1 ? '개인' : `${item.teamSize}인 팀`}</Text>
        </Row>
      )}
      {item.roles.length > 0 && (
        <Row label="담당 내역">
          {item.roles.map((itemRole) => (
            <RoleBadge key={itemRole.code} itemRole={itemRole} />
          ))}
        </Row>
      )}
    </View>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={S.row}>
      <Text color="textMuted">{label}</Text>
      <View style={S.value}>{children}</View>
    </View>
  );
}

// '개발 · 프론트엔드'
function RoleBadge({ itemRole }: { itemRole: CodeName }) {
  const key = getRoleKey(itemRole.code);

  return (
    <View style={[S.badge, key && { backgroundColor: role[key].tint }]}>
      <Text variant="meta" color={key ? role[key].text : 'textSecondary'}>
        {key ? `${ROLE_LABEL[key]} · ${itemRole.name}` : itemRole.name}
      </Text>
    </View>
  );
}

const S = StyleSheet.create({
  wrap: {
    paddingTop: space[5],
    paddingHorizontal: space[5],
  },
  title: {
    marginBottom: space[4],
  },
  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
    paddingVertical: space[2],
    borderTopWidth: 1,
    borderTopColor: color.lineSoft,
  },
  value: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: space[1.5],
  },
  badge: {
    paddingVertical: space[1],
    paddingHorizontal: space[2],
    borderRadius: radius.sm,
    backgroundColor: color.surfaceMuted,
  },
});
