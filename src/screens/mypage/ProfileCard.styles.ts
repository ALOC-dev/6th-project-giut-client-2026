import { StyleSheet } from 'react-native';

import { color, radius, shadow, space } from '@/theme';

const AVATAR = 72;
// 팀 상세 팀원 프로필과 같은 비율 (원 52, 아이콘 44)
const AVATAR_ICON = (AVATAR * 44) / 52;

export const S = StyleSheet.create({
  card: {
    gap: space[4],
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: radius.full,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: AVATAR,
    height: AVATAR,
  },
  avatarIcon: {
    width: AVATAR_ICON,
    height: AVATAR_ICON,
    overflow: 'visible',
  },
  info: {
    flex: 1,
    gap: space[0.5],
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  name: {
    flexShrink: 1,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1],
  },
  statNumber: {
    fontWeight: '800',
  },
  roles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space[1.5],
  },
  role: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[1.5],
  },
  roleDivider: {
    width: 1,
    height: 12,
    backgroundColor: color.line,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[1.5],
  },
  tag: {
    paddingVertical: space[1],
    paddingHorizontal: space[2.5],
    borderRadius: radius.md,
    backgroundColor: color.surfaceMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: space[2],
  },
  action: {
    ...shadow.card,
    height: 48,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: color.lineSoft,
    backgroundColor: color.surface,
  },
  edit: {
    flex: 1,
  },
  share: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
