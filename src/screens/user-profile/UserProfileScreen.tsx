import { StyleSheet, View } from 'react-native';

import { DetailHeader } from '@/components/header/DetailHeader';
import { Text } from '@/components/ui';
import { color } from '@/theme';

type UserProfileScreenProps = {
  name: string;
};

// TODO: 프로필 카드, 포트폴리오, 활동 이력 구역 추가
export function UserProfileScreen({ name }: UserProfileScreenProps) {
  return (
    <View style={S.screen}>
      <DetailHeader background="surface" />
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
