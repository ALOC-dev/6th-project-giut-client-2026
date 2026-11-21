import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  Animated as RNAnimated,
  Easing as RNEasing,
  ScrollView,
  View,
  type ListRenderItemInfo,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ContestCard } from '@/components/contests/ContestCard';
import { CheckIcon, ChevronIcon, PlusIcon } from '@/components/icons';
import { AppHeader, BottomSheet, Press, Text } from '../../components/ui';
import { color, space, useMotion } from '../../theme';
import {
  ACTIVITY_LABEL,
  ACTIVITY_TABS,
  EMPTY_FILTER,
  countFilters,
  daysUntil,
  overlaps,
  type Contest,
  type ContestFilter,
} from './contest';
import { ContestFilterButton, ContestFilterSheet } from './ContestFilter';
import { emptyStyles, screenStyles } from './ContestListScreen.styles';

const SORTS = [
  { key: 'deadline', label: '마감 임박 순' },
  { key: 'recent', label: '최근 등록 순' },
  { key: 'views', label: '조회수 순' },
  { key: 'scraps', label: '스크랩 순' },
] as const;
type SortKey = (typeof SORTS)[number]['key'];

const EMPTY_PATH_X = [0, -34, -20, 4, 0];
const EMPTY_PATH_Y = [0, 8, 34, 22, 0];
const NOOP_CONTEST = (_contest: Contest) => undefined;

function ContestSeparator() {
  return <View style={screenStyles.sepLine} />;
}

function EmptyContests({ title }: { title: string }) {
  const { reduced } = useMotion(); // 동작 줄이기 설정 시 애니메이션 중지
  const [progress] = useState(() => new RNAnimated.Value(0));

  useEffect(() => {
    if (reduced) {
      progress.stopAnimation();
      progress.setValue(0);
      return;
    }

    const loop = RNAnimated.loop(
      RNAnimated.timing(progress, {
        toValue: 1,
        duration: 3600,
        easing: RNEasing.inOut(RNEasing.ease),
        useNativeDriver: true,
      }),
    );
    loop.start();

    return () => loop.stop();
  }, [progress, reduced]);

  const inputRange = [0, 0.25, 0.5, 0.75, 1];
  const translateX = progress.interpolate({ inputRange, outputRange: EMPTY_PATH_X });
  const translateY = progress.interpolate({ inputRange, outputRange: EMPTY_PATH_Y });

  return (
    <View style={emptyStyles.wrap}>
      <View style={emptyStyles.art} accessible={false}>
        <View style={emptyStyles.cardBack} />
        <View style={emptyStyles.cardFront}>
          <View style={[emptyStyles.line, emptyStyles.lineTint]} />
          <View style={emptyStyles.line} />
          <View style={[emptyStyles.line, emptyStyles.lineShort]} />
          <View style={[emptyStyles.line, emptyStyles.lineLast]} />
        </View>

        <RNAnimated.View
          style={[emptyStyles.lens, { transform: [{ translateX }, { translateY }] }]}
        >
          <View style={emptyStyles.lensGlass}>
            <View style={emptyStyles.lensShine} />
          </View>
          <View style={emptyStyles.lensHandle} />
        </RNAnimated.View>
      </View>

      <Text variant="titleLg" style={emptyStyles.title}>
        {title}
      </Text>
    </View>
  );
}

export type ContestListScreenProps = {
  contests: Contest[];
  savedIds?: string[];
  onPressHome?: () => void;
  onToggleSave?: (c: Contest) => void;
  onPressContest?: (c: Contest) => void;
  onPressCreate?: () => void;
};

export function ContestListScreen({
  contests,
  savedIds = [],
  onPressHome,
  onToggleSave,
  onPressContest,
  onPressCreate,
}: ContestListScreenProps) {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<ContestFilter>(EMPTY_FILTER);
  const [sort, setSort] = useState<SortKey>('deadline');
  const [sheet, setSheet] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const saved = useMemo(() => new Set(savedIds), [savedIds]);

  const list = useMemo(() => {
    // 공모전 데이터나 필터, 정렬이 바뀔 때만 목록 계산
    const out = contests.filter((c) => {
      if (c.status === 'CLOSED' || daysUntil(c.deadline) < 0) return false;
      if (filter.activityType && c.activityType !== filter.activityType) return false;
      if (filter.categories.length && !filter.categories.includes(c.category)) return false;
      if (
        filter.from &&
        filter.to &&
        !overlaps(c.activityFrom, c.activityTo, filter.from, filter.to)
      )
        return false;
      return true;
    });
    const by: Record<SortKey, (a: Contest, b: Contest) => number> = {
      deadline: (a, b) => daysUntil(a.deadline) - daysUntil(b.deadline),
      recent: (a, b) => b.id.localeCompare(a.id),
      views: (a, b) => b.views - a.views,
      scraps: (a, b) => b.scraps - a.scraps,
    };
    return [...out].sort(by[sort]);
  }, [contests, filter, sort]);

  const reducedMotion = useReducedMotion();
  const fabProgress = useSharedValue(1);
  const lastY = useSharedValue(0);
  const mini = useSharedValue(false);
  const onScroll = useAnimatedScrollHandler((event) => {
    const y = event.contentOffset.y;
    const next =
      y > 12 && y > lastY.value ? true : y < lastY.value - 4 || y <= 12 ? false : mini.value;
    lastY.value = y;
    if (next !== mini.value) {
      mini.value = next;
      const target = next ? 0 : 1;
      fabProgress.value = reducedMotion
        ? target
        : withSpring(target, { damping: 18, stiffness: 220 });
    }
  });
  const fabAnimatedStyle = useAnimatedStyle(() => ({
    paddingHorizontal: fabProgress.value * 18,
  }));
  const fabLabelAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fabProgress.value,
    maxWidth: fabProgress.value * 90,
    marginLeft: fabProgress.value * 6,
  }));

  const filterCount = countFilters(filter);
  const sortLabel = SORTS.find((x) => x.key === sort)!.label;
  const renderContest = useCallback(
    ({ item, index }: ListRenderItemInfo<Contest>) => (
      <ContestCard
        contest={item}
        index={index}
        saved={saved.has(item.id)}
        onPress={onPressContest ?? NOOP_CONTEST}
        onToggleSave={onToggleSave ?? NOOP_CONTEST}
      />
    ),
    [onPressContest, onToggleSave, saved],
  );

  return (
    <View style={[screenStyles.screen, { paddingTop: insets.top }]}>
      <AppHeader
        onPressLogo={onPressHome}
        onPressNotification={() => undefined}
        onPressSearch={() => undefined}
        hasUnreadNotification
        style={screenStyles.header}
      />

      <View style={screenStyles.tabsWrap}>
        <ScrollView
          horizontal
          accessibilityRole="tablist"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={screenStyles.tabs}
        >
          {[null, ...ACTIVITY_TABS].map((t) => {
            const on = filter.activityType === t;
            return (
              <Pressable
                key={t ?? 'all'}
                hitSlop={{ left: 8, right: 8 }}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                style={[screenStyles.tab, on && screenStyles.tabOn]}
                onPress={() => setFilter((f) => ({ ...f, activityType: t }))}
              >
                <Text
                  variant="titleMd"
                  color={on ? 'ink' : 'textFaint'}
                  style={on ? undefined : screenStyles.tabOff}
                  numberOfLines={1}
                >
                  {t === null ? '전체' : ACTIVITY_LABEL[t]}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <Animated.FlatList
        data={list}
        keyExtractor={(c) => c.id}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={list.length === 0 ? screenStyles.emptyListContent : undefined}
        ListHeaderComponent={
          <View style={screenStyles.countRow}>
            <Text variant="body" color="textSecondary">
              총 <Text variant="bodyStrong">{list.length}</Text>건
            </Text>
            <View style={screenStyles.controls}>
              <Pressable
                onPress={() => setSortOpen(true)}
                accessibilityRole="button"
                accessibilityLabel={`정렬, ${sortLabel}`}
                style={screenStyles.control}
              >
                <Text variant="bodyStrong">{sortLabel}</Text>
                <ChevronIcon size={13} />
              </Pressable>
              <View style={screenStyles.sep} />
              <ContestFilterButton count={filterCount} onPress={() => setSheet(true)} />
            </View>
          </View>
        }
        ItemSeparatorComponent={ContestSeparator}
        renderItem={renderContest}
        ListEmptyComponent={
          <EmptyContests
            title={contests.length === 0 ? '아직 공모전이 없어요' : '해당 조건의 공고가 없어요'}
          />
        }
      />

      <Animated.View style={[screenStyles.fab, { bottom: space[2] }, fabAnimatedStyle]}>
        <Press
          onPress={onPressCreate}
          style={screenStyles.fabInner}
          accessibilityRole="button"
          accessibilityLabel="공모전 등록"
        >
          <PlusIcon />
          <Animated.View style={fabLabelAnimatedStyle}>
            <Text variant="label" color="surface" numberOfLines={1}>
              공모전 등록
            </Text>
          </Animated.View>
        </Press>
      </Animated.View>

      <ContestFilterSheet
        open={sheet}
        value={filter}
        onClose={() => setSheet(false)}
        onApply={(next) => setFilter(next)}
      />

      <BottomSheet
        visible={sortOpen}
        onClose={() => setSortOpen(false)}
        accessibilityLabel="정렬"
        contentStyle={screenStyles.sortContent}
      >
        <Text variant="titleLg">정렬</Text>
        <View style={screenStyles.sortOptions} accessibilityRole="radiogroup">
          {SORTS.map((option) => (
            <Pressable
              key={option.key}
              accessibilityRole="radio"
              accessibilityState={{ selected: sort === option.key }}
              onPress={() => {
                setSort(option.key);
                setSortOpen(false);
              }}
              style={screenStyles.sortRow}
            >
              <Text variant="label" color={sort === option.key ? 'brand' : 'ink'}>
                {option.label}
              </Text>
              {sort === option.key && <CheckIcon size={16} color={color.brand} />}
            </Pressable>
          ))}
        </View>
      </BottomSheet>
    </View>
  );
}
