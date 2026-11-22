import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChevronIcon } from '@/components/icons';
import { Text } from '@/components/ui';
import { color, radius, space } from '@/theme';

import { CREATE_COLOR, STEP_TITLES } from './constants';
import { StepTransition } from './TeamCreateParts';
import { TeamCreateStepActivity } from './TeamCreateStepActivity';
import { TeamCreateStepDone } from './TeamCreateStepDone';
import { TeamCreateStepIntro } from './TeamCreateStepIntro';
import { TeamCreateStepName } from './TeamCreateStepName';
import { TeamCreateStepRoles } from './TeamCreateStepRoles';
import { TeamCreateStepSeats } from './TeamCreateStepSeats';
import { useTeamDraft, type TeamDraft } from './useTeamDraft';

type TeamCreateScreenProps = {
  startStep?: 1 | 2 | 3 | 4 | 5 | 6;
  onExit: () => void;
  onSubmit?: (draft: TeamDraft) => Promise<{ shareUrl?: string } | void> | void;
  onDone: (draft: TeamDraft) => void;
  onCopyLink?: (url: string) => void | Promise<void>;
};

const STEPS = [
  TeamCreateStepName,
  TeamCreateStepRoles,
  TeamCreateStepSeats,
  TeamCreateStepActivity,
  TeamCreateStepIntro,
] as const;

export function TeamCreateScreen({
  startStep = 1,
  onExit,
  onSubmit,
  onDone,
  onCopyLink,
}: TeamCreateScreenProps) {
  const insets = useSafeAreaInsets();
  const draftApi = useTeamDraft(startStep);
  const [step, setStep] = useState(startStep);
  const [direction, setDirection] = useState<'right' | 'left'>('right');
  const [submitting, setSubmitting] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>();

  const completed = step === 6;
  const canContinue = draftApi.canContinue(step);
  const Step = STEPS[Math.min(step, 5) - 1];

  const moveTo = (nextStep: number) => {
    Keyboard.dismiss();
    setDirection(nextStep > step ? 'right' : 'left');
    setStep(nextStep as typeof step);
  };

  const handleBack = () => {
    if (completed) return;
    if (step > 1) moveTo(step - 1);
    else onExit();
  };

  const handleContinue = async () => {
    if (completed) {
      onDone(draftApi.draft);
      return;
    }
    if (!canContinue || submitting) return;

    if (step === 5) {
      const draft = {
        ...draftApi.draft,
        questions: draftApi.draft.questions.filter((question) => question.trim()),
      };
      draftApi.set({ questions: draft.questions });
      try {
        setSubmitting(true);
        const result = await onSubmit?.(draft);
        if (result?.shareUrl) setShareUrl(result.shareUrl);
      } catch {
        return;
      } finally {
        setSubmitting(false);
      }
    }

    moveTo(step + 1);
  };

  const ctaEnabled = completed || (canContinue && !submitting);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {!completed ? (
        <View style={styles.header}>
          <View style={styles.topBar}>
            <Pressable
              onPress={handleBack}
              accessibilityRole="button"
              accessibilityLabel={step === 1 ? '팀 만들기 닫기' : '이전 단계로 이동'}
              style={styles.backButton}
            >
              <ChevronIcon dir="left" size={22} />
            </Pressable>
            <Text variant="titleMd">팀 만들기</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View
            style={styles.progress}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 1, max: 5, now: step }}
          >
            {[1, 2, 3, 4, 5].map((item) => (
              <View
                key={item}
                style={[styles.progressSegment, item <= step && styles.progressSegmentActive]}
              />
            ))}
          </View>

          <View style={styles.stepHeading}>
            <View style={styles.stepTitleRow}>
              <Text variant="titleXl">{STEP_TITLES[step - 1][0]}</Text>
              <Text variant="caption" color="textMuted">
                {step} / 5
              </Text>
            </View>
            <Text variant="caption" color="textBody" style={styles.stepDescription}>
              {STEP_TITLES[step - 1][1]}
            </Text>
          </View>
        </View>
      ) : null}

      <KeyboardAvoidingView style={styles.keyboardArea} behavior="padding" enabled={step === 5}>
        <View style={styles.body}>
          <StepTransition key={step} direction={direction}>
            {completed ? (
              <TeamCreateStepDone api={draftApi} shareUrl={shareUrl} onCopyLink={onCopyLink} />
            ) : (
              <Step api={draftApi} />
            )}
          </StepTransition>
        </View>
      </KeyboardAvoidingView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space[3]) }]}>
        <Pressable
          onPress={handleContinue}
          disabled={!ctaEnabled}
          accessibilityRole="button"
          accessibilityState={{ disabled: !ctaEnabled, busy: submitting }}
          style={({ pressed }) => [
            styles.cta,
            ctaEnabled ? styles.ctaEnabled : styles.ctaDisabled,
            pressed && ctaEnabled && styles.ctaPressed,
          ]}
        >
          <Text variant="button" color={ctaEnabled ? 'surface' : 'textDisabled'}>
            {completed
              ? '내 팀 페이지로 가기'
              : step === 5
                ? submitting
                  ? '등록하는 중…'
                  : '팀 등록하기'
                : '다음'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.surface },
  keyboardArea: { flex: 1 },
  header: { paddingTop: space[2], paddingHorizontal: space[5] },
  topBar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    marginLeft: -space[3],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: { width: 32 },
  progress: { flexDirection: 'row', gap: space[1], marginTop: space[2] },
  progressSegment: {
    flex: 1,
    height: space[1],
    borderRadius: radius.full,
    backgroundColor: CREATE_COLOR.line,
  },
  progressSegmentActive: { backgroundColor: CREATE_COLOR.brand },
  stepHeading: { marginTop: space[5], minHeight: 64 },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  stepDescription: { marginTop: space[1.5] },
  body: { flex: 1, overflow: 'hidden' },
  footer: {
    paddingTop: space[3],
    paddingHorizontal: space[5],
    backgroundColor: color.surface,
  },
  cta: {
    height: 56,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaEnabled: { backgroundColor: CREATE_COLOR.brand },
  ctaDisabled: { backgroundColor: CREATE_COLOR.lineSoft },
  ctaPressed: { opacity: 0.88 },
});
