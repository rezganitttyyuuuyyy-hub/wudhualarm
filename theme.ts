import { Platform } from 'react-native';

export interface Palette {
  bg: string;
  surface: string;
  surfaceAlt: string;
  card: string;
  border: string;
  text: string;
  textMuted: string;
  textInverse: string;
  primary: string;
  primaryDark: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  gradientFrom: string;
  gradientTo: string;
  navBg: string;
  navBorder: string;
}

const lightPalette: Palette = {
  bg: '#F4F6F8',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF2F5',
  card: '#FFFFFF',
  border: '#E2E8F0',
  text: '#0F172A',
  textMuted: '#64748B',
  textInverse: '#FFFFFF',
  primary: '#0E7C66',
  primaryDark: '#0B5E4D',
  accent: '#F59E0B',
  success: '#16A34A',
  warning: '#D97706',
  error: '#DC2626',
  gradientFrom: '#0E7C66',
  gradientTo: '#0B5E4D',
  navBg: '#FFFFFF',
  navBorder: '#E2E8F0',
};

const darkPalette: Palette = {
  bg: '#0A0F1A',
  surface: '#121A28',
  surfaceAlt: '#0D141F',
  card: '#162233',
  border: '#1E2A3C',
  text: '#F1F5F9',
  textMuted: '#94A3B8',
  textInverse: '#0F172A',
  primary: '#34D399',
  primaryDark: '#10B981',
  accent: '#FBBF24',
  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#F87171',
  gradientFrom: '#0B3D33',
  gradientTo: '#062018',
  navBg: '#0D141F',
  navBorder: '#1E2A3C',
};

export function getPalette(dark: boolean): Palette {
  return dark ? darkPalette : lightPalette;
}

export function isPlatformWeb() {
  return Platform.OS === 'web';
}
