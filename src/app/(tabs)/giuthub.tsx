import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import { HubScreen, MOCK_PEOPLE } from '@/screens/giuthub';

export default function GiutHubScreen() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(
    () => () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    },
    [],
  );

  const handleRefresh = () => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);

    setRefreshing(true);
    refreshTimer.current = setTimeout(() => {
      setRefreshing(false);
      refreshTimer.current = null;
    }, 1000);
  };

  return (
    <HubScreen
      people={initialLoading ? [] : MOCK_PEOPLE}
      loading={initialLoading || refreshing}
      onRefresh={initialLoading ? undefined : handleRefresh}
      onRegisterProfile={() => router.push('/my')}
    />
  );
}
