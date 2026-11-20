import { View, ActivityIndicator, type StyleProp, type ViewStyle } from 'react-native';
import { color, radius, space } from '@/theme';
import { Press } from './Press';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'link';

export type ButtonProps = {
  label: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  full?: boolean;
  left?: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  variant = 'primary',
  disabled = false,
  loading = false,
  full = true,
  left,
  onPress,
  style,
}: ButtonProps) {
  const off = disabled || loading;

  if (variant === 'link') {
    return (
      <Press
        disabled={off}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: off }}
        style={[{ minHeight: 44, justifyContent: 'center', opacity: off ? 0.4 : 1 }, style]}
      >
        <Text
          variant="bodyStrong"
          color="textMuted"
          maxFontSizeMultiplier={1.5}
          style={{ textDecorationLine: 'underline', textAlign: 'center' }}
        >
          {label}
        </Text>
      </Press>
    );
  }

  const look = {
    primary: {
      bg: color.brand,
      fg: color.surface,
      height: 56,
      corner: radius.xl,
      variant: 'button' as const,
    },
    secondary: {
      bg: color.surfaceMuted,
      fg: color.ink,
      height: 52,
      corner: radius.md,
      variant: 'label' as const,
    },
    danger: {
      bg: color.dangerStrong,
      fg: color.surface,
      height: 52,
      corner: radius.md,
      variant: 'label' as const,
    },
  }[variant];

  return (
    <Press
      disabled={off}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: off, busy: loading }}
      style={[
        {
          height: look.height,
          borderRadius: look.corner,
          borderCurve: 'continuous',
          backgroundColor: off ? color.surfaceMuted : look.bg,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: space[1.5],
          paddingHorizontal: space[5],
          alignSelf: full ? 'stretch' : 'flex-start',
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={off ? color.textDisabled : look.fg} />
      ) : (
        <>
          {left ? <View>{left}</View> : null}
          <Text
            variant={look.variant}
            maxFontSizeMultiplier={1.5}
            style={{ color: off ? color.textDisabled : look.fg }}
          >
            {label}
          </Text>
        </>
      )}
    </Press>
  );
}
