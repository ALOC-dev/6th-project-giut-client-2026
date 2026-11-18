import { memo, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Easing as RNEasing,
  FlatList,
  Modal,
  Pressable,
  Animated as RNAnimated,
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AnimatedBookmarkIcon,
  AnimatedFilterIcon,
  CheckIcon,
  ChevronIcon,
  EyeIcon,
  PlusIcon,
  TeamIcon,
} from '@/components/icons';
import {
  AppHeader,
  BottomNavigationHeightContext,
  Button,
  Odometer,
  Press,
  Text,
} from '../../components/ui';
import { color, radius, shadow, space, text, useMotion } from '../../theme';

/**
 * 공모전 목록 — 서버 enum을 그대로 옮긴 타입.
 * 값 이름은 /contests 쿼리 파라미터(category, status, activityType)와 1:1이다.
 */

export const ACTIVITY_TYPES = [
  'COMPETITION',
  'CONTEST',
  'HACKATHON',
  'SUPPORTERS',
  'VOLUNTEERING',
  'STARTUP',
  'EDUCATION_PROGRAM',
  'OVERSEAS_EXPLORATION',
  'EVENT_NETWORKING',
  'ETC',
  'NOT_ACTIVITY',
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const CATEGORIES = [
  'PLANNING_IDEA',
  'ADVERTISING_MARKETING',
  'AI_DATA',
  'PAPER_REPORT',
  'VIDEO_UCC_PHOTO',
  'DESIGN_CHARACTER_WEBTOON',
  'WEB_MOBILE_IT',
  'GAME_SOFTWARE',
  'SCIENCE_ENGINEERING',
  'LITERATURE_WRITING_SCENARIO',
  'ARCHITECTURE_CONSTRUCTION_INTERIOR',
  'NAMING_SLOGAN',
  'ENTERTAINMENT_ART_MUSIC',
  'ETC',
] as const;
export type Category = (typeof CATEGORIES)[number];

export const CONTEST_STATUSES = ['UPCOMING', 'OPEN', 'CLOSED'] as const;
export type ContestStatus = (typeof CONTEST_STATUSES)[number];

export type Contest = {
  id: string;
  /** 주최 */
  org: string;
  title: string;
  /** 마감일. 'YYYY-MM-DD' */
  deadline: string;
  category: Category;
  activityType: ActivityType;
  status: ContestStatus;
  /** 이 공모전에서 팀원을 찾는 팀 수. 0이면 회색으로 보인다. */
  teamCount: number;
  views: number;
  scraps: number;
  /** 활동 기간. 기간 필터는 이 구간과 겹치는지를 본다. */
  activityFrom: string;
  activityTo: string;
};

/** 화면이 들고 있는 필터 상태. 시트에서 고르는 값 그대로다. */
export type ContestFilter = {
  /** 상단 탭. null이면 전체 */
  activityType: ActivityType | null;
  /** 시트의 분야. 여러 개 고를 수 있다 */
  categories: Category[];
  /** 참여 가능한 기간. 둘 다 있을 때만 거른다. 'YYYY-MM-DD' */
  from: string | null;
  to: string | null;
};

export const EMPTY_FILTER: ContestFilter = {
  activityType: null,
  categories: [],
  from: null,
  to: null,
};

/** 걸린 조건 개수 — 필터 버튼 옆 배지에 쓴다. 탭은 따로 보이니 빼고 센다. */
export function countFilters(f: ContestFilter): number {
  return f.categories.length + (f.from && f.to ? 1 : 0);
}

export const ACTIVITY_LABEL: Record<ActivityType, string> = {
  CONTEST: '공모전',
  COMPETITION: '경진대회',
  HACKATHON: '해커톤',
  SUPPORTERS: '서포터즈',
  VOLUNTEERING: '봉사활동',
  STARTUP: '창업',
  EDUCATION_PROGRAM: '교육 프로그램',
  OVERSEAS_EXPLORATION: '해외탐방',
  EVENT_NETWORKING: '행사/네트워킹',
  ETC: '기타',
  NOT_ACTIVITY: '해당 없음',
};

export const CATEGORY_LABEL: Record<Category, string> = {
  PLANNING_IDEA: '기획/아이디어',
  ADVERTISING_MARKETING: '광고/마케팅',
  AI_DATA: 'AI/데이터',
  PAPER_REPORT: '논문/리포트',
  VIDEO_UCC_PHOTO: '영상/UCC/사진',
  DESIGN_CHARACTER_WEBTOON: '디자인/캐릭터/웹툰',
  WEB_MOBILE_IT: '웹/모바일/IT',
  GAME_SOFTWARE: '게임/소프트웨어',
  SCIENCE_ENGINEERING: '과학/공학',
  LITERATURE_WRITING_SCENARIO: '문학/글쓰기/시나리오',
  ARCHITECTURE_CONSTRUCTION_INTERIOR: '건축/건설/인테리어',
  NAMING_SLOGAN: '네이밍/슬로건',
  ENTERTAINMENT_ART_MUSIC: '엔터/예술/음악',
  ETC: '기타',
};

/**
 * 상단 탭 순서 — 가나다가 아니라 중요도 순이다. 첫 칸이 트래픽을 가져간다.
 * NOT_ACTIVITY는 데이터를 분류하는 표시라 사용자에게 보여주지 않는다.
 */
export const ACTIVITY_TABS: ActivityType[] = [
  'CONTEST',
  'COMPETITION',
  'HACKATHON',
  'SUPPORTERS',
  'VOLUNTEERING',
  'STARTUP',
  'EDUCATION_PROGRAM',
  'OVERSEAS_EXPLORATION',
  'EVENT_NETWORKING',
  'ETC',
];

/**
 * 시트의 분야 순서 — 14개라 찾아야 하므로 가나다. '기타'만 맨 뒤에 고정한다.
 * (가나다로는 건축·게임·과학 다음 네 번째에 오는데, 나머지를 받는 칸이라 끝이 맞다)
 */
export const CATEGORY_OPTIONS: Category[] = (Object.keys(CATEGORY_LABEL) as Category[]).sort(
  (a, b) => {
    if (a === 'ETC') return 1;
    if (b === 'ETC') return -1;
    return CATEGORY_LABEL[a].localeCompare(CATEGORY_LABEL[b], 'ko');
  },
);

/** 'YYYY-MM-DD' <-> Date. 시간대 때문에 Date.parse를 쓰지 않는다. */

export function parseDay(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function toISODay(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function startOfToday(): Date {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

/** 오늘로부터 며칠 남았나. 오늘이면 0, 지났으면 음수. */
export function daysUntil(iso: string, today = startOfToday()): number {
  return Math.round((parseDay(iso).getTime() - today.getTime()) / 86400000);
}

const WEEK = '일월화수목금토';

/** '11.08 (토)' */
export function formatDay(iso: string): string {
  const d = parseDay(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getMonth() + 1)}.${p(d.getDate())} (${WEEK[d.getDay()]})`;
}

/** 목록 카드의 날짜 줄. 오늘·내일이면 D-day를 따로 보여주므로 '마감'을 붙이지 않는다. */
export function formatDeadline(iso: string, today = startOfToday()): string {
  const left = daysUntil(iso, today);
  return left <= 1 ? formatDay(iso) : `${formatDay(iso)} 마감`;
}

/** 오늘·내일만 D-day를 보여준다. 그 밖에는 빈 문자열. */
export function ddayLabel(iso: string, today = startOfToday()): string {
  const left = daysUntil(iso, today);
  if (left <= 0) return '오늘 마감';
  if (left === 1) return '내일 마감';
  return '';
}

/** 두 기간이 하루라도 겹치나 */
export function overlaps(aFrom: string, aTo: string, bFrom: string, bTo: string): boolean {
  return parseDay(aFrom) <= parseDay(bTo) && parseDay(aTo) >= parseDay(bFrom);
}

export type ScrapButtonProps = {
  saved: boolean;
  count: number;
  onPress: () => void;
};

/**
 * 스크랩 버튼. 켤 때만 터진다 — 끌 때는 살짝 눌렸다 돌아오기만 한다.
 * 고리와 점은 누른 뒤에만 나타나므로, 화면에 처음 그려질 때는 조용하다.
 */
export function ScrapButton({ saved, count, onPress }: ScrapButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={saved ? '스크랩 해제' : '스크랩'}
      accessibilityState={{ selected: saved }}
      style={scrapStyles.btn}
    >
      <AnimatedBookmarkIcon saved={saved} />
      <Odometer value={count} roll={false} />
    </Pressable>
  );
}

const scrapStyles = StyleSheet.create({
  btn: {
    width: 44,
    minHeight: 56,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    marginRight: -space[2],
    borderRadius: radius.md,
  },
});

export type FilterButtonProps = {
  count: number;
  onPress: () => void;
};

/** 필터 버튼. 누르면 위아래 손잡이가 반대 방향으로 움직였다가 돌아온다. */
export function FilterButton({ count, onPress }: FilterButtonProps) {
  const [animationKey, setAnimationKey] = useState(0);
  const tone = count > 0 ? color.brand : color.ink;

  return (
    <Pressable
      onPress={() => {
        setAnimationKey((current) => current + 1);
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={count > 0 ? `필터, 조건 ${count}개` : '필터'}
      style={filterButtonStyles.btn}
    >
      <Text variant="bodyStrong" color={count > 0 ? 'brand' : 'ink'}>
        필터
      </Text>
      {count > 0 && (
        <View style={filterButtonStyles.badge}>
          <Text variant="micro" color="surface">
            {count}
          </Text>
        </View>
      )}
      <AnimatedFilterIcon color={tone} animationKey={animationKey} />
    </Pressable>
  );
}

const filterButtonStyles = StyleSheet.create({
  btn: { flexDirection: 'row', alignItems: 'center', gap: space[1], paddingVertical: space[1] },
  badge: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    backgroundColor: color.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const CELL = 36;

export type RangeCalendarProps = {
  /** 'YYYY-MM-DD' */
  from: string | null;
  to: string | null;
  onChange: (next: { from: string | null; to: string | null }) => void;
};

type Cell = { key: string; day: number; iso: string; t: number } | { key: string; day: null };

function monthCells(base: Date): Cell[] {
  const first = base.getDay();
  const dim = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  const out: Cell[] = [];
  for (let i = 0; i < 42; i++) {
    const day = i - first + 1;
    if (day < 1 || day > dim) {
      out.push({ key: `e${i}`, day: null });
      continue;
    }
    const d = new Date(base.getFullYear(), base.getMonth(), day);
    out.push({ key: `d${i}`, day, iso: toISODay(d), t: d.getTime() });
  }
  return out;
}

/**
 * 기간 선택 달력.
 *
 * 선택 구간 띠는 칸의 반쪽씩만 칠한다. 시작 칸은 오른쪽 반, 끝 칸은 왼쪽 반.
 * 원이 칸 가운데 36px로 앉으니, 띠가 원 뒤에서 나오는 것처럼 보이고 밖으로 삐져나오지 않는다.
 */
export function RangeCalendar({ from, to, onChange }: RangeCalendarProps) {
  const [offset, setOffset] = useState(0);
  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const cells = monthCells(base);

  const startT = from ? dayT(from) : null;
  const endT = to ? dayT(to) : null;

  const pick = (t: number, iso: string) => {
    if (startT === null || endT !== null) {
      onChange({ from: iso, to: null });
      return;
    }
    if (t < startT) onChange({ from: iso, to: toISO(startT) });
    else onChange({ from: toISO(startT), to: iso });
  };

  return (
    <View>
      <View style={calendarStyles.head}>
        <Pressable
          onPress={() => setOffset((o) => o - 1)}
          accessibilityLabel="이전 달"
          style={calendarStyles.navBtn}
        >
          <ChevronIcon dir="left" size={18} />
        </Pressable>
        <Text variant="label">{`${base.getFullYear()}년 ${base.getMonth() + 1}월`}</Text>
        <Pressable
          onPress={() => setOffset((o) => o + 1)}
          accessibilityLabel="다음 달"
          style={calendarStyles.navBtn}
        >
          <ChevronIcon dir="right" size={18} />
        </Pressable>
      </View>

      <View style={calendarStyles.weekRow}>
        {WEEKDAYS.map((w, i) => (
          <Text
            key={w}
            variant="badge"
            style={[
              calendarStyles.weekday,
              { color: i === 0 ? color.daySun : i === 6 ? color.daySat : color.ink },
            ]}
          >
            {w}
          </Text>
        ))}
      </View>

      <View style={calendarStyles.grid}>
        {cells.map((c) => {
          if (c.day === null) return <View key={c.key} style={calendarStyles.cell} />;

          const isStart = startT !== null && c.t === startT;
          const isEnd = endT !== null && c.t === endT;
          const inRange = startT !== null && endT !== null && c.t > startT && c.t < endT;
          const selected = isStart || isEnd;
          const single = isStart && isEnd;
          const hasRange = startT !== null && endT !== null;

          const bandLeft = inRange || (isEnd && hasRange && !single);
          const bandRight = inRange || (isStart && hasRange && !single);

          return (
            <Pressable
              key={c.key}
              onPress={() => pick(c.t, c.iso)}
              accessibilityRole="button"
              accessibilityLabel={c.iso}
              accessibilityState={{ selected }}
              style={calendarStyles.cell}
            >
              {bandLeft && <View style={[calendarStyles.band, calendarStyles.bandLeft]} />}
              {bandRight && <View style={[calendarStyles.band, calendarStyles.bandRight]} />}
              <View style={[calendarStyles.circle, selected && calendarStyles.circleOn]}>
                <Text
                  style={[
                    calendarStyles.dayText,
                    selected && { color: color.surface, fontFamily: 'Pretendard-ExtraBold' },
                  ]}
                >
                  {c.day}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function dayT(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).getTime();
}
function toISO(t: number): string {
  return toISODay(new Date(t));
}

const calendarStyles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[1],
    paddingBottom: 18,
  },
  navBtn: { padding: 6 },
  weekRow: { flexDirection: 'row', marginBottom: space[4] },
  weekday: { flex: 1, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: space[1] },
  cell: {
    width: `${100 / 7}%`,
    height: CELL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  band: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50%',
    backgroundColor: color.brandTint,
  },
  bandLeft: { left: 0 },
  bandRight: { right: 0 },
  circle: {
    width: CELL,
    height: CELL,
    borderRadius: CELL / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleOn: { backgroundColor: color.brand },
  dayText: { ...text.caption, fontFamily: 'Pretendard-Medium', color: color.ink },
});

export type FilterSheetProps = {
  open: boolean;
  /** 지금 화면에 걸려 있는 조건. 시트는 복사본을 고치고, 적용할 때만 올려 보낸다. */
  value: ContestFilter;
  onClose: () => void;
  onApply: (next: ContestFilter) => void;
};

/**
 * 분야와 참여 가능한 기간을 고르는 바텀시트.
 *
 * 높이는 화면의 84%까지. 손잡이·전체 초기화와 맨 아래 버튼은 고정이고 가운데만 스크롤된다.
 * 안 그러면 분야 14개 + 달력이 화면 위를 뚫고 나간다.
 */
export function FilterSheet({ open, value, onClose, onApply }: FilterSheetProps) {
  const [draft, setDraft] = useState(value);

  const toggle = (c: Category) =>
    setDraft((d) => ({
      ...d,
      categories: d.categories.includes(c)
        ? d.categories.filter((x) => x !== c)
        : [...d.categories, c],
    }));

  const close = () => {
    setDraft(value);
    onClose();
  };

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={close}>
      <Pressable style={filterSheetStyles.backdrop} onPress={close} accessibilityLabel="닫기" />
      <View style={filterSheetStyles.sheet}>
        <View style={filterSheetStyles.handle} />

        <View style={filterSheetStyles.resetRow}>
          <Pressable
            onPress={() => setDraft({ ...draft, categories: [], from: null, to: null })}
            style={filterSheetStyles.resetBtn}
          >
            <Text variant="caption" color="textMuted">
              전체 초기화
            </Text>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={filterSheetStyles.scrollBody}
        >
          <Text variant="titleMd">분야</Text>
          <View style={filterSheetStyles.list}>
            {CATEGORY_OPTIONS.map((c) => {
              const on = draft.categories.includes(c);
              return (
                <Pressable
                  key={c}
                  onPress={() => toggle(c)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                  style={filterSheetStyles.listRow}
                >
                  <Text variant="label" color={on ? 'brand' : 'textSecondary'}>
                    {CATEGORY_LABEL[c]}
                  </Text>
                  <View style={[filterSheetStyles.dot, on && filterSheetStyles.dotOn]}>
                    {on && <CheckIcon />}
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={filterSheetStyles.divider} />

          <Text variant="titleMd">참여 가능한 기간</Text>
          <View style={filterSheetStyles.calWrap}>
            <RangeCalendar
              from={draft.from}
              to={draft.to}
              onChange={({ from, to }) => setDraft((d) => ({ ...d, from, to }))}
            />
          </View>
        </ScrollView>

        <Button
          label="적용하기"
          onPress={() => {
            onApply(draft);
            onClose();
          }}
          style={filterSheetStyles.apply}
        />
      </View>
    </Modal>
  );
}

const filterSheetStyles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(15,20,35,0.40)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '84%',
    backgroundColor: color.surface,
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    paddingHorizontal: space[5],
    paddingTop: space[3],
    paddingBottom: space[8],
    ...shadow.menu,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: color.line,
    alignSelf: 'center',
  },
  resetRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  resetBtn: { paddingVertical: space[1] },
  scrollBody: { gap: space[4], paddingBottom: space[2] },
  list: { marginHorizontal: -space[2], marginTop: -6 },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: space[2],
    borderRadius: radius.lg,
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotOn: { backgroundColor: color.brand, borderColor: color.brand },
  divider: { height: 1, backgroundColor: color.lineSoft, marginTop: 2 },
  calWrap: { marginHorizontal: -space[2], marginTop: -6 },
  apply: { marginTop: space[2] },
});

/**
 * 첫 화면에 보이는 만큼만 차례로 올라온다.
 * 전부 걸면 FlatList가 카드를 다시 마운트할 때마다 재생돼서,
 * 스크롤 중에 카드 자리가 비어 보인다(여섯 번째부터는 지연이 320ms로 고정).
 */
const FIRST_SCREEN = 6;

export type ContestCardProps = {
  contest: Contest;
  saved: boolean;
  /** 목록에서 몇 번째인지. 처음 그려질 때 차례로 올라오게 한다. */
  index?: number;
  onPress: (c: Contest) => void;
  onToggleSave: (c: Contest) => void;
};

/**
 * 목록 한 줄. 카드 테두리 없이 구분선만으로 나뉜다.
 *
 * 제목 무게는 디자인이 500(Medium)이고 토큰 title-md는 700이다.
 * 둘 중 하나로 정해지면 variant="titleMd" 하나로 합칠 것.
 */
function ContestCardBase({ contest, saved, index = 0, onPress, onToggleSave }: ContestCardProps) {
  const { enter } = useMotion();
  const dday = ddayLabel(contest.deadline);
  const hasTeams = contest.teamCount > 0;

  return (
    <Animated.View entering={index < FIRST_SCREEN ? enter.fadeUp(index) : undefined}>
      <Press onPress={() => onPress(contest)} style={cardStyles.row}>
        <View style={cardStyles.body}>
          <Text variant="caption" color="ink">
            {contest.org}
          </Text>

          <Text style={cardStyles.title} numberOfLines={2}>
            {contest.title}
          </Text>

          <View style={cardStyles.dateRow}>
            {dday !== '' && (
              <Text variant="titleSm" color="brand">
                {dday}
              </Text>
            )}
            <Text variant="caption" color="ink">
              {formatDeadline(contest.deadline)}
            </Text>
          </View>

          <View style={cardStyles.metaRow}>
            <View style={cardStyles.teamWrap}>
              <TeamIcon color={hasTeams ? color.ink : color.textFaint} />
              <Text
                variant="caption"
                color={hasTeams ? 'ink' : 'textFaint'}
                style={cardStyles.teamCount}
              >
                {contest.teamCount}팀
              </Text>
            </View>
            <View style={cardStyles.viewsWrap}>
              <EyeIcon />
              <Odometer value={contest.views} />
            </View>
          </View>
        </View>

        <ScrapButton
          saved={saved}
          count={contest.scraps + (saved ? 1 : 0)}
          onPress={() => onToggleSave(contest)}
        />
      </Press>
    </Animated.View>
  );
}

export const ContestCard = memo(ContestCardBase);

const cardStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: space[3],
    paddingVertical: space[4],
    paddingHorizontal: space[5],
  },
  body: { flex: 1, minWidth: 0, gap: 6 },
  title: {
    ...text.titleMd,
    fontFamily: 'Pretendard-Medium',
    color: color.ink,
  },
  dateRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: space[3], marginTop: 2 },
  teamWrap: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  teamCount: { fontFamily: 'Pretendard-Bold' },
  viewsWrap: { flexDirection: 'row', alignItems: 'center', gap: 3 },
});

const SORTS = [
  { key: 'deadline', label: '마감 임박 순' },
  { key: 'recent', label: '최근 등록 순' },
  { key: 'views', label: '조회수 순' },
  { key: 'scraps', label: '스크랩 순' },
] as const;
type SortKey = (typeof SORTS)[number]['key'];

const EMPTY_PATH_X = [0, -34, -20, 4, 0];
const EMPTY_PATH_Y = [0, 8, 34, 22, 0];

function EmptyContests({ title }: { title: string }) {
  const { reduced } = useMotion();
  const [progress] = useState(() => new RNAnimated.Value(0));

  useEffect(() => {
    if (reduced) {
      progress.stopAnimation();
      progress.setValue(0);
      return;
    }

    const loop = RNAnimated.loop(
      RNAnimated.timing(progress, {
        toValue: 1,
        duration: 3600,
        easing: RNEasing.inOut(RNEasing.ease),
        useNativeDriver: true,
      }),
    );
    loop.start();

    return () => loop.stop();
  }, [progress, reduced]);

  const inputRange = [0, 0.25, 0.5, 0.75, 1];
  const translateX = progress.interpolate({ inputRange, outputRange: EMPTY_PATH_X });
  const translateY = progress.interpolate({ inputRange, outputRange: EMPTY_PATH_Y });

  return (
    <View style={emptyStyles.wrap}>
      <View style={emptyStyles.art} accessible accessibilityLabel="공모전을 찾는 중">
        <View style={emptyStyles.cardBack} />
        <View style={emptyStyles.cardFront}>
          <View style={[emptyStyles.line, emptyStyles.lineTint]} />
          <View style={emptyStyles.line} />
          <View style={[emptyStyles.line, emptyStyles.lineShort]} />
          <View style={[emptyStyles.line, emptyStyles.lineLast]} />
        </View>

        <RNAnimated.View
          style={[emptyStyles.lens, { transform: [{ translateX }, { translateY }] }]}
        >
          <View style={emptyStyles.lensGlass}>
            <View style={emptyStyles.lensShine} />
          </View>
          <View style={emptyStyles.lensHandle} />
        </RNAnimated.View>
      </View>

      <Text variant="titleLg" style={emptyStyles.title}>
        {title}
      </Text>
    </View>
  );
}

export type ContestListScreenProps = {
  contests: Contest[];
  /** 스크랩한 공모전 id */
  savedIds?: string[];
  onToggleSave?: (c: Contest) => void;
  onPressContest?: (c: Contest) => void;
  onPressCreate?: () => void;
};

export function ContestListScreen({
  contests,
  savedIds = [],
  onToggleSave,
  onPressContest,
  onPressCreate,
}: ContestListScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomNavigationHeight = useContext(BottomNavigationHeightContext);
  const [filter, setFilter] = useState<ContestFilter>(EMPTY_FILTER);
  const [sort, setSort] = useState<SortKey>('deadline');
  const [sheet, setSheet] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const saved = useMemo(() => new Set(savedIds), [savedIds]);

  const list = useMemo(() => {
    const out = contests.filter((c) => {
      if (filter.activityType && c.activityType !== filter.activityType) return false;
      if (filter.categories.length && !filter.categories.includes(c.category)) return false;
      if (
        filter.from &&
        filter.to &&
        !overlaps(c.activityFrom, c.activityTo, filter.from, filter.to)
      )
        return false;
      return true;
    });
    const by: Record<SortKey, (a: Contest, b: Contest) => number> = {
      deadline: (a, b) => daysUntil(a.deadline) - daysUntil(b.deadline),
      recent: (a, b) => b.id.localeCompare(a.id),
      views: (a, b) => b.views - a.views,
      scraps: (a, b) => b.scraps - a.scraps,
    };
    return [...out].sort(by[sort]);
  }, [contests, filter, sort]);

  // FAB은 아래로 스크롤하면 글자를 접고 동그래진다.
  const [fabWidth] = useState(() => new RNAnimated.Value(1));
  const lastY = useRef(0);
  const mini = useRef(false);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const next =
      y > 12 && y > lastY.current ? true : y < lastY.current - 4 || y <= 12 ? false : mini.current;
    lastY.current = y;
    if (next !== mini.current) {
      mini.current = next;
      RNAnimated.spring(fabWidth, {
        toValue: next ? 0 : 1,
        useNativeDriver: false,
        damping: 18,
        stiffness: 220,
      }).start();
    }
  };

  const filterCount = countFilters(filter);
  const sortLabel = SORTS.find((x) => x.key === sort)!.label;

  return (
    <View style={[screenStyles.screen, { paddingTop: insets.top }]}>
      <AppHeader
        onPressNotification={() => undefined}
        onPressSearch={() => undefined}
        hasUnreadNotification
        style={screenStyles.header}
      />

      <View style={screenStyles.tabsWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={screenStyles.tabs}
        >
          {[null, ...ACTIVITY_TABS].map((t) => {
            const on = filter.activityType === t;
            return (
              <Pressable
                key={t ?? 'all'}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                style={[screenStyles.tab, on && screenStyles.tabOn]}
                onPress={() => setFilter((f) => ({ ...f, activityType: t }))}
              >
                <Text
                  variant="titleSm"
                  color={on ? 'ink' : 'textFaint'}
                  style={on ? undefined : screenStyles.tabOff}
                  numberOfLines={1}
                >
                  {t === null ? '전체' : ACTIVITY_LABEL[t]}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={list}
        keyExtractor={(c) => c.id}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={[
          { paddingBottom: bottomNavigationHeight },
          list.length === 0 && screenStyles.emptyListContent,
        ]}
        ListHeaderComponent={
          <View style={screenStyles.countRow}>
            <Text variant="body" color="textSecondary">
              총 <Text variant="bodyStrong">{list.length}</Text>건
            </Text>
            <View style={screenStyles.controls}>
              <Pressable onPress={() => setSortOpen(true)} style={screenStyles.control}>
                <Text variant="bodyStrong">{sortLabel}</Text>
                <ChevronIcon size={13} />
              </Pressable>
              <View style={screenStyles.sep} />
              <FilterButton count={filterCount} onPress={() => setSheet(true)} />
            </View>
          </View>
        }
        ItemSeparatorComponent={() => <View style={screenStyles.sepLine} />}
        renderItem={({ item, index }) => (
          <ContestCard
            contest={item}
            index={index}
            saved={saved.has(item.id)}
            onPress={(c) => onPressContest?.(c)}
            onToggleSave={(c) => onToggleSave?.(c)}
          />
        )}
        ListEmptyComponent={
          <EmptyContests
            title={contests.length === 0 ? '아직 공모전이 없어요' : '해당 조건의 공고가 없어요'}
          />
        }
      />

      <RNAnimated.View
        style={[
          screenStyles.fab,
          {
            bottom: bottomNavigationHeight + space[2],
            paddingHorizontal: fabWidth.interpolate({ inputRange: [0, 1], outputRange: [0, 18] }),
          },
        ]}
      >
        <Press
          onPress={onPressCreate}
          style={screenStyles.fabInner}
          accessibilityLabel="공모전 등록"
        >
          <PlusIcon />
          <RNAnimated.View
            style={{
              opacity: fabWidth,
              maxWidth: fabWidth.interpolate({ inputRange: [0, 1], outputRange: [0, 90] }),
              marginLeft: fabWidth.interpolate({ inputRange: [0, 1], outputRange: [0, 6] }),
            }}
          >
            <Text variant="label" color="surface" numberOfLines={1}>
              공모전 등록
            </Text>
          </RNAnimated.View>
        </Press>
      </RNAnimated.View>

      <FilterSheet
        open={sheet}
        value={filter}
        onClose={() => setSheet(false)}
        onApply={(next) => setFilter(next)}
      />

      <Modal
        visible={sortOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSortOpen(false)}
      >
        <Pressable
          style={screenStyles.backdrop}
          onPress={() => setSortOpen(false)}
          accessibilityLabel="닫기"
        />
        <View style={[screenStyles.sortSheet, { paddingBottom: space[8] + insets.bottom }]}>
          <View style={screenStyles.handle} />
          <Text variant="titleMd" style={screenStyles.sortTitle}>
            정렬
          </Text>
          {SORTS.map((o) => (
            <Pressable
              key={o.key}
              onPress={() => {
                setSort(o.key);
                setSortOpen(false);
              }}
              style={screenStyles.sortRow}
            >
              <Text variant="label" color={sort === o.key ? 'brand' : 'ink'}>
                {o.label}
              </Text>
              {sort === o.key && <CheckIcon size={16} color={color.brand} />}
            </Pressable>
          ))}
        </View>
      </Modal>
    </View>
  );
}

const screenStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.surface },
  header: {
    borderBottomWidth: 0,
  },
  tabsWrap: {
    flexGrow: 0,
    borderBottomWidth: 1,
    borderBottomColor: color.lineSoft,
  },
  tabs: { paddingHorizontal: space[5], gap: 22 },
  tab: {
    paddingTop: 10,
    paddingBottom: 11,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -1,
  },
  tabOn: { borderBottomColor: color.ink },
  tabOff: { fontFamily: 'Pretendard-Medium' },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space[5],
    paddingTop: 14,
    paddingBottom: 0,
  },
  controls: { flexDirection: 'row', alignItems: 'center', gap: space[3] },
  control: { flexDirection: 'row', alignItems: 'center', gap: space[1], paddingVertical: space[1] },
  sep: { width: 1, height: 12, backgroundColor: color.line },
  sepLine: { height: 1, backgroundColor: color.lineSoft, marginHorizontal: space[5] },
  emptyListContent: { flexGrow: 1 },
  fab: {
    position: 'absolute',
    right: space[5],
    height: 52,
    minWidth: 52,
    borderRadius: radius.full,
    backgroundColor: color.brand,
    justifyContent: 'center',
    ...shadow.brand,
  },
  fabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(15,20,35,0.40)',
  },
  sortSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: color.surface,
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    paddingHorizontal: space[3],
    paddingTop: space[3],
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: color.line,
    alignSelf: 'center',
  },
  sortTitle: { paddingHorizontal: space[2], paddingTop: space[3], paddingBottom: space[2] },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: space[3],
    borderRadius: radius.lg,
  },
});

const emptyStyles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  art: { width: 150, height: 120 },
  cardBack: {
    position: 'absolute',
    left: 28,
    top: 18,
    width: 96,
    height: 86,
    borderRadius: 10,
    backgroundColor: color.surfaceSunken,
    transform: [{ rotate: '-7deg' }],
  },
  cardFront: {
    position: 'absolute',
    left: 24,
    top: 12,
    width: 100,
    height: 90,
    borderRadius: 10,
    backgroundColor: color.surface,
    borderWidth: 1.5,
    borderColor: color.line,
    paddingVertical: 16,
    paddingHorizontal: 14,
    gap: 9,
    ...shadow.card,
  },
  line: { width: '100%', height: 7, borderRadius: 2, backgroundColor: color.lineSoft },
  lineTint: { width: 34, backgroundColor: '#C9D3F5' },
  lineShort: { width: '70%' },
  lineLast: { width: 28, height: 9, marginTop: 'auto', backgroundColor: '#DCE3FB' },
  lens: { position: 'absolute', right: 10, top: 6, width: 46, height: 46 },
  lensGlass: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2.4,
    borderColor: color.brand,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  lensShine: {
    position: 'absolute',
    left: 6,
    top: 8,
    width: 10,
    height: 2.2,
    borderRadius: 2,
    backgroundColor: '#8FA4FF',
    transform: [{ rotate: '-35deg' }],
  },
  lensHandle: {
    position: 'absolute',
    left: 27,
    top: 28,
    width: 13,
    height: 3.4,
    borderRadius: 2,
    backgroundColor: color.brand,
    transform: [{ rotate: '45deg' }],
  },
  title: { marginTop: 22, textAlign: 'center' },
});

export const SAMPLE_CONTESTS: Contest[] = [
  {
    id: '01',
    org: 'OO문화재단',
    title: '2026 청년 문화기획 아이디어 공모전',
    deadline: '2026-11-08',
    category: 'PLANNING_IDEA',
    activityType: 'CONTEST',
    status: 'OPEN',
    teamCount: 3,
    views: 1820,
    scraps: 212,
    activityFrom: '2026-11-16',
    activityTo: '2026-12-18',
  },
  {
    id: '02',
    org: 'OO기업 브랜드팀',
    title: '대학생 서포터즈 12기 콘텐츠 크루',
    deadline: '2026-11-10',
    category: 'VIDEO_UCC_PHOTO',
    activityType: 'SUPPORTERS',
    status: 'OPEN',
    teamCount: 2,
    views: 940,
    scraps: 88,
    activityFrom: '2026-12-01',
    activityTo: '2027-02-28',
  },
  {
    id: '03',
    org: 'OO커머스',
    title: '마케팅 챌린지 위크 시즌 3',
    deadline: '2026-11-13',
    category: 'ADVERTISING_MARKETING',
    activityType: 'CONTEST',
    status: 'OPEN',
    teamCount: 4,
    views: 2310,
    scraps: 305,
    activityFrom: '2026-11-23',
    activityTo: '2026-12-11',
  },
  {
    id: '04',
    org: 'OO테크',
    title: 'AI 서비스 해커톤 2026 WINTER',
    deadline: '2026-11-15',
    category: 'AI_DATA',
    activityType: 'HACKATHON',
    status: 'OPEN',
    teamCount: 6,
    views: 3050,
    scraps: 276,
    activityFrom: '2026-12-19',
    activityTo: '2026-12-21',
  },
  {
    id: '05',
    org: 'OO연구원',
    title: '미래 사회 정책 논문 공모',
    deadline: '2026-11-20',
    category: 'PAPER_REPORT',
    activityType: 'CONTEST',
    status: 'OPEN',
    teamCount: 0,
    views: 480,
    scraps: 37,
    activityFrom: '2026-11-20',
    activityTo: '2027-01-15',
  },
  {
    id: '06',
    org: 'OO필름',
    title: '숏폼 영상 콘텐츠 공모전',
    deadline: '2026-11-24',
    category: 'VIDEO_UCC_PHOTO',
    activityType: 'CONTEST',
    status: 'OPEN',
    teamCount: 2,
    views: 1270,
    scraps: 154,
    activityFrom: '2026-11-24',
    activityTo: '2027-01-09',
  },
  {
    id: '07',
    org: 'OO증권',
    title: '대학생 투자 경진대회',
    deadline: '2026-11-28',
    category: 'PAPER_REPORT',
    activityType: 'COMPETITION',
    status: 'OPEN',
    teamCount: 5,
    views: 1990,
    scraps: 190,
    activityFrom: '2027-01-05',
    activityTo: '2027-02-27',
  },
  {
    id: '08',
    org: 'OO은행',
    title: '청년 금융 아이디어 경진대회',
    deadline: '2026-12-03',
    category: 'PLANNING_IDEA',
    activityType: 'COMPETITION',
    status: 'UPCOMING',
    teamCount: 3,
    views: 860,
    scraps: 72,
    activityFrom: '2027-01-11',
    activityTo: '2027-02-19',
  },
  {
    id: '09',
    org: 'OO디자인',
    title: '친환경 패키지 디자인 공모전',
    deadline: '2026-12-10',
    category: 'DESIGN_CHARACTER_WEBTOON',
    activityType: 'CONTEST',
    status: 'UPCOMING',
    teamCount: 2,
    views: 1540,
    scraps: 233,
    activityFrom: '2026-12-10',
    activityTo: '2027-01-29',
  },
  {
    id: '10',
    org: 'OO미디어',
    title: '캠퍼스 숏폼 크리에이터 모집',
    deadline: '2026-11-09',
    category: 'VIDEO_UCC_PHOTO',
    activityType: 'SUPPORTERS',
    status: 'OPEN',
    teamCount: 4,
    views: 1130,
    scraps: 95,
    activityFrom: '2026-11-30',
    activityTo: '2027-02-20',
  },
];
