import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AppProvider, useApp } from '@/lib/AppContext';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { I18nManager, View, ActivityIndicator, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { createRewardedAd, loadRewardedAd } from '@/lib/ads';

function RootStack() {
  const { loaded, dark, palette, rtl } = useApp();
  const { loading: authLoading, profile } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS !== 'web') {
      createRewardedAd();
      loadRewardedAd().catch(() => {});
    }
  }, []);

  useEffect(() => {
    I18nManager.forceRTL(rtl);
  }, [rtl]);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const prayerKey = response.notification.request.content.data?.prayerKey;
      if (prayerKey) {
        router.push(`/alarm-ring?key=${prayerKey}`);
      }
    });
    return () => sub.remove();
  }, [router]);

  const inAuthGroup = segments[0] === 'auth';

  useEffect(() => {
    if (!loaded || authLoading) return;
    if (!profile && !inAuthGroup) {
      router.replace('/auth');
    } else if (profile && inAuthGroup) {
      router.replace('/');
    }
  }, [profile, inAuthGroup, loaded, authLoading]);

  if (!loaded || authLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="alarm-ring" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="admin" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={dark ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <RootStack />
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
