import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RewardsScreen() {
  const [points, setPoints] = useState(0);

  const unlockFeature = (cost: number, featureName: string) => {
    if (points >= cost) {
      setPoints(points - cost);
      Alert.alert("تم الفتح بنجاح!", `لقد حصلت على ميزة: ${featureName}`);
    } else {
      Alert.alert("نقاط غير كافية", "عليك جمع المزيد من النقاط عبر الألغاز أو مشاهدة الإعلانات.");
    }
  };

  const watchAdForPoints = () => {
    Alert.alert("إعلان مكافأة", "جاري عرض الإعلان...", [
      {
        text: "تم مشاهدة الإعلان",
        onPress: () => {
          setPoints(points + 2);
          Alert.alert("مبارك!", "تمت إضافة نقطتين إلى رصيدك.");
        }
      }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerBox}>
        <Ionicons name="trophy" size={36} color="#eab308" />
        <Text style={styles.title}>المكافآت والنقاط</Text>
        <Text style={styles.subtitle}>رصيد نقاطك: {points} نقطة</Text>
      </View>

      <TouchableOpacity style={styles.adCard} onPress={watchAdForPoints}>
        <Ionicons name="play-circle" size={28} color="#34d399" />
        <View style={styles.adInfo}>
          <Text style={styles.adTitle}>شاهد إعلان (+2 نقطة)</Text>
          <Text style={styles.adSub}>شاهد فيديو قصير واكسب نقاطاً إضافية</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>فتح الميزات المتقدمة</Text>

      <View style={styles.featureCard}>
        <View style={styles.featureInfo}>
          <Ionicons name="camera" size={24} color="#38bdf8" />
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureName}>التحقق بالكاميرا الذكية</Text>
            <Text style={styles.featureCost}>التكلفة: 50 نقطة</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.unlockBtn} onPress={() => unlockFeature(50, "التحقق بالكاميرا الذكية")}>
          <Text style={styles.unlockBtnText}>افتراضي / افتح</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.featureCard}>
        <View style={styles.featureInfo}>
          <Ionicons name="notifications-outline" size={24} color="#f59e0b" />
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureName}>وضع المنبه الصارم</Text>
            <Text style={styles.featureCost}>التكلفة: 80 نقطة</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.unlockBtn} onPress={() => unlockFeature(80, "وضع المنبه الصارم")}>
          <Text style={styles.unlockBtnText}>افتح الآن</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  headerBox: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#ffffff', marginTop: 8 },
  subtitle: { fontSize: 14, color: '#34d399', fontWeight: 'bold', marginTop: 4 },
  adCard: { backgroundColor: '#064e3b', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#059669' },
  adInfo: { marginLeft: 12, flex: 1 },
  adTitle: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
  adSub: { color: '#34d399', fontSize: 12, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#ffffff', marginBottom: 12 },
  featureCard: { backgroundColor: '#0f172a', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, borderWidth: 1, borderColor: '#1e293b' },
  featureInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  featureTextContainer: { marginLeft: 12 },
  featureName: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  featureCost: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  unlockBtn: { backgroundColor: '#1e293b', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  unlockBtnText: { color: '#34d399', fontSize: 12, fontWeight: 'bold' }
});
