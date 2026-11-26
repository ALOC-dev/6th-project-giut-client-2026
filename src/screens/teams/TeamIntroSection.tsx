import { StyleSheet, View } from 'react-native';

import { ExpandableText, Text } from '@/components/ui';
import { space } from '@/theme';

const MAX_LINES = 5;

type TeamIntroSectionProps = {
  description: string;
};

export function TeamIntroSection({ description }: TeamIntroSectionProps) {
  return (
    <View style={S.wrap}>
      <Text variant="titleMd">팀 소개</Text>
      <ExpandableText maxLines={MAX_LINES} label="팀 소개" style={S.text}>
        {description}
      </ExpandableText>
    </View>
  );
}

const S = StyleSheet.create({
  wrap: {
    padding: space[5],
    gap: space[3],
  },
  text: {
    gap: space[3],
  },
});
