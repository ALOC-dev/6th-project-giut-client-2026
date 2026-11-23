import { useState, type ReactNode } from 'react';
import { ScrollView, Share, StyleSheet, View } from 'react-native';

import { DetailHeader } from '@/components/header/DetailHeader';
import { Text } from '@/components/ui';
import { color, space } from '@/theme';

import { TeamActivitySection } from './TeamActivitySection';
import { TeamInfoSection } from './TeamInfoSection';
import { TeamIntroSection } from './TeamIntroSection';
import { TeamMemberSection } from './TeamMemberSection';
import { TeamTicket } from './TeamTicket';
import { isTeamClosed, type Team } from './team';

type TeamDetailScreenProps = {
  team: Team;
  contestTitle?: string;
  // 하단 버튼은 보는 사람(지원자, 팀장 등)에 따라 달라서 라우트에서 넣어줘요
  bottomBar?: ReactNode;
};

export function TeamDetailScreen({ team, contestTitle, bottomBar }: TeamDetailScreenProps) {
  // TODO: API 연결 전까지 화면 안에서만 저장 상태를 기억해요
  const [bookmarked, setBookmarked] = useState(false);

  const handleShare = () => {
    const message = [team.name, contestTitle].filter(Boolean).join('\n');
    Share.share({ message }).catch(() => {});
  };

  return (
    <View style={S.screen}>
      <DetailHeader
        bookmarked={bookmarked}
        onPressBookmark={() => setBookmarked((prev) => !prev)}
        onPressShare={handleShare}
      />

      <ScrollView contentContainerStyle={S.content}>
        <TeamTicket closed={isTeamClosed(team)}>
          <TeamInfoSection team={team} contestTitle={contestTitle} />
          <TeamMemberSection team={team} />
          <TeamIntroSection description={team.description} />
          <TeamActivitySection team={team} />
        </TeamTicket>
      </ScrollView>

      {bottomBar}
    </View>
  );
}

export function TeamNotFoundScreen() {
  return (
    <View style={S.screen}>
      <DetailHeader />
      <View style={S.notFound}>
        <Text variant="titleLg">존재하지 않는 팀이에요.</Text>
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.surfaceSunken,
  },
  content: {
    paddingTop: space[2],
    paddingBottom: space[8],
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
