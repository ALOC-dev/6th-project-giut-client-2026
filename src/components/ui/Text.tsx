import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { color, text, type ColorToken, type TextVariant } from '@/theme';

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  color?: ColorToken | (string & {});
};

const DEFAULT_MAX_FONT_SCALE = 2;

export function Text({
  variant = 'body',
  color: c = 'ink',
  maxFontSizeMultiplier = DEFAULT_MAX_FONT_SCALE,
  style,
  ...rest
}: TextProps) {
  const resolved = (color as Record<string, string>)[c] ?? c;
  return (
    <RNText
      {...rest}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={[text[variant], { color: resolved }, style]}
    />
  );
}
