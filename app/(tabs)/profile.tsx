import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={40} color="#34d399" />
        </View>
        <Text style={styles.userName}>حمزة الرزقاني</Text>
        <Text style={styles.userEmail}>wudhualarm.pro@user.com</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Ionicons name="checkbox-outline" size={22} color="#10b981" />
          <Text style={styles.statNumber}>142</Text>
          <Text style={styles.statLabel}>الصلوات المؤداة</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="flame-outline" size={22} color="#f59e0b" />
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>أيام التتابع</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="ellipse-outline" size={22} color="#38bdf8" />
          <Text style={styles.statNumber}>85.5</Text>
          <Text style={styles.statLabel}>النقاط الكلية</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>لوحة المتصدرين الشهرية</Text>
        <View style={styles.leaderboardRow}>
          <View style={styles.rankBadgeFirst}>
            <Ionicons name="trophy" size={16} color="#fbbf24" />
            <Text style={styles.rankText}>المركز الأول</Text>
          </View>
          <Text style={styles.leaderboardName}>حمزة الرزقاني</Text>
          <Text style={styles.leaderboardScore}>85.5 نقطة</Text>
        </View>
        <View style={styles.leaderboardRow}>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>المركز الثاني</Text>
          </View>
          <Text style={styles.leaderboardName}>مستخدم متميز</Text>
          <Text style={styles.leaderboardScore}>72.0 نقطة</Text>
        </View>
        <View style={styles.leaderboardRow}>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>المركز الثالث</Text>
          </View>
          <Text style={styles.leaderboardName}>حافظ الصلوات</Text>
          <Text style={styles.leaderboardScore}65.0 نقطة</Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>الإنجازات والتقدم</Text>
        <View style={styles.achievementRow}>
          <Ionicons name="medal-outline" size={24} color="#fbbf24" />
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>المحافظ الدائم</Text>
            <Text style={styles.achievementDesc}>صلِ الفجر في وقتها لـ 7 أيام متتالية</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={20} color="#ef4444" style={{ marginLeft: 8 }} />
        <Text style={styles.logoutText}>تسجيل الخروج</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b132b' },
  contentContainer: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginTop: 20, marginBottom: 25 },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#132247', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#1e3a8a', marginBottom: 12 },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  userEmail: { fontSize: 13, color: '#94a3b8' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statBox: { flex: 1, backgroundColor: '#132247', borderRadius: 15, padding: 15, alignItems: 'center', marginHorizontal: 5, borderWidth: 1, borderColor: '#1e293b' },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#34d399', marginTop: 6, marginBottom: 2 },
  statLabel: { fontSize: 11, color: '#94a3b8', textAlign: 'center' },
  sectionCard: { backgroundColor: '#132247', borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#1e293b' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#ffffff', marginBottom: 15 },
  leaderboardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: 12, borderRadius: 12, marginBottom: 10 },
  rankBadgeFirst: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#451a03', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  rankBadge: { backgroundColor: '#334155', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  rankText: { color: '#fbbf24', fontSize: 11, fontWeight: 'bold' },
  leaderboardName: { color: '#ffffff', fontSize: 14, fontWeight: '600', flex: 1, textAlign: 'right', marginHorizontal: 10 },
  leaderboardScore: { color: '#34d399', fontSize: 13, fontWeight: 'bold' },
  achievementRow: { flexDirection: 'row', alignItems: 'center' },
  achievementInfo: { marginRight: 15, flex: 1 },
  achievementTitle: { fontSize: 15, fontWeight: 'bold', color: '#ffffff', marginBottom: 2 },
  achievementDesc: { fontSize: 12, color: '#94a3b8' },
  logoutButton: { flexDirection: 'row', backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', borderRadius: 12, padding: 15, justifyContent: 'center', alignItems: 'center' },
  logoutText: { color: '#ef4444', fontSize: 15, fontWeight: 'bold' }
});
    
