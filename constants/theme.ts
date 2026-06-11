import { Platform } from 'react-native';

export const Palette = {
  cream: '#F9F4EE',
  ivory: '#FAF7F3',
  oliveDeep: '#4A5C3F',
  oliveMid: '#6B7F5E',
  oliveSoft: '#8FA882',
  terracotta: '#C4694A',
  terracottaLight: '#D4876A',
  beige: '#E8D9C6',
  beigeDeep: '#D9C9B3',
  charcoal: '#2C2C2C',
  warmGray: '#7A7066',
  warmGrayLight: '#B8AFA6',
  white: '#FFFFFF',
  black: '#1A1A1A',
} as const;

export const Colors = {
  light: {
    text: Palette.charcoal,
    subtext: Palette.warmGray,
    background: Palette.cream,
    surface: Palette.ivory,
    border: Palette.beige,
    tint: Palette.oliveDeep,
    icon: Palette.warmGray,
    tabIconDefault: Palette.warmGrayLight,
    tabIconSelected: Palette.oliveDeep,
    accent: Palette.terracotta,
    card: Palette.white,
  },
  dark: {
    text: Palette.cream,
    subtext: Palette.beigeDeep,
    background: '#1E1A16',
    surface: '#2A2420',
    border: '#3D3530',
    tint: Palette.oliveSoft,
    icon: Palette.beigeDeep,
    tabIconDefault: Palette.warmGray,
    tabIconSelected: Palette.oliveSoft,
    accent: Palette.terracottaLight,
    card: '#2A2420',
  },
};

export const Fonts = Platform.select({
  ios: {
    serif: 'ui-serif',
    sans: 'system-ui',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    serif: 'serif',
    sans: 'normal',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    serif: "Georgia, 'Times New Roman', serif",
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    rounded: "'SF Pro Rounded', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});
