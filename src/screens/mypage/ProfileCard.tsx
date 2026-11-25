import { ExportIcon } from 'phosphor-react-native/src/icons/Export';
import { PencilSimpleIcon } from 'phosphor-react-native/src/icons/PencilSimple';
import { StarIcon } from 'phosphor-react-native/src/icons/Star';
import { Image, View } from 'react-native';

import { PersonSilhouetteIcon } from '@/components/icons';
import { Button, Card, ExpandableText, Press, Text } from '@/components/ui';
import { color, role, space } from '@/theme';

import { getPrimaryRoleKey, getRoleKey, type Profile, type ProfileSummary } from './myProfile';
import { S } from './ProfileCard.styles';

const BIO_MAX_LINES = 3;
const LOOKING_FOR_TEAM = '팀 찾는 중';

type ProfileCardProps = {
  profile: Profile;
  summary: ProfileSummary;
  onPressEdit: () => void;
  onPressShare: () => void;
};

export function ProfileCard({ profile, summary, onPressEdit, onPressShare }: ProfileCardProps) {
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

          <View
            style={S.statRow}
            accessible
            accessibilityLabel={`추천 ${summary.receivedRecommendationCount}, 협업 ${summary.collaborationCount}`}
          >
            <StarIcon size={13} color={color.brand} weight="fill" />
            <Text variant="caption" color="textSecondary">
              추천{' '}
              <Text variant="caption" style={S.statNumber}>
                {summary.receivedRecommendationCount}
              </Text>
              <Text variant="caption" color="textDisabled">
                {'  ·  '}
              </Text>
              협업{' '}
              <Text variant="caption" style={S.statNumber}>
                {summary.collaborationCount}
              </Text>
            </Text>
          </View>
        </View>
      </View>

      {profile.roles.length > 0 && (
        <View style={S.roles}>
          {profile.roles.map(({ code, name }, index) => {
            const key = getRoleKey(code);
            return (
              <View key={code} style={S.role}>
                {index > 0 && <View style={S.roleDivider} />}
                <Text variant="caption" color={key ? role[key].text : 'textBody'}>
                  {name}
                </Text>
              </View>
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

      <View style={S.actions}>
        <Button
          variant="secondary"
          label="프로필 편집"
          left={<PencilSimpleIcon size={16} color={color.ink} weight="bold" />}
          onPress={onPressEdit}
          style={[S.action, S.edit]}
        />
        <Press
          onPress={onPressShare}
          accessibilityRole="button"
          accessibilityLabel="프로필 공유"
          style={[S.action, S.share]}
        >
          <ExportIcon size={20} color={color.ink} />
        </Press>
      </View>
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
