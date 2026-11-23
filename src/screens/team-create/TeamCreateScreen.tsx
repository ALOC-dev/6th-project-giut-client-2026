import { useRef, useState } from 'react';
import { usePreventRemove } from 'expo-router';
import { Alert, Keyboard, KeyboardAvoidingView, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChevronIcon } from '@/components/icons';
import { Text, Toast, useToast } from '@/components/ui';
import { color, radius, space } from '@/theme';

import { CREATE_COLOR, DEFAULT_QUESTIONS, STEP_TITLES } from './constants';
import { StepTransition } from './TeamCreateParts';
import { TeamCreateStepActivity } from './TeamCreateStepActivity';
import { TeamCreateStepDone } from './TeamCreateStepDone';
import { TeamCreateStepIntro } from './TeamCreateStepIntro';
import { TeamCreateStepName } from './TeamCreateStepName';
import { TeamCreateStepRoles } from './TeamCreateStepRoles';
import { TeamCreateStepSeats } from './TeamCreateStepSeats';
import { useTeamDraft, type TeamDraft } from './useTeamDraft';

type TeamCreateScreenProps = {
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

export function TeamCreateScreen({ onExit, onSubmit, onDone, onCopyLink }: TeamCreateScreenProps) {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const draftApi = useTeamDraft();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [direction, setDirection] = useState<'right' | 'left'>('right');
  const [submitting, setSubmitting] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>();
  const [allowRemoval, setAllowRemoval] = useState(false);
  const exitAlertOpen = useRef(false);

  const completed = step === 6;
  const canContinue = draftApi.canContinue(step);
  const Step = STEPS[Math.min(step, 5) - 1];
  const draftChanged = hasDraftChanges(draftApi.draft);

  const moveTo = (nextStep: number) => {
    Keyboard.dismiss();
    setDirection(nextStep > step ? 'right' : 'left');
    setStep(nextStep as typeof step);
  };

  const showExitConfirmation = (onConfirm: () => void) => {
    if (exitAlertOpen.current) return;
    exitAlertOpen.current = true;
    Keyboard.dismiss();

    Alert.alert(
      '팀 만들기를 그만둘까요?',
      '작성한 내용은 저장되지 않아요.',
      [
        {
          text: '계속 작성하기',
          style: 'cancel',
          onPress: () => {
            exitAlertOpen.current = false;
          },
        },
        {
          text: '나가기',
          style: 'destructive',
          onPress: () => {
            exitAlertOpen.current = false;
            onConfirm();
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {
          exitAlertOpen.current = false;
        },
      },
    );
  };

  const disableRemovalPrevention = usePreventRemove(
    (step > 1 || draftChanged) && !allowRemoval,
    ({ repeat }) => {
      if (completed) return;
      if (step > 1) {
        moveTo(step - 1);
        return;
      }

      showExitConfirmation(() => {
        setAllowRemoval(true);
        repeat();
      });
    },
  );

  const exitScreen = () => {
    setAllowRemoval(true);
    disableRemovalPrevention();
    onExit();
  };

  const handleBack = () => {
    if (completed) return;
    if (step > 1) {
      moveTo(step - 1);
      return;
    }

    if (draftChanged) {
      showExitConfirmation(exitScreen);
      return;
    }

    onExit();
  };

  const handleCopyLink = async (url: string) => {
    if (!onCopyLink) {
      toast.show('링크를 복사하지 못했어요. 잠시 후 다시 시도해주세요.');
      throw new Error('Copy handler is not available.');
    }

    try {
      await onCopyLink(url);
    } catch (error) {
      toast.show('링크를 복사하지 못했어요. 잠시 후 다시 시도해주세요.');
      throw error;
    }
  };

  const handleContinue = async () => {
    if (completed) {
      setAllowRemoval(true);
      disableRemovalPrevention();
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
        toast.show('팀을 등록하지 못했어요. 잠시 후 다시 시도해주세요.');
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
              <TeamCreateStepDone api={draftApi} shareUrl={shareUrl} onCopyLink={handleCopyLink} />
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

      <Toast {...toast.props} />
    </View>
  );
}

function hasDraftChanges(draft: TeamDraft) {
  const questionsChanged =
    draft.questions.length !== DEFAULT_QUESTIONS.length ||
    draft.questions.some((question, index) => question !== DEFAULT_QUESTIONS[index]);

  return (
    draft.name.trim().length > 0 ||
    draft.myRole !== null ||
    draft.myPosition !== null ||
    draft.recruitRoles.length > 0 ||
    Object.keys(draft.recruit).length > 0 ||
    draft.mode !== null ||
    draft.meetings > 0 ||
    draft.place !== null ||
    draft.tools.length > 0 ||
    draft.description.trim().length > 0 ||
    questionsChanged
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
