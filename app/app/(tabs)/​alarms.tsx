import React from 'react';
import { StyleSheet, Text, View, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AlarmsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>منبهات الصلاة</Text>
      
      {/* صلاة الفجر - كاميرا ذكية إلزامية لتصوير صنبور الماء */}
      <View style={styles.alarmCardActive}>
        <View style={styles.alarmHeader}>
          <View style={styles.alarmInfo}>
            <Ionicons name="alarm" size={24} color="#10b981" />
            <Text style={styles.alarmName}>الفجر</Text>
          </View>
          <View style={styles.badgeRequired}>
            <Text style={styles.badgeText}>كاميرا صنبور الماء (إلزامي)</Text>
          </View>
        </View>
        <Text style={styles.alarmTime}>05:00</Text>
        <Switch value={true} onValueChange={() => {}} trackColor={{ false: '#334155', true: '#10b981' }} />
      </View>

      <View style={styles.alarmCard}>
        <View style={styles.alarmHeader}>
          <View style={styles.alarmInfo}>
            <Ionicons name="notifications" size={24} color="#f59e0b" />
            <Text style={styles.alarmName}>الظهر</Text>
          </View>
          <Text style={styles.alarmSub}>إشعار لطيف</Text>
        </View>
        <Text style={styles.alarmTime}>12:30</Text>
        <Switch value={true} onValueChange={() => {}} trackColor={{ false: '#334155', true: '#10b981' }} />
      </View>

      <View style={styles.alarmCard}>
        <View style={styles.alarmHeader}>
          <View style={styles.alarmInfo}>
            <Ionicons name="notifications" size={24} color="#f59e0b" />
            <Text style={styles.alarmName}>العصر</Text>
          </View>
          <Text style={styles.alarmSub}>إشعار لطيف</Text>
        </View>
        <Text style={styles.alarmTime}>16:00</Text>
        <Switch value={true} onValueChange={() => {}} trackColor={{ false: '#334155', true: '#10b981' }} />
      </View>

      <View style={styles.alarmCard}>
        <View style={styles.alarmHeader}>
          <View style={styles.alarmInfo}>
            <Ionicons name="notifications" size={24} color="#f59e0b" />
            <Text style={styles.alarmName}>المغرب</Text>
          </View>
          <Text style={styles.alarmSub}>إشعار لطيف</Text>
        </View>
        <Text style={styles.alarmTime}>18:51</Text>
        <Switch value={true} onValueChange={() => {}} trackColor={{ false: '#334155', true: '#10b981' }} />
      </View>

      {/* صلاة العشاء - كاميرا ذكية إلزامية لتصوير صنبور الماء */}
      <View style={styles.alarmCardActive}>
        <View style={styles.alarmHeader}>
          <View style={styles.alarmInfo}>
            <Ionicons name="alarm" size={24} color="#10b981" />
            <Text style={styles.alarmName}>العشاء</Text>
          </View>
          <View style={styles.badgeRequired}>
            <Text style={styles.badgeText}>كاميرا صنبور الماء (إلزامي)</Text>
          </View>
        </View>
        <Text style={styles.alarmTime}>20:05</Text>
        <Switch value={true} onValueChange={() => {}} trackColor={{ false: '#334155', true: '#10b981' }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#ffffff', marginBottom: 20, textAlign: 'center' },
  alarmCard: { backgroundColor: '#0f172a', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#1e293b' },
  alarmCardActive: { backgroundColor: '#0f172a', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#059669' },
  alarmHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  alarmInfo: { flexDirection: 'row', alignItems: 'center' },
  alarmName: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginLeft: 10, marginRight: 10 },
  alarmSub: { fontSize: 12, color: '#94a3b8' },
  badgeRequired: { backgroundColor: '#064e3b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { color: '#34d399', fontSize: 10, fontWeight: 'bold' },
  alarmTime: { fontSize: 28, fontWeight: 'bold', color: '#34d399', marginBottom: 12 }
});
        
