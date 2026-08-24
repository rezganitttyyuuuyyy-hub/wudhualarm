import type { PrayerKey, PrayerTime, PrayerName } from './types';
import { PRAYER_KEYS } from './constants';

const DEFAULT_TIMES: Record<PrayerKey, string> = {
  fajr: '05:12',
  dhuhr: '12:30',
  asr: '15:45',
  maghrib: '18:20',
  isha: '19:50',
};

export interface Coords {
  lat: number;
  lng: number;
}

const prayerTimesCache = new Map<string, { times: Record<PrayerKey, string>; ts: number }>();

export async function fetchPrayerTimesFromAPI(lat: number, lng: number): Promise<Record<PrayerKey, string> | null> {
  try {
    const today = new Date();
    const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    const cacheKey = `${lat.toFixed(2)}_${lng.toFixed(2)}_${dateStr}`;

    const cached = prayerTimesCache.get(cacheKey);
    if (cached && Date.now() - cached.ts < 3600000) {
      return cached.times;
    }

    const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=2`;
    const res = await fetch(url);
    if (!res.ok) return cached?.times ?? null;
    const json = await res.json();
    const timings = json?.data?.timings;
    if (!timings) return cached?.times ?? null;
    const result: Record<PrayerKey, string> = {
      fajr: cleanTime(timings.Fajr),
      dhuhr: cleanTime(timings.Dhuhr),
      asr: cleanTime(timings.Asr),
      maghrib: cleanTime(timings.Maghrib),
      isha: cleanTime(timings.Isha),
    };
    prayerTimesCache.set(cacheKey, { times: result, ts: Date.now() });
    return result;
  } catch {
    return null;
  }
}

function cleanTime(t: string): string {
  // Aladhan returns "05:12 (EET)" — strip the timezone
  return t.split(' ')[0];
}

export function getPrayerTimesForToday(base?: Partial<Record<PrayerKey, string>>): PrayerTime[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();

  return PRAYER_KEYS.map((key) => {
    const hhmm = base?.[key] ?? DEFAULT_TIMES[key];
    const [h, min] = hhmm.split(':').map(Number);
    const dt = new Date(y, m, d, h, min, 0, 0);
    return {
      key,
      name: capitalize(key),
      time: hhmm,
      timestamp: dt.getTime(),
    };
  });
}

function capitalize(s: string): PrayerName {
  return (s.charAt(0).toUpperCase() + s.slice(1)) as PrayerName;
}

export function getNextPrayer(times: PrayerTime[]): PrayerTime | null {
  const now = Date.now();
  const upcoming = times.filter((t) => t.timestamp > now);
  if (upcoming.length > 0) {
    return upcoming[0];
  }
  const fajr = times.find((t) => t.key === 'fajr');
  if (!fajr) return null;
  return {
    ...fajr,
    timestamp: fajr.timestamp + 24 * 60 * 60 * 1000,
  };
}

export function formatCountdown(ms: number): { h: string; m: string } {
  if (ms < 0) ms = 0;
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return { h: String(h).padStart(2, '0'), m: String(m).padStart(2, '0') };
}

export function todayDateStr(): string {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
}
