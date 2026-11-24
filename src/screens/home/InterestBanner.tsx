import { XIcon } from 'phosphor-react-native/src/icons/X';
import { useState } from 'react';
import { View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { Button, Card, Chip, Press, Text } from '@/components/ui';
import { color, duration, easing, useMotion } from '@/theme';

import { HOME_CATEGORIES, type HomeCategoryLabel } from './categories';
import { S } from './InterestBanner.styles';
import { RingingBell } from './RingingBell';

type InterestBannerProps = {
  onSubmit: (categories: HomeCategoryLabel[]) => void;
  onClose: () => void;
};

export function InterestBanner({ onSubmit, onClose }: InterestBannerProps) {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<HomeCategoryLabel[]>([]);

  const toggle = (label: HomeCategoryLabel) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label],
    );
  };

  const { reduced, enter, stagger } = useMotion();
  const layout = reduced ? undefined : LinearTransition.duration(duration.d3).easing(easing.out);

  return (
    <Animated.View layout={layout} style={S.wrapper}>
      <Card bordered style={S.card}>
        <View style={S.topRow}>
          <View style={S.texts}>
            <Text variant="caption" color="textMuted">
              관심 분야만 골라두면
            </Text>
            <Text variant="bodyStrong">마감 3일 전에 알려드려요</Text>
          </View>

          <Press
            style={[S.toggleButton, expanded && S.toggleButtonExpanded]}
            onPress={() => setExpanded((prev) => !prev)}
            accessibilityRole="button"
            accessibilityState={{ expanded }}
          >
            <RingingBell
              ringing={!expanded}
              size={14}
              color={expanded ? color.ink : color.surface}
            />
            <Text variant="meta" color={expanded ? 'ink' : 'surface'}>
              {expanded ? '접기' : '분야 선택'}
            </Text>
          </Press>

          <Press onPress={onClose} touchSize={20} accessibilityLabel="배너 닫기">
            <XIcon size={16} color={color.textFaint} />
          </Press>
        </View>

        {expanded && (
          <>
            <View style={S.chips}>
              {HOME_CATEGORIES.map(({ label, Icon }, index) => {
                const on = selected.includes(label);
                return (
                  <Animated.View key={label} entering={enter.fadeUp(index, stagger.tight)}>
                    <Chip
                      label={label}
                      selected={on}
                      onPress={() => toggle(label)}
                      icon={<Icon size={14} color={on ? color.surface : color.textBody} />}
                    />
                  </Animated.View>
                );
              })}
            </View>

            <Animated.View entering={enter.fadeUp(HOME_CATEGORIES.length, stagger.tight)}>
              <Button
                label={
                  selected.length > 0
                    ? `${selected.length}개 분야 알림 받기`
                    : '관심 분야를 골라주세요'
                }
                disabled={selected.length === 0}
                onPress={() => onSubmit(selected)}
                style={S.submit}
              />
            </Animated.View>
          </>
        )}
      </Card>
    </Animated.View>
  );
}
