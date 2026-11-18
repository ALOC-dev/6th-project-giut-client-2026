import { useEffect } from 'react';
import { StyleSheet, View, type TextStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { text, useMotion, type ColorToken, type TextVariant } from '@/theme';

import { Text } from './Text';

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const ROLL_DIGITS = [...DIGITS, 0];

export type OdometerProps = {
  value: number;
  variant?: TextVariant;
  color?: ColorToken;
  roll?: boolean;
  delay?: number;
};

export function Odometer({
  value,
  variant = 'meta',
  color = 'textFaint',
  roll = true,
  delay = 0,
}: OdometerProps) {
  const { reduced } = useMotion();
  const characters = value.toLocaleString().split('');
  const lineHeight = (text[variant] as TextStyle).lineHeight ?? 16;

  return (
    <View style={styles.row} accessibilityLabel={String(value)}>
      {characters.map((character, index) => {
        const digit = Number(character);

        if (Number.isNaN(digit)) {
          return (
            <Text key={`character-${index}`} variant={variant} color={color}>
              {character}
            </Text>
          );
        }

        return (
          <DigitColumn
            key={`digit-${index}`}
            digit={digit}
            variant={variant}
            color={color}
            lineHeight={lineHeight}
            duration={500 + (characters.length - index) * 120}
            delay={delay}
            roll={roll && !reduced}
          />
        );
      })}
    </View>
  );
}

function DigitColumn({
  digit,
  variant,
  color,
  lineHeight,
  duration,
  delay,
  roll,
}: {
  digit: number;
  variant: TextVariant;
  color: ColorToken;
  lineHeight: number;
  duration: number;
  delay: number;
  roll: boolean;
}) {
  const targetIndex = roll && digit === 0 ? DIGITS.length : digit;
  const translateY = useSharedValue(roll ? 0 : -targetIndex * lineHeight);
  const { easing } = useMotion();

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(-targetIndex * lineHeight, {
        duration: roll ? duration : 0,
        easing: easing.out,
      }),
    );
  }, [delay, duration, easing.out, lineHeight, roll, targetIndex, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={{ height: lineHeight, overflow: 'hidden' }}>
      <Animated.View style={animatedStyle}>
        {ROLL_DIGITS.map((number, index) => (
          <Text
            key={`${number}-${index}`}
            variant={variant}
            color={color}
            style={{ height: lineHeight }}
          >
            {number}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
