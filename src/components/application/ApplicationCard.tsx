import { StyleSheet, type StyleProp, type ViewStyle, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { PersonSilhouetteIcon } from '@/components/icons';
import { color, radius, role, space, useFloat } from '@/theme';

import { Text } from '@/components/ui';

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const SLOTS = ['오전', '오후', '저녁'];

const FIELD_TONE: Record<string, { base: string; tint: string; text: string }> = {
  개발: role.dev,
  디자인: role.design,
  기획: role.plan,
  마케팅: role.mkt,
};

export type ApplicationAnswer = {
  tag: string;
  question: string;
  answer: string;
};

export type ApplicationCardData = {
  name: string;
  position: string;
  field: string;
  hours: number;
  availableSlots: number[];
  answers: ApplicationAnswer[];
};

export type ApplicationCardProps = {
  application: ApplicationCardData;
  appliedAt?: string;
  floating?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ApplicationCard({
  application,
  appliedAt,
  floating = true,
  style,
}: ApplicationCardProps) {
  const tone = FIELD_TONE[application.field] ?? role.dev;
  const floatStyle = useFloat(floating, 400);
  const available = new Set(application.availableSlots);
  const availableTimeLabel = application.availableSlots
    .filter((slot) => Number.isInteger(slot) && slot >= 0 && slot < DAYS.length * SLOTS.length)
    .sort((a, b) => a - b)
    .map((slot) => `${DAYS[slot % DAYS.length]}요일 ${SLOTS[Math.floor(slot / DAYS.length)]}`)
    .join(', ');

  return (
    <Animated.View style={[styles.card, floatStyle, style]}>
      <View style={styles.head}>
        <View style={[styles.avatar, { backgroundColor: tone.tint }]}>
          <PersonSilhouetteIcon color={tone.base} style={styles.personIcon} />
        </View>
        <View style={styles.identity}>
          <View style={styles.nameRow}>
            <Text variant="titleMd">{application.name}</Text>
            {appliedAt ? (
              <Text variant="meta" color="textFaint">
                {appliedAt} 지원
              </Text>
            ) : null}
          </View>
          <View style={styles.positionRow}>
            <View style={[styles.positionDot, { backgroundColor: tone.base }]} />
            <Text variant="caption" color="textSecondary">
              <Text style={{ color: tone.text, fontWeight: '700' }}>{application.position}</Text>
              으로 지원했어요
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.hoursCard}>
          <Text variant="badge" color="textMuted" style={styles.statLabel}>
            참여 시간
          </Text>
          <HoursGauge hours={application.hours} />
          <Text variant="label" style={styles.hoursText}>
            주 {application.hours}시간
          </Text>
        </View>
        <View
          accessible
          accessibilityLabel={
            availableTimeLabel
              ? `회의 가능 시간, ${availableTimeLabel}`
              : '선택한 회의 가능 시간이 없어요'
          }
          style={styles.scheduleCard}
        >
          <Text variant="badge" color="textMuted" style={styles.statLabel}>
            회의 가능
          </Text>
          <View style={styles.scheduleGrid}>
            <View style={styles.scheduleRow}>
              <View style={styles.slotLabel} />
              {DAYS.map((day, index) => (
                <Text
                  key={day}
                  variant="micro"
                  style={[
                    styles.dayLabel,
                    index === 5 && { color: color.daySat },
                    index === 6 && { color: color.daySun },
                  ]}
                >
                  {day}
                </Text>
              ))}
            </View>
            {SLOTS.map((slot, row) => (
              <View key={slot} style={styles.scheduleRow}>
                <Text variant="micro" color="textMuted" style={styles.slotLabel}>
                  {slot}
                </Text>
                {DAYS.map((day, column) => (
                  <View
                    key={`${slot}-${day}`}
                    style={[
                      styles.scheduleCell,
                      {
                        backgroundColor: available.has(row * 7 + column) ? color.brand : color.line,
                      },
                    ]}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.answers}>
        {application.answers.map((answer) => (
          <View key={answer.tag} style={styles.answerCard}>
            <Text variant="micro" style={styles.answerTag}>
              {answer.tag}
            </Text>
            <Text variant="bodyStrong" style={styles.question}>
              {answer.question}
            </Text>
            <Text variant="body" color="textBody" style={styles.answerCopy}>
              {answer.answer}
            </Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

function HoursGauge({ hours }: { hours: number }) {
  const activeDash = (() => {
    const segments: string[] = [];

    for (let index = 0; index < 4; index += 1) {
      const filled = (Math.max(0, Math.min(5, hours - index * 5)) / 5) * 21.31;
      if (filled <= 0) break;
      segments.push(filled.toFixed(2), (21.31 - filled + 3).toFixed(2));
    }

    return `${segments.join(' ')} 0 200`;
  })();

  return (
    <View style={styles.gauge}>
      <Svg width={80} height={45} viewBox="0 0 80 45">
        <Path
          d="M10 40 A30 30 0 0 1 70 40"
          fill="none"
          stroke={color.line}
          strokeWidth={9}
          strokeDasharray="21.31 3"
        />
        <Path
          d="M10 40 A30 30 0 0 1 70 40"
          fill="none"
          stroke={color.brand}
          strokeWidth={9}
          strokeDasharray={activeDash}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: space[4],
    overflow: 'hidden',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.line,
    backgroundColor: color.surface,
  },
  head: {
    paddingTop: space[4.5],
    paddingHorizontal: space[4.5],
    paddingBottom: space[1],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  personIcon: { width: 40, height: 40, overflow: 'visible' },
  identity: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: space[2] },
  positionRow: { marginTop: space[1], flexDirection: 'row', alignItems: 'center' },
  positionDot: { width: 7, height: 7, marginRight: space[1.5], borderRadius: radius.full },
  stats: {
    paddingTop: space[3.5],
    paddingHorizontal: space[3.5],
    paddingBottom: space[1],
    flexDirection: 'row',
    gap: space[2],
  },
  hoursCard: {
    flex: 1,
    minWidth: 0,
    padding: space[3],
    alignItems: 'center',
    borderRadius: radius.lg,
    backgroundColor: color.surfaceSubtle,
  },
  scheduleCard: {
    flex: 1.6,
    minWidth: 0,
    padding: space[3],
    borderRadius: radius.lg,
    backgroundColor: color.surfaceSubtle,
  },
  statLabel: { alignSelf: 'flex-start' },
  gauge: { width: 80, height: 45, marginTop: space[2] },
  hoursText: { marginTop: space[1] },
  scheduleGrid: { marginTop: space[2], gap: 3 },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  slotLabel: { width: 24 },
  dayLabel: { flex: 1, textAlign: 'center' },
  scheduleCell: { flex: 1, height: 10, borderRadius: radius.xs },
  answers: {
    paddingTop: space[1.5],
    paddingHorizontal: space[4.5],
    paddingBottom: space[4.5],
  },
  answerCard: {
    marginTop: space[2],
    paddingVertical: space[3.5],
    paddingHorizontal: space[4],
    borderRadius: radius.lg,
    backgroundColor: color.brandSoft,
  },
  answerTag: {
    alignSelf: 'flex-start',
    paddingVertical: space[0.5],
    paddingHorizontal: space[1.5],
    overflow: 'hidden',
    borderRadius: radius.sm,
    color: color.surface,
    backgroundColor: color.brand,
  },
  question: { marginTop: space[2] },
  answerCopy: { marginTop: space[2] },
});
