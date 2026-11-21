// 아이콘은 하나씩 경로로 가져와요. 패키지 전체를 import 하면 안 쓰는 아이콘까지 번들에 들어갈 수 있어요.
import { BriefcaseIcon } from 'phosphor-react-native/src/icons/Briefcase';
import { CodeIcon } from 'phosphor-react-native/src/icons/Code';
import { FlagIcon } from 'phosphor-react-native/src/icons/Flag';
import { GraduationCapIcon } from 'phosphor-react-native/src/icons/GraduationCap';
import { HeartIcon } from 'phosphor-react-native/src/icons/Heart';
import { MegaphoneIcon } from 'phosphor-react-native/src/icons/Megaphone';
import { RankingIcon } from 'phosphor-react-native/src/icons/Ranking';
import { TrophyIcon } from 'phosphor-react-native/src/icons/Trophy';

import type { ActivityType } from '@/screens/contests/contest';

export type HomeCategoryLabel =
  '공모전' | '대외활동' | '해커톤' | '경진대회' | '서포터즈' | '봉사' | '인턴' | '교육';

export type HomeCategory = {
  label: HomeCategoryLabel;
  Icon: typeof TrophyIcon;
  // 공모전 목록 필터로 넘길 활동 유형. 맞는 값이 없으면 null
  // TODO: '대외활동'·'인턴'에 맞는 활동 유형이 API에 없어서, 목록 연결 전에 기획과 확인 필요
  activityType: ActivityType | null;
};

// 분야별 둘러보기, 관심 분야 선택 배너에서 함께 쓰는 분야 목록
export const HOME_CATEGORIES: HomeCategory[] = [
  { label: '공모전', Icon: TrophyIcon, activityType: 'CONTEST' },
  { label: '대외활동', Icon: FlagIcon, activityType: null },
  { label: '해커톤', Icon: CodeIcon, activityType: 'HACKATHON' },
  { label: '경진대회', Icon: RankingIcon, activityType: 'COMPETITION' },
  { label: '서포터즈', Icon: MegaphoneIcon, activityType: 'SUPPORTERS' },
  { label: '봉사', Icon: HeartIcon, activityType: 'VOLUNTEERING' },
  { label: '인턴', Icon: BriefcaseIcon, activityType: null },
  { label: '교육', Icon: GraduationCapIcon, activityType: 'EDUCATION_PROGRAM' },
];
