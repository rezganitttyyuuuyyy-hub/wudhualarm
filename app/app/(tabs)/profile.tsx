import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  // البريد الإلكتروني الخاص بك كمطور (يمكنك تعديله أو ربطه بحساب تسسجيل الدخول)
  const developerEmail = "rezganitttyuuuyyy@gmail.com"; 
  const currentUserEmail = "rezganitttyuuuyyy@gmail.com"; // البريد الحالي للمستخدم التجريبي

  const isDeveloper = currentUserEmail === developerEmail;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarBox}>
          <Ionicons name="person" size={40} color="#34d399" />
        </View>
        <Text style={styles.userName}>حمزة الرزقاني</Text>
        <Text style={styles.userEmail}>{currentUserEmail}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="flame" size={24} color="#f97316" />
          <Text style={styles.statNum}>0</Text>
          <Text style={styles.statText}>التتابع الحالي</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="trophy" size={24} color="#38bdf8" />
          <Text style={styles.statNum}>0</Text>
          <Text style={styles.statText}>إجمالي النقاط</Text>
        </View>
      </View>

      {/* لوحة الإدارة - تظهر حصرياً للمطور فقط ولا تظهر للمستخدمين العاديين */}
      {isDeveloper && (
        <View style={styles.adminSection}>
          <View style={styles.adminHeader}>
            <Ionicons name="shield-checkmark" size={20} color="#10b981" />
            <Text style={styles.adminHeaderText}>منطقة المطور (خاص بك وحدك)</Text>
          </View>
          <TouchableOpacity 
            style={styles.adminButton}
            onClicked={() => Alert.alert("لوحة الإدارة", "أهلاً بك يا حمزة في لوحة التحكم الخاصة بالمطور.")}
          >
            <Ionicons name="settings-outline" size={20} color="#ffffff" />
            <Text style={styles.adminButtonText}>لوحة الإدارة الشاملة</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        <Text style={styles.logoutText}>تسجيل الخروج</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  profileHeader: { alignItems: 'center', backgroundColor: '#0f172a', borderRadius: 20, padding: 24, marginBottom: 20, borderWidth: 1, borderColor: '#1e293b' },
  avatarBox: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#064e3b', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  userEmail: { fontSize: 13, color: '#94a3b8' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#0f172a', borderRadius: 16, padding: 16, alignItems: 'center', marginHorizontal: 4, borderWidth: 1, borderColor: '#1e293b' },
  statNum: { fontSize: 22, fontWeight: 'bold', color: '#ffffff', marginVertical: 4 },
  statText: { fontSize: 12, color: '#94a3b8' },
  adminSection: { backgroundColor: '#064e3b33', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#059669' },
  adminHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  adminHeaderText: { color: '#34d399', fontWeight: 'bold', fontSize: 14, marginLeft: 8 },
  adminButton: { backgroundColor: '#059669', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12 },
  adminButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15, marginLeft: 8 },
  logoutButton: { backgroundColor: '#0f172a', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#7f1d1d' },
  logoutText: { color: '#ef4444', fontWeight: 'bold', fontSize: 15, marginLeft: 8 }
});
