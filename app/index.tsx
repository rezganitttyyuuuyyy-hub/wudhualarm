import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function Page() {
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
      
      <View style={styles.header}>
        <Text style={styles.appTitle}>Wudhu Alarm</Text>
        <Text style={styles.subtitle}>منبه الوضوء والصلاة</Text>
      </View>

      <View style={styles.clockCard}>
        <Text style={styles.timeText}>{currentTime || "00:00:00"}</Text>
        <Text style={styles.dateText}>الوقت المحلي الحالي</Text>
      </View>

      <View style={styles.alarmControlCard}>
        <View style={styles.row}>
          <Text style={styles.label}>تفعيل التنبيه المبكر للوضوء</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#0D9488' }}
            thumbColor={isAlarmEnabled ? '#f4f3f4' : '#f4f3f4'}
            onValueChange={setIsAlarmEnabled}
            value={isAlarmEnabled}
          />
        </View>
        <Text style={styles.statusText}>
          {isAlarmEnabled ? "المنبه مفعل وجاهز للتنبيه" : "المنبه متوقف"}
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => alert('قريباً: إعدادات وقت الوضوء المخصصة!')}>
        <Text style={styles.buttonText}>إعدادات الأوقات</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 5,
  },
  clockCard: {
    backgroundColor: '#1B263B',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  timeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#38BDF8',
  },
  dateText: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 10,
  },
  alarmControlCard: {
    backgroundColor: '#1B263B',
    padding: 20,
    borderRadius: 15,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
  },
  statusText: {
    color: '#38BDF8',
    fontSize: 14,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#0D9488',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
