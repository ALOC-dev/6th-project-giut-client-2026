import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type ScrollViewInstance,
  type ViewInstance,
} from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import { Text } from '@/components/ui';
import { radius, space, text } from '@/theme';

import { CREATE_COLOR, INTRO_HINTS, QUESTION_SUGGESTIONS } from './constants';
import { SectionTitle, StepBody } from './TeamCreateParts';
import type { TeamDraftApi } from './useTeamDraft';

type Props = { api: Pick<TeamDraftApi, 'draft' | 'set'> };

export function TeamCreateStepIntro({ api: { draft, set } }: Props) {
  const [editingIndex, setEditingIndex] = useState(-1);
  const scrollViewRef = useRef<ScrollViewInstance>(null);
  const questionRefs = useRef<Record<number, ViewInstance | null>>({});
  const activeQuestionRef = useRef(-1);
  const scrollFrameRef = useRef<number | null>(null);
  const viewportHeightRef = useRef(0);
  const suggestions = QUESTION_SUGGESTIONS.slice(0, 3);

  const scrollToQuestion = useCallback((index: number) => {
    const scrollView = scrollViewRef.current;
    const question = questionRefs.current[index];
    if (!scrollView || !question || index < 0) return;

    question.measureLayout(
      scrollView,
      (_x, y, _width, height) => {
        const centerOffset = Math.max(0, (viewportHeightRef.current - height) / 2);
        scrollView.scrollTo({ y: Math.max(0, y - centerOffset), animated: true });
      },
      () => undefined,
    );
  }, []);

  const scheduleQuestionScroll = useCallback(
    (index: number) => {
      if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current);
      scrollFrameRef.current = requestAnimationFrame(() => {
        scrollFrameRef.current = requestAnimationFrame(() => {
          scrollFrameRef.current = null;
          scrollToQuestion(index);
        });
      });
    },
    [scrollToQuestion],
  );

  useEffect(() => {
    const subscription = Keyboard.addListener('keyboardDidShow', () =>
      scheduleQuestionScroll(activeQuestionRef.current),
    );
    return () => {
      subscription.remove();
      if (scrollFrameRef.current !== null) cancelAnimationFrame(scrollFrameRef.current);
    };
  }, [scheduleQuestionScroll]);

  const updateQuestions = (questions: string[]) => set({ questions });

  const updateQuestion = (index: number, question: string) =>
    updateQuestions(
      draft.questions.map((current, questionIndex) =>
        questionIndex === index ? question : current,
      ),
    );

  const removeQuestion = (index: number) => {
    updateQuestions(draft.questions.filter((_, questionIndex) => questionIndex !== index));
    setEditingIndex(-1);
  };

  const addQuestion = (question = '') => {
    if (question && draft.questions.includes(question)) return;
    if (!question) activeQuestionRef.current = draft.questions.length;
    updateQuestions([...draft.questions, question]);
    setEditingIndex(question ? -1 : draft.questions.length);
  };

  const appendHint = (hint: string) => {
    const prefix = draft.description ? `${draft.description.replace(/\s*$/, '')}\n` : '';
    set({ description: `${prefix}${hint}`.slice(0, 1000) });
  };

  return (
    <StepBody
      scrollViewRef={scrollViewRef}
      automaticallyAdjustKeyboardInsets
      keyboardDismissMode="on-drag"
      contentStyle={styles.stepContent}
      onContentSizeChange={() => scheduleQuestionScroll(activeQuestionRef.current)}
      onLayout={(event) => {
        viewportHeightRef.current = event.nativeEvent.layout.height;
        scheduleQuestionScroll(activeQuestionRef.current);
      }}
    >
      <View style={styles.sections}>
        <View>
          <SectionTitle>팀 소개</SectionTitle>
          <View style={styles.box}>
            <TextInput
              value={draft.description}
              onChangeText={(description) => set({ description: description.slice(0, 1000) })}
              maxLength={1000}
              multiline
              textAlignVertical="top"
              placeholder="어떤 팀인지, 어떤 팀원을 찾는지 적어주세요."
              placeholderTextColor={CREATE_COLOR.disabled}
              selectionColor={CREATE_COLOR.brand}
              accessibilityLabel="팀 소개"
              style={styles.descriptionInput}
            />
            <View style={styles.descriptionBar}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hintRow}
                style={styles.hintScroll}
              >
                {INTRO_HINTS.map(([label, hint]) => {
                  const used = draft.description.includes(hint.trim());
                  return (
                    <Pressable
                      key={label}
                      disabled={used}
                      onPress={() => appendHint(hint)}
                      accessibilityRole="button"
                      accessibilityState={{ disabled: used }}
                      accessibilityLabel={`${label} 문구 ${used ? '추가됨' : '추가'}`}
                      style={({ pressed }) => [
                        styles.hintChip,
                        used && styles.hintChipUsed,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text variant="meta" color={used ? 'brand' : 'textBody'}>
                        {used ? '✓ ' : '+ '}
                        {label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
              <Text variant="badge" color="textSecondary">
                {draft.description.length}/1000
              </Text>
            </View>
          </View>
        </View>

        <View>
          <View style={styles.questionHeader}>
            <Text variant="label">지원자에게 받을 질문</Text>
            <Text variant="meta" color="textFaint">
              {draft.questions.length}개
            </Text>
          </View>
          <Text variant="meta" color="textSecondary" style={styles.questionHelper}>
            지원서에 그대로 나가요. 질문을 누르면 수정할 수 있어요.
          </Text>

          <View style={styles.box}>
            {draft.questions.map((question, index) => {
              const editing = editingIndex === index;
              return (
                <View
                  key={index}
                  ref={(node) => {
                    questionRefs.current[index] = node;
                  }}
                  style={[
                    styles.questionRow,
                    index > 0 && styles.questionDivider,
                    editing && styles.questionRowEditing,
                  ]}
                >
                  <View style={styles.questionNumber}>
                    <Text variant="badge" color="surface">
                      {index + 1}
                    </Text>
                  </View>
                  <View style={styles.questionContent}>
                    {editing ? (
                      <TextInput
                        value={question}
                        onChangeText={(value) => updateQuestion(index, value)}
                        onFocus={() => {
                          activeQuestionRef.current = index;
                          scheduleQuestionScroll(index);
                        }}
                        onBlur={() => {
                          activeQuestionRef.current = -1;
                          setEditingIndex(-1);
                        }}
                        onSubmitEditing={() => setEditingIndex(-1)}
                        autoFocus
                        returnKeyType="done"
                        placeholder="질문을 입력해주세요."
                        placeholderTextColor={CREATE_COLOR.disabled}
                        selectionColor={CREATE_COLOR.brand}
                        accessibilityLabel={`${index + 1}번 질문`}
                        style={styles.questionInput}
                      />
                    ) : (
                      <Pressable
                        onPress={() => {
                          activeQuestionRef.current = index;
                          setEditingIndex(index);
                        }}
                        accessibilityRole="button"
                        accessibilityLabel={`${index + 1}번 질문 수정`}
                        style={styles.questionTextButton}
                      >
                        <Text
                          variant="bodyStrong"
                          color={question ? 'ink' : 'textDisabled'}
                          style={styles.questionText}
                        >
                          {question || '질문을 입력해주세요.'}
                        </Text>
                      </Pressable>
                    )}
                  </View>
                  <Pressable
                    onPress={() => removeQuestion(index)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={`${index + 1}번 질문 지우기`}
                    style={({ pressed }) => [styles.removeButton, pressed && styles.pressed]}
                  >
                    <Text variant="body" color="textDisabled">
                      ×
                    </Text>
                  </Pressable>
                </View>
              );
            })}

            <Pressable
              onPress={() => addQuestion()}
              accessibilityRole="button"
              accessibilityLabel="질문 직접 추가"
              style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
            >
              <Text variant="bodyStrong" color="brand">
                + 직접 추가하기
              </Text>
            </Pressable>
          </View>

          {suggestions.length > 0 ? (
            <View style={styles.suggestionSection}>
              <Text variant="meta" style={styles.suggestionTitle}>
                추천 질문
              </Text>
              <View style={styles.suggestionList}>
                {suggestions.map((question) => {
                  const disabled = draft.questions.includes(question);
                  return (
                    <Pressable
                      key={question}
                      disabled={disabled}
                      onPress={() => addQuestion(question)}
                      accessibilityRole="button"
                      accessibilityState={{ disabled }}
                      accessibilityLabel={`추천 질문 추가: ${question}`}
                      style={({ pressed }) => [
                        styles.suggestion,
                        disabled && styles.suggestionDisabled,
                        pressed && styles.pressed,
                      ]}
                    >
                      <DashedBorder />
                      <Text variant="caption" color="textBody" style={styles.suggestionText}>
                        {question}
                      </Text>
                      <Text variant="label" color="brand">
                        {draft.questions.includes(question) ? '✓' : '+'}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </StepBody>
  );
}

function DashedBorder() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      onLayout={(event) =>
        setSize({
          width: event.nativeEvent.layout.width,
          height: event.nativeEvent.layout.height,
        })
      }
    >
      {size.width > 0 ? (
        <Svg width={size.width} height={size.height}>
          <Rect
            x={0.5}
            y={0.5}
            width={size.width - 1}
            height={size.height - 1}
            rx={radius.lg}
            fill={CREATE_COLOR.brandSoft}
            stroke={CREATE_COLOR.brand}
            strokeOpacity={0.28}
            strokeWidth={1}
            strokeDasharray="4 3"
          />
        </Svg>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stepContent: { paddingBottom: space[8] },
  sections: { gap: space[7] },
  box: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: CREATE_COLOR.line,
    backgroundColor: CREATE_COLOR.surface,
    overflow: 'hidden',
  },
  descriptionInput: {
    height: 150,
    paddingHorizontal: space[4],
    paddingVertical: space[3.5],
    color: CREATE_COLOR.ink,
    ...text.body,
  },
  descriptionBar: {
    minHeight: 49,
    paddingHorizontal: space[3],
    paddingVertical: space[2.5],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    borderTopWidth: 1,
    borderTopColor: CREATE_COLOR.lineSoft,
    backgroundColor: CREATE_COLOR.surfaceMuted,
  },
  hintScroll: { flex: 1 },
  hintRow: { gap: space[1] },
  hintChip: {
    height: 28,
    paddingHorizontal: space[2],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: CREATE_COLOR.line,
    justifyContent: 'center',
    backgroundColor: CREATE_COLOR.surface,
  },
  hintChipUsed: {
    borderColor: CREATE_COLOR.brandTint,
    backgroundColor: CREATE_COLOR.brandTint,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  questionHelper: { marginTop: space[1.5], marginBottom: space[3] },
  questionRow: {
    minHeight: 51,
    paddingVertical: space[3.5],
    paddingLeft: space[3.5],
    paddingRight: space[3],
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[2.5],
  },
  questionDivider: { borderTopWidth: 1, borderTopColor: CREATE_COLOR.lineSoft },
  questionRowEditing: { backgroundColor: CREATE_COLOR.brandSoft },
  questionNumber: {
    width: 22,
    height: 22,
    marginTop: space[0.5],
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CREATE_COLOR.brand,
  },
  questionContent: { flex: 1, minWidth: 0 },
  questionTextButton: { minHeight: 22, justifyContent: 'center' },
  questionText: { lineHeight: 21 },
  questionInput: {
    height: 24,
    padding: 0,
    color: CREATE_COLOR.ink,
    ...text.bodyStrong,
  },
  removeButton: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  addButton: {
    height: 48,
    borderTopWidth: 1,
    borderTopColor: CREATE_COLOR.lineSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionSection: { marginTop: space[3.5] },
  suggestionTitle: { marginBottom: space[2] },
  suggestionList: { gap: space[1.5] },
  suggestion: {
    minHeight: 44,
    paddingHorizontal: space[3.5],
    paddingVertical: space[2.5],
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2.5],
  },
  suggestionText: { flex: 1 },
  suggestionDisabled: { opacity: 0.5 },
  pressed: { opacity: 0.78 },
});
