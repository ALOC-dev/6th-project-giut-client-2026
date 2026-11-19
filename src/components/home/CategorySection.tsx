// 아이콘은 하나씩 경로로 가져와요. 패키지 전체를 import 하면 안 쓰는 아이콘까지 번들에 들어갈 수 있어요.
import { BriefcaseIcon } from 'phosphor-react-native/src/icons/Briefcase';
import { CodeIcon } from 'phosphor-react-native/src/icons/Code';
import { FlagIcon } from 'phosphor-react-native/src/icons/Flag';
import { GraduationCapIcon } from 'phosphor-react-native/src/icons/GraduationCap';
import { HeartIcon } from 'phosphor-react-native/src/icons/Heart';
import { MegaphoneIcon } from 'phosphor-react-native/src/icons/Megaphone';
import { RankingIcon } from 'phosphor-react-native/src/icons/Ranking';
import { TrophyIcon } from 'phosphor-react-native/src/icons/Trophy';
import { StyleSheet, View } from 'react-native';

import { Press, Text } from '@/components/ui';
import { color, space } from '@/theme';
import type { ContestCategory } from '@/types/contest';

type CategoryItem = {
  label: ContestCategory;
  Icon: typeof TrophyIcon;
};

const CATEGORIES: CategoryItem[] = [
  { label: '공모전', Icon: TrophyIcon },
  { label: '대외활동', Icon: FlagIcon },
  { label: '해커톤', Icon: CodeIcon },
  { label: '경진대회', Icon: RankingIcon },
  { label: '서포터즈', Icon: MegaphoneIcon },
  { label: '봉사', Icon: HeartIcon },
  { label: '인턴', Icon: BriefcaseIcon },
  { label: '교육', Icon: GraduationCapIcon },
];

export function CategorySection() {
  return (
    <View style={S.section}>
      <View style={S.header}>
        <Text variant="titleMd">분야별로 둘러보기</Text>
        <Text variant="caption" color="textMuted">
          전체 보기 ›
        </Text>
      </View>
      <View style={S.grid}>
        {CATEGORIES.map(({ label, Icon }) => (
          <Press key={label} style={S.item} onPress={() => {}}>
            <Icon size={24} color={color.ink} />
            <Text variant="caption">{label}</Text>
          </Press>
        ))}
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  section: {
    paddingTop: space[6],
    gap: space[3],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: space[4],
  },
  grid: {
    paddingTop: space[4],
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: space[4],
    rowGap: space[5],
  },
  item: {
    width: '25%',
    alignItems: 'center',
    gap: space[2],
  },
});
