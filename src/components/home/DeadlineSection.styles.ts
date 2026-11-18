import { StyleSheet } from 'react-native';

import { radius, space } from '@/theme';

export const S = StyleSheet.create({
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
  list: {
    paddingHorizontal: space[4],
    gap: space[3],
  },
  card: {
    width: 280,
    height: 180,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
});
