import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { LinkIcon } from '@/components/icons';
import { Text } from '@/components/ui';
import { radius, space } from '@/theme';

import { CREATE_COLOR, ROLE_COLOR, ROLE_TINT, ROLE_OPTIONS, TEAM_ROLES } from './constants';
import {
  FigureBox,
  PersonFigure,
  pingPong,
  SectionDivider,
  StepBody,
  TEAM_CREATE_EASING,
} from './TeamCreateParts';
import { TrainCardGradient } from './TeamCreateStepSeats';
import { TrainIllustration } from './TrainIllustration';
import { recruitKey, type TeamDraftApi } from './useTeamDraft';

type Props = {
  api: TeamDraftApi;
  shareUrl?: string;
  onCopyLink?: (url: string) => void | Promise<void>;
};

export function TeamCreateStepDone({ api, shareUrl = 'giut.app/team/preview', onCopyLink }: Props) {
  const reduced = useReducedMotion();
  const [progress] = useState(() => new Animated.Value(reduced ? 1 : 0));
  const [trainWidth, setTrainWidth] = useState(344);

  useEffect(() => {
    if (reduced) return;
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 600,
      easing: TEAM_CREATE_EASING.out,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, reduced]);

  const openRoles = useMemo(
    () =>
      TEAM_ROLES.flatMap((role) => {
        const positions = ROLE_OPTIONS[role]
          .map(
            (position) => [position, api.draft.recruit[recruitKey(role, position)] ?? 0] as const,
          )
          .filter(([, count]) => count > 0);
        if (!positions.length) return [];
        return [
          {
            role,
            count: positions.reduce((sum, [, count]) => sum + count, 0),
            detail: positions.map(([position, count]) => `${position} ${count}`).join(' · '),
          },
        ];
      }),
    [api.draft.recruit],
  );

  return (
    <StepBody contentStyle={styles.content}>
      <Animated.View
        style={{
          opacity: progress,
          transform: [
            { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) },
            { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1] }) },
          ],
        }}
      >
        <View
          style={styles.trainCard}
          onLayout={(event) => setTrainWidth(event.nativeEvent.layout.width - 2)}
        >
          <TrainCardGradient cornerRadius={radius.xl} />
          <View style={styles.train}>
            <TrainIllustration width={trainWidth} myRole={api.draft.myRole} people={api.people} />
          </View>
          <Confetti />
        </View>

        <Text variant="titleXl" style={styles.headline}>
          <Text variant="titleXl" color="brand">
            {api.draft.name || '이름 없는 팀'}
          </Text>{' '}
          팀 열차가 출발했어요!
        </Text>
        <Text variant="body" color="textSecondary" style={styles.description}>
          이제 {api.total}명의 팀원을 기다려요. 지원서가 오면 바로 알려드릴게요.
        </Text>

        <View style={styles.roleList}>
          {openRoles.map(({ role, count, detail }) => (
            <View key={role} style={styles.roleRow}>
              <FigureBox style={[styles.figure, { backgroundColor: ROLE_TINT[role] }]}>
                <PersonFigure
                  head={10}
                  bodyWidth={18}
                  bodyHeight={9}
                  gap={1}
                  fill={ROLE_COLOR[role]}
                />
              </FigureBox>
              <View style={styles.roleCopy}>
                <Text variant="label">{role}</Text>
                <Text variant="caption" color="textSecondary" numberOfLines={1}>
                  {detail}
                </Text>
              </View>
              <View style={styles.recruiting}>
                <PulseDot fill={ROLE_COLOR[role]} />
                <Text variant="caption" style={{ color: ROLE_COLOR[role] }}>
                  {count}명 모집 중
                </Text>
              </View>
            </View>
          ))}
        </View>

        <SectionDivider style={styles.divider} />

        <View style={styles.linkHeader}>
          <View style={styles.linkIcon}>
            <LinkIcon />
          </View>
          <View style={styles.linkCopy}>
            <Text variant="label">팀 링크</Text>
            <Text variant="caption" color="textSecondary">
              링크를 공유하면 팀원을 더 빨리 모을 수 있어요.
            </Text>
          </View>
        </View>
        <CopyRow url={shareUrl} onCopy={onCopyLink} />
      </Animated.View>
    </StepBody>
  );
}

function CopyRow({ url, onCopy }: { url: string; onCopy?: Props['onCopyLink'] }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const handleCopy = async () => {
    await onCopy?.(url);
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <View style={styles.copyRow}>
      <Text variant="caption" numberOfLines={1} style={styles.url}>
        {url}
      </Text>
      <Pressable
        onPress={handleCopy}
        accessibilityRole="button"
        accessibilityLabel={copied ? '팀 링크 복사됨' : '팀 링크 복사'}
        style={({ pressed }) => [
          styles.copyButton,
          copied && styles.copyButtonDone,
          pressed && styles.pressed,
        ]}
      >
        <Text variant="label" color={copied ? CREATE_COLOR.success : 'surface'}>
          {copied ? '복사됨 ✓' : '링크 복사'}
        </Text>
      </Pressable>
    </View>
  );
}

function PulseDot({ fill }: { fill: string }) {
  const reduced = useReducedMotion();
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (reduced) return;
    const animation = pingPong(progress, 700);
    animation.start();
    return () => animation.stop();
  }, [progress, reduced]);

  return (
    <Animated.View
      style={{
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: fill,
        opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0.35] }),
        transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0.7] }) }],
      }}
    />
  );
}

const CONFETTI_COLORS = [CREATE_COLOR.brand, ROLE_COLOR.디자인, ROLE_COLOR.기획, ROLE_COLOR.마케팅];

function Confetti() {
  const reduced = useReducedMotion();
  const [pieces] = useState(() => Array.from({ length: 22 }, () => new Animated.Value(0)));

  useEffect(() => {
    if (reduced) return;
    const animation = Animated.parallel(
      pieces.map((piece, index) =>
        Animated.timing(piece, {
          toValue: 1,
          duration: 1600 + (index % 5) * 250,
          delay: (index % 7) * 80,
          easing: TEAM_CREATE_EASING.fall,
          useNativeDriver: true,
        }),
      ),
    );
    animation.start();
    return () => animation.stop();
  }, [pieces, reduced]);

  if (reduced) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((piece, index) => {
        const dot = index % 3 === 0;
        return (
          <Animated.View
            key={index}
            style={{
              position: 'absolute',
              left: `${(index * 37) % 100}%`,
              top: -12,
              width: dot ? 8 : 6,
              height: dot ? 8 : 10,
              borderRadius: dot ? 4 : 2,
              backgroundColor: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
              opacity: piece.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
              transform: [
                { translateY: piece.interpolate({ inputRange: [0, 1], outputRange: [0, 210] }) },
                {
                  rotate: piece.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '540deg'],
                  }),
                },
              ],
            }}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: space[6] },
  trainCard: {
    height: 190,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: CREATE_COLOR.lineSoft,
  },
  train: { position: 'absolute', left: 0, right: 0, top: 30, height: 150 },
  headline: { marginTop: space[6] },
  description: { marginTop: space[2], lineHeight: 22 },
  roleList: { marginTop: space[5], gap: space[2] },
  roleRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  figure: { width: 32, height: 32, borderRadius: radius.md },
  roleCopy: { flex: 1, minWidth: 0, gap: space[0.5] },
  recruiting: { flexDirection: 'row', alignItems: 'center', gap: space[1.5] },
  divider: { marginTop: space[5], marginBottom: 0 },
  linkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    marginTop: space[5],
  },
  linkIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CREATE_COLOR.brandSoft,
  },
  linkCopy: { flex: 1, minWidth: 0, gap: space[0.5] },
  copyRow: {
    minHeight: 50,
    marginTop: space[3],
    paddingLeft: space[3],
    paddingRight: space[1.5],
    paddingVertical: space[1.5],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    borderWidth: 1,
    borderColor: CREATE_COLOR.line,
    borderRadius: radius.lg,
  },
  url: { flex: 1, minWidth: 0 },
  copyButton: {
    minHeight: 40,
    paddingHorizontal: space[3],
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CREATE_COLOR.brand,
  },
  copyButtonDone: { backgroundColor: CREATE_COLOR.successTint },
  pressed: { opacity: 0.8 },
});
