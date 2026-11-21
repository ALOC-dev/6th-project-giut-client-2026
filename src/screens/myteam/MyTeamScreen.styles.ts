import { StyleSheet } from 'react-native';

import { color, radius, space } from '@/theme';

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.surfaceSunken },
  content: { paddingHorizontal: space[5], paddingBottom: space[6] },
  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sections: { marginTop: space[2.5], gap: space[5] },
  section: { gap: space[2.5] },
  sectionTitle: { paddingLeft: space[0.5] },
  sectionCount: { color: color.ink },
  moreButton: {
    minHeight: 44,
    marginTop: space[1.5],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[1],
    borderRadius: radius.md,
  },
  chevronUp: { transform: [{ rotate: '180deg' }] },
  sheetDescription: { marginTop: space[1.5] },
  sheetActions: { flexDirection: 'row', gap: space[2] },
  sheetButton: { flex: 1 },
});
