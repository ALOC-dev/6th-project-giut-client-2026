import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { AnimatedBookmarkIcon, EyeIcon, TeamIcon } from '@/components/icons';
import { Odometer, Press, Text } from '@/components/ui';
import { ddayLabel, formatDeadline, type Contest } from '@/screens/contests/contest';
import { color, radius, space, text, useMotion } from '@/theme';

const FIRST_SCREEN_ITEM_COUNT = 6;

export type ContestCardProps = {
  contest: Contest;
  saved: boolean;
  index?: number;
  onPress: (contest: Contest) => void;
  onToggleSave: (contest: Contest) => void;
};

type ScrapButtonProps = {
  saved: boolean;
  count: number;
  onPress: () => void;
};

function ScrapButton({ saved, count, onPress }: ScrapButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={saved ? '스크랩 해제' : '스크랩'}
      accessibilityState={{ selected: saved }}
      style={styles.scrapButton}
    >
      <AnimatedBookmarkIcon saved={saved} />
      <Odometer value={count} roll={false} />
    </Pressable>
  );
}

function ContestCardBase({ contest, saved, index = 0, onPress, onToggleSave }: ContestCardProps) {
  const { enter } = useMotion();
  const deadlineLabel = ddayLabel(contest.deadline);
  const hasTeams = contest.teamCount > 0;

  return (
    <Animated.View entering={index < FIRST_SCREEN_ITEM_COUNT ? enter.fadeUp(index) : undefined}>
      <Press onPress={() => onPress(contest)} style={styles.row}>
        <View style={styles.body}>
          <Text variant="caption" color="ink">
            {contest.org}
          </Text>

          <Text style={styles.title} numberOfLines={2}>
            {contest.title}
          </Text>

          <View style={styles.dateRow}>
            {deadlineLabel !== '' && (
              <Text variant="titleSm" color="brand">
                {deadlineLabel}
              </Text>
            )}
            <Text variant="caption" color="ink">
              {formatDeadline(contest.deadline)}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.teamWrap}>
              <TeamIcon color={hasTeams ? color.ink : color.textFaint} />
              <Text
                variant="caption"
                color={hasTeams ? 'ink' : 'textFaint'}
                style={styles.teamCount}
              >
                {contest.teamCount}팀
              </Text>
            </View>
            <View style={styles.viewsWrap}>
              <EyeIcon />
              <Odometer value={contest.views} />
            </View>
          </View>
        </View>

        <ScrapButton
          saved={saved}
          count={contest.scraps + (saved ? 1 : 0)}
          onPress={() => onToggleSave(contest)}
        />
      </Press>
    </Animated.View>
  );
}

export const ContestCard = memo(ContestCardBase);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: space[3],
    paddingVertical: space[4],
    paddingHorizontal: space[5],
  },
  body: { flex: 1, minWidth: 0, gap: 6 },
  title: {
    ...text.titleMd,
    fontFamily: 'Pretendard-Medium',
    color: color.ink,
  },
  dateRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: space[3], marginTop: 2 },
  teamWrap: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  teamCount: { fontFamily: 'Pretendard-Bold' },
  viewsWrap: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  scrapButton: {
    width: 44,
    minHeight: 56,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    marginRight: -space[2],
    borderRadius: radius.md,
  },
});
