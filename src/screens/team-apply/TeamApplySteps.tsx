import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type GestureResponderEvent,
  type ViewInstance,
} from 'react-native';
import Svg, { Circle, Path, Polygon } from 'react-native-svg';

import { CheckIcon, ChevronIcon } from '@/components/icons';
import { ApplicationCard, type ApplicationCardData } from '@/components/application';
import { Press, Text } from '@/components/ui';
import { color, radius, role, shadowCompat, space, useMotion } from '@/theme';

import {
  ANSWER_MAX,
  APPLY_DAYS,
  APPLY_HOURS,
  APPLY_TIMES,
  type ApplyQuestion,
  type ApplySlot,
  type ApplyTeam,
  type TeamApplyDraftApi,
} from './teamApply';
import { SeatFigure } from './SeatFigure';
import { FoldingCard, PreviewFloatingCard } from './WaxSend';

const ROLE_TONE = role;
const GAUGE = { width: 240, height: 150, centerX: 120, centerY: 126, radius: 94 };
const GAUGE_ARC = Math.PI * GAUGE.radius;
const GAUGE_PATH = `M ${GAUGE.centerX - GAUGE.radius} ${GAUGE.centerY} A ${GAUGE.radius} ${GAUGE.radius} 0 0 1 ${GAUGE.centerX + GAUGE.radius} ${GAUGE.centerY}`;
const GAUGE_OUTER_RADIUS = 106;
const GAUGE_OUTER_ARC = Math.PI * GAUGE_OUTER_RADIUS;
const GAUGE_OUTER_PATH = `M ${GAUGE.centerX - GAUGE_OUTER_RADIUS} ${GAUGE.centerY} A ${GAUGE_OUTER_RADIUS} ${GAUGE_OUTER_RADIUS} 0 0 1 ${GAUGE.centerX + GAUGE_OUTER_RADIUS} ${GAUGE.centerY}`;
const MEETING_LABEL_WIDTH = 52;
const MEETING_GAP = 4;
const MEETING_HEADER_HEIGHT = 44;
const MEETING_ROW_HEIGHT = 36;

export function TeamApplySeatStep({ api, team }: { api: TeamApplyDraftApi; team: ApplyTeam }) {
  const openSlots = team.slots.filter((slot) => !slot.filled);
  const filledSlots = team.slots.filter((slot) => slot.filled);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.stepContent}>
      <TeamHero team={team} />

      <View>
        <Text variant="titleXl">{'어느 자리에\n지원할까요?'}</Text>
        <Text variant="body" color="textBody" style={styles.headingDescription}>
          지금 비어 있는 자리는 {openSlots.length}개예요.
        </Text>
      </View>

      <View style={styles.slotList} accessibilityRole="radiogroup">
        {openSlots.map((slot) => (
          <OpenSlot
            key={slot.id}
            slot={slot}
            selected={api.draft.slotId === slot.id}
            onPress={() => api.selectSlot(slot.id)}
          />
        ))}
      </View>

      {filledSlots.length > 0 ? (
        <View style={styles.filledSection}>
          <Text variant="caption" color="textMuted">
            이미 채워진 자리
          </Text>
          {filledSlots.map((slot) => (
            <FilledSlot key={slot.id} slot={slot} />
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}

function TeamHero({ team }: { team: ApplyTeam }) {
  const filled = team.slots.filter((slot) => slot.filled).length;

  return (
    <View style={styles.hero}>
      <View style={[styles.heroDecoration, styles.heroDecorationLarge]} />
      <View style={[styles.heroDecoration, styles.heroDecorationSmall]} />
      <View style={styles.heroTitleRow}>
        <View style={styles.flagBox}>
          <View style={styles.flagPole} />
          <Svg width={18} height={14} style={styles.flag}>
            <Polygon points="0,0 18,0 14,7 18,14 0,14" fill={color.brand} />
          </Svg>
        </View>
        <View style={styles.heroCopy}>
          <Text variant="titleLg" color="surface" numberOfLines={1}>
            {team.name}
          </Text>
          <Text variant="caption" color={color.brandTint} numberOfLines={1}>
            {team.contest}
          </Text>
        </View>
      </View>
      <View style={styles.heroChips}>
        {[`마감 D-${team.dday}`, `팀원 ${filled} / ${team.slots.length}`, team.activity].map(
          (label) => (
            <View key={label} style={styles.heroChip}>
              <Text variant="meta" color="surface">
                {label}
              </Text>
            </View>
          ),
        )}
      </View>
    </View>
  );
}

function OpenSlot({
  slot,
  selected,
  onPress,
}: {
  slot: ApplySlot;
  selected: boolean;
  onPress: () => void;
}) {
  const tone = ROLE_TONE[slot.role];
  const { reduced } = useMotion();
  const [checkProgress] = useState(() => new Animated.Value(selected ? 1 : 0));

  useEffect(() => {
    Animated.timing(checkProgress, {
      toValue: selected ? 1 : 0,
      duration: reduced ? 0 : 250,
      easing: Easing.bezier(0.34, 1.56, 0.64, 1),
      useNativeDriver: true,
    }).start();
  }, [checkProgress, reduced, selected]);

  return (
    <Press
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${slot.label} 자리 선택`}
      style={[
        styles.openSlot,
        { padding: selected ? 13.5 : space[3.5] },
        selected && {
          borderWidth: 2,
          borderColor: tone.base,
          backgroundColor: tone.tint,
          shadowColor: tone.base,
          shadowOpacity: 0.14,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 8 },
          elevation: 4,
        },
      ]}
    >
      <SeatFigure color={tone.base} tint={tone.tint} selected={selected} />
      <View style={styles.slotCopy}>
        <Text variant="meta" color={tone.text}>
          {ROLE_LABELS[slot.role]}
        </Text>
        <Text variant="titleMd" numberOfLines={1}>
          {slot.label}
        </Text>
      </View>
      <View
        style={[
          styles.radio,
          selected
            ? { backgroundColor: tone.base, borderColor: tone.base }
            : { backgroundColor: color.surface, borderColor: color.line },
        ]}
      >
        <Animated.View
          style={{
            opacity: checkProgress,
            transform: [
              {
                scale: checkProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.4, 1],
                }),
              },
            ],
          }}
        >
          <CheckIcon size={14} />
        </Animated.View>
      </View>
    </Press>
  );
}

function FilledSlot({ slot }: { slot: ApplySlot }) {
  const tone = ROLE_TONE[slot.role];
  return (
    <View style={styles.filledSlot}>
      <View style={[styles.filledAvatar, { backgroundColor: tone.tint }]}>
        <View style={[styles.filledPersonHead, { backgroundColor: tone.base }]} />
        <View style={[styles.filledPersonBody, { backgroundColor: tone.base }]} />
      </View>
      <Text variant="bodyStrong" numberOfLines={1} style={styles.filledRole}>
        {slot.label}
      </Text>
      <Text variant="meta" color="textMuted">
        마감
      </Text>
    </View>
  );
}

const ROLE_LABELS = {
  dev: '개발',
  design: '디자인',
  plan: '기획',
  mkt: '마케팅',
} as const;

export function TeamApplyAnswersStep({
  api,
  questions,
}: {
  api: TeamApplyDraftApi;
  questions: ApplyQuestion[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  return (
    <ScrollView
      scrollEnabled={scrollEnabled}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.stepContent}
    >
      <View>
        <Text variant="titleXl">{'팀장에게\n나를 소개해 주세요'}</Text>
        <View style={styles.answerHeadingRow}>
          <Text variant="body" color="textBody">
            <Text variant="bodyStrong" color={api.slot ? role[api.slot.role].text : 'brandStrong'}>
              {api.slot?.label}
            </Text>
            로 지원하고 있어요
          </Text>
          <Text
            variant="meta"
            color={api.required.done === api.required.total ? 'brand' : 'textMuted'}
          >
            필수 {api.required.done} / {api.required.total}
          </Text>
        </View>
      </View>

      <View style={styles.questionList}>
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            index={index}
            question={question}
            value={api.draft.answers[question.id] ?? ''}
            open={openId === question.id}
            onToggle={() => setOpenId((current) => (current === question.id ? null : question.id))}
            onChange={(value) => api.setAnswer(question.id, value)}
          />
        ))}
      </View>

      <HoursGauge
        value={api.draft.hours}
        onChange={api.setHours}
        onDragChange={(dragging) => setScrollEnabled(!dragging)}
      />

      <View style={styles.optionalDivider}>
        <Text variant="caption" color="textMuted">
          선택 항목
        </Text>
        <View style={styles.optionalLine} />
      </View>

      <MeetingGrid
        value={api.draft.availableSlots}
        onSet={api.setAvailableSlots}
        onPaintChange={(painting) => setScrollEnabled(!painting)}
      />
    </ScrollView>
  );
}

function QuestionCard({
  index,
  question,
  value,
  open,
  onToggle,
  onChange,
}: {
  index: number;
  question: ApplyQuestion;
  value: string;
  open: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}) {
  const completed = value.trim().length > 0;
  const emphasized = index === 0 || open;
  const { reduced } = useMotion();
  const [focused, setFocused] = useState(false);
  const [rotation] = useState(() => new Animated.Value(open ? 1 : 0));
  const [answerOpacity] = useState(() => new Animated.Value(open ? 1 : 0));

  useEffect(() => {
    const rotationAnimation = Animated.timing(rotation, {
      toValue: open ? 1 : 0,
      duration: reduced ? 0 : 250,
      easing: Easing.bezier(0.42, 0, 0.58, 1),
      useNativeDriver: true,
    });

    if (open) answerOpacity.setValue(0);
    const answerAnimation = Animated.timing(answerOpacity, {
      toValue: open ? 1 : 0,
      duration: reduced ? 0 : 250,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });

    Animated.parallel([rotationAnimation, answerAnimation]).start();
    return () => {
      rotationAnimation.stop();
      answerAnimation.stop();
    };
  }, [answerOpacity, open, reduced, rotation]);

  return (
    <View
      style={[
        styles.questionCard,
        open && styles.questionCardOpen,
        open && focused && styles.questionCardFocused,
      ]}
    >
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${question.question}, ${open ? '접기' : '펼치기'}`}
        style={styles.questionHeader}
      >
        <View
          style={[
            styles.questionNumber,
            { backgroundColor: completed ? color.brand : emphasized ? color.ink : color.line },
          ]}
        >
          <Text variant="meta" color={completed || emphasized ? 'surface' : 'textSecondary'}>
            {completed ? '✓' : index + 1}
          </Text>
        </View>
        <View style={styles.questionCopy}>
          <Text variant="label">
            {question.question} <Text color="brand">*</Text>
          </Text>
          {!open ? (
            <Text
              variant="caption"
              color={completed ? 'textSecondary' : 'textDisabled'}
              numberOfLines={1}
            >
              {completed ? value.replace(/\n/g, ' ') : '아직 작성하지 않았어요'}
            </Text>
          ) : null}
        </View>
        <Animated.View
          style={{
            transform: [
              {
                rotate: rotation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                }),
              },
            ],
          }}
        >
          <ChevronIcon size={18} color={color.textMuted} />
        </Animated.View>
      </Pressable>

      {open ? (
        <Animated.View style={[styles.answerInputWrap, { opacity: answerOpacity }]}>
          <TextInput
            value={value}
            onChangeText={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            maxLength={ANSWER_MAX}
            multiline
            textAlignVertical="top"
            accessibilityLabel={question.question}
            placeholder={question.placeholder ?? '답변을 적어 주세요'}
            placeholderTextColor={color.textFaint}
            selectionColor={color.brand}
            style={styles.answerInput}
          />
          <Text variant="meta" color="textMuted" style={styles.answerCount}>
            {value.length} / {ANSWER_MAX}
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

function HoursGauge({
  value,
  onChange,
  onDragChange,
}: {
  value: number;
  onChange: (value: number) => void;
  onDragChange?: (dragging: boolean) => void;
}) {
  const { reduced } = useMotion();
  const [dragging, setDragging] = useState(false);
  const [progress] = useState(() => new Animated.Value(value / 20));

  useEffect(() => {
    const next = value / 20;
    if (dragging || reduced) {
      progress.setValue(next);
      return;
    }

    const animation = Animated.timing(progress, {
      toValue: next,
      duration: 420,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [dragging, progress, reduced, value]);

  const panResponder = useMemo(() => {
    const setFromPoint = (locationX: number, locationY: number) => {
      const x = locationX - GAUGE.centerX;
      const y = GAUGE.centerY - locationY;
      const angle = Math.atan2(Math.max(y, 0), x);
      onChange(Math.max(1, Math.min(20, Math.round((1 - angle / Math.PI) * 20))));
    };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (event) => {
        setDragging(true);
        onDragChange?.(true);
        setFromPoint(event.nativeEvent.locationX, event.nativeEvent.locationY);
      },
      onPanResponderMove: (event) =>
        setFromPoint(event.nativeEvent.locationX, event.nativeEvent.locationY),
      onPanResponderRelease: () => {
        setDragging(false);
        onDragChange?.(false);
      },
      onPanResponderTerminate: () => {
        setDragging(false);
        onDragChange?.(false);
      },
    });
  }, [onChange, onDragChange]);

  const caption =
    value === 0
      ? '드래그하거나 아래에서 골라주세요'
      : value <= 10
        ? '꾸준히 함께해요'
        : value < 20
          ? '열심히 함께해요'
          : '거의 풀타임이에요';

  return (
    <View style={styles.hoursCard}>
      <Text variant="label">
        한 주에 함께할 수 있는 시간 <Text color="brand">*</Text>
      </Text>
      <View
        {...panResponder.panHandlers}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="주당 참여 시간"
        accessibilityValue={{ min: 1, max: 20, now: value || undefined }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(event) => {
          const delta = event.nativeEvent.actionName === 'increment' ? 1 : -1;
          onChange(Math.max(1, Math.min(20, (value || 1) + delta)));
        }}
        style={styles.gauge}
      >
        <Svg width={GAUGE.width} height={GAUGE.height} style={StyleSheet.absoluteFill}>
          <Path
            d={GAUGE_OUTER_PATH}
            fill="none"
            stroke={color.highlight}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={`${GAUGE_OUTER_ARC / 4} 400`}
            strokeDashoffset={-GAUGE_OUTER_ARC / 4}
          />
          <Path
            d={GAUGE_PATH}
            fill="none"
            stroke={color.lineSoft}
            strokeWidth={14}
            strokeLinecap="round"
          />
          <AnimatedPath
            d={GAUGE_PATH}
            fill="none"
            stroke={color.brand}
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray={`${GAUGE_ARC} 400`}
            strokeDashoffset={progress.interpolate({
              inputRange: [0, 1],
              outputRange: [GAUGE_ARC, 0],
            })}
          />
        </Svg>
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: value > 0 ? 1 : 0,
              transformOrigin: [GAUGE.centerX, GAUGE.centerY, 0],
              transform: [
                {
                  rotate: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[styles.gaugeKnob, dragging && styles.gaugeKnobDragging]} />
        </Animated.View>
        <View pointerEvents="none" style={styles.gaugeValue}>
          <Text variant="displayNumber" color={value ? 'ink' : 'textDisabled'}>
            {value ? (value >= 20 ? '20시간+' : `${value}시간`) : '—'}
          </Text>
          <Text variant="meta" color="textMuted">
            {caption}
          </Text>
        </View>
      </View>

      <View style={styles.recommendation}>
        <View style={styles.recommendationMark} />
        <Text variant="meta" color="textSecondary">
          추천 구간이에요 · <Text color="ink">주 5~10시간</Text>
        </Text>
      </View>

      <View style={styles.hourOptions} accessibilityRole="radiogroup">
        {APPLY_HOURS.map((hours) => {
          const selected = value === hours;
          return (
            <Press
              key={hours}
              onPress={() => onChange(hours)}
              scaleOnPress={false}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              style={[styles.hourOption, selected && styles.hourOptionSelected]}
            >
              <Text variant="caption" color={selected ? 'brand' : 'textMuted'}>
                {hours === 20 ? '20+' : hours}시간
              </Text>
            </Press>
          );
        })}
      </View>
    </View>
  );
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

function MeetingGrid({
  value,
  onSet,
  onPaintChange,
}: {
  value: number[];
  onSet: (indexes: number[], selected: boolean) => void;
  onPaintChange?: (painting: boolean) => void;
}) {
  const selected = new Set(value);
  const [gridWidth, setGridWidth] = useState(0);
  const valueRef = useRef(value);
  const paintValueRef = useRef<boolean | null>(null);
  const lastIndexRef = useRef<number | null>(null);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const hitTest = (x: number, y: number) => {
    const columnWidth = (gridWidth - MEETING_LABEL_WIDTH - MEETING_GAP * 7) / 7;
    const column =
      x < MEETING_LABEL_WIDTH + MEETING_GAP
        ? -1
        : Math.floor((x - MEETING_LABEL_WIDTH - MEETING_GAP) / (columnWidth + MEETING_GAP));
    const row =
      y < MEETING_HEADER_HEIGHT + MEETING_GAP
        ? -1
        : Math.floor(
            (y - MEETING_HEADER_HEIGHT - MEETING_GAP) / (MEETING_ROW_HEIGHT + MEETING_GAP),
          );
    if (column > 6 || row > 2) return null;
    return { column, row };
  };

  const handlePaintStart = (event: GestureResponderEvent) => {
    const hit = hitTest(event.nativeEvent.locationX, event.nativeEvent.locationY);
    if (!hit) return;
    if (hit.row === -1 && hit.column >= 0) {
      const indexes = APPLY_TIMES.map((_, row) => row * APPLY_DAYS.length + hit.column);
      onSet(indexes, !indexes.every((index) => valueRef.current.includes(index)));
      return;
    }
    if (hit.column === -1 && hit.row >= 0) {
      const indexes = APPLY_DAYS.map((_, column) => hit.row * APPLY_DAYS.length + column);
      onSet(indexes, !indexes.every((index) => valueRef.current.includes(index)));
      return;
    }
    if (hit.column < 0 || hit.row < 0) return;

    const index = hit.row * APPLY_DAYS.length + hit.column;
    paintValueRef.current = !valueRef.current.includes(index);
    lastIndexRef.current = index;
    onPaintChange?.(true);
    onSet([index], paintValueRef.current);
  };

  const handlePaintMove = (event: GestureResponderEvent) => {
    if (paintValueRef.current === null) return;
    const hit = hitTest(event.nativeEvent.locationX, event.nativeEvent.locationY);
    if (!hit || hit.column < 0 || hit.row < 0) return;
    const index = hit.row * APPLY_DAYS.length + hit.column;
    if (index === lastIndexRef.current) return;
    lastIndexRef.current = index;
    onSet([index], paintValueRef.current);
  };

  const finishPainting = () => {
    if (paintValueRef.current !== null) onPaintChange?.(false);
    paintValueRef.current = null;
    lastIndexRef.current = null;
  };

  const shouldStartPainting = (event: GestureResponderEvent) => {
    const hit = hitTest(event.nativeEvent.locationX, event.nativeEvent.locationY);
    return Boolean(hit && hit.column >= 0 && hit.row >= 0);
  };

  const toggleGroup = (indexes: number[]) => {
    onSet(indexes, !indexes.every((index) => selected.has(index)));
  };

  return (
    <View>
      <View style={styles.meetingTitleRow}>
        <Text variant="label">회의 가능한 시간</Text>
        <Text variant="meta" color={value.length ? 'brand' : 'textMuted'}>
          {value.length ? `${value.length}칸 선택` : '선택 안 함'}
        </Text>
      </View>
      <Text variant="meta" color="textMuted" style={styles.meetingHelp}>
        가능한 시간을 눌러서 골라주세요
      </Text>

      <View
        onStartShouldSetResponder={shouldStartPainting}
        onMoveShouldSetResponder={shouldStartPainting}
        onResponderTerminationRequest={() => false}
        onResponderGrant={handlePaintStart}
        onResponderMove={handlePaintMove}
        onResponderRelease={finishPainting}
        onResponderTerminate={finishPainting}
        onLayout={(event) => setGridWidth(event.nativeEvent.layout.width)}
        style={styles.meetingGrid}
      >
        <View style={[styles.meetingRow, styles.meetingHeaderRow]}>
          <View style={styles.meetingLabel} />
          {APPLY_DAYS.map((day, index) => (
            <Press
              key={day}
              onPress={() =>
                toggleGroup(APPLY_TIMES.map((_, row) => row * APPLY_DAYS.length + index))
              }
              scaleOnPress={false}
              accessibilityRole="button"
              accessibilityLabel={`${day}요일 전체 선택`}
              touchSize={44}
              style={styles.meetingDayButton}
            >
              <Text
                variant="meta"
                style={[
                  styles.meetingDay,
                  index === 5 && { color: color.daySat },
                  index === 6 && { color: color.daySun },
                ]}
              >
                {day}
              </Text>
            </Press>
          ))}
        </View>
        {APPLY_TIMES.map((time, row) => (
          <View key={time} style={styles.meetingRow}>
            <Press
              onPress={() =>
                toggleGroup(APPLY_DAYS.map((_, column) => row * APPLY_DAYS.length + column))
              }
              scaleOnPress={false}
              accessibilityRole="button"
              accessibilityLabel={`${time} 전체 선택`}
              touchSize={44}
              style={styles.meetingLabel}
            >
              <View style={[styles.meetingTimeIcon, { backgroundColor: timeIconBackground(row) }]}>
                <MeetingTimeIcon row={row} />
              </View>
              <Text variant="meta">{time}</Text>
            </Press>
            {APPLY_DAYS.map((day, column) => {
              const index = row * APPLY_DAYS.length + column;
              const checked = selected.has(index);
              return (
                <MeetingCell
                  key={day}
                  checked={checked}
                  column={column}
                  onPress={() => onSet([index], !checked)}
                  label={`${day}요일 ${time}`}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

function MeetingCell({
  checked,
  column,
  label,
  onPress,
}: {
  checked: boolean;
  column: number;
  label: string;
  onPress: () => void;
}) {
  const { reduced } = useMotion();
  const [progress] = useState(() => new Animated.Value(checked ? 1 : 0));

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: checked ? 1 : 0,
      duration: reduced ? 0 : 120,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [checked, progress, reduced]);

  return (
    <Animated.View
      style={[
        styles.meetingCellWrap,
        {
          transform: [
            {
              scale: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.94, 1],
              }),
            },
          ],
        },
      ]}
    >
      <Press
        onPress={onPress}
        scaleOnPress={false}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        accessibilityLabel={label}
        style={[
          styles.meetingCell,
          {
            backgroundColor: checked
              ? color.brand
              : column === 6
                ? color.dangerTint
                : column === 5
                  ? color.brandSoft
                  : color.surfaceMuted,
          },
          checked && styles.meetingCellSelected,
        ]}
      />
    </Animated.View>
  );
}

function timeIconBackground(row: number) {
  if (row === 0) return color.roleMktTint;
  if (row === 1) return color.roleDesignTint;
  return color.brandTint;
}

function MeetingTimeIcon({ row }: { row: number }) {
  if (row === 0) {
    return (
      <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
        <Path
          d="M4 18h16M7.5 18a4.5 4.5 0 0 1 9 0M12 6v3M5.6 9.6l1.8 1.8M18.4 9.6l-1.8 1.8"
          stroke={color.roleMktText}
          strokeWidth={2.4}
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (row === 1) {
    return (
      <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
        <Circle cx={12} cy={12} r={4} stroke={color.roleDesign} strokeWidth={2.4} />
        <Path
          d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"
          stroke={color.roleDesign}
          strokeWidth={2.4}
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  return (
    <Svg width={13} height={13} viewBox="0 0 24 24">
      <Path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill={color.brand} />
    </Svg>
  );
}

export function TeamApplyPreviewStep({
  api,
  questions,
  userName,
  sending,
  cardHidden,
  cardRef,
}: {
  api: TeamApplyDraftApi;
  questions: ApplyQuestion[];
  userName: string;
  sending: boolean;
  cardHidden: boolean;
  cardRef: React.Ref<ViewInstance>;
}) {
  const application: ApplicationCardData = {
    name: userName,
    position: api.slot?.label ?? '',
    field: api.slot ? ROLE_LABELS[api.slot.role] : '개발',
    hours: api.draft.hours,
    availableSlots: api.draft.availableSlots,
    answers: questions.map((question, index) => ({
      tag: `팀장 질문 ${index + 1}`,
      question: question.question,
      answer: api.draft.answers[question.id] ?? '',
    })),
  };

  return (
    <ScrollView
      scrollEnabled={!sending}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.previewContent}
    >
      <View>
        <Text variant="titleXl">이렇게 보낼게요</Text>
        <Text variant="body" color="textBody" style={styles.headingDescription}>
          팀장에게 보이는 지원서 모습이에요.
        </Text>
      </View>
      <PreviewFloatingCard paused={sending}>
        <FoldingCard
          folding={sending}
          hidden={cardHidden}
          cardRef={cardRef}
          containerStyle={styles.previewCardShadow}
          style={styles.previewCardClip}
        >
          <ApplicationCard
            application={application}
            floating={false}
            preview
            style={styles.previewCard}
          />
        </FoldingCard>
      </PreviewFloatingCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  stepContent: {
    paddingHorizontal: space[5],
    paddingTop: space[2.5],
    paddingBottom: space[7],
    gap: space[6],
  },
  headingDescription: { marginTop: space[2] },
  hero: {
    padding: space[5],
    overflow: 'hidden',
    borderRadius: radius['2xl'],
    backgroundColor: color.brand,
  },
  heroDecoration: { position: 'absolute', borderRadius: radius.full },
  heroDecorationLarge: {
    width: 130,
    height: 130,
    top: -30,
    right: -30,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroDecorationSmall: {
    width: 90,
    height: 90,
    right: 30,
    bottom: -50,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  heroTitleRow: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  flagBox: {
    width: 46,
    height: 46,
    overflow: 'hidden',
    borderRadius: radius.card,
    backgroundColor: color.surface,
  },
  flagPole: {
    position: 'absolute',
    left: 14,
    top: 9,
    width: 3,
    height: 29,
    borderRadius: radius.full,
    backgroundColor: color.ink,
  },
  flag: { position: 'absolute', left: 17, top: 10 },
  heroCopy: { flex: 1, minWidth: 0, gap: space[0.5] },
  heroChips: { marginTop: space[4], flexDirection: 'row', flexWrap: 'wrap', gap: space[1.5] },
  heroChip: {
    paddingVertical: space[1],
    paddingHorizontal: space[2.5],
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  slotList: { gap: space[3] },
  openSlot: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    borderWidth: 1.5,
    borderColor: color.lineSoft,
    borderRadius: radius.xl,
    backgroundColor: color.surface,
  },
  slotCopy: { flex: 1, minWidth: 0, gap: space[0.5] },
  radio: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: radius.full,
  },
  filledSection: { marginTop: -space[1.5], gap: space[2] },
  filledSlot: {
    paddingVertical: space[2.5],
    paddingHorizontal: space[3.5],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    borderRadius: radius.xl,
    backgroundColor: color.surfaceMuted,
  },
  filledAvatar: {
    width: 34,
    height: 34,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderRadius: radius.lg,
    opacity: 0.75,
  },
  filledPersonHead: { width: 12, height: 12, borderRadius: radius.full },
  filledPersonBody: {
    width: 22,
    height: 10,
    marginTop: space[0.5],
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  filledRole: { flex: 1, minWidth: 0 },
  answerHeadingRow: {
    marginTop: space[3],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[2],
  },
  questionList: { gap: space[2.5] },
  questionCard: {
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: color.lineSoft,
    borderRadius: radius.xl,
    backgroundColor: color.surfaceSubtle,
  },
  questionCardOpen: { borderColor: color.line, backgroundColor: color.surface },
  questionCardFocused: { borderColor: color.brand },
  questionHeader: {
    minHeight: 60,
    paddingVertical: space[3.5],
    paddingHorizontal: space[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  questionNumber: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
  },
  questionCopy: { flex: 1, minWidth: 0, gap: space[0.5] },
  answerInputWrap: { paddingLeft: 54, paddingRight: space[4], paddingBottom: space[2.5] },
  answerInput: {
    height: 110,
    padding: 0,
    color: color.ink,
    fontSize: 14,
    lineHeight: 22,
  },
  answerCount: { textAlign: 'right' },
  hoursCard: {
    padding: space[4],
    borderWidth: 1.5,
    borderColor: color.line,
    borderRadius: radius['2xl'],
    backgroundColor: color.surface,
  },
  gauge: { width: GAUGE.width, height: GAUGE.height, marginTop: space[3.5], alignSelf: 'center' },
  gaugeValue: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 78,
    alignItems: 'center',
  },
  gaugeKnob: {
    position: 'absolute',
    left: GAUGE.centerX - GAUGE.radius - 12,
    top: GAUGE.centerY - 12,
    width: 24,
    height: 24,
    borderWidth: 4,
    borderColor: color.brand,
    borderRadius: radius.full,
    backgroundColor: color.surface,
    shadowColor: color.brand,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  gaugeKnobDragging: {
    left: GAUGE.centerX - GAUGE.radius - 15,
    top: GAUGE.centerY - 15,
    width: 30,
    height: 30,
  },
  recommendation: {
    marginTop: space[1.5],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[1.5],
  },
  recommendationMark: {
    width: 14,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: color.highlight,
  },
  hourOptions: {
    marginTop: space[3.5],
    padding: space[1],
    flexDirection: 'row',
    gap: space[1],
    borderRadius: radius.card,
    backgroundColor: color.surfaceMuted,
  },
  hourOption: {
    flex: 1,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
  },
  hourOptionSelected: { backgroundColor: color.surface, ...shadowCompat.control },
  optionalDivider: { flexDirection: 'row', alignItems: 'center', gap: space[2.5] },
  optionalLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: color.lineSoft },
  meetingTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  meetingHelp: { marginTop: space[1] },
  meetingGrid: { marginTop: space[3], gap: MEETING_GAP },
  meetingRow: {
    height: MEETING_ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: MEETING_GAP,
  },
  meetingHeaderRow: { height: MEETING_HEADER_HEIGHT },
  meetingLabel: {
    width: MEETING_LABEL_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
  },
  meetingTimeIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
  meetingDayButton: {
    flex: 1,
    height: MEETING_HEADER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meetingDay: { textAlign: 'center' },
  meetingCellWrap: {
    flex: 1,
    height: MEETING_ROW_HEIGHT,
  },
  meetingCell: { flex: 1, borderRadius: radius.md },
  meetingCellSelected: {
    shadowColor: color.brand,
    shadowOpacity: 0.28,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  previewContent: {
    paddingHorizontal: space[5],
    paddingTop: space[2.5],
    paddingBottom: space[7],
  },
  previewCardShadow: {
    marginTop: space[5],
    borderRadius: radius.lg,
    backgroundColor: color.surface,
    ...shadowCompat.raised,
  },
  previewCardClip: { borderRadius: radius.lg },
  previewCard: { marginTop: 0 },
});
