import { StyleSheet } from 'react-native';

import { color, radius, space } from '@/theme';

export const NOTCH_RADIUS = 9; // 위아래 반원 홈 반지름
export const RIGHT_WIDTH = 104; // 오른쪽(인원 원·지원하기) 영역 너비

export const S = StyleSheet.create({
  // 배경·테두리는 TicketBackground(SVG)가 그려요
  card: {
    flexDirection: 'row',
  },

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
  closedChip: {
    backgroundColor: color.surfaceMuted,
  },
  roleText: {
    fontWeight: '700',
  },

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
  applyButtonClosed: {
    backgroundColor: color.surfaceMuted,
  },
  applyText: {
    fontWeight: '800',
  },
});
