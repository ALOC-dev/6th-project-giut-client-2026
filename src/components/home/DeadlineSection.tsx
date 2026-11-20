import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, View, useWindowDimensions, type ScrollViewInstance } from 'react-native';

import { GiutMark } from '@/components/brand/GiutMark';
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
  const [isDragging, setIsDragging] = useState(false);

  // 공모전 개수가 줄어서 page가 범위를 벗어나도 마지막 카드 안으로 맞춰요
  const lastPage = Math.max(contests.length - 1, 0);
  const currentPage = Math.min(page, lastPage);

  // 스크롤 위치(x)로 지금 보이는 카드 번호를 계산해서 page에 반영해요
  const syncPage = (x: number) => {
    const next = Math.round(x / snap);
    setPage(Math.min(Math.max(next, 0), lastPage));
  };

  // 화면 회전 등으로 카드 너비(snap)가 바뀌면, 보고 있던 카드 위치로 다시 맞춰요
  useEffect(() => {
    scrollRef.current?.scrollTo({ x: currentPage * snap, animated: false });
    // snap이 바뀔 때만 실행해요 (페이지 이동은 아래 타이머와 손 스크롤이 처리)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snap]);

  // 5초마다 다음 카드로 넘기기. 페이지가 바뀌면(자동이든 손으로든) 타이머를 새로 시작해요.
  // 손으로 넘기는 중에는 타이머를 멈춰서 제스처와 부딪히지 않게 해요.
  useEffect(() => {
    if (contests.length <= 1 || isDragging) return;

    const timer = setTimeout(() => {
      const next = (currentPage + 1) % contests.length;
      scrollRef.current?.scrollTo({ x: next * snap, animated: true });
      setPage(next);
    }, AUTO_SLIDE_MS);

    return () => clearTimeout(timer);
  }, [currentPage, contests.length, snap, isDragging]);

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
        onScrollBeginDrag={() => setIsDragging(true)}
        // 손을 뗄 때도 위치로 page를 맞춰요 (관성 없이 멈추면 onMomentumScrollEnd가 안 불릴 수 있어서)
        onScrollEndDrag={(e) => {
          syncPage(e.nativeEvent.contentOffset.x);
          setIsDragging(false);
        }}
        onMomentumScrollEnd={(e) => syncPage(e.nativeEvent.contentOffset.x)}
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
              // 스크린리더는 카드 전체를 한 번에 읽어요 (D-day 글자 칸을 하나씩 읽지 않도록)
              accessible
              accessibilityRole="button"
              accessibilityLabel={`${contest.title}, ${formatDday(contest.endDate)}, ${formatShortDate(contest.endDate)} 마감`}
            >
              {hasPoster ? (
                <>
                  <Image
                    source={contest.posterUrl}
                    style={S.poster}
                    contentFit="cover"
                    accessible={false}
                  />
                  <View style={S.dim} />
                </>
              ) : (
                <GiutMark width={200} color={palette.base} style={S.fallbackSymbol} />
              )}

              {/* 안의 글자들은 위 accessibilityLabel로 대신 읽어요 */}
              {/* Android: importantForAccessibility, iOS: accessibilityElementsHidden */}
              <View
                style={S.content}
                importantForAccessibility="no-hide-descendants"
                accessibilityElementsHidden
              >
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
