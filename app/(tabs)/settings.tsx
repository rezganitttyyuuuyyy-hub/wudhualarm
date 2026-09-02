import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { setLanguage, t } from '../../i18n';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [strictMode, setStrictMode] = useState(true);
  const [selectedLang, setSelectedLang] = useState('ar');

  const handleLanguageChange = (lang: 'ar' | 'en' | 'tr' | 'id' | 'es') => {
    setLanguage(lang);
    setSelectedLang(lang);
    Alert.alert('تم تغيير اللغة', 'Language updated successfully');
  };

  const handleSave = () => {
    Alert.alert('تم الحفظ', 'تم حفظ إعدادات التطبيق بنجاح');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.headerTitle}>{t('settings')}</Text>
      <Text style={styles.headerSubtitle}>تخصيص تفضيلات التطبيق ومنبهات الصلوات</Text>

      {/* قسم اللغات */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>لغة التطبيق / App Language</Text>
        <View style={styles.langRow}>
          {[
            { code: 'ar', label: 'العربية' },
            { code: 'en', label: 'English' },
            { code: 'tr', label: 'Türkçe' },
            { code: 'id', label: 'Indo' },
            { code: 'es', label: 'Español' },
          ].map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.langButton,
                selectedLang === lang.code && styles.langButtonActive,
              ]}
              onPress={() => handleLanguageChange(lang.code as any)}
            >
              <Text
                style={[
                  styles.langText,
                  selectedLang === lang.code && styles.langTextActive,
                ]}
              >
                {lang.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* قسم التفضيلات العامة */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>التفضيلات العامة</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>الإشعارات والتنبيهات</Text>
            <Text style={styles.settingDesc}>استلام تنبيهات أوقات الصلوات اليومية</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#334155', true: '#059669' }}
            thumbColor={'#ffffff'}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>الوضع الليلي</Text>
            <Text style={styles.settingDesc}>تفعيل المظهر المظلم المريح للعين</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#334155', true: '#059669' }}
            thumbColor={'#ffffff'}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>الوضع الصارم للفجر والعشاء</Text>
            <Text style={styles.settingDesc}>إلزامية التحقق بالكاميرا الذكية</Text>
          </View>
          <Switch
            value={strictMode}
            onValueChange={setStrictMode}
            trackColor={{ false: '#334155', true: '#059669' }}
            thumbColor={'#ffffff'}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{t('save')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b132b' },
  contentContainer: { padding: 20, paddingBottom: 40 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#ffffff', marginTop: 20, marginBottom: 5 },
  headerSubtitle: { fontSize: 13, color: '#94a3b8', marginBottom: 20 },
  sectionCard: { backgroundColor: '#132247', borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#1e293b' },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#34d399', marginBottom: 15 },
  langRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  langButton: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#1e293b', borderRadius: 8, borderWidth: 1, borderColor: '#334155', marginBottom: 8 },
  langButtonActive: { backgroundColor: '#059669', borderColor: '#34d399' },
  langText: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  langTextActive: { color: '#ffffff', fontWeight: 'bold' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  settingInfo: { flex: 1, marginRight: 15 },
  settingTitle: { fontSize: 15, fontWeight: 'bold', color: '#ffffff', marginBottom: 3 },
  settingDesc: { fontSize: 12, color: '#94a3b8' },
  saveButton: { backgroundColor: '#059669', borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' }
});
                
