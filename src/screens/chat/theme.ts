import { color, role } from '@/theme';

export const C = {
  brand: color.brand,
  brandStrong: color.brandStrong,
  brandTint: color.brandTint,
  ink: color.ink,
  body: color.textBody,
  secondary: color.textSecondary,
  muted: color.textMuted,
  faint: color.textFaint,
  placeholder: color.textFaint,
  line: color.line,
  lineSoft: color.lineSoft,
  surface: color.surfaceMuted,
  chatBg: color.surfaceMuted,
  datePill: color.line,
  sysPill: color.lineSoft,
  danger: color.danger,
  dangerTint: color.dangerTint,
  badge: color.alert,
  okTint: color.successTint,
  okText: role.plan.text,
  white: color.surface,
  dim: color.overlayDim,
  toast: color.surfaceInverse,
} as const;

export const ROLE = {
  개발: [role.dev.base, role.dev.tint],
  디자인: [role.design.base, role.design.tint],
  기획: [role.plan.base, role.plan.tint],
  마케팅: [role.mkt.base, role.mkt.tint],
} as const satisfies Record<string, readonly [string, string]>;

export const FONT = {
  family: undefined as string | undefined,
};
