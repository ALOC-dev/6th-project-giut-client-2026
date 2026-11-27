import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { DetailHeader } from '@/components/header/DetailHeader';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { Text } from '@/components/ui';
import { color, space } from '@/theme';

import type { PublicProfileDetail } from './publicProfile';
import { UserProfileActions } from './UserProfileActions';

type UserProfileScreenProps = {
  detail: PublicProfileDetail;
  onPressMore: () => void;
  onPressPropose: () => void;
  onPressMessage: () => void;
};

// TODO: 포트폴리오, 활동 이력 구역 추가
export function UserProfileScreen({
  detail,
  onPressMore,
  onPressPropose,
  onPressMessage,
}: UserProfileScreenProps) {
  // TODO: API 연결 전까지 화면 안에서만 추천 상태를 기억해요
  const [recommended, setRecommended] = useState(detail.recommended);

  // 처음 받은 수에서 내 추천을 바꾼 만큼만 더하고 빼요
  const recommendationCount =
    detail.recommendationCount + Number(recommended) - Number(detail.recommended);

  return (
    <View style={S.screen}>
      <DetailHeader
        background="surface"
        recommended={recommended}
        onPressRecommend={() => setRecommended((prev) => !prev)}
        onPressMore={onPressMore}
      />

      <ScrollView contentContainerStyle={S.content}>
        <ProfileCard
          profile={detail.profile}
          recommendationCount={recommendationCount}
          collaborationCount={detail.collaborationCount}
          actions={
            <UserProfileActions onPressPropose={onPressPropose} onPressMessage={onPressMessage} />
          }
        />
      </ScrollView>
    </View>
  );
}

export function UserProfileNotFoundScreen() {
  return (
    <View style={S.screen}>
      <DetailHeader background="surface" />
      <View style={S.notFound}>
        <Text variant="titleLg">존재하지 않는 프로필이에요.</Text>
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.surface,
  },
  content: {
    paddingTop: space[2],
    paddingHorizontal: space[4],
    paddingBottom: space[8],
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
