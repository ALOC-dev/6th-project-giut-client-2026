import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnimatedBookmarkIcon } from '@/components/icons';
import { Card, Press, SegmentedControl, Text } from '@/components/ui';
import { ACTIVITY_LABEL } from '@/screens/contests/contest';
import { color, space } from '@/theme';
import { formatDday, getDday } from '@/utils/date';

import type { ProfileSummary } from './myProfile';
import { getScrapKey, type Scrap, type ScrapKind } from './scrap';
import { SectionHeader } from './SectionHeader';

type ScrapFilter = 'all' | ScrapKind;

const EMPTY_MESSAGE: Record<ScrapFilter, string> = {
  all: '아직 스크랩한 항목이 없어요',
  post: '아직 스크랩한 게시물이 없어요',
  team: '아직 스크랩한 팀이 없어요',
};

type ScrapSectionProps = {
  scraps: Scrap[];
  summary: ProfileSummary;
  onPressScrap: (scrap: Scrap) => void;
};

export function ScrapSection({ scraps, summary, onPressScrap }: ScrapSectionProps) {
  const [filter, setFilter] = useState<ScrapFilter>('all');
  // TODO: API 연결 전까지 해제한 스크랩을 화면 안에서만 기억해요
  // 실수로 눌러도 되돌릴 수 있게 카드는 남겨 두고 북마크만 비워요
  const [removedKeys, setRemovedKeys] = useState<string[]>([]);

  const toggle = (key: string) =>
    setRemovedKeys((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );

  const removed = scraps.filter((scrap) => removedKeys.includes(getScrapKey(scrap)));
  const removedPosts = removed.filter(({ kind }) => kind === 'post').length;
  const total = summary.scrapCount - removed.length;

  const visible = filter === 'all' ? scraps : scraps.filter(({ kind }) => kind === filter);

  return (
    <View style={S.section}>
      <SectionHeader title="스크랩" count={total} />

      <SegmentedControl
        segments={[
          { key: 'all', label: '전체', count: total },
          { key: 'post', label: '게시물', count: summary.competitionScrapCount - removedPosts },
          {
            key: 'team',
            label: '팀',
            count: summary.teamScrapCount - (removed.length - removedPosts),
          },
        ]}
        value={filter}
        onChange={(key) => setFilter(key as ScrapFilter)}
      />

      {visible.map((scrap) => {
        const key = getScrapKey(scrap);
        return (
          <ScrapCard
            key={key}
            scrap={scrap}
            saved={!removedKeys.includes(key)}
            onPress={() => onPressScrap(scrap)}
            onPressBookmark={() => toggle(key)}
          />
        );
      })}

      {visible.length === 0 && (
        <View style={S.empty}>
          <Text color="textMuted">{EMPTY_MESSAGE[filter]}</Text>
        </View>
      )}
    </View>
  );
}

type ScrapCardProps = {
  scrap: Scrap;
  saved: boolean;
  onPress: () => void;
  onPressBookmark: () => void;
};

// 카드 본문과 북마크를 나란히 둬서 스크린리더에서도 각각 누를 수 있어요
function ScrapCard({ scrap, saved, onPress, onPressBookmark }: ScrapCardProps) {
  const { label, title, status, closed, source } = getCardContent(scrap);

  return (
    <Card corner="2xl" elevation="raised" padding={0} style={S.card}>
      <Press
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${title}, ${status}, ${source}`}
        style={S.body}
      >
        <Text variant="caption" color="textMuted">
          {label}
        </Text>
        <Text variant="titleSm" numberOfLines={1}>
          {title}
        </Text>
        <Text variant="caption" color="textMuted" numberOfLines={1}>
          <Text variant="caption" color={closed ? 'textFaint' : 'brand'} style={S.status}>
            {status}
          </Text>
          {`  ${source}`}
        </Text>
      </Press>

      <Press
        onPress={onPressBookmark}
        accessibilityRole="button"
        accessibilityLabel={saved ? `${title} 스크랩 해제` : `${title} 스크랩`}
        accessibilityState={{ selected: saved }}
        style={S.bookmark}
      >
        <AnimatedBookmarkIcon saved={saved} />
      </Press>
    </Card>
  );
}

function getCardContent(scrap: Scrap) {
  if (scrap.kind === 'post') {
    return {
      label: `게시물 · ${ACTIVITY_LABEL[scrap.activityType]}`,
      title: scrap.title,
      status: formatDday(scrap.deadline),
      closed: getDday(scrap.deadline) < 0,
      source: scrap.org,
    };
  }
  return {
    label: '팀 모집',
    title: scrap.name,
    status: scrap.closed ? '마감' : `${scrap.memberCount}/${scrap.capacity}명`,
    closed: scrap.closed,
    source: scrap.contestTitle,
  };
}

const S = StyleSheet.create({
  section: {
    gap: space[3],
  },
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: color.lineSoft,
  },
  body: {
    flex: 1,
    paddingVertical: space[4],
    paddingLeft: space[4],
    gap: space[0.5],
  },
  status: {
    fontWeight: '800',
  },
  bookmark: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    paddingVertical: space[8],
    alignItems: 'center',
  },
});
