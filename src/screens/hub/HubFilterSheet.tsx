import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { BottomSheet, Button, Text } from '@/components/ui';
import { color, radius, space, useMotion } from '@/theme';

import { ROLE_COLOR, STATUS_DESCRIPTION } from './constants';
import { EMPTY_HUB_FILTER, GRADES, ROLES, STATUSES, type HubFilter, type Status } from './types';

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
            onApply(draft);
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
                    <View style={[styles.roleAvatarHead, { backgroundColor: roleColor.main }]} />
                    <View style={[styles.roleAvatarBody, { backgroundColor: roleColor.main }]} />
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
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" accessible={false}>
              <Circle cx={11} cy={11} r={6.5} stroke={color.textMuted} strokeWidth={2} />
              <Path d="M16 16l4 4" stroke={color.textMuted} strokeWidth={2} strokeLinecap="round" />
            </Svg>
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

function CheckIcon({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none" accessible={false}>
      <Path
        d="M3.5 8.5l3 3 6-7"
        stroke={color.surface}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  sheet: {
    height: '84%',
  },
  sheetContent: {
    flex: 1,
    marginTop: space[2],
    borderTopWidth: 1,
    borderTopColor: color.lineSoft,
  },
  reset: {
    minWidth: 76,
    minHeight: 44,
    marginRight: -space[2],
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  body: {
    paddingTop: space[4],
    paddingBottom: space[2],
  },
  group: {
    gap: 10,
  },
  groupNext: {
    marginTop: 18,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: color.lineSoft,
  },
  roleTiles: {
    flexDirection: 'row',
    gap: 10,
  },
  roleTile: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    gap: 6,
  },
  roleFigure: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius['2xl'],
    borderWidth: 2.5,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  roleFigureSelected: {
    borderColor: color.brand,
  },
  roleCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: radius.full,
    backgroundColor: color.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleAvatarHead: {
    position: 'absolute',
    top: '20%',
    left: '31%',
    width: '38%',
    aspectRatio: 1,
    borderRadius: radius.full,
  },
  roleAvatarBody: {
    position: 'absolute',
    bottom: '-36%',
    left: '14%',
    width: '72%',
    aspectRatio: 1,
    borderRadius: radius.full,
  },
  gradeControl: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  gradeItem: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeItemBorder: {
    borderRightWidth: 1,
    borderRightColor: color.line,
  },
  gradeItemSelected: {
    backgroundColor: color.brand,
  },
  departmentSearch: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingHorizontal: space[4],
    borderRadius: radius.lg,
    backgroundColor: color.surfaceMuted,
  },
  departmentInput: {
    flex: 1,
    minWidth: 0,
    padding: 0,
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    color: color.ink,
  },
  departmentList: {
    maxHeight: 220,
    marginHorizontal: -6,
  },
  departmentRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingHorizontal: 6,
    borderRadius: radius.lg,
  },
  departmentLabel: {
    flex: 1,
    minWidth: 0,
    fontFamily: 'Pretendard-SemiBold',
  },
  squareCheck: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: color.textFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareCheckSelected: {
    borderColor: color.brand,
    backgroundColor: color.brand,
  },
  noResult: {
    paddingVertical: space[5],
    textAlign: 'center',
  },
  statusList: {
    gap: 10,
  },
  statusRow: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: space[3],
    paddingHorizontal: 14,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: color.line,
    backgroundColor: color.surface,
  },
  statusRowSelected: {
    borderColor: color.brand,
    backgroundColor: color.brandSoft,
  },
  statusFigure: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusRing: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: radius.full,
  },
  roundCheck: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: color.textFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundCheckSelected: {
    borderColor: color.brand,
    backgroundColor: color.brand,
  },
});
