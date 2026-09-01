import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerBanner}>
        <Text style={styles.appTitle}>وضوء ألارم</Text>
        <Text style={styles.appSubtitle}>لا تفوت صلاتك مرة أخرى</Text>
      </View>
      
      <Text style={styles.sectionLabel}>الصلاة القادمة</Text>
      <View style={styles.prayerCard}>
        <Text style={styles.prayerName}>المغرب</Text>
        <View style={styles.timeBox}>
          <Text style={styles.timeText}>18:51</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="flame" size={24} color="#f97316" />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>التتابع الحالي</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="trophy" size={24} color="#38bdf8" />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>إجمالي النقاط</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="star" size={24} color="#eab308" />
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statLabel}>تصريح تخطي</Text>
        </View>
      </View>

      <View style={styles.featureBox}>
        <View style={styles.featureInfo}>
          <Text style={styles.featureTitle}>الفجر (كاميرا ذكية)</Text>
          <View style={styles.badge}>
            <Ionicons name="camera" size={14} color="#10b981" />
            <Text style={styles.badgeText}>الكاميرا مطلوبة للتحقق</Text>
          </View>
        </View>
        <Switch value={true} onValueChange={() => {}} trackColor={{ false: '#334155', true: '#10b981' }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  headerBanner: { alignItems: 'center', marginBottom: 20 },
  appTitle: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  appSubtitle: { fontSize: 13, color: '#94a3b8' },
  sectionLabel: { fontSize: 14, color: '#94a3b8', textAlign: 'center', marginBottom: 10 },
  prayerCard: { backgroundColor: '#0f172a', borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#1e293b' },
  prayerName: { fontSize: 28, fontWeight: 'bold', color: '#10b981', marginBottom: 16 },
  timeBox: { backgroundColor: '#064e3b', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 14, width: '100%', alignItems: 'center' },
  timeText: { fontSize: 36, fontWeight: 'bold', color: '#34d399' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statItem: { flex: 1, backgroundColor: '#0f172a', borderRadius: 16, padding: 16, alignItems: 'center', marginHorizontal: 4, borderWidth: 1, borderColor: '#1e293b' },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginVertical: 4 },
  statLabel: { fontSize: 12, color: '#94a3b8' },
  featureBox: { backgroundColor: '#0f172a', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#1e293b' },
  featureInfo: { flex: 1 },
  featureTitle: { fontSize: 16, fontWeight: 'bold', color: '#ffffff', marginBottom: 6 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#064e3b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  badgeText: { color: '#34d399', fontSize: 11, marginLeft: 4 }
});
            
