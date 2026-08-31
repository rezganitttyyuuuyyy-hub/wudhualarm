import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Brain } from 'lucide-react-native';

export default function PuzzlesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Brain color="#34D399" size={32} />
          <Text style={styles.title}>ألغاز</Text>
          <Text style={styles.sub}>حل الألغاز واكسب 1.5 نقطة لكل إجابة صحيحة</Text>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.qBadge}>EASY</Text>
          <Text style={styles.qText}>كم عدد أعياد المسلمين في السنة؟</Text>
          
          {['عيد واحد', 'عيدان', 'ثلاثة أعياد', 'أربعة أعياد'].map((opt, idx) => (
            <TouchableOpacity key={idx} style={styles.option}>
              <Text style={styles.optText}>{opt}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.submitBtn}>
            <Text style={styles.submitText}>إرسال الإجابة</Text>
          </TouchableOpacity>
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
  sub: { color: '#94A3B8', fontSize: 12, textAlign: 'center', marginTop: 4 },
  questionCard: { backgroundColor: '#1B263B', padding: 20, borderRadius: 15, borderWidth: 1, borderColor: '#30363D' },
  qBadge: { backgroundColor: '#064E3B', color: '#34D399', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, fontSize: 10, marginBottom: 10 },
  qText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  option: { backgroundColor: '#0D1B2A', padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#30363D' },
  optText: { color: '#fff', fontSize: 14 },
  submitBtn: { backgroundColor: '#064E3B', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  submitText: { color: '#34D399', fontWeight: 'bold', fontSize: 15 }
});
    
