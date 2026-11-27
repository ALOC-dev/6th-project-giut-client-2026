import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DetailHeader } from '@/components/header/DetailHeader';
import { Text } from '@/components/ui';
import { color } from '@/theme';

type UserProfileScreenProps = {
  name: string;
  onPressMore: () => void;
};

// TODO: 프로필 카드, 포트폴리오, 활동 이력 구역 추가
export function UserProfileScreen({ name, onPressMore }: UserProfileScreenProps) {
  // TODO: API 연결 전까지 화면 안에서만 추천 상태를 기억해요
  const [recommended, setRecommended] = useState(false);

  return (
    <View style={S.screen}>
      <DetailHeader
        background="surface"
        recommended={recommended}
        onPressRecommend={() => setRecommended((prev) => !prev)}
        onPressMore={onPressMore}
      />
      <View style={S.center}>
        <Text variant="titleLg">{name}</Text>
      </View>
    </View>
  );
}

export function UserProfileNotFoundScreen() {
  return (
    <View style={S.screen}>
      <DetailHeader background="surface" />
      <View style={S.center}>
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
