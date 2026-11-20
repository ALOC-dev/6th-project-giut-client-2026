import { StyleSheet } from 'react-native';

import { color, radius, space } from '@/theme';

export const NOTCH_RADIUS = 9; // 위아래 반원 홈 반지름
export const RIGHT_WIDTH = 104; // 오른쪽(인원 원·지원하기) 영역 너비

export const S = StyleSheet.create({
  // 배경·테두리는 TicketBackground(SVG)가 그려요
  card: {
    flexDirection: 'row',
  },

  // 왼쪽: 팀 이름, 설명, 모집 역할
  left: {
    flex: 1,
    justifyContent: 'center',
    gap: space[3],
    paddingVertical: space[5],
    paddingLeft: space[4],
    paddingRight: space[3],
  },
  head: {
    gap: space[1],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  name: {
    flexShrink: 1,
  },
  roles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
  },
  roleChip: {
    paddingHorizontal: space[2],
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  roleText: {
    fontWeight: '700',
  },

  // 가운데 점선 (위아래 홈과 겹치지 않게 홈 크기만큼 띄워요)
  dashes: {
    width: 1,
    justifyContent: 'space-evenly',
    paddingVertical: NOTCH_RADIUS + space[1],
    overflow: 'hidden',
  },
  dash: {
    width: 1,
    height: 4,
    backgroundColor: color.line,
  },

  // 오른쪽: 인원 원, 지원하기
  right: {
    width: RIGHT_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[3],
    paddingVertical: space[4],
  },
  applyButton: {
    paddingHorizontal: space[4],
    paddingVertical: space[2],
    borderRadius: radius.md,
    borderCurve: 'continuous',
    backgroundColor: color.brand,
  },
  applyText: {
    fontWeight: '800',
  },
});
