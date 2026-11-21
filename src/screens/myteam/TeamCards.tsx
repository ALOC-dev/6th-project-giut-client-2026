import { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, G, Path } from 'react-native-svg';

import {
  AnimatedFilterIcon,
  CheckIcon,
  ChevronIcon,
  EnvelopeIcon,
  PersonSilhouetteIcon,
} from '@/components/icons';
import { Button, Press, Text } from '@/components/ui';
import { color, role, useMotion } from '@/theme';

import { EMPTY_APPLICANT_RING_SIZE, styles } from './TeamCards.styles';
import type { Applicant, Member, Team, TeamFilter } from './types';

const RING_RADIUS = 23;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const TWINKLE_INPUT = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];
const RING_OPACITY_INPUT = [0, 0.0025, 0.005, 0.0075, 0.01, 0.2575, 0.505, 0.7525, 1];

const TEAM_TONE = {
  leader: { ring: color.brand, text: color.brandStrong, dot: color.brand },
  member: { ring: color.rolePlan, text: color.rolePlanText, dot: color.rolePlan },
  pending: { ring: color.pending, text: color.roleMktText, dot: color.pending },
  ended: { ring: color.textDisabled, text: color.textMuted, dot: color.textDisabled },
} as const;

const FIELD_TONE: Record<string, { base: string; tint: string; text: string }> = {
  개발: role.dev,
  디자인: role.design,
  기획: role.plan,
  마케팅: role.mkt,
};

const FILTER_OPTIONS: { id: TeamFilter; label: string; short: string }[] = [
  { id: 'all', label: '전체', short: '전체' },
  { id: 'leader', label: '내가 팀장인 팀', short: '팀장' },
  { id: 'member', label: '내가 팀원인 팀', short: '팀원' },
  { id: 'pending', label: '지원 중인 팀', short: '지원 중' },
];

export function TeamFilterMenu({
  value,
  onChange,
}: {
  value: TeamFilter;
  onChange: (filter: TeamFilter) => void;
}) {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const current = FILTER_OPTIONS.find((option) => option.id === value) ?? FILTER_OPTIONS[0];

  const toggle = () => {
    setAnimationKey((key) => key + 1);
    setOpen((visible) => !visible);
  };

  return (
    <>
      <Press
        onPress={toggle}
        accessibilityRole="button"
        accessibilityLabel={`팀 필터, 현재 ${current.label}`}
        accessibilityState={{ expanded: open }}
        style={styles.filterButton}
      >
        {value !== 'all' ? (
          <>
            <TeamStatusDot kind={value} outlined={value === 'pending'} />
            <Text variant="caption">{current.short}</Text>
          </>
        ) : null}
        <AnimatedFilterIcon size={22} animationKey={animationKey} />
      </Press>

      <Modal
        visible={open}
        transparent
        animationType={reducedMotion ? 'none' : 'fade'}
        onRequestClose={() => setOpen(false)}
      >
        <Press
          scaleOnPress={false}
          style={StyleSheet.absoluteFill}
          accessibilityLabel="팀 필터 닫기"
          onPress={() => setOpen(false)}
        />
        <View style={[styles.filterMenu, { top: insets.top + 52 }]}>
          {FILTER_OPTIONS.map((option) => {
            const selected = option.id === value;
            return (
              <Press
                key={option.id}
                scaleOnPress={false}
                accessibilityRole="menuitem"
                accessibilityState={{ selected }}
                onPress={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                style={[styles.filterItem, selected && styles.filterItemSelected]}
              >
                {option.id === 'all' ? (
                  <View style={[styles.statusDot, styles.allFilterDot]} />
                ) : (
                  <TeamStatusDot kind={option.id} outlined={option.id === 'pending'} />
                )}
                <Text variant={selected ? 'bodyStrong' : 'body'} style={styles.filterLabel}>
                  {option.label}
                </Text>
                <View style={styles.checkSlot}>
                  {selected ? <CheckIcon size={16} color={color.brand} /> : null}
                </View>
              </Press>
            );
          })}
        </View>
      </Modal>
    </>
  );
}

export function TeamRingCard({
  team,
  selected,
  onPress,
}: {
  team: Team;
  selected: boolean;
  onPress: () => void;
}) {
  const tone = TEAM_TONE[team.kind];
  const filled = team.filled.length;
  const offset = RING_CIRCUMFERENCE * (1 - filled / team.total);

  return (
    <Press
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${team.name}, ${team.role}${team.newCount ? `, 새 지원 ${team.newCount}건` : ''}`}
      style={[styles.teamCard, selected && { borderColor: tone.ring }]}
    >
      <View style={styles.ringBox}>
        <Svg width={56} height={56} viewBox="0 0 56 56">
          <Circle
            cx={28}
            cy={28}
            r={RING_RADIUS}
            fill="none"
            stroke={color.lineSoft}
            strokeWidth={6}
          />
          <G transform="translate(56 0) scale(-1 1) rotate(-90 28 28)">
            <Circle
              cx={28}
              cy={28}
              r={RING_RADIUS}
              fill="none"
              stroke={tone.ring}
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE.toFixed(1)}
              strokeDashoffset={offset.toFixed(1)}
            />
          </G>
        </Svg>
        <View style={styles.ringLabel}>
          <Text variant="label">{filled}</Text>
          <Text variant="badge" color="textMuted">
            /{team.total}
          </Text>
        </View>
      </View>

      <View style={styles.teamCopy}>
        <View style={styles.statusRow}>
          <TeamStatusDot kind={team.kind} outlined={team.kind === 'pending'} />
          <Text variant="meta" style={{ color: tone.text }}>
            {team.role}
          </Text>
        </View>
        <Text variant="titleSm" numberOfLines={1}>
          {team.name}
        </Text>
        <Text variant="meta" color="textSecondary" numberOfLines={1}>
          {team.contest}
        </Text>
      </View>

      {team.newCount ? <UnreadMail key={team.newCount} count={team.newCount} /> : null}
    </Press>
  );
}

function UnreadMail({ count }: { count: number }) {
  const reduced = useReducedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reduced) {
      progress.value = 0;
      return;
    }

    progress.value = withDelay(
      400,
      withRepeat(withTiming(1, { duration: 1600, easing: Easing.linear }), 3, false),
    );
    return () => cancelAnimation(progress);
  }, [progress, reduced]);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      TWINKLE_INPUT,
      [1, 0.929, 0.725, 0.521, 0.45, 0.521, 0.725, 0.929, 1],
    ),
    transform: [
      {
        scale: interpolate(
          progress.value,
          TWINKLE_INPUT,
          [1, 0.974, 0.9, 0.826, 0.8, 0.826, 0.9, 0.974, 1],
        ),
      },
    ],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      RING_OPACITY_INPUT,
      [0, 0.303, 0.548, 0.725, 0.8, 0.498, 0.252, 0.075, 0],
    ),
    transform: [
      {
        scale: interpolate(progress.value, [0, 0.25, 0.5, 0.75, 1], [1, 1.605, 2.095, 2.451, 2.6]),
      },
    ],
  }));

  return (
    <View style={styles.mailWrap} accessibilityLabel={`새 지원 ${count}건`}>
      <View>
        <EnvelopeIcon />
        <Animated.View pointerEvents="none" style={[styles.alertDot, dotStyle]} />
        <Animated.View pointerEvents="none" style={[styles.alertRing, ringStyle]} />
      </View>
      <Text variant="caption" style={styles.mailCount}>
        {count}
      </Text>
    </View>
  );
}

function TeamStatusDot({ kind, outlined = false }: { kind: Team['kind']; outlined?: boolean }) {
  const tone = TEAM_TONE[kind];
  return (
    <View
      style={[
        styles.statusDot,
        outlined
          ? { borderWidth: 1.5, borderColor: tone.ring, backgroundColor: color.surface }
          : { backgroundColor: tone.dot },
      ]}
    />
  );
}

export function ApplicantCards({
  applicants,
  onOpen,
}: {
  applicants: Applicant[];
  onOpen: (index: number) => void;
}) {
  return (
    <View style={styles.detailSection}>
      <Text variant="titleMd">새로 들어온 지원</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={158}
        decelerationRate="fast"
        style={styles.edgeScroll}
        contentContainerStyle={styles.applicantList}
      >
        {applicants.map((applicant, index) => {
          const tone = FIELD_TONE[applicant.field] ?? role.dev;
          return (
            <Press
              key={applicant.id}
              onPress={() => onOpen(index)}
              accessibilityRole="button"
              accessibilityLabel={`${applicant.name}, ${applicant.position}, 지원서 보기`}
              style={styles.applicantCard}
            >
              <View style={[styles.applicantBand, { backgroundColor: tone.tint }]}>
                <View style={styles.applicantAvatar}>
                  <PersonSilhouetteIcon color={tone.base} style={styles.applicantPersonIcon} />
                </View>
              </View>
              {index === 0 ? (
                <View style={styles.newBadge}>
                  <Text variant="micro" style={{ color: color.surface }}>
                    NEW
                  </Text>
                </View>
              ) : null}
              <View style={styles.applicantCopy}>
                <Text variant="label">{applicant.name}</Text>
                <Text variant="meta" style={{ color: tone.text }} numberOfLines={1}>
                  {applicant.position}
                </Text>
                <Text variant="meta" color="textFaint" style={styles.appliedAt}>
                  {applicant.appliedAt} 지원
                </Text>
              </View>
            </Press>
          );
        })}
      </ScrollView>
    </View>
  );
}

export function NoApplicants() {
  const reducedMotion = useReducedMotion();
  const { enter } = useMotion();
  const ringRotation = useSharedValue(0);
  const envelopeNudge = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) {
      ringRotation.value = 0;
      envelopeNudge.value = 0;
      return;
    }

    ringRotation.value = withRepeat(
      withTiming(1, { duration: 18000, easing: Easing.linear }),
      -1,
      false,
    );
    envelopeNudge.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withDelay(2560, withTiming(0.86, { duration: 192, easing: Easing.inOut(Easing.quad) })),
          withTiming(0.92, { duration: 192, easing: Easing.inOut(Easing.quad) }),
          withTiming(1, { duration: 256, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        false,
      ),
    );

    return () => {
      cancelAnimation(ringRotation);
      cancelAnimation(envelopeNudge);
    };
  }, [envelopeNudge, reducedMotion, ringRotation]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ringRotation.value * 360}deg` }],
  }));
  const envelopeStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(envelopeNudge.value, [0, 0.8, 0.86, 0.92, 1], [0, 0, -3, 0, 0]),
      },
      {
        rotate: `${interpolate(envelopeNudge.value, [0, 0.8, 0.86, 0.92, 1], [0, 0, -6, 4, 0])}deg`,
      },
    ],
  }));

  return (
    <View style={styles.detailSection}>
      <Text variant="titleMd">새로 들어온 지원</Text>
      <Animated.View
        entering={enter.selectionFadeUp()}
        style={styles.noApplicantsCard}
        accessibilityLabel="아직 들어온 지원이 없어요"
      >
        <View style={styles.waitingEnvelopeBox}>
          <Animated.View style={[StyleSheet.absoluteFill, ringStyle]}>
            <Svg
              width={EMPTY_APPLICANT_RING_SIZE}
              height={EMPTY_APPLICANT_RING_SIZE}
              viewBox={`0 0 ${EMPTY_APPLICANT_RING_SIZE} ${EMPTY_APPLICANT_RING_SIZE}`}
            >
              <Circle
                cx={EMPTY_APPLICANT_RING_SIZE / 2}
                cy={EMPTY_APPLICANT_RING_SIZE / 2}
                r={EMPTY_APPLICANT_RING_SIZE / 2 - 0.75}
                fill="none"
                stroke={color.line}
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
            </Svg>
          </Animated.View>
          <View style={styles.waitingEnvelopeBadge}>
            <Animated.View style={envelopeStyle}>
              <EnvelopeIcon width={26} height={20} color={color.brand} strokeWidth={1.5} />
            </Animated.View>
          </View>
        </View>
        <Text variant="titleSm" style={styles.noApplicantsMessage}>
          아직 들어온 지원이 없어요
        </Text>
      </Animated.View>
    </View>
  );
}

export function MemberStrip({
  members,
  onOpenTeam,
}: {
  members: Member[];
  onOpenTeam?: () => void;
}) {
  return (
    <View style={styles.detailSection}>
      <View style={styles.sectionHead}>
        <Text variant="titleMd">함께하는 팀원</Text>
        {onOpenTeam ? (
          <Press onPress={onOpenTeam} accessibilityRole="button" style={styles.teamLink}>
            <Text variant="caption">팀 상세</Text>
            <ChevronIcon dir="right" size={15} />
          </Press>
        ) : null}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.edgeScroll}
        contentContainerStyle={styles.memberList}
      >
        {members.map((member) => {
          const tone = FIELD_TONE[member.field] ?? role.dev;
          return (
            <View key={`${member.name}-${member.role}`} style={styles.memberItem}>
              {member.isLeader ? (
                <View style={styles.leaderBadge}>
                  <Text variant="micro" style={{ color: color.surface }}>
                    팀장
                  </Text>
                </View>
              ) : null}
              <View style={[styles.memberAvatar, { backgroundColor: tone.tint }]}>
                <PersonSilhouetteIcon color={tone.base} style={styles.memberPersonIcon} />
              </View>
              <Text variant="caption" numberOfLines={1}>
                {member.name}
              </Text>
              <Text variant="badge" style={{ color: tone.text }} numberOfLines={1}>
                {member.role}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

export function MyTeamEmpty({ onBrowse }: { onBrowse: () => void }) {
  const reducedMotion = useReducedMotion();
  const { enter } = useMotion();
  const ringRotation = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) {
      ringRotation.value = 0;
      return;
    }

    ringRotation.value = withRepeat(
      withTiming(1, { duration: 18000, easing: Easing.linear }),
      -1,
      false,
    );

    return () => cancelAnimation(ringRotation);
  }, [reducedMotion, ringRotation]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ringRotation.value * 360}deg` }],
  }));

  return (
    <Animated.View style={styles.emptyWrap} entering={enter.selectionFadeUp()}>
      <View style={styles.emptyVisual}>
        <Animated.View style={[StyleSheet.absoluteFill, ringStyle]}>
          <Svg width={120} height={120} viewBox="0 0 120 120">
            <Circle
              cx={60}
              cy={60}
              r={50}
              fill="none"
              stroke={color.line}
              strokeWidth={8}
              strokeDasharray="10 9"
              strokeLinecap="round"
            />
          </Svg>
        </Animated.View>

        <View style={styles.emptyPerson}>
          <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <Circle
              cx={8}
              cy={8}
              r={6.75}
              stroke={color.textDisabled}
              strokeWidth={2.5}
              strokeDasharray="4 3"
            />
          </Svg>
          <Svg width={28} height={14} viewBox="0 0 28 14" fill="none" style={styles.emptyBody}>
            <Path
              d="M1.25 14 A 12.75 12.75 0 0 1 26.75 14"
              stroke={color.textDisabled}
              strokeWidth={2.5}
              strokeDasharray="4 3"
            />
          </Svg>
        </View>
      </View>
      <Text variant="titleLg">아직 함께하는 팀이 없어요</Text>
      <Text variant="body" color="textSecondary" style={styles.emptyDescription}>
        {'마음에 드는 공모전 팀에 지원하거나\n직접 팀을 만들어 보세요'}
      </Text>
      <Button label="공모전 둘러보기" full={false} onPress={onBrowse} style={styles.browseButton} />
    </Animated.View>
  );
}
