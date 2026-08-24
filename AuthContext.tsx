import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef, type ReactNode } from 'react';
import { supabase } from './supabase';
import type { Session, User } from '@supabase/supabase-js';

export interface AuthProfile {
  id: string;
  display_name: string;
  email: string | null;
  is_guest: boolean;
  points: number;
  monthly_points: number;
  streak: number;
  best_streak: number;
  skip_passes: number;
  premium_unlocked: boolean;
  unlocked_reciters: string[];
  unlocked_themes: string[];
  unlocked_badges: string[];
  full_name?: string | null;
  phone_number?: string | null;
  country?: string | null;
  social_link?: string | null;
  tiktok_link?: string | null;
  is_admin?: boolean;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: AuthProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string, extra?: { full_name?: string; phone_number?: string; country?: string; social_link?: string; tiktok_link?: string }) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (patch: Partial<AuthProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const profileRef = useRef(profile);
  profileRef.current = profile;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session === null) setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      (async () => {
        setSession(sess);
        setUser(sess?.user ?? null);
        if (!sess) {
          setProfile(null);
          setLoading(false);
        }
      })();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchProfile = useCallback(async (uid: string, email?: string | null) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', uid)
      .maybeSingle();

    if (!error && data) {
      setProfile(data as AuthProfile);
      return;
    }

    // Only auto-create if the row genuinely doesn't exist (data is null, no network error)
    if (error) {
      setProfile(null);
      return;
    }

    // data is null and no error => row doesn't exist, create it
    const { data: newProfile, error: insertErr } = await supabase
      .from('profiles')
      .upsert({
        user_id: uid,
        display_name: email?.split('@')[0] ?? 'User',
        email: email ?? null,
        is_guest: false,
      }, { onConflict: 'user_id', ignoreDuplicates: true })
      .select()
      .single();

    if (!insertErr && newProfile) {
      setProfile(newProfile as AuthProfile);
    } else {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile(user.id, user.email).finally(() => setLoading(false));
    }
  }, [user, fetchProfile]);

  const signUp = useCallback(async (email: string, password: string, displayName: string, extra?: { full_name?: string; phone_number?: string; country?: string; social_link?: string; tiktok_link?: string }): Promise<{ error: string | null }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    if (error) {
      if (error.message.toLowerCase().includes('already')) {
        return { error: 'emailExists' };
      }
      return { error: error.message };
    }
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        user_id: data.user.id,
        display_name: displayName,
        email,
        is_guest: false,
        full_name: extra?.full_name ?? null,
        phone_number: extra?.phone_number ?? null,
        country: extra?.country ?? null,
        social_link: extra?.social_link ?? null,
        tiktok_link: extra?.tiktok_link ?? null,
      });
      if (profileError) return { error: profileError.message };
    }
    return { error: null };
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setUser(null);
    setSession(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  const updateProfile = useCallback(async (patch: Partial<AuthProfile>) => {
    const current = profileRef.current;
    if (!current) return;

    // Optimistic update using ref to avoid stale closures
    const updated = { ...current, ...patch };
    setProfile(updated);

    const { error } = await supabase
      .from('profiles')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', current.id);

    if (error) {
      // Revert on failure
      setProfile(current);
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
    updateProfile,
  }), [session, user, profile, loading, signUp, signIn, signOut, refreshProfile, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
