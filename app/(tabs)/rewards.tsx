import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Gift, Play } from 'lucide-react-native';

export default function RewardsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Gift color="#34D399" size={32} />
          <Text style={styles.title}>المكافآت</Text>
          <Text style={styles.sub}>رصيد نقاطك: 0 نقطة</Text>
        </View>

        <TouchableOpacity style={styles.adCard}>
          <Play color="#34D399" size={20} />
          <View style={{marginLeft: 10}}>
            <Text style={styles.adTitle}>شاهد إعلان (+2 نقطة)</Text>
            <Text style={styles.adSub}>شاهد فيديو قصير واكسب نقطتين</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>فتح الميزات</Text>
        {[
          { name: 'التحقق بالكاميرا الذكية', cost: '50 النقاط' },
          { name: 'وضع المنبه الصارم', cost: '80 النقاط' },
          { name: 'قراء أذان حصريون', cost: '40 النقاط' },
          { name: 'سمات مميزة', cost: '60 النقاط' },
        ].map((item, idx) => (
          <View key={idx} style={styles.featureCard}>
            <View>
              <Text style={styles.featTitle}>{item.name}</Text>
              <Text style={styles.featSub}>التكلفة: {item.cost}</Text>
            </View>
            <TouchableOpacity style={styles.unlockBtn}>
              <Text style={styles.unlockText}>افتراضي</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1B2A' },
  scrollContent: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 8 },
  sub: { color: '#34D399', fontSize: 14, fontWeight: 'bold', marginTop: 4 },
  adCard: { backgroundColor: '#1B263B', padding: 15, borderRadius: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#30363D' },
  adTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  adSub: { color: '#94A3B8', fontSize: 12 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  featureCard: { backgroundColor: '#1B263B', padding: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#30363D' },
  featTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  featSub: { color: '#94A3B8', fontSize: 12 },
  unlockBtn: { backgroundColor: '#064E3B', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  unlockText: { color: '#34D399', fontSize: 13, fontWeight: 'bold' }
});
