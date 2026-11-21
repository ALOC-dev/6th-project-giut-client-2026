import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Animated, Easing, Pressable, ScrollView, TextInput, View } from 'react-native';

import { CheckIcon, PersonSilhouetteIcon, SearchIcon } from '@/components/icons';
import { BottomSheet, Button, Text } from '@/components/ui';
import { color, space, useMotion } from '@/theme';

import { styles } from './HubFilterSheet.styles';

import {
  EMPTY_HUB_FILTER,
  GRADES,
  ROLES,
  ROLE_COLOR,
  STATUSES,
  type HubFilter,
  type Status,
} from '../types';

const STATUS_DESCRIPTION: Record<Status, string> = {
  '팀 찾는 중': '지금 함께할 팀을 찾고 있어요',
  '둘러보는 중': '좋은 제안이 오면 생각해볼게요',
  '팀 있음': '이미 팀에 속해 있어요',
};

const STATUS_TONE: Record<Status, { dot: string; tint: string }> = {
  '팀 찾는 중': { dot: color.rolePlan, tint: color.rolePlanTint },
  '둘러보는 중': { dot: color.roleMkt, tint: color.roleMktTint },
  '팀 있음': { dot: color.textDisabled, tint: color.surfaceMuted },
};

const PULSING_STATUS: Record<Status, boolean> = {
  '팀 찾는 중': true,
  '둘러보는 중': true,
  '팀 있음': false,
};

type HubFilterSheetProps = {
  visible: boolean;
  value: HubFilter;
  departments: string[];
  onClose: () => void;
  onApply: (value: HubFilter) => void;
};

function toggleValue<T>(values: T[], value: T) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function HubFilterSheet({
  visible,
  value,
  departments,
  onClose,
  onApply,
}: HubFilterSheetProps) {
  const [draft, setDraft] = useState(value);
  const [departmentQuery, setDepartmentQuery] = useState('');

  const handleDismiss = () => {
    setDraft(value);
    setDepartmentQuery('');
    onClose();
  };

  const filteredDepartments = useMemo(() => {
    const query = departmentQuery.trim().toLocaleLowerCase('ko');

    if (!query) return departments;

    return departments.filter((department) => department.toLocaleLowerCase('ko').includes(query));
  }, [departmentQuery, departments]);

  const reset = () => {
    setDepartmentQuery('');
    setDraft((current) => ({ ...EMPTY_HUB_FILTER, query: current.query }));
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={handleDismiss}
      title="필터"
      titleVariant="titleLg"
      accessibilityLabel="기웃허브 필터"
      sheetStyle={styles.sheet}
      contentStyle={styles.sheetContent}
      headerAction={
        <Pressable
          onPress={reset}
          accessibilityRole="button"
          accessibilityLabel="필터 전체 초기화"
          accessibilityHint="선택한 모든 필터 조건을 해제합니다"
          hitSlop={space[2]}
          style={styles.reset}
        >
          <Text variant="caption" color="textMuted">
            전체 초기화
          </Text>
        </Pressable>
      }
      footer={
        <Button
          label="적용하기"
          onPress={() => {
            onApply({ ...draft, query: value.query });
            setDepartmentQuery('');
            onClose();
          }}
        />
      }
    >
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.body}
      >
        <FilterGroup title="포지션" first>
          <View style={styles.roleTiles}>
            {ROLES.map((role) => {
              const selected = draft.roles.includes(role);
              const roleColor = ROLE_COLOR[role];

              return (
                <Pressable
                  key={role}
                  onPress={() =>
                    setDraft((current) => ({
                      ...current,
                      roles: toggleValue(current.roles, role),
                    }))
                  }
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected }}
                  style={styles.roleTile}
                >
                  <View
                    style={[
                      styles.roleFigure,
                      { backgroundColor: roleColor.tint },
                      selected && styles.roleFigureSelected,
                    ]}
                  >
                    <PersonSilhouetteIcon color={roleColor.main} style={styles.roleAvatar} />
                    {selected ? (
                      <View style={styles.roleCheck}>
                        <CheckIcon size={11} />
                      </View>
                    ) : null}
                  </View>
                  <Text variant="label" color={selected ? 'brand' : 'ink'}>
                    {role}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </FilterGroup>

        <FilterGroup title="학년">
          <View style={styles.gradeControl}>
            {GRADES.map((grade, index) => {
              const selected = draft.grades.includes(grade);

              return (
                <Pressable
                  key={grade}
                  onPress={() =>
                    setDraft((current) => ({
                      ...current,
                      grades: toggleValue(current.grades, grade),
                    }))
                  }
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected }}
                  style={[
                    styles.gradeItem,
                    index < GRADES.length - 1 && styles.gradeItemBorder,
                    selected && styles.gradeItemSelected,
                  ]}
                >
                  <Text variant="body" color={selected ? 'surface' : 'ink'}>
                    {grade}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </FilterGroup>

        <FilterGroup title="학과">
          <View style={styles.departmentSearch}>
            <SearchIcon />
            <TextInput
              value={departmentQuery}
              onChangeText={setDepartmentQuery}
              placeholder="학과 이름으로 검색"
              placeholderTextColor={color.textFaint}
              accessibilityLabel="학과 검색"
              style={styles.departmentInput}
            />
          </View>

          <ScrollView
            style={styles.departmentList}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
          >
            {filteredDepartments.map((department) => {
              const selected = draft.depts.includes(department);

              return (
                <Pressable
                  key={department}
                  onPress={() =>
                    setDraft((current) => ({
                      ...current,
                      depts: toggleValue(current.depts, department),
                    }))
                  }
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected }}
                  style={styles.departmentRow}
                >
                  <View style={[styles.squareCheck, selected && styles.squareCheckSelected]}>
                    {selected ? <CheckIcon size={12} /> : null}
                  </View>
                  <Text variant="label" style={styles.departmentLabel}>
                    {department}
                  </Text>
                </Pressable>
              );
            })}
            {filteredDepartments.length === 0 ? (
              <Text variant="body" color="textMuted" style={styles.noResult}>
                검색 결과가 없어요
              </Text>
            ) : null}
          </ScrollView>
        </FilterGroup>

        <FilterGroup title="현재 상태">
          <View style={styles.statusList}>
            {STATUSES.map((status) => {
              const selected = draft.statuses.includes(status);
              const tone = STATUS_TONE[status];

              return (
                <Pressable
                  key={status}
                  onPress={() =>
                    setDraft((current) => ({
                      ...current,
                      statuses: toggleValue(current.statuses, status),
                    }))
                  }
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected }}
                  style={[styles.statusRow, selected && styles.statusRowSelected]}
                >
                  <View style={[styles.statusFigure, { backgroundColor: tone.tint }]}>
                    <StatusDot tone={tone.dot} pulsing={PULSING_STATUS[status]} />
                  </View>
                  <View style={styles.statusText}>
                    <Text variant="label">{status}</Text>
                    <Text variant="caption" color="textSecondary">
                      {STATUS_DESCRIPTION[status]}
                    </Text>
                  </View>
                  <View style={[styles.roundCheck, selected && styles.roundCheckSelected]}>
                    {selected ? <CheckIcon size={12} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </FilterGroup>
      </ScrollView>
    </BottomSheet>
  );
}

function FilterGroup({
  title,
  first = false,
  children,
}: {
  title: string;
  first?: boolean;
  children: ReactNode;
}) {
  return (
    <View style={[styles.group, !first && styles.groupNext]}>
      <Text variant="titleSm" color="ink">
        {title}
      </Text>
      {children}
    </View>
  );
}

function StatusDot({ tone, pulsing }: { tone: string; pulsing: boolean }) {
  const { reduced } = useMotion();
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!pulsing || reduced) {
      progress.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1800,
        easing: Easing.bezier(0, 0, 0.58, 1),
        useNativeDriver: true,
      }),
    );

    loop.start();
    return () => loop.stop();
  }, [progress, pulsing, reduced]);

  return (
    <View style={[styles.statusDot, { backgroundColor: tone }]}>
      {pulsing && !reduced ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.statusRing,
            {
              backgroundColor: tone,
              opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] }),
              transform: [
                {
                  scale: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 2.6] }),
                },
              ],
            },
          ]}
        />
      ) : null}
    </View>
  );
}
