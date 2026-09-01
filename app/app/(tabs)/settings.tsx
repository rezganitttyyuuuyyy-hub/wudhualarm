import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [selectedLang, setSelectedLang] = useState('ar');
  const [selectedTheme, setSelectedTheme] = useState('dark');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerBox}>
        <Ionicons name="settings" size={36} color="#10b981" />
        <Text style={styles.title}>الإعدادات</Text>
        <Text style={styles.subtitle}>تخصيص التطبيق واللغات والسمات</Text>
      </View>

      <Text style={styles.sectionTitle}>السمة (المظهر)</Text>
      <View style={styles.card}>
        <TouchableOpacity 
          style={[styles.optionRow, selectedTheme === 'dark' && styles.optionSelected]} 
          onPress={() => setSelectedTheme('dark')}
        >
          <Ionicons name="moon" size={20} color="#34d399" />
          <Text style={styles.optionText}>النمط الداكن (Dark Mode)</Text>
          {selectedTheme === 'dark' && <Ionicons name="checkmark" size={18} color="#10b981" />}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.optionRow, selectedTheme === 'light' && styles.optionSelected]} 
          onPress={() => setSelectedTheme('light')}
        >
          <Ionicons name="sunny" size={20} color="#f59e0b" />
          <Text style={styles.optionText}>النمط الفاتح</Text>
          {selectedTheme === 'light' && <Ionicons name="checkmark" size={18} color="#10b981" />}
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>لغة التطبيق</Text>
      <View style={styles.card}>
        <TouchableOpacity 
          style={[styles.optionRow, selectedLang === 'ar' && styles.optionSelected]} 
          onPress={() => setSelectedLang('ar')}
        >
          <Ionicons name="globe" size={20} color="#38bdf8" />
          <Text style={styles.optionText}>العربية (Arabic)</Text>
          {selectedLang === 'ar' && <Ionicons name="checkmark" size={18} color="#10b981" />}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.optionRow, selectedLang === 'en' && styles.optionSelected]} 
          onPress={() => setSelectedLang('en')}
        >
          <Ionicons name="globe" size={20} color="#38bdf8" />
          <Text style={styles.optionText}>English (الإنجليزية)</Text>
          {selectedLang === 'en' && <Ionicons name="checkmark" size={18} color="#10b981" />}
        </TouchableOpacity>
      </View>

      <View style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>حول التطبيق</Text>
        <Text style={styles.aboutText}>وضوء ألارم - الإصدار 1.0.0</Text>
        <Text style={styles.aboutSub}>يساعدك على الاستيقاظ لصلاة الفجر والعشاء عبر التحقق الإلزامي بالكاميرا وصنبور الماء.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  headerBox: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#ffffff', marginTop: 8 },
  subtitle: { fontSize: 13, color: '#94a3b8', textAlign: 'center', marginTop: 4 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#34d399', marginBottom: 10, marginTop: 10 },
  card: { backgroundColor: '#0f172a', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#1e293b', marginBottom: 16 },
  optionRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  optionSelected: { backgroundColor: '#064e3b33' },
  optionText: { color: '#ffffff', fontSize: 15, flex: 1, marginLeft: 12, marginRight: 12 },
  aboutCard: { backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e293b', alignItems: 'center', marginTop: 10 },
  aboutTitle: { color: '#ffffff', fontWeight: 'bold', fontSize: 16, marginBottom: 6 },
  aboutText: { color: '#10b981', fontSize: 13, fontWeight: 'bold', marginBottom: 6 },
  aboutSub: { color: '#94a3b8', fontSize: 12, textAlign: 'center' }
});
        
