import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PuzzlesScreen() {
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 5;
  const [score, setScore] = useState(0);

  const handleAnswer = (isCorrect: boolean) => {
    if (attempts >= maxAttempts) {
      Alert.alert("انتهت المحاولات", "لقد استنفدت المحاولات الـ 5. شاهدي إعلاناً قصيراً لتستعيد الفرصة وتتابع اللعب!");
      return;
    }

    if (isCorrect) {
      setScore(score + 1.5);
      Alert.alert("إجابة صحيحة!", "كسبت 1.5 نقطة.");
    } else {
      Alert.alert("إجابة خاطئة", "حاول في السؤال القادم.");
    }

    setAttempts(attempts + 1);
  };

  const watchAdForMoreAttempts = () => {
    // محاكاة مشاهدة إعلان AdMob واستعادة المحاولات
    Alert.alert("إعلان مكافأة", "جاري عرض الإعلان...", [
      { 
        text: "تم مشاهدة الإعلان", 
        onPress: () => {
          setAttempts(0); // إعادة تعيين المحاولات
          Alert.alert("ممتاز!", "تمت إضافة محاولات جديدة بنجاح.");
        } 
      }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerBox}>
        <Ionicons name="extension-puzzle" size={36} color="#10b981" />
        <Text style={styles.title}>ألغاز الاستيقاظ</Text>
        <Text style={styles.subtitle}>حل الألغاز واكسب 1.5 نقطة لكل إجابة صحيحة</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Ionicons name="checkmark-circle" size={20} color="#34d399" />
          <Text style={styles.statText}>المحاولات: {attempts}/{maxAttempts}</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="trophy" size={20} color="#eab308" />
          <Text style={styles.statText}>النقاط: {score}</Text>
        </View>
      </View>

      {/* إذا انتهت المحاولات يظهر زر مشاهدة الإعلان حصراً */}
      {attempts >= maxAttempts ? (
        <View style={styles.adCard}>
          <Ionicons name="play-circle" size={40} color="#38bdf8" />
          <Text style={styles.adTitle}>انتهت محاولاتك اليومية!</Text>
          <Text style={styles.adSubtitle}>شاهد إعلاناً قصيراً واحصل على 5 محاولات جديدة فوراً</Text>
          <TouchableOpacity style={styles.adButton} onPress={watchAdForMoreAttempts}>
            <Text style={styles.adButtonText}>شاهد إعلان واحصل على فرصة أخرى</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.questionCard}>
          <View style={styles.badgeEasy}>
            <Text style={styles.badgeText}>سهل</Text>
          </View>
          <Text style={styles.questionText}>كم عدد أعياد المسلمين في السنة؟</Text>
          
          <TouchableOpacity style={styles.optionButton} onPress={() => handleAnswer(false)}>
            <Text style={styles.optionText}>عید واحد</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={() => handleAnswer(true)}>
            <Text style={styles.optionText}>عيدان</Text>
          </TouchableOpacity>
          <TouchableOpacity style.optionButton} onPress={() => handleAnswer(false)}>
            <Text style={styles.optionText}>ثلاثة أعياد</Text>
          </TouchableOpacity>
          <TouchableOpacity style.optionButton} onPress={() => handleAnswer(false)}>
            <Text style={styles.optionText}>أربعة أعياد</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  headerBox: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#ffffff', marginTop: 8 },
  subtitle: { fontSize: 13, color: '#94a3b8', textAlign: 'center', marginTop: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statBox: { flex: 1, backgroundColor: '#0f172a', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 4, borderWidth: 1, borderColor: '#1e293b' },
  statText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold', marginLeft: 6, marginRight: 6 },
  questionCard: { backgroundColor: '#0f172a', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#1e293b', marginBottom: 20 },
  badgeEasy: { backgroundColor: '#064e3b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 12 },
  badgeText: { color: '#34d399', fontSize: 10, fontWeight: 'bold' },
  questionText: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginBottom: 16, textAlign: 'right' },
  optionButton: { backgroundColor: '#1e293b', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  optionText: { color: '#ffffff', fontSize: 15, textAlign: 'right' },
  adCard: { backgroundColor: '#0f172a', borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#0284c7' },
  adTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginTop: 12, marginBottom: 6 },
  adSubtitle: { fontSize: 13, color: '#94a3b8', textAlign: 'center', marginBottom: 20 },
  adButton: { backgroundColor: '#0284c7', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 14, width: '100%', alignItems: 'center' },
  adButtonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 }
});
          
