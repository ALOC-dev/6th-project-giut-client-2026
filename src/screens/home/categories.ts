// 번들 크기를 줄이려고 아이콘을 하나씩 경로로 가져와요
import { AirplaneIcon } from 'phosphor-react-native/src/icons/Airplane';
import { CalendarBlankIcon } from 'phosphor-react-native/src/icons/CalendarBlank';
import { CodeIcon } from 'phosphor-react-native/src/icons/Code';
import { DotsThreeCircleIcon } from 'phosphor-react-native/src/icons/DotsThreeCircle';
import { GraduationCapIcon } from 'phosphor-react-native/src/icons/GraduationCap';
import { HeartIcon } from 'phosphor-react-native/src/icons/Heart';
import { LightbulbIcon } from 'phosphor-react-native/src/icons/Lightbulb';
import { MegaphoneIcon } from 'phosphor-react-native/src/icons/Megaphone';
import { RankingIcon } from 'phosphor-react-native/src/icons/Ranking';
import { TrophyIcon } from 'phosphor-react-native/src/icons/Trophy';

import type { ActivityType } from '@/screens/contests/contest';

export type HomeCategoryLabel =
  | '공모전'
  | '경진대회'
  | '해커톤'
  | '서포터즈'
  | '봉사'
  | '창업'
  | '교육'
  | '해외'
  | '행사'
  | '기타';

export type HomeCategory = {
  label: HomeCategoryLabel;
  Icon: typeof TrophyIcon;
  activityType: ActivityType | null;
};

export const HOME_CATEGORIES: HomeCategory[] = [
  { label: '공모전', Icon: TrophyIcon, activityType: 'CONTEST' },
  { label: '경진대회', Icon: RankingIcon, activityType: 'COMPETITION' },
  { label: '해커톤', Icon: CodeIcon, activityType: 'HACKATHON' },
  { label: '서포터즈', Icon: MegaphoneIcon, activityType: 'SUPPORTERS' },
  { label: '봉사', Icon: HeartIcon, activityType: 'VOLUNTEERING' },
  { label: '창업', Icon: LightbulbIcon, activityType: 'STARTUP' },
  { label: '교육', Icon: GraduationCapIcon, activityType: 'EDUCATION_PROGRAM' },
  { label: '해외', Icon: AirplaneIcon, activityType: 'OVERSEAS_EXPLORATION' },
  { label: '행사', Icon: CalendarBlankIcon, activityType: 'EVENT_NETWORKING' },
  { label: '기타', Icon: DotsThreeCircleIcon, activityType: 'ETC' },
];
