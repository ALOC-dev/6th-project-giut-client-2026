import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlassView, isGlassEffectAPIAvailable } from 'expo-glass-effect';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  TextInput,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SearchIcon } from '@/components/icons';
import { Text } from '@/components/ui';
import { color, shadow } from '@/theme';

import { HubFilterButton } from './filter/HubFilterButton';
import { HubFilterSheet } from './filter/HubFilterSheet';
import { styles } from './HubScreen.styles';
import { HubEmpty } from './HubEmpty';
import { HubLoading } from './HubLoading';
import { CardEnter, PersonCard } from './PersonCard';
import { PullIndicator, PullRefreshGuide, usePullToRefresh } from './PullToRefresh';
import { MOCK_DEPARTMENT_NAMES } from './mocks';
import {
  EMPTY_HUB_FILTER,
  countHubFilters,
  matchesHubFilter,
  type HubFilter,
  type Person,
} from './types';

type HubScreenProps = {
  people: Person[];
  loading?: boolean;
  onPressPerson?: (person: Person) => void;
  onRefresh?: () => void;
  onRegisterProfile?: () => void;
};

const PULL_GUIDE_STORAGE_KEY = '@giut/hub/pull-refresh-guide:v2';

export function HubScreen({
  people,
  loading = false,
  onPressPerson,
  onRefresh,
  onRegisterProfile,
}: HubScreenProps) {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<HubFilter>(EMPTY_HUB_FILTER);
  const [filterVisible, setFilterVisible] = useState(false);
  const [compactHeader, setCompactHeader] = useState(false);
  const [cardGeneration, setCardGeneration] = useState(0);
  const [showPullGuide, setShowPullGuide] = useState(false);
  const refreshStartedWithCards = useRef(false);
  const dismissPullGuide = useCallback(() => {
    setShowPullGuide(false);
    void AsyncStorage.setItem(PULL_GUIDE_STORAGE_KEY, 'true').catch(() => undefined);
  }, []);
  const handlePullRefreshStart = useCallback(() => {
    if (showPullGuide) dismissPullGuide();
  }, [dismissPullGuide, showPullGuide]);
  const {
    panHandlers,
    onScroll: handlePullScroll,
    done: finishRefresh,
    indicator: pullIndicator,
  } = usePullToRefresh({ onRefresh, onRefreshStart: handlePullRefreshStart });

  const filteredPeople = useMemo(
    () => people.filter((person) => matchesHubFilter(person, filter)),
    [filter, people],
  );
  const filterCount = countHubFilters(filter);
  const refreshAvailable = Boolean(onRefresh);
  const replayCards = useCallback(() => {
    setCardGeneration((current) => current + 1);
  }, []);
  useEffect(() => {
    if (!refreshAvailable) return;

    let active = true;

    AsyncStorage.getItem(PULL_GUIDE_STORAGE_KEY)
      .then((seen) => {
        if (active && seen !== 'true') setShowPullGuide(true);
      })
      .catch(() => {
        if (active) setShowPullGuide(true);
      });

    return () => {
      active = false;
    };
  }, [refreshAvailable]);

  useEffect(() => {
    if (loading) {
      if (people.length > 0) refreshStartedWithCards.current = true;
      return;
    }

    const shouldReplayCards = refreshStartedWithCards.current;
    refreshStartedWithCards.current = false;
    finishRefresh(shouldReplayCards ? replayCards : undefined);
  }, [finishRefresh, loading, people.length, replayCards]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextCompact = event.nativeEvent.contentOffset.y > 24;

    if (nextCompact !== compactHeader) setCompactHeader(nextCompact);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.fill} {...panHandlers}>
        <FlatList
          data={filteredPeople}
          numColumns={2}
          keyExtractor={(person) => person.id}
          onScroll={(event) => {
            handleScroll(event);
            handlePullScroll(event);
          }}
          scrollEventThrottle={16}
          columnWrapperStyle={styles.column}
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + 126 },
            filteredPeople.length === 0 && styles.emptyContent,
          ]}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <>
              <PullIndicator {...pullIndicator} />
              {showPullGuide ? <PullRefreshGuide onDismiss={dismissPullGuide} /> : null}
            </>
          }
          renderItem={({ item, index }) => (
            <CardEnter index={index} generation={cardGeneration}>
              <PersonCard person={item} onPress={onPressPerson} />
            </CardEnter>
          )}
          ListEmptyComponent={
            loading ? (
              <HubLoading />
            ) : (
              <HubEmpty
                kind={filterCount > 0 || filter.query.trim().length > 0 ? 'filter' : 'none'}
                onRegister={onRegisterProfile}
              />
            )
          }
        />
      </View>

      <HubHeader
        compact={compactHeader}
        query={filter.query}
        onChangeQuery={(query) => setFilter((current) => ({ ...current, query }))}
        filterCount={filterCount}
        onOpenFilter={() => setFilterVisible(true)}
        topInset={insets.top}
      />

      <HubFilterSheet
        visible={filterVisible}
        value={filter}
        departments={MOCK_DEPARTMENT_NAMES}
        onClose={() => setFilterVisible(false)}
        onApply={setFilter}
      />
    </View>
  );
}

type HubHeaderProps = {
  compact: boolean;
  query: string;
  onChangeQuery: (query: string) => void;
  filterCount: number;
  onOpenFilter: () => void;
  topInset: number;
};

function HubHeader({
  compact,
  query,
  onChangeQuery,
  filterCount,
  onOpenFilter,
  topInset,
}: HubHeaderProps) {
  const supportsLiquidGlass = Platform.OS === 'ios' && isGlassEffectAPIAvailable();

  return (
    <View style={[styles.header, { paddingTop: topInset }]}>
      {!compact ? (
        <View style={styles.titleRow}>
          <Text variant="displayNumber" color="brand">
            기웃허브
          </Text>
          <Image
            source={require('../../../assets/images/giut-symbol.png')}
            resizeMode="contain"
            accessible={false}
            style={styles.titleIcon}
          />
        </View>
      ) : null}

      <View style={styles.controls}>
        <View style={[styles.search, shadow.card]}>
          {supportsLiquidGlass ? (
            <GlassView
              colorScheme="light"
              glassEffectStyle="regular"
              tintColor={color.surfaceGlassTint}
              pointerEvents="none"
              style={styles.searchGlass}
            />
          ) : (
            <View pointerEvents="none" style={[styles.searchGlass, styles.searchFallback]} />
          )}
          <View pointerEvents="none" style={styles.searchHighlight} />
          <View style={styles.searchContent}>
            <SearchIcon />
            <TextInput
              value={query}
              onChangeText={onChangeQuery}
              placeholder="이름, 학과, 관심사로 찾기"
              placeholderTextColor={color.textFaint}
              accessibilityLabel="기웃허브 사람 검색"
              returnKeyType="search"
              style={styles.searchInput}
            />
          </View>
        </View>

        <HubFilterButton count={filterCount} onPress={onOpenFilter} />
      </View>
    </View>
  );
}
