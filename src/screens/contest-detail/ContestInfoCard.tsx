import { View } from 'react-native';

import { Press, Text } from '@/components/ui';
import { ACTIVITY_LABEL, CATEGORY_LABEL } from '@/screens/contests/contest';
import { PARTICIPATION_LABEL, type ContestDetail } from '@/screens/contests/contestDetail';
import { formatDday, formatFullDate, formatPeriod } from '@/utils/date';
import { openExternalUrl } from '@/utils/link';

import { S } from './ContestInfoCard.styles';

type ContestInfoCardProps = {
  contest: ContestDetail;
};

// 공모전 상세 상단의 기본 정보 카드
export function ContestInfoCard({ contest }: ContestInfoCardProps) {
  return (
    <View style={S.card}>
      <View style={S.top}>
        <Text variant="caption" color="textMuted">
          #{ACTIVITY_LABEL[contest.activityType]} #{CATEGORY_LABEL[contest.category]}
        </Text>
        <Text variant="titleLg">{contest.title}</Text>
        <Text variant="caption" color="textSecondary" style={S.host}>
          {contest.org}
        </Text>
      </View>

      <InfoRow label="접수 기간">
        <Text variant="caption" style={S.valueText}>
          {/* 접수 시작일이 없으면 마감일만 보여줘요 */}
          {contest.applyFrom
            ? formatPeriod(contest.applyFrom, contest.deadline)
            : `~ ${formatFullDate(contest.deadline)}`}{' '}
          <Text variant="caption" color="brand" style={S.dday}>
            {formatDday(contest.deadline)}
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
            onPress={() => openExternalUrl(contest.sourceUrl)}
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
