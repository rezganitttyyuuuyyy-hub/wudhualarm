import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/lib/AppContext';
import { formatCountdown } from '@/lib/prayerTimes';

interface Props {
  target: number;
  label?: string;
  size?: 'lg' | 'md';
}

export default function CountdownTimer({ target, label, size = 'lg' }: Props) {
  const { palette, t } = useApp();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const ms = target - now;
  const { h, m } = formatCountdown(ms);
  const big = size === 'lg';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[palette.gradientFrom, palette.gradientTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, big ? styles.cardLg : styles.cardMd]}
      >
        {label && <Text style={[styles.label, { color: palette.textInverse }]}>{label}</Text>}
        <View style={styles.timeRow}>
          <TimeBlock value={h} unit={t('hours')} big={big} color={palette.textInverse} />
          <Text style={[styles.colon, { color: palette.textInverse }]}>:</Text>
          <TimeBlock value={m} unit={t('minutes')} big={big} color={palette.textInverse} />
        </View>
      </LinearGradient>
    </View>
  );
}

function TimeBlock({ value, unit, big, color }: { value: string; unit: string; big: boolean; color: string }) {
  return (
    <View style={styles.block}>
      <Text style={[styles.value, { color }, big ? styles.valueLg : styles.valueMd]}>{value}</Text>
      <Text style={[styles.unit, { color: color }]}>{unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  card: { borderRadius: 24, paddingHorizontal: 24, paddingVertical: 20, alignItems: 'center' },
  cardLg: { minWidth: 280 },
  cardMd: { minWidth: 220 },
  label: { fontSize: 14, fontWeight: '600', opacity: 0.85, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  block: { alignItems: 'center', minWidth: 70 },
  value: { fontWeight: '700', fontVariant: ['tabular-nums'] },
  valueLg: { fontSize: 56 },
  valueMd: { fontSize: 36 },
  unit: { fontSize: 12, opacity: 0.8, marginTop: 4, textTransform: 'uppercase' },
  colon: { fontSize: 40, fontWeight: '700', marginBottom: 12 },
});
