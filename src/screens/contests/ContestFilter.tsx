import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AnimatedFilterIcon, CheckIcon } from '@/components/icons';
import { BottomSheet, Button, RangeCalendar, Text, Toast, useToast } from '@/components/ui';
import { color, radius, space } from '@/theme';

import { CATEGORY_LABEL, CATEGORY_OPTIONS, type Category, type ContestFilter } from './contest';

export type ContestFilterButtonProps = {
  count: number;
  onPress: () => void;
};

export function ContestFilterButton({ count, onPress }: ContestFilterButtonProps) {
  const [animationKey, setAnimationKey] = useState(0);
  const tone = count > 0 ? color.brand : color.ink;

  return (
    <Pressable
      onPress={() => {
        setAnimationKey((current) => current + 1);
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={count > 0 ? `필터, 조건 ${count}개` : '필터'}
      style={styles.filterButton}
    >
      <Text variant="bodyStrong" color={count > 0 ? 'brand' : 'ink'}>
        필터
      </Text>
      {count > 0 && (
        <View style={styles.badge}>
          <Text variant="micro" color="surface">
            {count}
          </Text>
        </View>
      )}
      <AnimatedFilterIcon color={tone} animationKey={animationKey} />
    </Pressable>
  );
}

export type ContestFilterSheetProps = {
  open: boolean;
  value: ContestFilter;
  onClose: () => void;
  onApply: (next: ContestFilter) => void;
};

export function ContestFilterSheet({ open, value, onClose, onApply }: ContestFilterSheetProps) {
  const [draft, setDraft] = useState(value);
  const toast = useToast();

  const toggleCategory = (category: Category) =>
    setDraft((current) => ({
      ...current,
      categories: current.categories.includes(category)
        ? current.categories.filter((item) => item !== category)
        : [...current.categories, category],
    }));

  const close = () => {
    setDraft(value);
    onClose();
  };

  const reset = () => {
    setDraft({ ...draft, categories: [], from: null, to: null });
    toast.show('필터가 초기화되었어요.');
  };

  return (
    <BottomSheet
      visible={open}
      onClose={close}
      accessibilityLabel="공모전 필터"
      sheetStyle={styles.sheet}
      contentStyle={styles.content}
      headerAction={
        <Pressable onPress={reset} style={styles.resetButton}>
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
            onClose();
          }}
          style={styles.applyButton}
        />
      }
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
        <View style={styles.sectionHeader}>
          <Text variant="titleLg">분야</Text>
          <View style={styles.sectionDivider} />
        </View>
        <View style={styles.categoryList}>
          {CATEGORY_OPTIONS.map((category) => {
            const isSelected = draft.categories.includes(category);
            return (
              <Pressable
                key={category}
                onPress={() => toggleCategory(category)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected }}
                style={styles.categoryRow}
              >
                <Text variant="label" color={isSelected ? 'brand' : 'textSecondary'}>
                  {CATEGORY_LABEL[category]}
                </Text>
                <View style={[styles.selection, isSelected && styles.selectionSelected]}>
                  {isSelected && <CheckIcon />}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.sectionHeader, styles.timeSectionHeader]}>
          <Text variant="titleLg">참여 가능한 기간</Text>
          <View style={styles.sectionDivider} />
        </View>
        <View style={styles.calendar}>
          <RangeCalendar
            from={draft.from}
            to={draft.to}
            onChange={({ from, to }) => setDraft((current) => ({ ...current, from, to }))}
          />
        </View>
      </ScrollView>
      <Toast {...toast.props} bottom={space[3]} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
    paddingVertical: space[1],
  },
  badge: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    backgroundColor: color.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    maxHeight: '84%',
  },
  content: { paddingHorizontal: space[5] },
  resetButton: { paddingVertical: space[1] },
  scrollBody: { gap: space[4], paddingBottom: space[2] },
  sectionHeader: { gap: space[1] },
  timeSectionHeader: { marginTop: space[2] },
  sectionDivider: { height: 1, backgroundColor: color.line },
  categoryList: { marginHorizontal: -space[2], marginTop: -6 },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: space[2],
    borderRadius: radius.lg,
  },
  selection: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionSelected: { backgroundColor: color.brand, borderColor: color.brand },
  calendar: { marginHorizontal: -space[2], marginTop: -6 },
  applyButton: { marginTop: space[2] },
});
