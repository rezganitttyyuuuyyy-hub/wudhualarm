import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AlarmsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.headerTitle}>منبهات الصلوات</Text>
      
      <View style={styles.alarmCard}>
        <View style={styles.alarmInfo}>
          <Text style={styles.prayerTitle}>الفجر</Text>
          <Text style={styles.prayerSubtitle}>كاميرا ذكية (صارم) - إلزامي</Text>
        </View>
      </View>

      <View style={styles.alarmCard}>
        <View style={styles.alarmInfo}>
          <Text style={styles.prayerTitle}>الظهر</Text>
          <Text style={styles.prayerSubtitle}>إشعار لطيف</Text>
        </View>
      </View>

      <View style={styles.alarmCard}>
        <View style={styles.alarmInfo}>
          <Text style={styles.prayerTitle}>العصر</Text>
          <Text style={styles.prayerSubtitle}>إشعار لطيف</Text>
        </View>
      </View>

      <View style={styles.alarmCard}>
        <View style={styles.alarmInfo}>
          <Text style={styles.prayerTitle}>المغرب</Text>
          <Text style={styles.prayerSubtitle}>إشعار لطيف</Text>
        </View>
      </View>

      <View style={styles.alarmCard}>
        <View style={styles.alarmInfo}>
          <Text style={styles.prayerTitle}>العشاء</Text>
          <Text style={styles.prayerSubtitle}>الكاميرا مطلوبة - إلزامي</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b132b',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    marginTop: 20,
  },
  alarmCard: {
    backgroundColor: '#132247',
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  alarmInfo: {
    flex: 1,
  },
  prayerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  prayerSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
  },
});
