import { useRef, useState } from 'react';
import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewInstance,
} from 'react-native';

// 도착으로 볼 오차(px). 플랫폼마다 소수점 처리가 달라요
const ARRIVE_TOLERANCE = 2;

type Jump = { target: number; arrived: boolean };

// 탭을 누르면 그 구역으로 스크롤하고, 스크롤하면 보이는 구역의 탭을 선택해요
// keys는 화면에 나오는 순서, topGap은 고정된 탭과 구역 제목 사이 간격
export function useSectionTabs<K extends string>(keys: readonly K[], topGap: number) {
  const [tab, setTab] = useState<K>(keys[0]);

  const scrollRef = useRef<ScrollViewInstance>(null);
  const tabBarHeight = useRef(0);
  const sectionsY = useRef(0);
  const sectionY = useRef<Partial<Record<K, number>>>({});
  const viewportHeight = useRef(0);
  const contentHeight = useRef(0);
  const scrollY = useRef(0);

  // 탭을 눌러 이동한 자리에 있는 동안은 누른 탭을 유지해요
  // (내용이 짧아 구역이 맨 위까지 못 올라가도 다른 탭으로 바뀌지 않게)
  const jump = useRef<Jump | null>(null);

  const scrollYOf = (key: K) => {
    const y = sectionY.current[key];
    if (y === undefined) return undefined;
    return Math.max(sectionsY.current + y - tabBarHeight.current - topGap, 0);
  };

  const handlePressTab = (key: K) => {
    setTab(key);

    const y = scrollYOf(key);
    if (y === undefined) return;

    // 내용이 짧으면 갈 수 있는 최대 위치까지만
    const maxY = Math.max(contentHeight.current - viewportHeight.current, 0);
    const target = Math.min(y, maxY);
    const arrived = Math.abs(scrollY.current - target) < ARRIVE_TOLERANCE;
    jump.current = { target, arrived };
    if (!arrived) scrollRef.current?.scrollTo({ y: target, animated: true });
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
    const y = contentOffset.y;
    scrollY.current = y;

    if (jump.current) {
      const isAtTarget = Math.abs(y - jump.current.target) < ARRIVE_TOLERANCE;
      if (isAtTarget) jump.current.arrived = true;
      if (isAtTarget || !jump.current.arrived) return;
      jump.current = null;
    }

    // 마지막 구역이 짧아도 맨 아래에 닿으면 마지막 탭으로
    const isScrollable = contentSize.height > layoutMeasurement.height + 1;
    const isAtBottom =
      isScrollable && y > 0 && y + layoutMeasurement.height >= contentSize.height - 1;
    const passed = keys.filter((key) => {
      const top = scrollYOf(key);
      return top !== undefined && y >= top - 1;
    });
    const next = isAtBottom ? keys[keys.length - 1] : (passed[passed.length - 1] ?? keys[0]);
    setTab((prev) => (prev === next ? prev : next));
  };

  // 손으로 스크롤하면 다시 스크롤 위치를 따라가요
  const handleScrollBeginDrag = () => {
    jump.current = null;
  };

  // 목표에 못 미치고 멈췄으면(내용 높이가 바뀐 경우 등) 멈춘 자리를 도착으로 봐요
  const handleMomentumScrollEnd = () => {
    if (jump.current && !jump.current.arrived) {
      jump.current = { target: scrollY.current, arrived: true };
    }
  };

  return {
    tab,
    handlePressTab,
    scrollRef,
    scrollProps: {
      onScroll: handleScroll,
      onScrollBeginDrag: handleScrollBeginDrag,
      onMomentumScrollEnd: handleMomentumScrollEnd,
      scrollEventThrottle: 16,
      onLayout: (e: LayoutChangeEvent) => {
        viewportHeight.current = e.nativeEvent.layout.height;
      },
      onContentSizeChange: (_width: number, height: number) => {
        contentHeight.current = height;
      },
    },
    onTabBarLayout: (e: LayoutChangeEvent) => {
      tabBarHeight.current = e.nativeEvent.layout.height;
    },
    onSectionsLayout: (e: LayoutChangeEvent) => {
      sectionsY.current = e.nativeEvent.layout.y;
    },
    onSectionLayout: (key: K) => (e: LayoutChangeEvent) => {
      sectionY.current[key] = e.nativeEvent.layout.y;
    },
  };
}
