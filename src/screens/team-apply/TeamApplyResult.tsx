import { useEffect, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, View } from 'react-native';

import { CheckIcon } from '@/components/icons';
import { Text } from '@/components/ui';
import { color, radius, role, shadowCompat, space, useMotion } from '@/theme';

import type { ApplySlot, ApplyTeam } from './teamApply';
import { WaxEnvelopeHero } from './WaxSend';

export function TeamApplyDone({ team, slot }: { team: ApplyTeam; slot: ApplySlot | null }) {
  const [pulse] = useState(() => new Animated.Value(0));
  const { reduced } = useMotion();

  useEffect(() => {
    if (reduced) return;
    const animation = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [pulse, reduced]);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.doneContent}>
      <WaxEnvelopeHero />

      <Text variant="titleXl" style={styles.doneTitle}>
        지원서를 보냈어요
      </Text>
      <Text variant="body" color="textBody" style={styles.doneDescription}>
        {'팀장이 결정하면\n바로 알림으로 알려드릴게요.'}
      </Text>

      <View style={styles.progressCard}>
        <View style={styles.progressCardHeader}>
          <Text variant="titleSm" numberOfLines={1} style={styles.progressTeamName}>
            {team.name}
          </Text>
          <Text variant="meta" style={{ color: slot ? role[slot.role].text : color.brandStrong }}>
            {slot?.label}
          </Text>
        </View>
        <View
          style={styles.progressTrackWrap}
          accessibilityRole="text"
          accessibilityLabel="지원 완료, 현재 팀장 검토 중, 다음 단계 결과 알림"
        >
          <View style={styles.progressTrack} />
          <View style={styles.progressTrackActive} />
          <View style={styles.progressSteps}>
            <ProgressStep label="지원 완료" state="done" />
            <View style={styles.progressStep}>
              <View style={[styles.progressNode, styles.progressNodeCurrent]}>
                <Animated.View
                  style={[
                    styles.progressPulse,
                    {
                      opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] }),
                      transform: [
                        {
                          scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.5] }),
                        },
                      ],
                    },
                  ]}
                />
              </View>
              <Text variant="meta" color="brand">
                팀장 검토 중
              </Text>
            </View>
            <ProgressStep label="결과 알림" state="waiting" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function ProgressStep({ label, state }: { label: string; state: 'done' | 'waiting' }) {
  return (
    <View style={styles.progressStep}>
      <View
        style={[
          styles.progressNode,
          state === 'done' ? styles.progressNodeDone : styles.progressNodeWaiting,
        ]}
      >
        {state === 'done' ? <CheckIcon size={12} /> : null}
      </View>
      <Text variant="meta" color={state === 'done' ? 'ink' : 'textFaint'}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  doneContent: {
    flexGrow: 1,
    paddingHorizontal: space[5],
    paddingTop: space[8],
    paddingBottom: space[4],
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneTitle: { marginTop: space[5], textAlign: 'center' },
  doneDescription: { marginTop: space[2.5], textAlign: 'center' },
  progressCard: {
    width: '100%',
    marginTop: space[8],
    paddingTop: space[4],
    paddingHorizontal: space[4],
    paddingBottom: space[4.5],
    borderWidth: 1,
    borderColor: color.lineSoft,
    borderRadius: radius['2xl'],
    backgroundColor: color.surface,
    ...shadowCompat.card,
  },
  progressCardHeader: { flexDirection: 'row', alignItems: 'baseline', gap: space[2] },
  progressTeamName: { flex: 1 },
  progressTrackWrap: { marginTop: space[4.5] },
  progressTrack: {
    position: 'absolute',
    left: '16.6%',
    right: '16.6%',
    top: 11,
    height: 3,
    borderRadius: radius.full,
    backgroundColor: color.lineSoft,
  },
  progressTrackActive: {
    position: 'absolute',
    left: '16.6%',
    width: '33.4%',
    top: 11,
    height: 3,
    borderRadius: radius.full,
    backgroundColor: color.brand,
  },
  progressSteps: { flexDirection: 'row' },
  progressStep: { flex: 1, alignItems: 'center', gap: space[2] },
  progressNode: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
  },
  progressNodeDone: { backgroundColor: color.brand },
  progressNodeCurrent: {
    borderWidth: 3,
    borderColor: color.brand,
    backgroundColor: color.surface,
  },
  progressNodeWaiting: {
    borderWidth: 3,
    borderColor: color.line,
    backgroundColor: color.surface,
  },
  progressPulse: {
    position: 'absolute',
    left: -7,
    right: -7,
    top: -7,
    bottom: -7,
    borderWidth: 2,
    borderColor: color.brand,
    borderRadius: radius.full,
  },
});
