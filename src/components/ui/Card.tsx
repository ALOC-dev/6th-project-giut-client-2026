import { View, type ViewProps, type StyleProp, type ViewStyle } from 'react-native';
import { color, radius, shadow, space, type RadiusToken } from '@/theme';
import { Press } from './Press';

export type CardProps = ViewProps & {
  elevation?: 'flat' | 'card' | 'raised';
  corner?: RadiusToken;
  padding?: number;
  bordered?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Card({
  elevation = 'card', corner = 'lg', padding = space[4],
  bordered = false, onPress, style, children, ...rest
}: CardProps) {
  const base: StyleProp<ViewStyle> = [
    {
      backgroundColor: color.surface,
      borderRadius: radius[corner],
      borderCurve: 'continuous',
      padding,
    },
    bordered && { borderWidth: 1, borderColor: color.line },
    elevation !== 'flat' && shadow[elevation],
    style,
  ];

  if (onPress) {
    return (
      <Press
        style={base}
        onPress={onPress}
        {...rest}
        accessibilityRole={rest.accessibilityRole ?? 'button'}
      >
        {children}
      </Press>
    );
  }
  return <View style={base} {...rest}>{children}</View>;
}
