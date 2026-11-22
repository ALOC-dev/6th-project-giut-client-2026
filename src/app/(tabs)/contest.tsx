import { router, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { ContestListScreen } from '@/screens/contests/ContestListScreen';
import { ACTIVITY_TYPES, type ActivityType, type Contest } from '@/screens/contests/contest';
import { MOCK_CONTESTS } from '@/screens/contests/mocks';

const first = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value);

const toActivityType = (value?: string): ActivityType | null =>
  ACTIVITY_TYPES.find((type) => type === value) ?? null;

export default function ContestListRoute() {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // 홈에서 분야를 눌러 들어오면 그 분야 탭을 열어요 (activity: 'ALL'이면 전체)
  const params = useLocalSearchParams<{ activity?: string | string[]; key?: string | string[] }>();
  const requestKey = first(params.key);
  const requestActivity = first(params.activity);
  const activityRequest = useMemo(
    () =>
      requestKey ? { key: requestKey, activityType: toActivityType(requestActivity) } : undefined,
    [requestKey, requestActivity],
  );

  // 요청은 목록 화면이 그리는 즉시 적용되니, 적용 후에는 주소에서 지워요
  // (웹 새로고침·딥링크로 같은 필터가 다시 적용되지 않도록)
  useEffect(() => {
    if (requestKey) router.setParams({ activity: undefined, key: undefined });
  }, [requestKey]);

  const toggleBookmark = useCallback((contest: Contest) => {
    setBookmarkedIds((current) =>
      current.includes(contest.id)
        ? current.filter((id) => id !== contest.id)
        : [...current, contest.id],
    );
  }, []);

  const openHome = useCallback(() => router.navigate('/'), []);
  const openContest = useCallback(
    (contest: Contest) => router.push({ pathname: '/contest/[id]', params: { id: contest.id } }),
    [],
  );
  const openCreate = useCallback(
    () => Alert.alert('공모전 등록', '등록 화면은 다음 작업에서 연결할 예정이에요.'),
    [],
  );

  return (
    <ContestListScreen
      contests={MOCK_CONTESTS}
      activityRequest={activityRequest}
      savedIds={bookmarkedIds}
      onPressHome={openHome}
      onToggleSave={toggleBookmark}
      onPressContest={openContest}
      onPressCreate={openCreate}
    />
  );
}
