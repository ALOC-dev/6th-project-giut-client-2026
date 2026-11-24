import { usePreventRemove } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  type ViewInstance,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChevronIcon } from '@/components/icons';
import { Press, Text, Toast, useToast } from '@/components/ui';
import { color, radius, space, useMotion } from '@/theme';

import { TeamApplyDone } from './TeamApplyResult';
import { TeamApplyAnswersStep, TeamApplyPreviewStep, TeamApplySeatStep } from './TeamApplySteps';
import {
  APPLY_QUESTIONS,
  type ApplyQuestion,
  type ApplyTeam,
  type TeamApplyDraft,
  useTeamApplyDraft,
} from './teamApply';
import { WaxSendOverlay } from './WaxSend';

type TeamApplyScreenProps = {
  team: ApplyTeam;
  questions?: ApplyQuestion[];
  userName?: string;
  onExit: () => void;
  onSubmit?: (draft: TeamApplyDraft) => Promise<void> | void;
  onDone: () => void;
};

export function TeamApplyScreen({
  team,
  questions = APPLY_QUESTIONS,
  userName = '기웃 사용자',
  onExit,
  onSubmit,
  onDone,
}: TeamApplyScreenProps) {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const api = useTeamApplyDraft(team, questions);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [leaving, setLeaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sending, setSending] = useState(false);
  const [cardHidden, setCardHidden] = useState(false);
  const [sendFrom, setSendFrom] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const [screenSize, setScreenSize] = useState({ width: 390, height: 794 });
  const [completed, setCompleted] = useState(false);
  const submitLock = useRef(false);
  const mountedRef = useRef(true);
  const rootRef = useRef<ViewInstance>(null);
  const cardRef = useRef<ViewInstance>(null);
  const measurementFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const moveTo = useCallback(
    (nextStep: 1 | 2 | 3) => {
      Keyboard.dismiss();
      setDirection(nextStep > step ? 'right' : 'left');
      setStep(nextStep);
    },
    [step],
  );

  const disableRemovalPrevention = usePreventRemove(
    !completed && !leaving,
    ({ repeat }) => {
      if (submitting) return;
      if (step > 1) {
        moveTo((step - 1) as 1 | 2);
        return;
      }
      setLeaving(true);
      repeat();
    },
  );

  const startSendAnimation = useCallback(() => {
    const root = rootRef.current;
    const card = cardRef.current;
    let started = false;

    const beginAnimation = (box?: { x: number; y: number; w: number; h: number }) => {
      if (started) return;
      started = true;
      if (measurementFallbackRef.current) {
        clearTimeout(measurementFallbackRef.current);
        measurementFallbackRef.current = null;
      }
      if (box) setSendFrom(box);
      else setCardHidden(true);
      setSending(true);
    };

    if (!root || !card) {
      beginAnimation();
      return;
    }

    measurementFallbackRef.current = setTimeout(beginAnimation, 500);
    try {
      root.measureInWindow((rootX, rootY) => {
        card.measureInWindow((x, y, width, height) => {
          beginAnimation({ x: x - rootX, y: y - rootY, w: width, h: height });
        });
      });
    } catch {
      beginAnimation();
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      if (measurementFallbackRef.current) clearTimeout(measurementFallbackRef.current);
    };
  }, []);

  const handleBack = () => {
    if (submitting) return;
    if (step > 1) {
      moveTo((step - 1) as 1 | 2);
      return;
    }
    setLeaving(true);
    disableRemovalPrevention();
    onExit();
  };

  const handleContinue = async () => {
    if (completed) {
      onDone();
      return;
    }
    if (!api.canContinue(step) || submitting || submitLock.current) return;

    if (step < 3) {
      moveTo((step + 1) as 2 | 3);
      return;
    }

    submitLock.current = true;
    setSubmitting(true);
    try {
      await onSubmit?.(api.draft);
    } catch {
      if (!mountedRef.current) return;
      submitLock.current = false;
      setSubmitting(false);
      toast.show('지원서를 보내지 못했어요. 잠시 후 다시 시도해주세요.');
      return;
    }
    if (!mountedRef.current) return;
    startSendAnimation();
  };

  const handleCardHide = useCallback(() => setCardHidden(true), []);

  const handleSendAnimationDone = useCallback(() => {
    setSubmitting(false);
    setSending(false);
    setCardHidden(false);
    setSendFrom(null);
    setCompleted(true);
  }, []);

  const ctaLabel = completed
    ? '돌아가기'
    : step === 1
      ? api.slot
        ? `${api.slot.label}로 지원하기`
        : '자리를 골라주세요'
      : step === 2
        ? '지원서 미리보기'
        : '지원서 보내기';
  const ctaEnabled = completed || (api.canContinue(step) && !submitting);

  return (
    <View
      ref={rootRef}
      collapsable={false}
      style={[styles.screen, { paddingTop: insets.top }]}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setScreenSize((current) =>
          current.width === width && current.height === height ? current : { width, height },
        );
      }}
    >
      {!completed ? (
        <View style={styles.header}>
          <Press
            onPress={handleBack}
            disabled={submitting}
            touchSize={44}
            accessibilityRole="button"
            accessibilityLabel={step === 1 ? '팀 지원 화면 닫기' : '이전 단계로 이동'}
            accessibilityState={{ disabled: submitting }}
            style={[styles.backButton, submitting && styles.disabled]}
          >
            <ChevronIcon dir="left" size={24} />
          </Press>
          <View
            style={styles.progressDots}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 1, max: 3, now: step }}
          >
            {[1, 2, 3].map((item) => (
              <ProgressDot key={item} active={item === step} passed={item <= step} />
            ))}
          </View>
          <Text variant="caption" color="textMuted" style={styles.stepNumber}>
            {step} / 3
          </Text>
        </View>
      ) : null}

      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled={step === 2 && Platform.OS === 'ios'}
      >
        <StepTransition key={completed ? 'done' : step} direction={direction}>
          {completed ? (
            <TeamApplyDone team={team} slot={api.slot} />
          ) : step === 1 ? (
            <TeamApplySeatStep api={api} team={team} />
          ) : step === 2 ? (
            <TeamApplyAnswersStep api={api} questions={questions} />
          ) : (
            <TeamApplyPreviewStep
              api={api}
              questions={questions}
              userName={userName}
              sending={sending}
              cardHidden={cardHidden}
              cardRef={cardRef}
            />
          )}
        </StepTransition>
      </KeyboardAvoidingView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space[3]) }]}>
        <Press
          onPress={handleContinue}
          disabled={!ctaEnabled || submitting}
          accessibilityRole="button"
          accessibilityLabel={submitting ? '지원서를 보내는 중입니다' : ctaLabel}
          accessibilityState={{ disabled: !ctaEnabled || submitting, busy: submitting }}
          style={[
            styles.cta,
            ctaEnabled ? styles.ctaEnabled : styles.ctaDisabled,
            sending && styles.ctaSending,
          ]}
        >
          <Text variant="button" color={ctaEnabled ? 'surface' : 'textDisabled'} numberOfLines={1}>
            {ctaLabel}
          </Text>
        </Press>
      </View>

      {sending ? (
        <WaxSendOverlay
          width={screenSize.width}
          height={screenSize.height}
          from={sendFrom}
          onCardHide={handleCardHide}
          onDone={handleSendAnimationDone}
        />
      ) : null}
      <Toast {...toast.props} />
    </View>
  );
}

function StepTransition({
  direction,
  children,
}: {
  direction: 'left' | 'right';
  children: React.ReactNode;
}) {
  const { reduced } = useMotion();
  const [progress] = useState(() => new Animated.Value(reduced ? 1 : 0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: reduced ? 0 : 400,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: true,
    }).start();
  }, [progress, reduced]);

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: progress,
        transform: [
          {
            translateX: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [direction === 'right' ? 28 : -28, 0],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}

function ProgressDot({ active, passed }: { active: boolean; passed: boolean }) {
  const { reduced } = useMotion();
  const [width] = useState(() => new Animated.Value(active ? 28 : 6));

  useEffect(() => {
    Animated.timing(width, {
      toValue: active ? 28 : 6,
      duration: reduced ? 0 : 350,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: false,
    }).start();
  }, [active, reduced, width]);

  return (
    <Animated.View
      style={[styles.progressDot, { width, backgroundColor: passed ? color.brand : color.line }]}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.surface },
  header: {
    height: 52,
    paddingHorizontal: space[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2.5],
  },
  backButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.4 },
  progressDots: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[1.5],
  },
  progressDot: { height: 6, borderRadius: radius.full },
  stepNumber: { width: 44, textAlign: 'right' },
  body: { flex: 1, overflow: 'hidden' },
  footer: { paddingTop: space[3], paddingHorizontal: space[5], backgroundColor: color.surface },
  cta: {
    height: 56,
    paddingHorizontal: space[4],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xl,
  },
  ctaEnabled: { backgroundColor: color.brand },
  ctaDisabled: { backgroundColor: color.surfaceMuted },
  ctaSending: { opacity: 0 },
});
