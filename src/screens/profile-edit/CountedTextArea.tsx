import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Text } from '@/components/ui';
import { color, radius, space, text } from '@/theme';

type CountedTextAreaProps = {
  value: string;
  onChangeText: (value: string) => void;
  maxLength: number;
  label: string; // 스크린리더용 이름
  placeholder?: string;
  onFocus?: () => void;
};

// 여러 줄 입력 칸. 글자 수는 오른쪽 아래에 보여요 (예: 80/200)
export function CountedTextArea({
  value,
  onChangeText,
  maxLength,
  label,
  placeholder,
  onFocus,
}: CountedTextAreaProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[S.box, focused && S.boxFocused]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        maxLength={maxLength}
        multiline
        placeholder={placeholder}
        placeholderTextColor={color.textDisabled}
        selectionColor={color.brand}
        onFocus={() => {
          setFocused(true);
          onFocus?.();
        }}
        onBlur={() => setFocused(false)}
        accessibilityLabel={label}
        accessibilityHint={`최대 ${maxLength}자`}
        style={S.input}
      />
      <Text
        variant="caption"
        color="textFaint"
        style={S.count}
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
    paddingTop: space[3],
    paddingBottom: space[3],
    paddingHorizontal: space[4],
    gap: space[2],
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.xl,
    borderCurve: 'continuous',
    backgroundColor: color.surface,
  },
  boxFocused: {
    borderColor: color.brand,
  },
  // 여러 줄 입력 칸은 lineHeight를 써도 글자 위치가 어긋나지 않아요
  input: {
    ...text.body,
    minHeight: 110,
    padding: 0,
    color: color.ink,
    textAlignVertical: 'top',
  },
  count: {
    alignSelf: 'flex-end',
  },
});
