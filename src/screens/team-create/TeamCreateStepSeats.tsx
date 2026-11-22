import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { AlertCircleIcon, MinusIcon, PlusIcon } from '@/components/icons';
import { Text } from '@/components/ui';
import { radius, space } from '@/theme';

import {
  CREATE_COLOR,
  MAX_RECRUIT,
  ROLE_COLOR,
  ROLE_OPTIONS,
  ROLE_TINT,
  type TeamRole,
} from './constants';
import { bakeKeyframes, playOnce, StepBody, TEAM_CREATE_EASING } from './TeamCreateParts';
import { TRAIN_COLOR, TrainIllustration } from './TrainIllustration';
import { recruitKey, type TeamDraftApi } from './useTeamDraft';

const NUMBER_OPACITY = bakeKeyframes([0, 100], [0, 1], TEAM_CREATE_EASING.easeOut);
const NUMBER_TRANSLATE_Y = bakeKeyframes([0, 60, 100], [8, -2, 0], TEAM_CREATE_EASING.easeOut);
const WARNING_TRANSLATE_X = bakeKeyframes(
  [0, 15, 30, 45, 60, 75, 100],
  [0, -6, 5, -4, 3, -1.5, 0],
  TEAM_CREATE_EASING.shake,
);

export function TeamCreateStepSeats({ api }: { api: TeamDraftApi }) {
  const { name, myRole, recruitRoles, recruit } = api.draft;
  const [pickedRole, setPickedRole] = useState<TeamRole | null>(null);
  const activeRole = pickedRole && recruitRoles.includes(pickedRole) ? pickedRole : recruitRoles[0];
  const full = api.total >= MAX_RECRUIT;
  const countForRole = (role: TeamRole) =>
    ROLE_OPTIONS[role].reduce(
      (sum, position) => sum + (recruit[recruitKey(role, position)] ?? 0),
      0,
    );

  return (
    <StepBody stickyHeaderIndices={[0]} contentStyle={styles.content}>
      <View style={styles.sticky}>
        <TrainCard title={`${name.trim() || '우리 팀'}행 열차`} count={api.total + 1}>
          {(width) => <TrainIllustration width={width} myRole={myRole} people={api.people} />}
        </TrainCard>

        <View style={styles.tabs} accessibilityRole="tablist">
          {[0, 1, 2, 3].map((index) => {
            const role = recruitRoles[index];
            if (!role) return <View key={index} style={styles.emptyTab} />;
            const selected = role === activeRole;
            const count = countForRole(role);
            return (
              <Pressable
                key={role}
                onPress={() => setPickedRole(role)}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                style={[
                  styles.tab,
                  {
                    borderColor: selected ? ROLE_COLOR[role] : CREATE_COLOR.line,
                    backgroundColor: selected ? ROLE_TINT[role] : CREATE_COLOR.surface,
                  },
                ]}
              >
                <View style={[styles.roleDot, { backgroundColor: ROLE_COLOR[role] }]} />
                <Text variant="caption" numberOfLines={1} style={styles.tabLabel}>
                  {role}
                </Text>
                <View
                  style={[
                    styles.countBadge,
                    { backgroundColor: count ? ROLE_COLOR[role] : CREATE_COLOR.lineSoft },
                  ]}
                >
                  <Text
                    variant="badge"
                    style={{ color: count ? CREATE_COLOR.surface : CREATE_COLOR.disabled }}
                  >
                    {count}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.list}>
        {full ? <FullWarning key={`warning-${api.warningKey}`} /> : null}
        {recruitRoles.length === 0 ? (
          <View style={styles.emptyMessage}>
            <Text variant="caption" color="textFaint">
              이전 단계에서 모집 직군을 골라주세요.
            </Text>
          </View>
        ) : null}

        <View style={styles.positionList}>
          {activeRole
            ? ROLE_OPTIONS[activeRole].map((position) => {
                const key = recruitKey(activeRole, position);
                const count = recruit[key] ?? 0;
                return (
                  <View
                    key={key}
                    style={[styles.positionRow, count > 0 && styles.positionRowSelected]}
                  >
                    <Text variant="bodyStrong" color="ink">
                      {position}
                    </Text>
                    <View
                      style={[styles.counter, count ? styles.counterSelected : styles.counterEmpty]}
                    >
                      <Pressable
                        onPress={() => api.setRecruitCount(key, -1)}
                        disabled={count === 0}
                        accessibilityRole="button"
                        accessibilityLabel={`${position} 한 명 빼기`}
                        style={styles.counterButton}
                      >
                        <MinusIcon
                          size={18}
                          color={count ? CREATE_COLOR.brand : CREATE_COLOR.disabled}
                        />
                      </Pressable>
                      <Text variant="bodyStrong" style={styles.counterValue}>
                        {count}
                      </Text>
                      <Pressable
                        onPress={() => api.setRecruitCount(key, 1)}
                        disabled={full}
                        accessibilityRole="button"
                        accessibilityLabel={`${position} 한 명 더하기`}
                        style={styles.counterButton}
                      >
                        <PlusIcon
                          size={18}
                          color={full ? CREATE_COLOR.disabled : CREATE_COLOR.brand}
                        />
                      </Pressable>
                    </View>
                  </View>
                );
              })
            : null}
        </View>
      </View>
    </StepBody>
  );
}

export function TrainCard({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: (width: number) => ReactNode;
}) {
  const [width, setWidth] = useState(344);
  return (
    <View
      style={styles.trainCard}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width - 2)}
    >
      <TrainCardGradient />
      <View style={styles.trainCardHeader}>
        <Text variant="meta">{title}</Text>
        <View style={styles.trainCountRow}>
          <PoppingNumber key={count} value={count} />
          <Text variant="titleLg">명이 함께해요</Text>
        </View>
      </View>
      <View style={styles.train}>{children(width)}</View>
    </View>
  );
}

export function TrainCardGradient({ cornerRadius = radius.card }: { cornerRadius?: number }) {
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <LinearGradient id="teamCreateCard" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={TRAIN_COLOR.cardGradientStart} />
          <Stop offset="1" stopColor={TRAIN_COLOR.cardGradientEnd} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" rx={cornerRadius} fill="url(#teamCreateCard)" />
    </Svg>
  );
}

function PoppingNumber({ value }: { value: number }) {
  const reduced = useReducedMotion();
  const [progress] = useState(() => new Animated.Value(reduced ? 1 : 0));

  useEffect(() => {
    if (reduced) return;
    const animation = playOnce(progress, 350);
    animation.start();
    return () => animation.stop();
  }, [progress, reduced]);

  return (
    <Animated.Text
      style={[
        styles.trainCount,
        {
          opacity: progress.interpolate(NUMBER_OPACITY),
          transform: [
            {
              translateY: progress.interpolate(NUMBER_TRANSLATE_Y),
            },
          ],
        },
      ]}
    >
      {value}
    </Animated.Text>
  );
}

function FullWarning() {
  const reduced = useReducedMotion();
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (reduced) return;
    const animation = playOnce(progress, 450);
    animation.start();
    return () => animation.stop();
  }, [progress, reduced]);

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      style={[
        styles.warning,
        {
          transform: [
            {
              translateX: progress.interpolate(WARNING_TRANSLATE_X),
            },
          ],
        },
      ]}
    >
      <AlertCircleIcon color={CREATE_COLOR.danger} />
      <Text variant="meta" style={{ color: CREATE_COLOR.danger }}>
        팀은 팀장 포함 최대 10명까지 꾸릴 수 있어요.
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 0 },
  sticky: {
    marginHorizontal: -space[5],
    paddingHorizontal: space[5],
    paddingTop: space[5],
    paddingBottom: space[3],
    backgroundColor: CREATE_COLOR.surface,
  },
  trainCard: {
    borderWidth: 1,
    borderColor: TRAIN_COLOR.cardBorder,
    borderRadius: radius.card,
    overflow: 'hidden',
  },
  trainCardHeader: { paddingHorizontal: space[4.5], paddingTop: space[4] },
  trainCountRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: space[0.5] },
  trainCount: { fontSize: 22, lineHeight: 28, fontWeight: '800', color: CREATE_COLOR.brand },
  train: { height: 150, marginBottom: space[1.5] },
  tabs: { flexDirection: 'row', gap: space[1.5], marginTop: space[4] },
  emptyTab: { flex: 1 },
  tab: {
    flex: 1,
    minWidth: 0,
    height: 38,
    paddingHorizontal: space[1.5],
    borderRadius: radius.lg,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[1],
  },
  roleDot: { width: 6, height: 6, borderRadius: radius.full },
  tabLabel: { flexShrink: 1, letterSpacing: -0.3 },
  countBadge: {
    minWidth: 16,
    height: 16,
    paddingHorizontal: space[1],
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { gap: space[3.5], paddingTop: space[0.5] },
  warning: { flexDirection: 'row', alignItems: 'center', gap: space[1.5], padding: space[0.5] },
  emptyMessage: {
    padding: space[4],
    borderRadius: radius.card,
    backgroundColor: CREATE_COLOR.surfaceMuted,
  },
  positionList: { gap: space[1.5] },
  positionRow: {
    height: 52,
    paddingLeft: space[4],
    paddingRight: space[2],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: CREATE_COLOR.line,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: CREATE_COLOR.surface,
  },
  positionRowSelected: {
    borderColor: CREATE_COLOR.brandBorder,
    backgroundColor: CREATE_COLOR.brandSoft,
  },
  counter: { height: 36, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center' },
  counterSelected: { backgroundColor: CREATE_COLOR.surface },
  counterEmpty: { backgroundColor: CREATE_COLOR.surfaceMuted },
  counterButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  counterValue: { minWidth: 22, textAlign: 'center' },
});
