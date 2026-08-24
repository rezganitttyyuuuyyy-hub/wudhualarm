import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'wudhualarm:';

export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function saveJSON<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export async function loadString(key: string, fallback: string): Promise<string> {
  try {
    const v = await AsyncStorage.getItem(PREFIX + key);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

export async function saveString(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(PREFIX + key, value);
  } catch {
    // ignore
  }
}
