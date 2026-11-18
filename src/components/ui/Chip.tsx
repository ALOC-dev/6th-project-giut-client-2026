import { View, type StyleProp, type ViewStyle } from 'react-native';
import { color, radius, shadow } from '@/theme';
import { Press } from './Press';
import { Text } from './Text';

type Base = {
  label: string;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export type ChipProps =
  | (Base & { selected: boolean; onPress: () => void; onDelete?: never })
  | (Base & { onDelete: () => void; onPress?: () => void; selected?: never });

export function Chip(props: ChipProps) {
  const { label, icon, style } = props;
  const deletable = 'onDelete' in props && !!props.onDelete;
  const on = 'selected' in props ? !!props.selected : false;

  const body = (
    <>
      {icon ? <View>{icon}</View> : null}
      <Text
        variant="caption"
        maxFontSizeMultiplier={1.5}
        style={{ color: on ? '#FFFFFF' : deletable ? color.ink : color.textBody }}
      >
        {label}
      </Text>
    </>
  );

  const shell: StyleProp<ViewStyle> = [
    {
      height: 36,
      borderRadius: radius.full,
      paddingLeft: icon ? 10 : 14,
      paddingRight: deletable ? 8 : 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      borderWidth: 1,
      backgroundColor: on ? color.brand : color.surface,
      borderColor: on ? color.brand : color.line,
    },
    deletable && shadow.card,
    style,
  ];

  if (deletable) {
    return (
      <View style={shell}>
        <Press
          onPress={props.onPress}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
        >
          {body}
        </Press>
        <Press
          onPress={props.onDelete}
          accessibilityRole="button"
          accessibilityLabel={`${label} 삭제`}
          style={{ width: 24, height: 36, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text variant="caption" color="textMuted" maxFontSizeMultiplier={1.5}>
            ✕
          </Text>
        </Press>
      </View>
    );
  }

  return (
    <Press
      onPress={props.onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      scaleOnPress={false}
      style={shell}
    >
      {body}
    </Press>
  );
}
