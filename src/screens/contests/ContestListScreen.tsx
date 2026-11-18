import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Easing as RNEasing,
  FlatList,
  Modal,
  Pressable,
  Animated as RNAnimated,
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CheckIcon, ChevronIcon, PlusIcon } from '@/components/icons';
import { ContestCard } from '@/components/contests/ContestCard';
import { AppHeader, BottomNavigationHeightContext, Press, Text } from '../../components/ui';
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
import { color, radius, shadow, space, useMotion } from '../../theme';

const SORTS = [
  { key: 'deadline', label: '마감 임박 순' },
  { key: 'recent', label: '최근 등록 순' },
  { key: 'views', label: '조회수 순' },
  { key: 'scraps', label: '스크랩 순' },
] as const;
type SortKey = (typeof SORTS)[number]['key'];

const EMPTY_PATH_X = [0, -34, -20, 4, 0];
const EMPTY_PATH_Y = [0, 8, 34, 22, 0];

function EmptyContests({ title }: { title: string }) {
  const { reduced } = useMotion();
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
      <View style={emptyStyles.art} accessible accessibilityLabel="공모전을 찾는 중">
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
  /** 스크랩한 공모전 id */
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
  const bottomNavigationHeight = useContext(BottomNavigationHeightContext);
  const [filter, setFilter] = useState<ContestFilter>(EMPTY_FILTER);
  const [sort, setSort] = useState<SortKey>('deadline');
  const [sheet, setSheet] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const saved = useMemo(() => new Set(savedIds), [savedIds]);

  const list = useMemo(() => {
    const out = contests.filter((c) => {
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

  // FAB은 아래로 스크롤하면 글자를 접고 동그래진다.
  const [fabWidth] = useState(() => new RNAnimated.Value(1));
  const lastY = useRef(0);
  const mini = useRef(false);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const next =
      y > 12 && y > lastY.current ? true : y < lastY.current - 4 || y <= 12 ? false : mini.current;
    lastY.current = y;
    if (next !== mini.current) {
      mini.current = next;
      RNAnimated.spring(fabWidth, {
        toValue: next ? 0 : 1,
        useNativeDriver: false,
        damping: 18,
        stiffness: 220,
      }).start();
    }
  };

  const filterCount = countFilters(filter);
  const sortLabel = SORTS.find((x) => x.key === sort)!.label;

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
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={screenStyles.tabs}
        >
          {[null, ...ACTIVITY_TABS].map((t) => {
            const on = filter.activityType === t;
            return (
              <Pressable
                key={t ?? 'all'}
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

      <FlatList
        data={list}
        keyExtractor={(c) => c.id}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={[
          { paddingBottom: bottomNavigationHeight },
          list.length === 0 && screenStyles.emptyListContent,
        ]}
        ListHeaderComponent={
          <View style={screenStyles.countRow}>
            <Text variant="body" color="textSecondary">
              총 <Text variant="bodyStrong">{list.length}</Text>건
            </Text>
            <View style={screenStyles.controls}>
              <Pressable onPress={() => setSortOpen(true)} style={screenStyles.control}>
                <Text variant="bodyStrong">{sortLabel}</Text>
                <ChevronIcon size={13} />
              </Pressable>
              <View style={screenStyles.sep} />
              <ContestFilterButton count={filterCount} onPress={() => setSheet(true)} />
            </View>
          </View>
        }
        ItemSeparatorComponent={() => <View style={screenStyles.sepLine} />}
        renderItem={({ item, index }) => (
          <ContestCard
            contest={item}
            index={index}
            saved={saved.has(item.id)}
            onPress={(c) => onPressContest?.(c)}
            onToggleSave={(c) => onToggleSave?.(c)}
          />
        )}
        ListEmptyComponent={
          <EmptyContests
            title={contests.length === 0 ? '아직 공모전이 없어요' : '해당 조건의 공고가 없어요'}
          />
        }
      />

      <RNAnimated.View
        style={[
          screenStyles.fab,
          {
            bottom: bottomNavigationHeight + space[2],
            paddingHorizontal: fabWidth.interpolate({ inputRange: [0, 1], outputRange: [0, 18] }),
          },
        ]}
      >
        <Press
          onPress={onPressCreate}
          style={screenStyles.fabInner}
          accessibilityLabel="공모전 등록"
        >
          <PlusIcon />
          <RNAnimated.View
            style={{
              opacity: fabWidth,
              maxWidth: fabWidth.interpolate({ inputRange: [0, 1], outputRange: [0, 90] }),
              marginLeft: fabWidth.interpolate({ inputRange: [0, 1], outputRange: [0, 6] }),
            }}
          >
            <Text variant="label" color="surface" numberOfLines={1}>
              공모전 등록
            </Text>
          </RNAnimated.View>
        </Press>
      </RNAnimated.View>

      <ContestFilterSheet
        open={sheet}
        value={filter}
        onClose={() => setSheet(false)}
        onApply={(next) => setFilter(next)}
      />

      <Modal
        visible={sortOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSortOpen(false)}
      >
        <Pressable
          style={screenStyles.backdrop}
          onPress={() => setSortOpen(false)}
          accessibilityLabel="닫기"
        />
        <View style={[screenStyles.sortSheet, { paddingBottom: space[8] + insets.bottom }]}>
          <View style={screenStyles.handle} />
          <Text variant="titleMd" style={screenStyles.sortTitle}>
            정렬
          </Text>
          {SORTS.map((o) => (
            <Pressable
              key={o.key}
              onPress={() => {
                setSort(o.key);
                setSortOpen(false);
              }}
              style={screenStyles.sortRow}
            >
              <Text variant="label" color={sort === o.key ? 'brand' : 'ink'}>
                {o.label}
              </Text>
              {sort === o.key && <CheckIcon size={16} color={color.brand} />}
            </Pressable>
          ))}
        </View>
      </Modal>
    </View>
  );
}

const screenStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.surface },
  header: {
    borderBottomWidth: 0,
  },
  tabsWrap: {
    flexGrow: 0,
    borderBottomWidth: 1,
    borderBottomColor: color.lineSoft,
  },
  tabs: { paddingHorizontal: space[5], gap: space[5] },
  tab: {
    paddingTop: space[3],
    paddingBottom: space[3],
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -1,
  },
  tabOn: { borderBottomColor: color.ink },
  tabOff: { fontFamily: 'Pretendard-Medium' },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[5],
    paddingTop: space[4],
    paddingBottom: 0,
  },
  controls: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  control: { flexDirection: 'row', alignItems: 'center', gap: space[1], paddingVertical: space[1] },
  sep: { width: 1, height: space[3], backgroundColor: color.line },
  sepLine: { height: 1, backgroundColor: color.lineSoft, marginHorizontal: space[5] },
  emptyListContent: { flexGrow: 1 },
  fab: {
    position: 'absolute',
    right: space[5],
    height: 52,
    minWidth: 52,
    borderRadius: radius.full,
    backgroundColor: color.brand,
    justifyContent: 'center',
    ...shadow.brand,
  },
  fabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: color.overlayDim,
  },
  sortSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: color.surface,
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    paddingHorizontal: space[3],
    paddingTop: space[3],
  },
  handle: {
    width: 36,
    height: space[1],
    borderRadius: radius.full,
    backgroundColor: color.line,
    alignSelf: 'center',
  },
  sortTitle: { paddingHorizontal: space[2], paddingTop: space[3], paddingBottom: space[2] },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space[3],
    paddingHorizontal: space[3],
    borderRadius: radius.lg,
  },
});

const emptyStyles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space[8],
  },
  art: { width: 150, height: 120 },
  cardBack: {
    position: 'absolute',
    left: 28,
    top: 18,
    width: 96,
    height: 86,
    borderRadius: radius.lg,
    backgroundColor: color.surfaceSunken,
    transform: [{ rotate: '-7deg' }],
  },
  cardFront: {
    position: 'absolute',
    left: space[6],
    top: space[3],
    width: 100,
    height: 90,
    borderRadius: radius.lg,
    backgroundColor: color.surface,
    borderWidth: 1.5,
    borderColor: color.line,
    paddingVertical: space[4],
    paddingHorizontal: space[4],
    gap: space[2],
    ...shadow.card,
  },
  line: { width: '100%', height: 7, borderRadius: radius.full, backgroundColor: color.lineSoft },
  lineTint: { width: 34, backgroundColor: color.brandTint },
  lineShort: { width: '70%' },
  lineLast: { width: 28, height: 9, marginTop: 'auto', backgroundColor: color.brandTint },
  lens: { position: 'absolute', right: 10, top: 6, width: 46, height: 46 },
  lensGlass: {
    width: space[8],
    height: space[8],
    borderRadius: radius.xl,
    borderWidth: 2.4,
    borderColor: color.brand,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  lensShine: {
    position: 'absolute',
    left: 6,
    top: space[2],
    width: 10,
    height: 2.2,
    borderRadius: radius.full,
    backgroundColor: color.brand,
    transform: [{ rotate: '-35deg' }],
  },
  lensHandle: {
    position: 'absolute',
    left: 27,
    top: 28,
    width: 13,
    height: 3.4,
    borderRadius: radius.full,
    backgroundColor: color.brand,
    transform: [{ rotate: '45deg' }],
  },
  title: { marginTop: space[5], textAlign: 'center' },
});
