import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';

import { TeamCreateScreen } from '@/screens/team-create';

export default function TeamCreateRoute() {
  const params = useLocalSearchParams<{ contestId?: string | string[] }>();
  const contestId = Array.isArray(params.contestId) ? params.contestId[0] : params.contestId;

  return (
    <TeamCreateScreen
      onExit={() => router.back()}
      onSubmit={async () => ({
        // TODO: 팀 생성 API 연결 후 서버가 반환한 팀 공유 링크로 교체
        shareUrl: `https://giut.app/team/${contestId ?? 'preview'}`,
      })}
      onCopyLink={async (url) => {
        await Clipboard.setStringAsync(url);
      }}
      onDone={() => router.replace('/team')}
    />
  );
}
