import { openBrowserAsync } from 'expo-web-browser';
import { View } from 'react-native';

import { Press, Text } from '@/components/ui';
import { PARTICIPATION_LABEL } from '@/constants/contest';
import type { Contest } from '@/types/contest';
import { formatDday, formatPeriod } from '@/utils/date';

import { S } from './ContestInfoCard.styles';

type ContestInfoCardProps = {
  contest: Contest;
};

// 공모전 상세 상단의 기본 정보 카드
export function ContestInfoCard({ contest }: ContestInfoCardProps) {
  return (
    <View style={S.card}>
      <View style={S.top}>
        <Text variant="caption" color="textMuted">
          #{contest.category} #{contest.field}
        </Text>
        <Text variant="titleLg">{contest.title}</Text>
        <Text variant="caption" color="textSecondary" style={S.host}>
          {contest.host}
        </Text>
      </View>

      <InfoRow label="접수 기간">
        <Text variant="caption" style={S.valueText}>
          {formatPeriod(contest.startDate, contest.endDate)}{' '}
          <Text variant="caption" color="brand" style={S.dday}>
            {formatDday(contest.endDate)}
          </Text>
        </Text>
      </InfoRow>

      <InfoRow label="참여 대상">
        <Text variant="caption" style={S.valueText}>
          {contest.targets.join(' · ')}
        </Text>
      </InfoRow>

      <InfoRow label="참가 형태">
        <Text variant="caption" style={S.valueText}>
          {PARTICIPATION_LABEL[contest.participationType]}
        </Text>
      </InfoRow>

      <InfoRow label="활동 혜택">
        <Text variant="caption" style={S.valueText}>
          {contest.benefit}
        </Text>
      </InfoRow>

      <InfoRow label="원문" isLast>
        <View style={S.source}>
          <Press
            onPress={() => openBrowserAsync(contest.sourceUrl)}
            accessibilityRole="link"
            accessibilityLabel="원문 보기"
            touchSize={20}
          >
            <Text variant="caption" color="brand" style={S.dday}>
              원문 보기 ↗
            </Text>
          </Press>
          <Text variant="micro" color="textFaint">
            출처: {contest.sourceName}
          </Text>
        </View>
      </InfoRow>
    </View>
  );
}

type InfoRowProps = {
  label: string;
  isLast?: boolean;
  children: React.ReactNode;
};

// "라벨 ··· 값" 한 줄
function InfoRow({ label, isLast, children }: InfoRowProps) {
  return (
    <View style={[S.row, isLast && S.rowLast]}>
      <Text variant="caption" color="textMuted" style={S.label}>
        {label}
      </Text>
      <View style={S.value}>{children}</View>
    </View>
  );
}
