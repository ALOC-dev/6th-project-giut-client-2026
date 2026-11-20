
import type { ViewStyle } from 'react-native';

export const shadow = {
  card: { boxShadow: '0 1px 2px rgba(25,27,32,0.05)' },
  raised: { boxShadow: '0 10px 28px rgba(25,27,32,0.07)' },
  selection: { boxShadow: '0 3px 18px rgba(23,32,58,0.22)' },
  menu: { boxShadow: '0 10px 28px rgba(25,27,32,0.16)' },
  brand: { boxShadow: '0 6px 18px rgba(47,91,255,0.35)' },
} as const satisfies Record<string, ViewStyle>;

export const shadowCompat = {
  card: {
    shadowColor: 'rgba(25,27,32,0.05)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 1.0,
    elevation: 1,
  },
  raised: {
    shadowColor: 'rgba(25,27,32,0.07)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 14.0,
    elevation: 9,
  },
  selection: {
    shadowColor: 'rgba(23,32,58,0.22)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 9.0,
    elevation: 6,
  },
  menu: {
    shadowColor: 'rgba(25,27,32,0.16)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 14.0,
    elevation: 9,
  },
  brand: {
    shadowColor: 'rgba(47,91,255,0.35)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 9.0,
    elevation: 6,
  },
} as const satisfies Record<string, ViewStyle>;

export type ShadowToken = keyof typeof shadow;
