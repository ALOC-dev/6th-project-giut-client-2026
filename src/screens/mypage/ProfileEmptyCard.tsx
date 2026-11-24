import { StyleSheet, View } from 'react-native';

import { Button, Card, Text } from '@/components/ui';
import { color, space } from '@/theme';

type ProfileEmptyCardProps = {
  onPressCreate: () => void;
};

export function ProfileEmptyCard({ onPressCreate }: ProfileEmptyCardProps) {
  return (
    <Card corner="2xl" elevation="raised" padding={space[5]} bordered style={S.card}>
      <View style={S.texts}>
        <Text variant="titleMd">아직 프로필이 없어요</Text>
        <Text color="textMuted">프로필을 만들고 나를 소개해 보세요</Text>
      </View>
      <Button label="프로필 만들기" onPress={onPressCreate} />
    </Card>
  );
}

const S = StyleSheet.create({
  card: {
    gap: space[5],
    borderColor: color.lineSoft,
  },
  texts: {
    alignItems: 'center',
    gap: space[1],
    paddingTop: space[3],
  },
});
