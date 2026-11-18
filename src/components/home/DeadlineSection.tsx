import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Press, Text } from '@/components/ui';
import type { Contest } from '@/types/contest';

import { S } from './DeadlineSection.styles';

type DeadlineSectionProps = {
  contests: Contest[];
};

export function DeadlineSection({ contests }: DeadlineSectionProps) {
  return (
    <View style={S.section}>
      <View style={S.header}>
        <Text variant="titleMd">이번 주 마감</Text>
        <Text variant="caption" color="textMuted">
          더보기 ›
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={S.list}>
        {contests.map((contest) => (
          <Press
            key={contest.id}
            style={S.card}
            onPress={() => router.push({ pathname: '/contest/[id]', params: { id: contest.id } })}
          >
            <Image source={contest.posterUrl} style={S.poster} contentFit="cover" />
          </Press>
        ))}
      </ScrollView>
    </View>
  );
}
