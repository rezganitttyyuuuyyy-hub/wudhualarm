import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '@/lib/AppContext';
import { Flame, Coins, Star } from 'lucide-react-native';

function StatsBar() {
  const { palette, t, profile } = useApp();
  return (
    <View style={[styles.container, { backgroundColor: palette.card, borderColor: palette.border }]}>
      <Stat icon={<Flame color={palette.accent} size={20} strokeWidth={2.2} />} value={String(profile.streak)} label={t('streak')} palette={palette} />
      <Divider palette={palette} />
      <Stat icon={<Coins color={palette.primary} size={20} strokeWidth={2.2} />} value={String(profile.points)} label={t('points')} palette={palette} />
      <Divider palette={palette} />
      <Stat icon={<Star color={palette.warning} size={20} strokeWidth={2.2} />} value={String(profile.skipPasses)} label={t('skipPass')} palette={palette} />
    </View>
  );
}

function Stat({ icon, value, label, palette }: { icon: React.ReactNode; value: string; label: string; palette: ReturnType<typeof useApp>['palette'] }) {
  return (
    <View style={styles.stat}>
      {icon}
      <Text style={[styles.value, { color: palette.text }]}>{value}</Text>
      <Text style={[styles.label, { color: palette.textMuted }]}>{label}</Text>
    </View>
  );
}

function Divider({ palette }: { palette: ReturnType<typeof useApp>['palette'] }) {
  return <View style={[styles.divider, { backgroundColor: palette.border }]} />;
}

export default React.memo(StatsBar);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, paddingVertical: 14 },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  value: { fontSize: 20, fontWeight: '700' },
  label: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
  divider: { width: 1, height: 36, alignSelf: 'center' },
});
