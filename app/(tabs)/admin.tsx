import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AdminScreen() {
  // قائمة المستخدمين كاملة، والتطبيق بيكشف ويجيب أعلى 3 تلقائياً حسب النقاط
  const [users, setUsers] = useState([
    { id: '1', name: 'حمزة الرزقاني', score: 150, email: 'hamza@user.com', phone: '+216XXXXXXXX' },
    { id: '2', name: 'أحمد صالح', score: 130, email: 'ahmad@user.com', phone: '+216YYYYYYYY' },
    { id: '3', name: 'محمد علي', score: 110, email: 'mohamed@user.com', phone: '+216ZZZZZZZZ' },
    { id: '4', name: 'يوسف التونسي', score: 61, email: 'youssef@user.com', phone: '+216WWWWWWWW' }, // لو وصل هنا هينافس ويدخل الترتيب
  ]);

  // فرز المستخدمين من الأعلى نقاط للأقل، ثم أخذ أول 3 فقط تلقائياً
  const sortedTopUsers = [...users].sort((a, b) => b.score - a.score).slice(0, 3);

  const handleResetMonthly = () => {
    Alert.alert('تأكيد التصفير', 'هل أنت متأكد من إعادة تعيين نقاط الشهر وبدء دورة جديدة؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'نعم، تصفير النقاط', onPress: () => Alert.alert('تم', 'تمت إعادة تعيين النقاط بنجاح') }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerCard}>
        <Ionicons name="shield-checkmark" size={40} color="#34d399" />
        <Text style={styles.headerTitle}>لوحة الإدارة المركزية</Text>
        <Text style={styles.headerSubtitle}>متابعة أفضل 3 مراكز تتحدث تلقائياً حسب النقاط</Text>
      </View>

      <View style={styles.actionCard}>
        <Text style={styles.sectionTitle}>إدارة الدورة الحالية</Text>
        <TouchableOpacity style={styles.resetButton} onPress={handleResetMonthly}>
          <Ionicons name="refresh-outline" size={20} color="#ffffff" style={{ marginLeft: 8 }} />
          <Text style={styles.resetButtonText}>تنفيذ إعادة التعيين الشهرية</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>أعلى 3 متصدرين حالياً (تحديث تلقائي)</Text>
        
        {sortedTopUsers.map((user, index) => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userHeader}>
              <Text style={styles.userRank}>المركز #{index + 1}</Text>
              <Text style={styles.userScore}>{user.score} نقطة</Text>
            </View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userMeta}>📧 الجيميل: {user.email}</Text>
            <Text style={styles.userMeta}>📱 الهاتف: {user.phone}</Text>
            
            <View style={styles.contactActions}>
              <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL(`tel:${user.phone}`)}>
                <Ionicons name="call" size={16} color="#ffffff" />
                <Text style={styles.contactText}>اتصال</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactBtnEmail} onPress={() => Linking.openURL(`mailto:${user.email}`)}>
                <Ionicons name="mail" size={16} color="#ffffff" />
                <Text style={styles.contactText}>إيميل</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b132b' },
  contentContainer: { padding: 20, paddingBottom: 40 },
  headerCard: { backgroundColor: '#132247', borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#1e293b' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#ffffff', marginTop: 10, marginBottom: 5 },
  headerSubtitle: { fontSize: 12, color: '#94a3b8' },
  actionCard: { backgroundColor: '#132247', borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#1e293b' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#34d399', marginBottom: 15 },
  resetButton: { flexDirection: 'row', backgroundColor: '#059669', borderRadius: 12, padding: 12, justifyContent: 'center', alignItems: 'center' },
  resetButtonText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  sectionCard: { backgroundColor: '#132247', borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#1e293b' },
  userCard: { backgroundColor: '#1e293b', borderRadius: 15, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#334155' },
  userHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  userRank: { color: '#fbbf24', fontSize: 12, fontWeight: 'bold' },
  userScore: { color: '#34d399', fontSize: 12, fontWeight: 'bold' },
  userName: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  userMeta: { color: '#94a3b8', fontSize: 13, marginBottom: 4 },
  contactActions: { flexDirection: 'row', marginTop: 12, gap: 10 },
  contactBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#2563eb', padding: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  contactBtnEmail: { flex: 1, flexDirection: 'row', backgroundColor: '#475569', padding: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  contactText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold', marginRight: 5 }
});
              
