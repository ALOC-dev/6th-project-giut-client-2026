import { BookmarkSimpleIcon } from 'phosphor-react-native/src/icons/BookmarkSimple';
import { View } from 'react-native';

import { Press, Text } from '@/components/ui';
import { ROLE_LABEL } from '@/constants/team';
import { color, role } from '@/theme';
import type { Team } from '@/types/team';
import { isTeamClosed } from '@/utils/team';

import { NOTCH_RADIUS, RIGHT_WIDTH, S } from './RecruitingTeamCard.styles';
import { TeamMemberRing } from './TeamMemberRing';
import { TicketBackground } from './TicketBackground';

type RecruitingTeamCardProps = {
  team: Team;
  bookmarked: boolean;
  onPress: () => void; // 카드 → 팀 상세
  onPressBookmark: () => void;
  onPressApply: () => void;
};

const DASH_COUNT = 14; // 가운데 점선 조각 개수

// "A해요. B해요!" → "A해요." (마침표·느낌표·물음표 뒤 공백이나 끝에서 자름)
function getFirstSentence(text: string) {
  const match = text.trim().match(/^.*?[.!?](?=\s|$)/);
  return match ? match[0] : text.trim();
}

// 티켓 모양 팀 카드: 왼쪽은 팀 이름·모집 역할, 오른쪽은 인원 원·지원하기
export function RecruitingTeamCard({
  team,
  bookmarked,
  onPress,
  onPressBookmark,
  onPressApply,
}: RecruitingTeamCardProps) {
  const closed = isTeamClosed(team);

  return (
    <Press onPress={onPress} scaleOnPress={false} style={S.card}>
      <TicketBackground notchFromRight={RIGHT_WIDTH + 0.5} notchRadius={NOTCH_RADIUS} />

      {/* 왼쪽 */}
      <View style={S.left}>
        <View style={S.head}>
          <View style={S.titleRow}>
            <Text variant="titleSm" numberOfLines={1} style={S.name}>
              {team.name}
            </Text>
            <Press
              onPress={onPressBookmark}
              accessibilityRole="button"
              accessibilityLabel={bookmarked ? '팀 저장 취소' : '팀 저장'}
              accessibilityState={{ selected: bookmarked }}
              touchSize={20}
            >
              <BookmarkSimpleIcon
                size={20}
                color={bookmarked ? color.brand : color.textFaint}
                weight={bookmarked ? 'fill' : 'regular'}
              />
            </Press>
          </View>

          {/* 설명의 첫 문장만, 한 줄을 넘으면 ... */}
          <Text variant="caption" color="textMuted" numberOfLines={1}>
            {getFirstSentence(team.description)}
          </Text>
        </View>

        <View style={S.roles}>
          {closed ? (
            // 마감된 팀은 역할 대신 회색 '모집 완료'
            <View style={[S.roleChip, S.closedChip]}>
              <Text variant="badge" color="textFaint" style={S.roleText}>
                모집 완료
              </Text>
            </View>
          ) : (
            team.recruitingRoles.map(({ role: key, count }) => (
              <View key={key} style={[S.roleChip, { backgroundColor: role[key].tint }]}>
                <Text variant="badge" color={role[key].text} style={S.roleText}>
                  {ROLE_LABEL[key]} {count}명
                </Text>
              </View>
            ))
          )}
        </View>
      </View>

      {/* 가운데 점선 (위아래 홈 사이) */}
      <View style={S.dashes}>
        {Array.from({ length: DASH_COUNT }, (_, i) => (
          <View key={i} style={S.dash} />
        ))}
      </View>

      {/* 오른쪽 */}
      <View style={S.right}>
        <TeamMemberRing members={team.members} capacity={team.capacity} />
        <Press
          onPress={onPressApply}
          disabled={closed}
          accessibilityRole="button"
          accessibilityState={{ disabled: closed }}
          style={[S.applyButton, closed && S.applyButtonClosed]}
        >
          <Text variant="caption" color={closed ? 'textFaint' : color.surface} style={S.applyText}>
            {closed ? '마감' : '지원하기'}
          </Text>
        </Press>
      </View>
    </Press>
  );
}
