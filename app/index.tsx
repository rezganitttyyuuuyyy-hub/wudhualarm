import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Switch, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Flame, Coins, Star, Camera } from 'lucide-react-native';

export default function HomeScreen() {
  const [currentTime, setCurrentTime] = useState('');
  const [isAlarmEnabled, setIsAlarmEnabled] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.subtitle}>الصلاة القادمة</Text>
          <Text style={styles.appTitle}>الفجر</Text>
        </View>

        <View style={styles.clockCard}>
          <Text style={styles.timeText}>{currentTime || "06:09:00"}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Flame color="#F97316" size={22} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>التتابع</Text>
          </View>
          <View style={styles.statBox}>
            <Coins color="#38BDF8" size={22} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>النقاط</Text>
          </View>
          <View style={styles.statBox}>
            <Star color="#FACC15" size={22} />
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>تصريح تخطي</Text>
          </View>
        </View>

        <View style={styles.alarmControlCard}>
          <View style={styles.row}>
            <Text style={styles.label}>الفجر (كاميرا ذكية)</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#0D9488' }}
              thumbColor={'#f4f3f4'}
              onValueChange={setIsAlarmEnabled}
              value={isAlarmEnabled}
            />
          </View>
          <View style={styles.cameraBadge}>
            <Camera color="#34D399" size={14} style={{ marginRight: 4 }} />
            <Text style={styles.cameraBadgeText}>الكاميرا مطلوبة للتحقق</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  scrollContent: {
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 15,
    color: '#94A3B8',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#34D399',
    marginTop: 5,
  },
  clockCard: {
    backgroundColor: '#064E3B',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#059669',
  },
  timeText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#38BDF8',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1B263B',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  statValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },
  alarmControlCard: {
    backgroundColor: '#1B263B',
    padding: 20,
    borderRadius: 15,
    width: '100%',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  cameraBadgeText: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
            
