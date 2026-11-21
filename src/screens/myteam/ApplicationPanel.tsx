import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { CheckIcon } from '@/components/icons';
import { ApplicationCard } from '@/components/application';
import { Button, Text } from '@/components/ui';
import { color, radius, space, usePulse } from '@/theme';

import type { Application } from './types';

export function ProgressSteps({ current = 1 }: { current?: 0 | 1 | 2 }) {
  const reduced = useReducedMotion();
  const lineStyle = useProgressLine();
  const pulseStyle = usePulse(true, 800);
  const steps = ['지원 완료', '팀장 검토 중', '결과 알림'];

  return (
    <View style={styles.progressSection}>
      <Text variant="titleMd">지원 진행 상황</Text>
      <View style={styles.progressCard}>
        <View style={styles.track}>
          <View style={styles.trackLine} />
          <Animated.View
            style={[
              styles.trackLineActive,
              { width: `${(100 / steps.length) * current}%` },
              lineStyle,
            ]}
          />
          {steps.map((step, index) => {
            const complete = index < current;
            const active = index === current;
            return (
              <View
                key={step}
                accessible
                accessibilityLabel={`${step}, ${complete ? '완료됨' : active ? '현재 단계' : '진행 전'}`}
                style={styles.step}
              >
                <View
                  style={[
                    styles.stepNode,
                    complete && styles.stepNodeComplete,
                    active && styles.stepNodeCurrent,
                  ]}
                >
                  {complete ? <CheckIcon size={12} /> : null}
                  {active && !reduced ? (
                    <Animated.View pointerEvents="none" style={[styles.pulseRing, pulseStyle]} />
                  ) : null}
                </View>
                <Text
                  variant="meta"
                  color={complete ? 'ink' : active ? 'brand' : 'textMuted'}
                  style={active && styles.currentStepLabel}
                >
                  {step}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.progressNote}>
          <ScanningDocument still={reduced} />
          <View style={styles.progressCopy}>
            <Text variant="bodyStrong">팀장이 지원서를 확인하고 있어요</Text>
            <Text variant="caption" color="textMuted">
              결정되면 바로 알림으로 알려드릴게요
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function useProgressLine() {
  const reduced = useReducedMotion();
  const progress = useSharedValue(reduced ? 1 : 0);

  useEffect(() => {
    progress.value = reduced
      ? 1
      : withDelay(
          200,
          withTiming(1, {
            duration: 600,
            easing: Easing.bezier(0.22, 1, 0.36, 1),
          }),
        );
    return () => cancelAnimation(progress);
  }, [progress, reduced]);

  return useAnimatedStyle(() => ({
    transform: [{ scaleX: progress.value }],
  }));
}

function ScanningDocument({ still }: { still: boolean }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = still
      ? 0
      : withRepeat(withTiming(1, { duration: 3200, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(progress);
  }, [progress, still]);

  const scanStyle = useAnimatedStyle(() => {
    const input = [
      0, 0.0625, 0.125, 0.1875, 0.25, 0.3125, 0.375, 0.4375, 0.5, 0.5625, 0.625, 0.6875, 0.75,
      0.8125, 0.875, 0.9375, 1,
    ];
    return {
      transform: [
        {
          translateX: interpolate(
            progress.value,
            input,
            [
              0, -0.52, -2, -3.48, -4, -4.13, -4.5, -4.87, -5, -4.48, -3, -1.52, -1, -0.87, -0.5,
              -0.13, 0,
            ],
          ),
        },
        {
          translateY: interpolate(
            progress.value,
            input,
            [
              0, -0.65, -2.5, -4.35, -5, -4.35, -2.5, -0.65, 0, -0.39, -1.5, -2.61, -3, -2.61, -1.5,
              -0.39, 0,
            ],
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.scanIcon}>
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 20.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5h7L18.5 8v3"
          stroke={color.ink}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M14 3.5V8h4.5"
          stroke={color.ink}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, scanStyle]}>
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Circle cx={16.5} cy={16.5} r={3} stroke={color.ink} strokeWidth={2} />
          <Path
            d="M18.7 18.7 21 21"
            stroke={color.ink}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

export function ApplicationPanel({
  application,
  onCancel,
}: {
  application: Application;
  onCancel: () => void;
}) {
  return (
    <View style={styles.applicationSection}>
      <Text variant="titleMd">내가 보낸 지원서</Text>
      <ApplicationCard application={application} />
      <Button label="지원 취소하기" variant="link" onPress={onCancel} style={styles.cancelButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  progressSection: { marginTop: space[6] },
  progressCard: {
    marginTop: space[2.5],
    paddingVertical: space[4.5],
    paddingHorizontal: space[4],
    borderRadius: radius.lg,
    backgroundColor: color.surface,
  },
  track: {
    flexDirection: 'row',
  },
  trackLine: {
    position: 'absolute',
    left: '16.6%',
    right: '16.6%',
    top: 11,
    height: 3,
    borderRadius: radius.full,
    backgroundColor: color.lineSoft,
  },
  trackLineActive: {
    position: 'absolute',
    left: '16.6%',
    top: 11,
    height: 3,
    borderRadius: radius.full,
    backgroundColor: color.brand,
    transformOrigin: 'left center',
  },
  step: { flex: 1, alignItems: 'center', gap: space[2] },
  stepNode: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.surface,
    borderWidth: 3,
    borderColor: color.line,
  },
  stepNodeComplete: { borderWidth: 0, backgroundColor: color.brand },
  stepNodeCurrent: { borderColor: color.brand },
  pulseRing: {
    position: 'absolute',
    top: -7,
    right: -7,
    bottom: -7,
    left: -7,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: color.brand,
  },
  currentStepLabel: { fontWeight: '800' },
  progressNote: {
    marginTop: space[4.5],
    paddingTop: space[3.5],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2.5],
    borderTopWidth: 1,
    borderTopColor: color.lineSoft,
  },
  scanIcon: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCopy: { flex: 1, minWidth: 0, gap: space[0.5] },
  applicationSection: { marginTop: space[6] },
  cancelButton: { alignSelf: 'center', marginTop: space[2] },
});
