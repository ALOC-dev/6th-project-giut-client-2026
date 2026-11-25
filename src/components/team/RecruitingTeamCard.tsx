import { BookmarkSimpleIcon } from 'phosphor-react-native';
import { View } from 'react-native';

import { Press, Text } from '@/components/ui';
import { color, role } from '@/theme';
import { getRecruitingCounts, isTeamClosed, ROLE_LABEL, type Team } from '@/screens/teams';

import { NOTCH_RADIUS, RIGHT_WIDTH, S } from './RecruitingTeamCard.styles';
import { TeamMemberRing } from './TeamMemberRing';
import { TicketBackground } from './TicketBackground';

type RecruitingTeamCardProps = {
  team: Team;
  bookmarked: boolean;
  onPress: () => void;
  onPressBookmark: () => void;
  onPressApply: () => void;
};

const DASH_COUNT = 14;
const APPLY_BUTTON_HEIGHT = 32;

// "A해요. B해요!" → "A해요." (마침표·느낌표·물음표 뒤 공백이나 끝에서 자름)
function getFirstSentence(text: string) {
  const match = text.trim().match(/^.*?[.!?](?=\s|$)/);
  return match ? match[0] : text.trim();
}

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

      <View style={S.left}>
        <View style={S.head}>
          <View style={S.titleRow}>
            <Text variant="titleSm" numberOfLines={1} style={S.name}>
              {team.name}
            </Text>
            <Press
              onPress={onPressBookmark}
              accessibilityRole="button"
              accessibilityLabel={bookmarked ? `${team.name} 저장 취소` : `${team.name} 저장`}
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

          <Text variant="caption" color="textMuted" numberOfLines={1}>
            {getFirstSentence(team.description)}
          </Text>
        </View>

        <View style={S.roles}>
          {closed ? (
            <View style={[S.roleChip, S.closedChip]}>
              <Text variant="badge" color="textFaint" style={S.roleText}>
                모집 완료
              </Text>
            </View>
          ) : (
            getRecruitingCounts(team).map(({ role: key, count }) => (
              <View key={key} style={[S.roleChip, { backgroundColor: role[key].tint }]}>
                <Text variant="badge" color={role[key].text} style={S.roleText}>
                  {ROLE_LABEL[key]} {count}명
                </Text>
              </View>
            ))
          )}
        </View>
      </View>

      <View style={S.dashes}>
        {Array.from({ length: DASH_COUNT }, (_, i) => (
          <View key={i} style={S.dash} />
        ))}
      </View>

      <View style={S.right}>
        <TeamMemberRing members={team.members} capacity={team.capacity} />
        <Press
          // disabled면 터치가 뒤 카드로 넘어가 팀 상세로 이동해서, 마감일 땐 onPress만 비워요
          onPress={closed ? undefined : onPressApply}
          scaleOnPress={!closed}
          // 버튼 높이 약 32 → 터치 영역 44로 확장
          touchSize={APPLY_BUTTON_HEIGHT}
          accessibilityRole="button"
          accessibilityLabel={closed ? `${team.name} 모집 마감` : `${team.name} 지원하기`}
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
