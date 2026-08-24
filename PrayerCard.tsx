import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '@/lib/AppContext';
import type { PrayerTime } from '@/lib/types';
import { CAMERA_MANDATORY } from '@/lib/constants';
import { Sunrise } from 'lucide-react-native';

interface Props {
  prayer: PrayerTime;
  isNext?: boolean;
}

function PrayerCard({ prayer, isNext }: Props) {
  const { palette, t, alarms } = useApp();
  const alarm = alarms[prayer.key];
  const isCamera = CAMERA_MANDATORY.includes(prayer.key);
  const isCameraMode = alarm?.mode === 'camera';

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: palette.card, borderColor: palette.border },
        isNext && { borderColor: palette.primary, borderWidth: 2 },
      ]}
    >
      <View style={styles.left}>
        <View style={[styles.iconWrap, { backgroundColor: palette.surfaceAlt }]}>
          {prayer.key === 'fajr' ? (
            <Sunrise color={palette.primary} size={22} strokeWidth={2} />
          ) : (
            <View style={[styles.dot, { backgroundColor: palette.primary }]} />
          )}
        </View>
        <View>
          <Text style={[styles.name, { color: palette.text }]}>{t(prayer.key)}</Text>
          <Text style={[styles.time, { color: palette.textMuted }]}>{prayer.time}</Text>
        </View>
      </View>
      <View style={styles.right}>
        {isCameraMode ? (
          <View style={[styles.badge, { backgroundColor: palette.primary + '22' }]}>
            <Text style={[styles.badgeText, { color: palette.primary }]}>{t('cameraRequired')}</Text>
          </View>
        ) : (
          <View style={[styles.badge, { backgroundColor: palette.accent + '22' }]}>
            <Text style={[styles.badgeText, { color: palette.accent }]}>{t('gentleSound')}</Text>
          </View>
        )}
        <Text style={[styles.modeLabel, { color: palette.textMuted }]}>
          {isCamera ? t('mandatory') : t('optional')}
        </Text>
      </View>
    </View>
  );
}

export default React.memo(PrayerCard);

const styles = StyleSheet.create({
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 16, padding: 16, borderWidth: 1 },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  name: { fontSize: 18, fontWeight: '600' },
  time: { fontSize: 14, marginTop: 2 },
  right: { alignItems: 'flex-end', gap: 4 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  modeLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
});
