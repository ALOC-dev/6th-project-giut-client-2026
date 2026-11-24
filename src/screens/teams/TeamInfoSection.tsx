import { ArrowRightIcon } from 'phosphor-react-native/src/icons/ArrowRight';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { color, radius, space } from '@/theme';
import { formatDday, formatMonthDay, formatShortDate, formatWeekday } from '@/utils/date';

import { isTeamClosed, type Team } from './team';

type TeamInfoSectionProps = {
  team: Team;
  contestTitle?: string;
};

export function TeamInfoSection({ team, contestTitle }: TeamInfoSectionProps) {
  const closed = isTeamClosed(team);
  // 기간이 남아도 정원이 차면 마감이라 D-day 대신 '마감'
  const dday = closed ? '마감' : formatDday(team.recruitEndDate);

  return (
    <View style={S.wrap}>
      <View style={S.titles}>
        {closed && (
          <View style={S.closedBadge}>
            <Text variant="meta" color="textMuted">
              모집이 마감된 팀이에요
            </Text>
          </View>
        )}
        {contestTitle && (
          <Text variant="caption" color="textMuted" numberOfLines={1}>
            {contestTitle}
          </Text>
        )}
        <Text variant="titleXl" style={S.center}>
          {team.name}
        </Text>
      </View>

      <View style={S.row}>
        <View
          style={S.column}
          accessible
          accessibilityLabel={`현재 인원 ${team.members.length}명, 정원 ${team.capacity}명`}
        >
          <Text variant="caption" color="textMuted">
            현재 인원
          </Text>
          <Text variant="titleLg" color={closed ? 'ink' : 'brand'}>
            {team.members.length}
            <Text variant="titleMd" color="textMuted">
              {` / ${team.capacity}명`}
            </Text>
          </Text>
        </View>

        <ArrowRightIcon size={24} color={closed ? color.textDisabled : color.brand} weight="bold" />

        <View
          style={S.column}
          accessible
          accessibilityLabel={`모집 마감 ${formatShortDate(team.recruitEndDate)}, ${dday}`}
        >
          <Text variant="caption" color="textMuted">
            모집 마감{' '}
            <Text variant="caption" color={closed ? 'textMuted' : 'brand'} style={S.dday}>
              {dday}
            </Text>
          </Text>
          <Text variant="titleLg">
            {formatMonthDay(team.recruitEndDate)}
            <Text variant="titleSm" color="textFaint" style={S.weekday}>
              {` (${formatWeekday(team.recruitEndDate)})`}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  wrap: {
    paddingHorizontal: space[5],
    paddingTop: space[6],
    paddingBottom: space[5],
    gap: space[6],
  },
  titles: {
    alignItems: 'center',
    gap: space[1],
  },
  closedBadge: {
    marginBottom: space[2],
    paddingVertical: space[1],
    paddingHorizontal: space[3],
    borderRadius: radius.full,
    backgroundColor: color.surfaceMuted,
  },
  center: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[6],
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: space[1],
  },
  weekday: {
    fontWeight: '400',
  },
  dday: {
    fontWeight: '800',
  },
});
