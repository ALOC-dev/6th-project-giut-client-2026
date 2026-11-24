import { useState } from 'react';
import { StyleSheet, View, type TextLayoutEvent } from 'react-native';

import { Press, Text } from '@/components/ui';
import { space } from '@/theme';

const MAX_LINES = 5;

type TeamIntroSectionProps = {
  description: string;
};

export function TeamIntroSection({ description }: TeamIntroSectionProps) {
  const [isLong, setIsLong] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleMeasure = (e: TextLayoutEvent) => {
    setIsLong(e.nativeEvent.lines.length > MAX_LINES);
  };

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

        <Text color="textBody" numberOfLines={expanded ? undefined : MAX_LINES}>
          {description}
        </Text>
      </View>

      {isLong && (
        <Press
          onPress={() => setExpanded((prev) => !prev)}
          accessibilityRole="button"
          accessibilityLabel={expanded ? '팀 소개 접기' : '팀 소개 더보기'}
          accessibilityState={{ expanded }}
          style={S.toggle}
        >
          <Text color={expanded ? 'textFaint' : 'brand'} style={S.more}>
            {expanded ? '접기' : '더보기'}
          </Text>
        </Press>
      )}
    </View>
  );
}

const S = StyleSheet.create({
  wrap: {
    padding: space[5],
    gap: space[3],
  },
  measure: {
    position: 'absolute',
    left: 0,
    right: 0,
    opacity: 0,
  },
  toggle: {
    alignSelf: 'flex-start',
    minHeight: 44,
    justifyContent: 'center',
  },
  more: {
    fontWeight: '700',
  },
});
