import { useState } from 'react';
import {
  StyleSheet,
  View,
  type StyleProp,
  type TextLayoutEvent,
  type ViewStyle,
} from 'react-native';

import { Press } from './Press';
import { Text } from './Text';

export type ExpandableTextProps = {
  children: string;
  maxLines: number;
  label: string; // 스크린리더용 이름 (예: '팀 소개' → '팀 소개 더보기')
  style?: StyleProp<ViewStyle>;
};

// maxLines를 넘으면 ...으로 자르고 더보기/접기 버튼을 보여줘요
export function ExpandableText({ children, maxLines, label, style }: ExpandableTextProps) {
  const [isLong, setIsLong] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleMeasure = (e: TextLayoutEvent) => {
    setIsLong(e.nativeEvent.lines.length > maxLines);
  };

  return (
    <View style={style}>
      <View>
        <Text
          color="textBody"
          style={S.measure}
          onTextLayout={handleMeasure}
          aria-hidden
          importantForAccessibility="no-hide-descendants"
        >
          {children}
        </Text>

        <Text color="textBody" numberOfLines={expanded ? undefined : maxLines}>
          {children}
        </Text>
      </View>

      {isLong && (
        <Press
          onPress={() => setExpanded((prev) => !prev)}
          accessibilityRole="button"
          accessibilityLabel={`${label} ${expanded ? '접기' : '더보기'}`}
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
