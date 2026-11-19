import { memo, useEffect } from 'react';
import { Pressable, StyleSheet, View, type TextStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AnimatedBookmarkIcon, EyeIcon, TeamIcon } from '@/components/icons';
import { Press, Text } from '@/components/ui';
import { ddayLabel, formatDeadline, type Contest } from '@/screens/contests/contest';
import { color, radius, space, text, useMotion, type ColorToken, type TextVariant } from '@/theme';

const FIRST_SCREEN_ITEM_COUNT = 6;
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const ROLL_DIGITS = [...DIGITS, 0];

function Odometer({
  value,
  variant = 'meta',
  color: textColor = 'textFaint',
}: {
  value: number;
  variant?: TextVariant;
  color?: ColorToken;
}) {
  const { reduced } = useMotion();
  const characters = value.toLocaleString().split('');
  const lineHeight = (text[variant] as TextStyle).lineHeight ?? 16;

  return (
    <View style={styles.odometerRow} accessible accessibilityLabel={value.toLocaleString()}>
      {characters.map((character, index) => {
        const digit = Number(character);

        if (Number.isNaN(digit)) {
          return (
            <Text key={`character-${index}`} variant={variant} color={textColor}>
              {character}
            </Text>
          );
        }

        return (
          <DigitColumn
            key={`digit-${index}`}
            digit={digit}
            variant={variant}
            color={textColor}
            lineHeight={lineHeight}
            duration={500 + (characters.length - index) * 120}
            roll={!reduced}
          />
        );
      })}
    </View>
  );
}

function DigitColumn({
  digit,
  variant,
  color: textColor,
  lineHeight,
  duration,
  roll,
}: {
  digit: number;
  variant: TextVariant;
  color: ColorToken;
  lineHeight: number;
  duration: number;
  roll: boolean;
}) {
  const targetIndex = roll && digit === 0 ? DIGITS.length : digit;
  const translateY = useSharedValue(roll ? 0 : -targetIndex * lineHeight);
  const { easing } = useMotion();

  useEffect(() => {
    translateY.value = withTiming(-targetIndex * lineHeight, {
      duration: roll ? duration : 0,
      easing: easing.out,
    });
  }, [duration, easing.out, lineHeight, roll, targetIndex, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={{ height: lineHeight, overflow: 'hidden' }}>
      <Animated.View style={animatedStyle}>
        {ROLL_DIGITS.map((number, index) => (
          <Text
            key={`${number}-${index}`}
            variant={variant}
            color={textColor}
            style={{ height: lineHeight }}
          >
            {number}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}

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
      <Text variant="meta" color="textFaint">
        {count.toLocaleString()}
      </Text>
    </Pressable>
  );
}

function ContestCardBase({ contest, saved, index = 0, onPress, onToggleSave }: ContestCardProps) {
  const { enter } = useMotion();
  const deadlineLabel = ddayLabel(contest.deadline);
  const hasTeams = contest.teamCount > 0;

  return (
    <Animated.View entering={index < FIRST_SCREEN_ITEM_COUNT ? enter.fadeUp(index) : undefined}>
      <Press
        onPress={() => onPress(contest)}
        accessibilityRole="button"
        accessibilityHint="공모전 상세 화면으로 이동합니다"
        style={styles.row}
      >
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

function areContestCardPropsEqual(previous: ContestCardProps, next: ContestCardProps) {
  return (
    previous.contest === next.contest &&
    previous.saved === next.saved &&
    previous.onPress === next.onPress &&
    previous.onToggleSave === next.onToggleSave
  );
}

export const ContestCard = memo(ContestCardBase, areContestCardPropsEqual);

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
  odometerRow: { flexDirection: 'row', alignItems: 'center' },
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
