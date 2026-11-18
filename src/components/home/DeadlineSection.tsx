import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, View, useWindowDimensions, type ScrollViewInstance } from 'react-native';

import { Press, Text } from '@/components/ui';
import { role, space, type RoleName } from '@/theme';
import type { Contest } from '@/types/contest';
import { formatDday, formatShortDate } from '@/utils/date';

import { S } from './DeadlineSection.styles';

const AUTO_SLIDE_MS = 5000;

// 포스터가 없는 카드에 차례대로 칠할 색: 파랑 → 주황 → 초록 → 노랑
const FALLBACK_ROLES: RoleName[] = ['dev', 'design', 'plan', 'mkt'];

type DeadlineSectionProps = {
  contests: Contest[];
};

export function DeadlineSection({ contests }: DeadlineSectionProps) {
  const { width } = useWindowDimensions();
  const cardWidth = width - space[4] * 2;
  const snap = cardWidth + space[3];

  const scrollRef = useRef<ScrollViewInstance>(null);
  const [page, setPage] = useState(0);

  // 5초마다 다음 카드로 넘기기. 페이지가 바뀌면(자동이든 손으로든) 타이머를 새로 시작해요.
  useEffect(() => {
    if (contests.length <= 1) return;

    const timer = setTimeout(() => {
      const next = (page + 1) % contests.length;
      scrollRef.current?.scrollTo({ x: next * snap, animated: true });
      setPage(next);
    }, AUTO_SLIDE_MS);

    return () => clearTimeout(timer);
  }, [page, contests.length, snap]);

  // 포스터 없는 카드끼리만 순서를 세서 색을 배정해요.
  // 포스터 카드는 건너뛰므로, 같은 색이 최대한 이어지지 않아요.
  let fallbackCount = 0;
  const cardRoles = contests.map((contest) =>
    contest.posterUrl ? null : FALLBACK_ROLES[fallbackCount++ % FALLBACK_ROLES.length],
  );

  return (
    <View style={S.section}>
      <View style={S.header}>
        <Text variant="titleMd">이번 주 마감</Text>
        <Text variant="caption" color="textMuted">
          더보기 ›
        </Text>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={S.list}
        snapToInterval={snap}
        decelerationRate="fast"
        onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / snap))}
      >
        {contests.map((contest, index) => {
          const hasPoster = !!contest.posterUrl;
          const textColor = hasPoster ? 'surface' : 'ink';
          const subColor = hasPoster ? 'surface' : 'textMuted';
          const palette = role[cardRoles[index] ?? FALLBACK_ROLES[0]];
          const accentColor = hasPoster ? 'surface' : palette.text;

          return (
            <Press
              key={contest.id}
              style={[
                S.card,
                { width: cardWidth },
                !hasPoster && { backgroundColor: palette.tint },
              ]}
              onPress={() => router.push({ pathname: '/contest/[id]', params: { id: contest.id } })}
            >
              {hasPoster ? (
                <>
                  <Image source={contest.posterUrl} style={S.poster} contentFit="cover" />
                  <View style={S.dim} />
                </>
              ) : (
                <Image
                  source={require('../../../assets/images/giut-symbol.png')}
                  style={S.fallbackSymbol}
                  contentFit="contain"
                  tintColor={palette.base}
                />
              )}

              <View style={S.content}>
                <View style={S.topRow}>
                  <View style={[S.badge, !hasPoster && S.badgeFallback]}>
                    <Text variant="badge" color={accentColor}>
                      {contest.field}
                    </Text>
                  </View>
                  <Text variant="meta" color={subColor}>
                    {index + 1} / {contests.length}
                  </Text>
                </View>

                <View style={S.ddayRow}>
                  {formatDday(contest.endDate)
                    .split('')
                    .map((char, i) => (
                      <View
                        key={i}
                        style={[
                          S.ddayBox,
                          !hasPoster && S.ddayBoxFallback,
                          char === '-' && S.ddayDash,
                        ]}
                      >
                        <View style={S.ddayLineWrap}>
                          <View style={[S.ddayLine, !hasPoster && S.ddayLineFallback]} />
                        </View>
                        <Text variant="displayNumber" style={S.ddayText} color={accentColor}>
                          {char}
                        </Text>
                      </View>
                    ))}
                </View>

                <View style={S.bottom}>
                  <Text variant="caption" color={subColor}>
                    {formatShortDate(contest.endDate)} 마감
                  </Text>
                  <Text variant="titleMd" color={textColor} numberOfLines={1}>
                    {contest.title}
                  </Text>
                </View>
              </View>
            </Press>
          );
        })}
      </ScrollView>
    </View>
  );
}
