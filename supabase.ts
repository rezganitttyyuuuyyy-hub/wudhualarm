import { createClient } from '@supabase/supabase-js';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export async function getDeviceId(): Promise<string> {
  if (Platform.OS === 'web') {
    let id = localStorage.getItem('wudhualarm:device_id');
    if (!id) {
      id = 'web-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem('wudhualarm:device_id', id);
    }
    return id;
  }
  const nativeId = Application.getAndroidId?.() || (await Application.getIosIdForVendorAsync?.()) || null;
  if (nativeId) return nativeId;
  return 'device-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
