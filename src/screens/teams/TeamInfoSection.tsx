import { ArrowRightIcon } from 'phosphor-react-native/src/icons/ArrowRight';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { color, space } from '@/theme';
import { formatDday, formatShortDate } from '@/utils/date';

import type { Team } from './team';

type TeamInfoSectionProps = {
  team: Team;
  contestTitle?: string;
};

export function TeamInfoSection({ team, contestTitle }: TeamInfoSectionProps) {
  return (
    <View style={S.wrap}>
      <View style={S.titles}>
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
          <Text variant="titleMd" color="textMuted">
            <Text variant="titleLg" color="brand">
              {team.members.length}
            </Text>
            {` / ${team.capacity}명`}
          </Text>
        </View>

        <ArrowRightIcon
          size={24}
          color={color.brand}
          weight="bold"
          style={{ marginLeft: space[5] }}
        />

        <View
          style={S.column}
          accessible
          accessibilityLabel={`모집 마감 ${formatShortDate(team.recruitEndDate)}, ${formatDday(team.recruitEndDate)}`}
        >
          <Text variant="caption" color="textMuted">
            모집 마감{' '}
            <Text variant="caption" color="brand" style={S.dday}>
              {formatDday(team.recruitEndDate)}
            </Text>
          </Text>
          <Text variant="titleLg">{formatShortDate(team.recruitEndDate)}</Text>
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
  center: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  column: {
    alignItems: 'center',
    gap: space[1],
  },
  dday: {
    fontWeight: '800',
  },
});
