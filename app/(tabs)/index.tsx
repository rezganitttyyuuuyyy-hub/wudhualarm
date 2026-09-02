import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [timeLeft, setTimeLeft] = useState('00:13');
  const [nextPrayer, setNextPrayer] = useState('المغرب');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>وضوء ألارم</Text>
          <Text style={styles.appSubtitle}>لا تفوت صلاتك مرة أخرى</Text>
        </View>
        <TouchableOpacity style={styles.themeToggle}>
          <Ionicons name="moon-outline" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.prayerCard}>
        <Text style={styles.prayerLabel}>الصلاة القادمة</Text>
        <Text style={styles.prayerName}>{nextPrayer}</Text>
        <Text style={styles.countdownText}>{timeLeft}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Ionicons name="flame-outline" size={24} color="#f59e0b" />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>التتابع</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="ellipse-outline" size={24} color="#10b981" />
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>النقاط</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="star-outline" size={24} color="#fbbf24" />
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statLabel}>تصريح تخطي</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => router.push('/alarms')}
      >
        <Ionicons name="alarm-outline" size={20} color="#ffffff" />
        <Text style={styles.actionButtonText}>إدارة المنبهات</Text>
      </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  appName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  appSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  themeToggle: {
    padding: 10,
    backgroundColor: '#1e293b',
    borderRadius: 12,
  },
  prayerCard: {
    backgroundColor: '#132247',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1e3a8a',
  },
  prayerLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
  },
  prayerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  countdownText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#34d399',
    letterSpacing: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#132247',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#059669',
    borderRadius: 15,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
        
