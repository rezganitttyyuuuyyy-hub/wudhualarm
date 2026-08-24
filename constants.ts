import type { AdhanReciter, AppTheme, Badge, PrayerKey } from './types';

export const PRAYER_KEYS: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export const PRAYER_NAMES: Record<PrayerKey, string> = {
  fajr: 'Fajr',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

// Prayers that require strict AI camera verification by default
export const CAMERA_MANDATORY: PrayerKey[] = ['fajr', 'isha'];

export const ADHAN_RECITERS: AdhanReciter[] = [
  { id: 'makkah', name: 'Makkah Adhan', premium: false },
  { id: 'madinah', name: 'Madinah Adhan', premium: false },
  { id: 'egypt', name: 'Egyptian Adhan', premium: true },
  { id: 'turkey', name: 'Turkish Adhan', premium: true },
  { id: 'morocco', name: 'Moroccan Adhan', premium: true },
  { id: 'indonesia', name: 'Indonesian Adhan', premium: true },
];

export const APP_THEMES: AppTheme[] = [
  { id: 'emerald', name: 'Emerald Night', premium: false },
  { id: 'midnight', name: 'Mid Blue', premium: false },
  { id: 'sand', name: 'Desert Sand', premium: true },
  { id: 'rose', name: 'Rose Dawn', premium: true },
  { id: 'gold', name: 'Royal Gold', premium: true },
];

export const BADGES: Badge[] = [
  { id: 'streak3', name: 'Early Bird', description: '3 day streak', threshold: 3, premium: false },
  { id: 'streak7', name: 'Consistent', description: '7 day streak', threshold: 7, premium: false },
  { id: 'streak30', name: 'Devoted', description: '30 day streak', threshold: 30, premium: false },
  { id: 'streak100', name: 'Guardian', description: '100 day streak', threshold: 100, premium: true },
  { id: 'streak365', name: 'Pillar', description: '365 day streak', threshold: 365, premium: true },
];

export const POINTS_ON_TIME = 10;
export const POINTS_CAMERA_VERIFY = 5;
export const SKIP_PASS_REWARD = 1; // skip passes granted per rewarded ad
