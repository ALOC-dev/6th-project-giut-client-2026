import { CaretDownIcon } from 'phosphor-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Press, Text } from '@/components/ui';
import { color, radius, space } from '@/theme';

import { ACTIVITY_STATUS_OPTIONS, type ActivityStatus } from './activityStatus';

type ActivityStatusFieldProps = {
  value: ActivityStatus;
  onChange: (status: ActivityStatus) => void;
};

// 지금 상태를 보여주고, 화살표를 누르면 세 가지 상태가 아래로 펼쳐져요
export function ActivityStatusField({ value, onChange }: ActivityStatusFieldProps) {
  const [expanded, setExpanded] = useState(false);

  const current =
    ACTIVITY_STATUS_OPTIONS.find((it) => it.key === value) ?? ACTIVITY_STATUS_OPTIONS[0];
  const others = ACTIVITY_STATUS_OPTIONS.filter((it) => it.key !== value);

  const handleSelect = (status: ActivityStatus) => {
    onChange(status);
    setExpanded(false);
  };

  return (
    <View style={S.box}>
      <Press
        onPress={() => setExpanded((prev) => !prev)}
        accessibilityRole="button"
        accessibilityLabel={`활동 상태, ${current.label}, ${current.description}`}
        accessibilityHint={expanded ? '목록을 닫아요' : '다른 상태를 골라요'}
        accessibilityState={{ expanded }}
        scaleOnPress={false}
        style={S.row}
      >
        <StatusTexts option={current} />
        <View style={[S.arrow, expanded && S.arrowExpanded]}>
          <CaretDownIcon size={18} color={color.textMuted} weight="bold" />
        </View>
      </Press>

      {expanded &&
        others.map((option) => (
          <Press
            key={option.key}
            onPress={() => handleSelect(option.key)}
            accessibilityRole="radio"
            accessibilityState={{ checked: false }}
            accessibilityLabel={`${option.label}, ${option.description}`}
            scaleOnPress={false}
            style={[S.row, S.divider]}
          >
            <StatusTexts option={option} />
            {/* 오른쪽 정렬을 맞추려고 화살표 자리만큼 비워요 */}
            <View style={S.arrow} />
          </Press>
        ))}
    </View>
  );
}

function StatusTexts({ option }: { option: (typeof ACTIVITY_STATUS_OPTIONS)[number] }) {
  return (
    <View style={S.texts}>
      <View style={S.titleRow}>
        <View style={[S.dot, { backgroundColor: option.dotColor }]} />
        <Text variant="label">{option.label}</Text>
      </View>
      <Text variant="caption" color="textMuted" style={S.description}>
        {option.description}
      </Text>
    </View>
  );
}

const DOT = 8;

const S = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.xl,
    borderCurve: 'continuous',
    backgroundColor: color.surface,
    overflow: 'hidden',
  },
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingVertical: space[3],
    paddingHorizontal: space[4],
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: color.lineSoft,
  },
  texts: {
    flex: 1,
    gap: space[0.5],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: radius.full,
  },
  // 점과 같은 줄에서 시작하도록 들여쓰기
  description: {
    marginLeft: DOT + space[2],
  },
  arrow: {
    width: 24,
    alignItems: 'center',
  },
  arrowExpanded: {
    transform: [{ rotate: '180deg' }],
  },
});
