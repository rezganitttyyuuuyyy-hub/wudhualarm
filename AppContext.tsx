import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import type { AppLanguage, PrayerAlarmSettings, ThemeMode, UserProfile, UserLocation } from './types';
import { PRAYER_KEYS, CAMERA_MANDATORY } from './constants';
import { loadJSON, saveJSON, loadString, saveString } from './storage';
import { detectSystemLang, getDict, isRtl, type LangCode } from './i18n';
import { getPalette, type Palette } from './theme';
import { useAuth } from './AuthContext';
import { supabase } from './supabase';

interface AppContextValue {
  langSetting: AppLanguage;
  activeLang: LangCode;
  setLangSetting: (l: AppLanguage) => void;
  t: (key: string) => string;
  rtl: boolean;
  themeSetting: ThemeMode;
  dark: boolean;
  setThemeSetting: (m: ThemeMode) => void;
  palette: Palette;
  alarms: Record<string, PrayerAlarmSettings>;
  updateAlarm: (key: string, patch: Partial<PrayerAlarmSettings>) => void;
  profile: UserProfile;
  addPoints: (n: number) => void;
  recordPrayer: (key: string, verifiedByCamera?: boolean) => void;
  grantSkipPass: (n: number) => void;
  useSkipPass: () => boolean;
  unlockPremium: () => void;
  unlockReciter: (id: string) => void;
  unlockTheme: (id: string) => void;
  unlockBadge: (id: string) => void;
  loaded: boolean;
  location: UserLocation | null;
  setLocation: (loc: UserLocation) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const DEFAULT_PROFILE: UserProfile = {
  points: 0,
  streak: 0,
  lastPrayerKey: null,
  lastPrayerDate: null,
  skipPasses: 0,
  premiumUnlocked: false,
  unlockedReciters: ['makkah', 'madinah'],
  unlockedThemes: ['emerald', 'midnight'],
  unlockedBadges: [],
};

function defaultAlarms(): Record<string, PrayerAlarmSettings> {
  const out: Record<string, PrayerAlarmSettings> = {};
  for (const k of PRAYER_KEYS) {
    const mandatory = CAMERA_MANDATORY.includes(k);
    out[k] = {
      key: k,
      enabled: true,
      mode: mandatory ? 'camera' : 'notification',
      soundId: 'makkah',
    };
  }
  return out;
}

function authProfileToLocal(ap: {
  points: number;
  streak: number;
  best_streak: number;
  skip_passes: number;
  premium_unlocked: boolean;
  unlocked_reciters: string[];
  unlocked_themes: string[];
  unlocked_badges: string[];
  display_name: string;
  email: string | null;
  is_guest: boolean;
} | null): UserProfile {
  if (!ap) return DEFAULT_PROFILE;
  return {
    points: ap.points ?? 0,
    streak: ap.streak ?? 0,
    lastPrayerKey: null,
    lastPrayerDate: null,
    skipPasses: ap.skip_passes ?? 0,
    premiumUnlocked: ap.premium_unlocked ?? false,
    unlockedReciters: ap.unlocked_reciters ?? ['makkah', 'madinah'],
    unlockedThemes: ap.unlocked_themes ?? ['emerald', 'midnight'],
    unlockedBadges: ap.unlocked_badges ?? [],
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const systemDark = useColorScheme() === 'dark';
  const { profile: authProfile, updateProfile: updateAuthProfile } = useAuth();

  const [langSetting, setLangSettingState] = useState<AppLanguage>('auto');
  const [themeSetting, setThemeSettingState] = useState<ThemeMode>('system');
  const [alarms, setAlarms] = useState<Record<string, PrayerAlarmSettings>>(defaultAlarms());
  const [localProfile, setLocalProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [location, setLocationState] = useState<UserLocation | null>(null);
  const [loaded, setLoaded] = useState(false);

  const activeLang: LangCode = langSetting === 'auto' ? detectSystemLang() : (langSetting as LangCode);
  const dict = useMemo(() => getDict(activeLang), [activeLang]);
  const rtl = useMemo(() => isRtl(activeLang), [activeLang]);
  const dark = themeSetting === 'system' ? systemDark : themeSetting === 'dark';
  const palette = useMemo(() => getPalette(dark), [dark]);

  const profile = useMemo(
    () => authProfile ? authProfileToLocal(authProfile) : localProfile,
    [authProfile, localProfile]
  );

  useEffect(() => {
    (async () => {
      const ls = await loadString('langSetting', 'auto') as AppLanguage;
      const ts = await loadString('themeSetting', 'system') as ThemeMode;
      const al = await loadJSON('alarms', defaultAlarms());
      const pr = await loadJSON('profile', DEFAULT_PROFILE);
      const loc = await loadJSON<UserLocation | null>('location', null);
      setLangSettingState(ls);
      setLocationState(loc);
      setThemeSettingState(ts);
      setAlarms(al);
      setLocalProfile(pr);
      setLoaded(true);
    })();
  }, []);

  const setLangSetting = useCallback((l: AppLanguage) => {
    setLangSettingState(l);
    saveString('langSetting', l);
  }, []);

  const setThemeSetting = useCallback((m: ThemeMode) => {
    setThemeSettingState(m);
    saveString('themeSetting', m);
  }, []);

  const updateAlarm = useCallback((key: string, patch: Partial<PrayerAlarmSettings>) => {
    setAlarms((prev) => {
      const next = { ...prev, [key]: { ...prev[key], ...patch } };
      saveJSON('alarms', next);
      return next;
    });
  }, []);

  const addPoints = useCallback((n: number) => {
    if (authProfile) {
      updateAuthProfile({ points: (authProfile.points ?? 0) + n });
    } else {
      setLocalProfile((prev) => {
        const next = { ...prev, points: prev.points + n };
        saveJSON('profile', next);
        return next;
      });
    }
  }, [authProfile, updateAuthProfile]);

  const recordPrayer = useCallback((key: string, verifiedByCamera = false) => {
    const today = new Date().toISOString().slice(0, 10);
    const computeStreak = (prev: UserProfile) => {
      if (prev.lastPrayerDate === today) return prev.streak;
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const yStr = y.toISOString().slice(0, 10);
      return prev.lastPrayerDate === yStr ? prev.streak + 1 : 1;
    };

    if (authProfile) {
      const newStreak = computeStreak(authProfileToLocal(authProfile));
      const prayerPoints = 10;
      updateAuthProfile({
        points: (authProfile.points ?? 0) + prayerPoints,
        monthly_points: (authProfile.monthly_points ?? 0) + prayerPoints,
        streak: newStreak,
        best_streak: Math.max(authProfile.best_streak ?? 0, newStreak),
      });
      supabase.from('prayer_logs').insert({
        profile_id: authProfile.id,
        prayer_key: key,
        verified_by_camera: verifiedByCamera,
      }).then(({ error }) => {
        if (error) console.warn('Failed to log prayer:', error.message);
      });
      supabase.from('point_transactions').insert({
        profile_id: authProfile.id,
        source: verifiedByCamera ? 'camera_verify' : 'prayer',
        amount: prayerPoints,
        description: `Prayer: ${key}${verifiedByCamera ? ' (camera verified)' : ''}`,
      }).then(({ error }) => {
        if (error) console.warn('Failed to log point transaction:', error.message);
      });
    } else {
      setLocalProfile((prev) => {
        const streak = computeStreak(prev);
        const next: UserProfile = {
          ...prev,
          points: prev.points + 10,
          streak,
          lastPrayerKey: key as UserProfile['lastPrayerKey'],
          lastPrayerDate: today,
        };
        saveJSON('profile', next);
        return next;
      });
    }
  }, [authProfile, updateAuthProfile]);

  const grantSkipPass = useCallback((n: number) => {
    if (authProfile) {
      updateAuthProfile({ skip_passes: (authProfile.skip_passes ?? 0) + n });
    } else {
      setLocalProfile((prev) => {
        const next = { ...prev, skipPasses: prev.skipPasses + n };
        saveJSON('profile', next);
        return next;
      });
    }
  }, [authProfile, updateAuthProfile]);

  const useSkipPass = useCallback(() => {
    if (authProfile) {
      if ((authProfile.skip_passes ?? 0) > 0) {
        updateAuthProfile({ skip_passes: (authProfile.skip_passes ?? 0) - 1 });
        return true;
      }
      return false;
    }
    let used = false;
    setLocalProfile((prev) => {
      if (prev.skipPasses <= 0) return prev;
      used = true;
      const next = { ...prev, skipPasses: prev.skipPasses - 1 };
      saveJSON('profile', next);
      return next;
    });
    return used;
  }, [authProfile, updateAuthProfile]);

  const unlockPremium = useCallback(() => {
    if (authProfile) {
      updateAuthProfile({ premium_unlocked: true });
    } else {
      setLocalProfile((prev) => {
        const next = { ...prev, premiumUnlocked: true };
        saveJSON('profile', next);
        return next;
      });
    }
  }, [authProfile, updateAuthProfile]);

  const unlockReciter = useCallback((id: string) => {
    if (authProfile) {
      const current = authProfile.unlocked_reciters ?? [];
      if (current.includes(id)) return;
      updateAuthProfile({ unlocked_reciters: [...current, id] });
    } else {
      setLocalProfile((prev) => {
        if (prev.unlockedReciters.includes(id)) return prev;
        const next = { ...prev, unlockedReciters: [...prev.unlockedReciters, id] };
        saveJSON('profile', next);
        return next;
      });
    }
  }, [authProfile, updateAuthProfile]);

  const unlockTheme = useCallback((id: string) => {
    if (authProfile) {
      const current = authProfile.unlocked_themes ?? [];
      if (current.includes(id)) return;
      updateAuthProfile({ unlocked_themes: [...current, id] });
    } else {
      setLocalProfile((prev) => {
        if (prev.unlockedThemes.includes(id)) return prev;
        const next = { ...prev, unlockedThemes: [...prev.unlockedThemes, id] };
        saveJSON('profile', next);
        return next;
      });
    }
  }, [authProfile, updateAuthProfile]);

  const unlockBadge = useCallback((id: string) => {
    if (authProfile) {
      const current = authProfile.unlocked_badges ?? [];
      if (current.includes(id)) return;
      updateAuthProfile({ unlocked_badges: [...current, id] });
    } else {
      setLocalProfile((prev) => {
        if (prev.unlockedBadges.includes(id)) return prev;
        const next = { ...prev, unlockedBadges: [...prev.unlockedBadges, id] };
        saveJSON('profile', next);
        return next;
      });
    }
  }, [authProfile, updateAuthProfile]);

  const setLocation = useCallback((loc: UserLocation) => {
    setLocationState(loc);
    saveJSON('location', loc);
  }, []);

  const t = useCallback((key: string) => dict[key] ?? key, [dict]);

  const value = useMemo<AppContextValue>(() => ({
    langSetting,
    activeLang,
    setLangSetting,
    t,
    rtl,
    themeSetting,
    dark,
    setThemeSetting,
    palette,
    alarms,
    updateAlarm,
    profile,
    addPoints,
    recordPrayer,
    grantSkipPass,
    useSkipPass,
    unlockPremium,
    unlockReciter,
    unlockTheme,
    unlockBadge,
    loaded,
    location,
    setLocation,
  }), [
    langSetting, activeLang, setLangSetting, t, rtl,
    themeSetting, dark, setThemeSetting, palette,
    alarms, updateAlarm, profile, addPoints, recordPrayer,
    grantSkipPass, useSkipPass, unlockPremium,
    unlockReciter, unlockTheme, unlockBadge,
    loaded, location, setLocation,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
