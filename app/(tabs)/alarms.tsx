import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AlarmsScreen() {
  const [alarms, setAlarms] = useState([
    { id: 'fajr', name: 'الفجر', time: '04:30', enabled: true, strict: true, desc: 'كاميرا ذكية (صارم) - إلزامي' },
    { id: 'dhuhr', name: 'الظهر', time: '12:15', enabled: true, strict: false, desc: 'إشعار لطيف' },
    { id: 'asr', name: 'العصر', time: '15:45', enabled: true, strict: false, desc: 'إشعار لطيف' },
    { id: 'maghrib', name: 'المغرب', time: '18:51', enabled: true, strict: false, desc: 'إشعار لطيف' },
    { id: 'isha', name: 'العشاء', time: '20:05', enabled: true, strict: true, desc: 'الكاميرا مطلوبة - إلزامي' },
  ]);

  const toggleAlarm = (id: string) => {
    setAlarms(prev => prev.map(alarm => alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm));
  };

  const handleTestAlarm = () => {
    Alert.alert('محاكاة المنبه', 'تم تشغيل تجربة المنبه والكاميرا الصارمة بنجاح!');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.headerTitle}>منبهات الصلوات</Text>
      <Text style={styles.headerSubtitle}>إدارة أوقات الصلوات وتفعيل نظام الكاميرا الذكية</Text>

      {alarms.map((alarm) => (
        <View key={alarm.id} style={styles.alarmCard}>
          <View style={styles.alarmInfo}>
            <View style={styles.alarmHeaderRow}>
              <Text style={styles.prayerTitle}>{alarm.name}</Text>
              <Text style={styles.prayerTime}>{alarm.time}</Text>
            </View>
            <Text style={styles.prayerSubtitle}>{alarm.desc}</Text>
          </View>
          <Switch
            value={alarm.enabled}
            onValueChange={() => toggleAlarm(alarm.id)}
            trackColor={{ false: '#334155', true: '#059669' }}
            thumbColor={'#ffffff'}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.testButton} onPress={handleTestAlarm}>
        <Ionicons name="notifications-outline" size={20} color="#ffffff" style={{ marginLeft: 8 }} />
        <Text style={styles.testButtonText}>محاكاة المنبه التجريبي</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b132b' },
  contentContainer: { padding: 20, paddingBottom: 40 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#ffffff', marginTop: 20, marginBottom: 5 },
  headerSubtitle: { fontSize: 13, color: '#94a3b8', marginBottom: 20 },
  alarmCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#132247', borderRadius: 15, padding: 18, marginBottom: 15, borderWidth: 1, borderColor: '#1e293b' },
  alarmInfo: { flex: 1, marginRight: 15 },
  alarmHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  prayerTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  prayerTime: { fontSize: 16, fontWeight: 'bold', color: '#34d399' },
  prayerSubtitle: { fontSize: 13, color: '#94a3b8' },
  testButton: { flexDirection: 'row', backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 12, padding: 15, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  testButtonText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' }
});
        
