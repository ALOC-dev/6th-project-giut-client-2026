import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { color, space } from '@/theme';

type ContestDescriptionProps = {
  description: string;
  sourceName: string;
};

export function ContestDescription({ description, sourceName }: ContestDescriptionProps) {
  return (
    <View style={S.wrap}>
      <Text variant="body" color="textBody" style={S.text}>
        {description}
      </Text>

      <View style={S.source}>
        <Text variant="caption" color="textFaint">
          출처: {sourceName}
        </Text>
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  wrap: {
    padding: space[5],
  },
  text: {
    lineHeight: 24,
  },
  source: {
    marginTop: space[5],
    paddingTop: space[4],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.line,
  },
});
