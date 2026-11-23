import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View, useWindowDimensions, type ScrollViewInstance } from 'react-native';

import { GiutMark } from '@/components/brand/GiutMark';
import { Press, Text } from '@/components/ui';
import { CATEGORY_LABEL } from '@/screens/contests/contest';
import type { ContestDetail } from '@/screens/contests/contestDetail';
import { role, space, type RoleName } from '@/theme';
import { formatDday, formatShortDate, getDday } from '@/utils/date';

import { S } from './DeadlineSection.styles';

const AUTO_SLIDE_MS = 5000;

// 포스터 없는 카드 색 순서: 파랑 → 주황 → 초록 → 노랑
const FALLBACK_ROLES: RoleName[] = ['dev', 'design', 'plan', 'mkt'];

// 오늘(D-DAY)부터 며칠 뒤 마감까지 보여줄지
const WEEK_RANGE_DAYS = 6;

type DeadlineSectionProps = {
  contests: ContestDetail[]; // 전체 공모전. 이번 주 마감은 여기서 골라요
};

export function DeadlineSection({ contests: allContests }: DeadlineSectionProps) {
  // 날짜가 바뀔 때만 다시 골라요. 앱을 켜둔 채 날짜가 넘어가도 마감된 카드가 남지 않아요
  // (섹션이 5초마다 다시 그려져서 날짜 변경을 금방 알아채요)
  const todayKey = new Date().toDateString();
  const contests = useMemo(() => {
    const today = new Date(todayKey);
    return allContests.filter((contest) => {
      const dday = getDday(contest.deadline, today);
      return dday >= 0 && dday <= WEEK_RANGE_DAYS;
    });
  }, [allContests, todayKey]);

  const { width } = useWindowDimensions();
  const cardWidth = width - space[4] * 2;
  const snap = cardWidth + space[3];

  const scrollRef = useRef<ScrollViewInstance>(null);
  const [page, setPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const lastPage = Math.max(contests.length - 1, 0);
  const currentPage = Math.min(page, lastPage);

  const syncPage = (x: number) => {
    const next = Math.round(x / snap);
    setPage(Math.min(Math.max(next, 0), lastPage));
  };

  // 카드 너비가 바뀌면(화면 회전 등) 보던 카드 위치로 다시 맞춰요
  useEffect(() => {
    scrollRef.current?.scrollTo({ x: currentPage * snap, animated: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snap]);

  // 5초마다 다음 카드로. 손으로 넘기는 중에는 멈춰요
  useEffect(() => {
    if (contests.length <= 1 || isDragging) return;

    const timer = setTimeout(() => {
      const next = (currentPage + 1) % contests.length;
      scrollRef.current?.scrollTo({ x: next * snap, animated: true });
      setPage(next);
    }, AUTO_SLIDE_MS);

    return () => clearTimeout(timer);
  }, [currentPage, contests.length, snap, isDragging]);

  // 포스터 없는 카드끼리만 순서를 세서 같은 색이 이어지지 않게 해요
  let fallbackCount = 0;
  const cardRoles = contests.map((contest) =>
    contest.posterUrl ? null : FALLBACK_ROLES[fallbackCount++ % FALLBACK_ROLES.length],
  );

  if (contests.length === 0) return null;

  return (
    <View style={S.section}>
      <View style={S.header}>
        <Text variant="titleLg">이번 주 마감</Text>
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
        // 관성 없이 멈추면 onMomentumScrollEnd가 안 불려서 여기서도 맞춰요
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
              // 스크린리더가 D-day 글자 칸을 하나씩 읽지 않고 카드 전체를 한 번에 읽도록
              accessible
              accessibilityRole="button"
              accessibilityLabel={`${contest.title}, ${formatDday(contest.deadline)}, ${formatShortDate(contest.deadline)} 마감`}
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

              {/* Android: importantForAccessibility, iOS: accessibilityElementsHidden */}
              <View
                style={S.content}
                importantForAccessibility="no-hide-descendants"
                accessibilityElementsHidden
              >
                <View style={S.topRow}>
                  <View style={[S.badge, !hasPoster && S.badgeFallback]}>
                    <Text variant="badge" color={accentColor}>
                      {CATEGORY_LABEL[contest.category]}
                    </Text>
                  </View>
                  <Text variant="meta" color={subColor}>
                    {index + 1} / {contests.length}
                  </Text>
                </View>

                <View style={S.ddayRow}>
                  {formatDday(contest.deadline)
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
                    {formatShortDate(contest.deadline)} 마감
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
