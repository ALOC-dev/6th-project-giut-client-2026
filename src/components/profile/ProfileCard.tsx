import { StarIcon } from 'phosphor-react-native';
import type { ReactNode } from 'react';
import { Image, View } from 'react-native';

import { PersonSilhouetteIcon } from '@/components/icons';
import { Card, ExpandableText, Text } from '@/components/ui';
import { getPrimaryRoleKey, getRoleKey, type Profile } from '@/screens/mypage';
import { color, role, space } from '@/theme';

import { S } from './ProfileCard.styles';

const BIO_MAX_LINES = 3;
const LOOKING_FOR_TEAM = '팀 찾는 중';

type ProfileCardProps = {
  profile: Profile;
  recommendationCount: number;
  collaborationCount?: number; // 없으면 숨김
  actions: ReactNode; // 카드 맨 아래 버튼
};

// 프로필 카드 (마이페이지, 다른 사람 프로필)
export function ProfileCard({
  profile,
  recommendationCount,
  collaborationCount,
  actions,
}: ProfileCardProps) {
  const stats = [
    `추천 ${recommendationCount}`,
    collaborationCount !== undefined && `협업 ${collaborationCount}`,
  ].filter(Boolean);

  const lookingForTeam = profile.activityStatusName === LOOKING_FOR_TEAM;
  const skills = profile.tags.filter(({ type }) => type === 'SKILL');

  return (
    <Card corner="2xl" padding={space[5]} bordered style={S.card}>
      <View style={S.top}>
        <ProfileAvatar profile={profile} />

        <View style={S.info}>
          <View style={S.nameRow}>
            <Text variant="titleXl" numberOfLines={1} style={S.name}>
              {profile.nickname}
            </Text>
            <View style={S.status}>
              <View
                style={[
                  S.statusDot,
                  { backgroundColor: lookingForTeam ? color.success : color.textFaint },
                ]}
              />
              <Text variant="meta" color={lookingForTeam ? 'rolePlanText' : 'textMuted'}>
                {profile.activityStatusName}
              </Text>
            </View>
          </View>

          <Text variant="caption" color="textMuted" numberOfLines={1}>
            {profile.departmentName} · {profile.grade}학년
          </Text>

          <View style={S.statRow} accessible accessibilityLabel={stats.join(', ')}>
            <StarIcon size={13} color={color.brand} weight="fill" />
            <Text variant="caption" color="textSecondary">
              추천{' '}
              <Text variant="caption" style={S.statNumber}>
                {recommendationCount}
              </Text>
              {collaborationCount !== undefined && (
                <>
                  <Text variant="caption" color="textDisabled">
                    {'  ·  '}
                  </Text>
                  협업{' '}
                  <Text variant="caption" style={S.statNumber}>
                    {collaborationCount}
                  </Text>
                </>
              )}
            </Text>
          </View>
        </View>
      </View>

      {profile.roles.length > 0 && (
        <View
          style={S.roles}
          accessible
          accessibilityLabel={`역할: ${profile.roles.map(({ name }) => name).join(', ')}`}
        >
          {/* 기웃허브 카드의 태그처럼 #으로 */}
          {profile.roles.map(({ code, name }) => {
            const key = getRoleKey(code);
            return (
              <Text key={code} variant="caption" color={key ? role[key].text : 'textBody'}>
                #{name}
              </Text>
            );
          })}
        </View>
      )}

      {!!profile.bio && (
        <ExpandableText maxLines={BIO_MAX_LINES} label="자기소개">
          {profile.bio}
        </ExpandableText>
      )}

      {skills.length > 0 && (
        <View style={S.tags}>
          {skills.map((tag) => (
            <View key={tag.id} style={S.tag}>
              <Text variant="caption" color="textBody">
                {tag.name}
              </Text>
            </View>
          ))}
        </View>
      )}

      {actions}
    </Card>
  );
}

function ProfileAvatar({ profile }: { profile: Profile }) {
  const tone = role[getPrimaryRoleKey(profile) ?? 'dev'];

  return (
    <View
      style={[S.avatar, { backgroundColor: tone.tint }]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`${profile.nickname} 프로필 사진`}
    >
      {profile.profileImageUrl ? (
        <Image source={{ uri: profile.profileImageUrl }} style={S.avatarImage} />
      ) : (
        <PersonSilhouetteIcon color={tone.base} style={S.avatarIcon} />
      )}
    </View>
  );
}
