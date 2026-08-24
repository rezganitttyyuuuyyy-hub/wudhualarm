import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { PrayerTime } from './types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') {
    if (!('Notification' in window)) return false;
    const result = await Notification.requestPermission();
    return result === 'granted';
  }
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function getNotificationPermissionStatus(): Promise<boolean> {
  if (Platform.OS === 'web') {
    if (!('Notification' in window)) return false;
    return Notification.permission === 'granted';
  }
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

export async function scheduleAllPrayerAlarms(
  prayers: PrayerTime[],
  enabledKeys: string[],
  t: (key: string) => string,
): Promise<number> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  let scheduled = 0;
  const now = Date.now();

  for (const prayer of prayers) {
    if (!enabledKeys.includes(prayer.key)) continue;
    if (prayer.timestamp <= now) continue;

    const triggerDate = new Date(prayer.timestamp);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${t('wakeUpFor')} ${t(prayer.key)}`,
        body: `${prayer.time} - ${t('tapToDismiss')}`,
        sound: true,
        data: { prayerKey: prayer.key },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });
    scheduled++;
  }

  return scheduled;
}

export async function cancelAllAlarms(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
