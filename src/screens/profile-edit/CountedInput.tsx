import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Text } from '@/components/ui';
import { color, radius, space, text } from '@/theme';

type CountedInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  maxLength: number;
  label: string; // 스크린리더용 이름
  placeholder?: string;
};

// 글자 수가 오른쪽에 보이는 한 줄 입력 칸 (예: 3/10)
export function CountedInput({
  value,
  onChangeText,
  maxLength,
  label,
  placeholder,
}: CountedInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[S.box, focused && S.boxFocused]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        maxLength={maxLength}
        placeholder={placeholder}
        placeholderTextColor={color.textDisabled}
        selectionColor={color.brand}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={label}
        accessibilityHint={`최대 ${maxLength}자`}
        style={S.input}
      />
      <Text
        variant="caption"
        color="textFaint"
        importantForAccessibility="no"
        accessibilityElementsHidden
      >
        {value.length}/{maxLength}
      </Text>
    </View>
  );
}

const S = StyleSheet.create({
  box: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingHorizontal: space[4],
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.xl,
    borderCurve: 'continuous',
    backgroundColor: color.surface,
  },
  boxFocused: {
    borderColor: color.brand,
  },
  // 한 줄 입력 칸에 lineHeight를 주면 iOS에서 글자가 아래로 붙어서 크기와 굵기만 써요
  input: {
    flex: 1,
    fontSize: text.body.fontSize,
    fontWeight: text.body.fontWeight,
    paddingVertical: space[3],
    color: color.ink,
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});
