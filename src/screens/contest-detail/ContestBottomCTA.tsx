import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui';
import { color, space } from '@/theme';

type ContestBottomCTAProps = {
  label: string;
  onPress: () => void;
};

export function ContestBottomCTA({ label, onPress }: ContestBottomCTAProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[S.wrap, { paddingBottom: insets.bottom + space[3] }]}>
      <Button label={label} onPress={onPress} />
    </View>
  );
}

const S = StyleSheet.create({
  wrap: {
    paddingTop: space[3],
    paddingHorizontal: space[4],
    backgroundColor: color.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.line,
  },
});
