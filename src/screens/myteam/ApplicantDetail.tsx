import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Animated as RNAnimated,
  Easing as RNEasing,
  Modal,
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewInstance,
} from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChevronIcon } from '@/components/icons';
import { ApplicationCard } from '@/components/application';
import { Button, Press, Text } from '@/components/ui';
import { color, space, useMotion } from '@/theme';

import type { Applicant, ApplicantDecision } from './types';

export function ApplicantDetail({
  visible,
  applicants,
  index,
  decisions,
  onIndexChange,
  onClose,
  onDecide,
  onUndo,
}: {
  visible: boolean;
  applicants: Applicant[];
  index: number;
  decisions: Record<string, ApplicantDecision>;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  onDecide: (applicant: Applicant, decision: ApplicantDecision) => void;
  onUndo: (applicant: Applicant) => void;
}) {
  const insets = useSafeAreaInsets();
  const { reduced } = useMotion();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const shownIndexRef = useRef(index);
  const pendingEntryRef = useRef<{ direction: number; distance: number } | null>(null);
  const entryAnimationRef = useRef<RNAnimated.CompositeAnimation | null>(null);
  const [shownIndex, setShownIndex] = useState(index);
  const [translateX] = useState(() => new RNAnimated.Value(0));
  const [opacity] = useState(() => new RNAnimated.Value(1));
  const applicant = applicants[shownIndex];

  useLayoutEffect(() => {
    const entry = pendingEntryRef.current;
    if (!entry) return;

    pendingEntryRef.current = null;
    entryAnimationRef.current = RNAnimated.parallel([
      RNAnimated.timing(translateX, {
        toValue: 0,
        duration: 260,
        easing: RNEasing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }),
      RNAnimated.timing(opacity, {
        toValue: 1,
        duration: 260,
        easing: RNEasing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }),
    ]);
    entryAnimationRef.current.start();

    return () => entryAnimationRef.current?.stop();
  }, [opacity, shownIndex, translateX]);

  useEffect(() => {
    if (index === shownIndexRef.current) return;

    const direction = index > shownIndexRef.current ? 1 : -1;
    const distance = reduced ? 0 : 24;
    entryAnimationRef.current?.stop();
    const exitAnimation = RNAnimated.parallel([
      RNAnimated.timing(translateX, {
        toValue: -distance * direction,
        duration: 140,
        easing: RNEasing.bezier(0.55, 0, 0.8, 0.4),
        useNativeDriver: true,
      }),
      RNAnimated.timing(opacity, {
        toValue: 0,
        duration: 140,
        easing: RNEasing.bezier(0.55, 0, 0.8, 0.4),
        useNativeDriver: true,
      }),
    ]);

    exitAnimation.start(({ finished }) => {
      if (!finished) return;
      pendingEntryRef.current = { direction, distance };
      translateX.setValue(distance * direction);
      opacity.setValue(0);
      shownIndexRef.current = index;
      setShownIndex(index);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    });

    return () => {
      exitAnimation.stop();
    };
  }, [index, opacity, reduced, translateX]);

  if (!applicant) return null;

  const decision = decisions[applicant.id];

  return (
    <Modal visible={visible} animationType={reduced ? 'none' : 'slide'} onRequestClose={onClose}>
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Press
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="지원자 상세 닫기"
            style={styles.iconButton}
          >
            <ChevronIcon dir="left" size={22} />
          </Press>
          <Text variant="titleMd" style={styles.headerTitle}>
            지원자 상세
          </Text>
          <View style={styles.pager}>
            <Press
              disabled={index === 0}
              onPress={() => onIndexChange(index - 1)}
              accessibilityRole="button"
              accessibilityLabel="이전 지원자"
              style={[styles.pagerButton, index === 0 && styles.disabled]}
            >
              <ChevronIcon dir="left" size={18} />
            </Press>
            <RollingCount value={index + 1} total={applicants.length} />
            <Press
              disabled={index === applicants.length - 1}
              onPress={() => onIndexChange(index + 1)}
              accessibilityRole="button"
              accessibilityLabel="다음 지원자"
              style={[styles.pagerButton, index === applicants.length - 1 && styles.disabled]}
            >
              <ChevronIcon dir="right" size={18} />
            </Press>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <RNAnimated.View style={{ opacity, transform: [{ translateX }] }}>
            <ApplicationCard
              key={applicant.id}
              application={applicant}
              appliedAt={applicant.appliedAt}
            />
          </RNAnimated.View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space[3]) }]}>
          {decision ? (
            <View style={styles.decisionRow} accessibilityLiveRegion="polite">
              <Text
                variant="bodyStrong"
                style={{
                  color: decision === 'accepted' ? color.rolePlanText : color.textSecondary,
                }}
              >
                {decision === 'accepted'
                  ? `${applicant.name}님을 팀원으로 수락했어요`
                  : `${applicant.name}님의 지원을 거절했어요`}
              </Text>
              <Button
                label="되돌리기"
                variant="link"
                full={false}
                onPress={() => onUndo(applicant)}
              />
            </View>
          ) : (
            <View style={styles.actionRow}>
              <Button
                label="거절하기"
                variant="secondary"
                onPress={() => onDecide(applicant, 'rejected')}
                style={styles.rejectButton}
              />
              <Button
                label="팀원으로 수락하기"
                onPress={() => onDecide(applicant, 'accepted')}
                style={styles.acceptButton}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

function RollingCount({ value, total }: { value: number; total: number }) {
  const { reduced, easing } = useMotion();
  const previous = useRef(value);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (value === previous.current) return;

    const direction = value > previous.current ? 1 : -1;
    previous.current = value;
    if (reduced) {
      translateY.value = 0;
      opacity.value = 1;
      return;
    }

    translateY.value = 10 * direction;
    opacity.value = 0;
    translateY.value = withTiming(0, { duration: 220, easing: easing.out });
    opacity.value = withTiming(1, { duration: 180, easing: easing.out });

    return () => {
      cancelAnimation(translateY);
      cancelAnimation(opacity);
    };
  }, [easing.out, opacity, reduced, translateY, value]);

  const numberStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View
      style={styles.count}
      accessibilityLiveRegion="polite"
      accessibilityLabel={`${total}명 중 ${value}번째`}
    >
      <View style={styles.countClip}>
        <Animated.View style={numberStyle}>
          <Text variant="caption" style={styles.countCurrent}>
            {value}
          </Text>
        </Animated.View>
      </View>
      <Text variant="caption" color="textDisabled">
        {' '}
        / {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.surfaceSunken },
  header: {
    height: 52,
    paddingHorizontal: space[2],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.lineSoft,
  },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1 },
  pager: { flexDirection: 'row', alignItems: 'center', gap: space[1] },
  pagerButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.3 },
  count: {
    minWidth: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countClip: { height: 18, overflow: 'hidden', justifyContent: 'center' },
  countCurrent: { fontWeight: '800' },
  content: { padding: space[5], paddingBottom: space[6] },
  footer: {
    paddingTop: space[3],
    paddingHorizontal: space[5],
    backgroundColor: color.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.lineSoft,
  },
  actionRow: { flexDirection: 'row', gap: space[2] },
  rejectButton: { flex: 1 },
  acceptButton: { flex: 2 },
  decisionRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[2],
  },
});
