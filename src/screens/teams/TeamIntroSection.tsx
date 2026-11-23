import { useState } from 'react';
import { StyleSheet, View, type TextLayoutEvent } from 'react-native';

import { Text } from '@/components/ui';
import { space } from '@/theme';

const MAX_LINES = 5;
// 5번째 줄 끝에서 '... 더보기'가 들어갈 만큼 지우는 글자 수
const MORE_ROOM = 7;

type TeamIntroSectionProps = {
  description: string;
};

export function TeamIntroSection({ description }: TeamIntroSectionProps) {
  const [lines, setLines] = useState<string[] | null>(null);
  const [expanded, setExpanded] = useState(false);

  // 화면에 보이지 않는 전체 글로 줄을 나눠 보고, 5줄이 넘는지 판단해요
  const handleMeasure = (e: TextLayoutEvent) => {
    setLines(e.nativeEvent.lines.map((line) => line.text));
  };

  const isLong = lines !== null && lines.length > MAX_LINES;
  const collapsed = isLong && !expanded;

  const preview = collapsed
    ? lines.slice(0, MAX_LINES - 1).join('') +
      lines[MAX_LINES - 1].trimEnd().slice(0, -MORE_ROOM).trimEnd()
    : description;

  return (
    <View style={S.wrap}>
      <Text variant="titleMd">팀 소개</Text>

      <View>
        <Text
          color="textBody"
          style={S.measure}
          onTextLayout={handleMeasure}
          aria-hidden
          importantForAccessibility="no-hide-descendants"
        >
          {description}
        </Text>

        {collapsed ? (
          <Text
            color="textBody"
            numberOfLines={MAX_LINES}
            accessibilityRole="button"
            accessibilityHint="두 번 탭하면 팀 소개 전체를 볼 수 있어요"
            onPress={() => setExpanded(true)}
          >
            {preview}
            {'... '}
            <Text color="brand" style={S.more}>
              더보기
            </Text>
          </Text>
        ) : isLong ? (
          <Text
            color="textBody"
            accessibilityRole="button"
            accessibilityHint="두 번 탭하면 팀 소개를 접어요"
            onPress={() => setExpanded(false)}
          >
            {description}{' '}
            <Text color="textFaint" style={S.more}>
              접기
            </Text>
          </Text>
        ) : (
          <Text color="textBody">{description}</Text>
        )}
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  wrap: {
    padding: space[5],
    gap: space[3],
  },
  // 측정용 글. 실제 글과 같은 폭에서 줄을 나누되 보이지 않게
  measure: {
    position: 'absolute',
    left: 0,
    right: 0,
    opacity: 0,
  },
  more: {
    fontWeight: '700',
  },
});
