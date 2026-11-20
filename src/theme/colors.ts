export const color = {
  brand: '#2F5BFF',
  brandStrong: '#1E46E0',
  brandTint: '#EAF0FF',
  brandSoft: '#F5F8FF',

  ink: '#191B20',
  textBody: '#3A3D45',
  textSecondary: '#4E525C',
  textMuted: '#6B6F78',
  textFaint: '#8A8F99',
  textDisabled: '#B0B5BF',

  surface: '#FFFFFF',
  surfaceGlass: 'rgba(255,255,255,0.82)',
  surfaceSunken: '#F5F6FA',
  surfaceMuted: '#F5F6F9',
  surfaceSubtle: '#F8F9FB',
  surfaceInverse: 'rgba(25,27,32,0.92)',

  line: '#E3E5EA',
  lineSoft: '#EEF0F4',
  lineGlass: 'rgba(255,255,255,0.88)',

  roleDev: '#2F5BFF',
  roleDevTint: '#EAF0FF',
  roleDevText: '#1E46E0',
  roleDesign: '#FF7A59',
  roleDesignTint: '#FFF0EB',
  roleDesignText: '#B7411F',
  rolePlan: '#1FB57F',
  rolePlanTint: '#E6F7F0',
  rolePlanText: '#0E7A52',
  roleMkt: '#F5A623',
  roleMktTint: '#FFF5E3',
  roleMktText: '#8A5200',

  danger: '#E5364A',
  dangerStrong: '#C8283B',
  dangerTint: '#FFF0F1',
  alert: '#FF4D5E',
  pending: '#E8A33B',
  highlight: '#FFB84D',

  daySat: '#2F5BFF',
  daySun: '#E5484D',

  overlayDim: 'rgba(15,20,35,0.40)',
  focusRing: 'rgba(47,91,255,0.12)',
} as const;

export const role = {
  dev: {
    base: '#2F5BFF',
    tint: '#EAF0FF',
    text: '#1E46E0',
  },

  design: {
    base: '#FF7A59',
    tint: '#FFF0EB',
    text: '#B7411F',
  },

  plan: {
    base: '#1FB57F',
    tint: '#E6F7F0',
    text: '#0E7A52',
  },

  mkt: {
    base: '#F5A623',
    tint: '#FFF5E3',
    text: '#8A5200',
  },
} as const;

export type ColorToken = keyof typeof color;
export type RoleName = keyof typeof role;
