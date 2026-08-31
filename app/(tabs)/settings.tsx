import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Settings as SettingsIcon } from 'lucide-react-native';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <SettingsIcon color="#34D399" size={32} />
          <Text style={styles.title}>الإعدادات</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>حول التطبيق</Text>
          <Text style={styles.desc}>
            وضوء ألارم يساعدك على الاستيقاظ للفجر والعشاء بالتحقق عبر الكاميرا الذكية، ويحافظ على التزامك بالتتابع والمكافآت.
          </Text>
          <Text style={styles.version}>v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1B2A' },
  scrollContent: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 8 },
  card: { backgroundColor: '#1B263B', padding: 20, borderRadius: 15, borderWidth: 1, borderColor: '#30363D' },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  desc: { color: '#94A3B8', fontSize: 14, lineHeight: 22 },
  version: { color: '#34D399', fontSize: 12, marginTop: 15, fontWeight: 'bold' }
});
              
