import { ChatCircleIcon } from 'phosphor-react-native/src/icons/ChatCircle';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui';
import { color, radius, space } from '@/theme';

type TeamBottomBarProps = {
  closed: boolean;
  onPressInquiry: () => void;
  onPressApply: () => void;
};

export function TeamBottomBar({ closed, onPressInquiry, onPressApply }: TeamBottomBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[S.wrap, { paddingBottom: insets.bottom + space[3] }]}>
      <Button
        variant="secondary"
        label="팀장에게 문의"
        left={<ChatCircleIcon size={18} color={color.ink} />}
        full={false}
        onPress={onPressInquiry}
        style={[S.button, S.inquiry]}
      />
      <Button
        label={closed ? '모집 마감' : '지원하기'}
        disabled={closed}
        full={false}
        onPress={onPressApply}
        style={[S.button, S.apply]}
      />
    </View>
  );
}

const S = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: space[2],
    paddingTop: space[3],
    paddingHorizontal: space[4],
    backgroundColor: color.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.line,
  },
  button: {
    height: 56,
    borderRadius: radius.xl,
    paddingHorizontal: space[3],
  },
  inquiry: {
    flex: 2,
  },
  apply: {
    flex: 3,
  },
});
