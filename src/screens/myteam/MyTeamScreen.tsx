import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChevronIcon } from '@/components/icons';
import { BottomSheet, Button, Press, Text, Toast, useToast } from '@/components/ui';
import { space, useMotion } from '@/theme';

import { ApplicantDetail } from './ApplicantDetail';
import { ApplicationPanel, ProgressSteps } from './ApplicationPanel';
import { styles } from './MyTeamScreen.styles';
import {
  ApplicantCards,
  MemberStrip,
  MyTeamEmpty,
  NoApplicants,
  TeamFilterMenu,
  TeamRingCard,
} from './TeamCards';
import {
  VISIBLE_TEAM_LIMIT,
  matchesTeamFilter,
  teamPriority,
  type Applicant,
  type ApplicantDecision,
  type Application,
  type Member,
  type Team,
  type TeamFilter,
} from './types';

export type MyTeamScreenProps = {
  teams: Team[];
  application?: Application;
  applicants?: Applicant[];
  members?: Member[];
  onBrowseContests: () => void;
  onOpenTeam?: (team: Team) => void;
};

export function MyTeamScreen({
  teams,
  application,
  applicants = [],
  members = [],
  onBrowseContests,
  onOpenTeam,
}: MyTeamScreenProps) {
  const insets = useSafeAreaInsets();
  const { enter } = useMotion();
  const toast = useToast();
  const [filter, setFilter] = useState<TeamFilter>('all');
  const [showAll, setShowAll] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cancelVisible, setCancelVisible] = useState(false);
  const [applicantIndex, setApplicantIndex] = useState<number | null>(null);
  const [decisions, setDecisions] = useState<Record<string, ApplicantDecision>>({});

  const activeTeams = useMemo(() => teams.filter((team) => team.kind !== 'ended'), [teams]);
  const filteredTeams = useMemo(
    () =>
      activeTeams
        .filter((team) => matchesTeamFilter(team, filter))
        .sort((a, b) => teamPriority(a) - teamPriority(b)),
    [activeTeams, filter],
  );

  const visibleTeams = showAll ? filteredTeams : filteredTeams.slice(0, VISIBLE_TEAM_LIMIT);
  const resolvedSelectedId = filteredTeams.some((team) => team.id === selectedId)
    ? selectedId
    : filteredTeams[0]?.id;
  const selectedTeam = activeTeams.find((team) => team.id === resolvedSelectedId);
  const sections = [
    {
      label: '지원 중',
      teams: visibleTeams.filter((team) => team.kind === 'pending'),
      count: filteredTeams.filter((team) => team.kind === 'pending').length,
    },
    {
      label: '참여 중',
      teams: visibleTeams.filter((team) => team.kind !== 'pending'),
      count: filteredTeams.filter((team) => team.kind !== 'pending').length,
    },
  ].filter((section) => section.teams.length > 0);

  if (activeTeams.length === 0) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={[styles.header, { marginHorizontal: space[5] }]}>
          <Text variant="titleXl">내 팀</Text>
        </View>
        <MyTeamEmpty onBrowse={onBrowseContests} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: insets.top }]}
      >
        <View style={styles.header}>
          <Text variant="titleXl">내 팀</Text>
          <TeamFilterMenu
            value={filter}
            onChange={(nextFilter) => {
              setFilter(nextFilter);
              setShowAll(false);
            }}
          />
        </View>

        <View style={styles.sections}>
          {sections.map((section) => (
            <View key={section.label} style={styles.section}>
              <Text variant="caption" color="textMuted" style={styles.sectionTitle}>
                {section.label}{' '}
                <Text variant="caption" style={styles.sectionCount}>
                  {section.count}
                </Text>
              </Text>
              {section.teams.map((team) => (
                <TeamRingCard
                  key={team.id}
                  team={team}
                  selected={team.id === resolvedSelectedId}
                  onPress={() => setSelectedId(team.id)}
                />
              ))}
            </View>
          ))}
        </View>

        {filteredTeams.length > VISIBLE_TEAM_LIMIT ? (
          <Press
            onPress={() => setShowAll((visible) => !visible)}
            accessibilityRole="button"
            accessibilityState={{ expanded: showAll }}
            style={styles.moreButton}
          >
            <Text variant="bodyStrong">
              {showAll ? '접기' : `팀 ${filteredTeams.length - VISIBLE_TEAM_LIMIT}개 더보기`}
            </Text>
            <View style={showAll && styles.chevronUp}>
              <ChevronIcon size={16} />
            </View>
          </Press>
        ) : null}

        {selectedTeam ? (
          <Animated.View key={selectedTeam.id} entering={enter.selectionFadeUp()}>
            {selectedTeam.kind === 'pending' && application ? (
              <>
                <ProgressSteps />
                <ApplicationPanel
                  application={application}
                  onCancel={() => setCancelVisible(true)}
                />
              </>
            ) : null}

            {selectedTeam.kind === 'leader' ? (
              <>
                {applicants.length > 0 ? (
                  <ApplicantCards applicants={applicants} onOpen={setApplicantIndex} />
                ) : (
                  <NoApplicants />
                )}
                {members.length ? (
                  <MemberStrip members={members} onOpenTeam={() => onOpenTeam?.(selectedTeam)} />
                ) : null}
              </>
            ) : null}

            {selectedTeam.kind === 'member' && members.length ? (
              <MemberStrip members={members} onOpenTeam={() => onOpenTeam?.(selectedTeam)} />
            ) : null}
          </Animated.View>
        ) : null}
      </ScrollView>

      <ApplicantDetail
        visible={applicantIndex !== null}
        applicants={applicants}
        index={applicantIndex ?? 0}
        decisions={decisions}
        onIndexChange={setApplicantIndex}
        onClose={() => setApplicantIndex(null)}
        onDecide={(applicant, decision) =>
          setDecisions((current) => ({ ...current, [applicant.id]: decision }))
        }
        onUndo={(applicant) =>
          setDecisions((current) => {
            const next = { ...current };
            delete next[applicant.id];
            return next;
          })
        }
      />

      <BottomSheet
        visible={cancelVisible}
        title="지원을 취소할까요?"
        accessibilityLabel="지원 취소 확인"
        onClose={() => setCancelVisible(false)}
        footer={
          <View style={styles.sheetActions}>
            <Button
              label="계속 기다리기"
              variant="secondary"
              onPress={() => setCancelVisible(false)}
              style={styles.sheetButton}
            />
            <Button
              label="지원 취소하기"
              variant="danger"
              onPress={() => {
                setCancelVisible(false);
                toast.show('지원을 취소했어요');
              }}
              style={styles.sheetButton}
            />
          </View>
        }
      >
        <Text variant="body" color="textSecondary" style={styles.sheetDescription}>
          {selectedTeam?.name} 팀에 보낸 지원서가 사라지고 되돌릴 수 없어요.
        </Text>
      </BottomSheet>

      <Toast {...toast.props} bottom={space[3]} />
    </View>
  );
}
