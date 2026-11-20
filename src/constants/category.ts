// 아이콘은 하나씩 경로로 가져와요. 패키지 전체를 import 하면 안 쓰는 아이콘까지 번들에 들어갈 수 있어요.
import { BriefcaseIcon } from 'phosphor-react-native/src/icons/Briefcase';
import { CodeIcon } from 'phosphor-react-native/src/icons/Code';
import { FlagIcon } from 'phosphor-react-native/src/icons/Flag';
import { GraduationCapIcon } from 'phosphor-react-native/src/icons/GraduationCap';
import { HeartIcon } from 'phosphor-react-native/src/icons/Heart';
import { MegaphoneIcon } from 'phosphor-react-native/src/icons/Megaphone';
import { RankingIcon } from 'phosphor-react-native/src/icons/Ranking';
import { TrophyIcon } from 'phosphor-react-native/src/icons/Trophy';

import type { ContestCategory } from '@/types/contest';

export type CategoryItem = {
  label: ContestCategory;
  Icon: typeof TrophyIcon;
};

// 분야별 둘러보기, 관심 분야 선택 배너에서 함께 쓰는 분야 목록
export const CATEGORIES: CategoryItem[] = [
  { label: '공모전', Icon: TrophyIcon },
  { label: '대외활동', Icon: FlagIcon },
  { label: '해커톤', Icon: CodeIcon },
  { label: '경진대회', Icon: RankingIcon },
  { label: '서포터즈', Icon: MegaphoneIcon },
  { label: '봉사', Icon: HeartIcon },
  { label: '인턴', Icon: BriefcaseIcon },
  { label: '교육', Icon: GraduationCapIcon },
];
