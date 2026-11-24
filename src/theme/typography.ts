import type { TextStyle } from 'react-native';

export const text = {
  displayNumber: {
    fontWeight: '900',
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.8,
  },
  titleXl: {
    fontWeight: '800',
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  titleLg: {
    fontWeight: '800',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  titleMd: {
    fontWeight: '800',
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: -0.3,
  },
  titleSm: {
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  label: {
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 22,
  },
  body: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 22,
  },
  bodyStrong: {
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 22,
  },
  caption: {
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 18,
  },
  meta: {
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 16,
  },
  badge: {
    fontWeight: '800',
    fontSize: 11,
    lineHeight: 14,
  },
  micro: {
    fontWeight: '800',
    fontSize: 10,
    lineHeight: 12,
  },
  button: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
  },
} as const satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof text;
