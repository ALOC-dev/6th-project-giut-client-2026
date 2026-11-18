import { router } from 'expo-router';
import { Alert } from 'react-native';
import { useState } from 'react';

import { ContestListScreen } from '@/screens/contests/ContestListScreen';
import type { Contest } from '@/screens/contests/contest';
import { MOCK_CONTESTS } from '@/screens/contests/data';

export default function ContestListRoute() {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const toggleBookmark = (contest: Contest) => {
    setBookmarkedIds((current) =>
      current.includes(contest.id)
        ? current.filter((id) => id !== contest.id)
        : [...current, contest.id],
    );
  };

  return (
    <ContestListScreen
      contests={MOCK_CONTESTS}
      savedIds={bookmarkedIds}
      onToggleSave={toggleBookmark}
      onPressContest={(contest) =>
        router.push({ pathname: '/contest/[id]', params: { id: contest.id } })
      }
      onPressCreate={() =>
        Alert.alert('공모전 등록', '등록 화면은 다음 작업에서 연결할 예정이에요.')
      }
    />
  );
}
