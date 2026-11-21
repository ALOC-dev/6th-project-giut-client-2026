import { router } from 'expo-router';
import { Fragment, useCallback, useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ContestCard } from '@/components/contests/ContestCard';
import { Press, Text } from '@/components/ui';
import type { Contest } from '@/screens/contests/contest';
import { color, space } from '@/theme';

type RecommendationSectionProps = {
  userName: string;
  contests: Contest[];
  style?: StyleProp<ViewStyle>;
};

export function RecommendationSection({ userName, contests, style }: RecommendationSectionProps) {
  // TODO: API 연결 전까지 화면 안에서만 저장 상태를 기억해요
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // ContestCard가 memo라서 함수를 useCallback으로 고정해요
  const openContest = useCallback(
    (contest: Contest) => router.push({ pathname: '/contest/[id]', params: { id: contest.id } }),
    [],
  );
  const toggleSave = useCallback((contest: Contest) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(contest.id)) next.delete(contest.id);
      else next.add(contest.id);
      return next;
    });
  }, []);

  return (
    <View style={[S.section, style]}>
      <View style={S.header}>
        <Text variant="titleLg">{userName}님을 위한 추천</Text>
        {/* TODO: 공모전 목록 연결 작업 때 관심 분야로 필터된 목록으로 이동 후 disabled 제거 */}
        <Press
          disabled
          touchSize={20}
          accessibilityRole="button"
          accessibilityLabel="추천 공모전 더보기"
          accessibilityState={{ disabled: true }}
        >
          <Text variant="caption" color="textMuted">
            더보기 ›
          </Text>
        </Press>
      </View>

      <View>
        {contests.map((contest, index) => (
          <Fragment key={contest.id}>
            {index > 0 && <View style={S.separator} />}
            <ContestCard
              contest={contest}
              index={index}
              saved={savedIds.has(contest.id)}
              onPress={openContest}
              onToggleSave={toggleSave}
            />
          </Fragment>
        ))}
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  section: {
    paddingTop: space[6],
    paddingBottom: space[4],
    gap: space[1],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: space[4],
  },
  separator: {
    height: 1,
    backgroundColor: color.lineSoft,
    marginHorizontal: space[5],
  },
});
