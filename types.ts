export type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export type PrayerKey =
  | 'fajr'
  | 'dhuhr'
  | 'asr'
  | 'maghrib'
  | 'isha';

export interface PrayerTime {
  key: PrayerKey;
  name: PrayerName;
  time: string; // 'HH:MM'
  timestamp: number; // ms epoch for today's occurrence
}

export type AlarmMode = 'camera' | 'notification';

export interface PrayerAlarmSettings {
  key: PrayerKey;
  enabled: boolean;
  mode: AlarmMode; // camera = strict AI verification, notification = gentle
  soundId: string; // adhan or chime id
}

export type ThemeMode = 'light' | 'dark' | 'system';

export type AppLanguage = 'auto' | 'ar' | 'en' | 'fr' | 'tr' | 'ur' | 'id' | 'de' | 'es';

export interface UserProfile {
  points: number;
  streak: number;
  lastPrayerKey: PrayerKey | null;
  lastPrayerDate: string | null; // YYYY-MM-DD
  skipPasses: number;
  premiumUnlocked: boolean;
  unlockedReciters: string[];
  unlockedThemes: string[];
  unlockedBadges: string[];
}

export interface UserLocation {
  country: string;
  city: string;
  lat: number;
  lng: number;
}

export interface AdhanReciter {
  id: string;
  name: string;
  premium: boolean;
}

export interface AppTheme {
  id: string;
  name: string;
  premium: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  threshold: number; // streak days
  premium: boolean;
}
