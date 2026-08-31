import React from 'react';
import { StyleSheet, Text, View, Switch, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Bell, Camera, Play } from 'lucide-react-native';

export default function AlarmsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>المنبهات</Text>
        
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Camera color="#34D399" size={22} style={{marginLeft: 10}} />
              <View>
                <Text style={styles.title}>الفجر</Text>
                <Text style={styles.sub}>كاميرا ذكية (صارم)</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.badge}>إلزامي</Text>
              <Switch value={true} onValueChange={() => {}} />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Bell color="#FACC15" size={22} style={{marginLeft: 10}} />
              <View>
                <Text style={styles.title}>الظهر</Text>
                <Text style={styles.sub}>إشعار لطيف</Text>
              </View>
            </View>
            <Switch value={true} onValueChange={() => {}} />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Bell color="#FACC15" size={22} style={{marginLeft: 10}} />
              <View>
                <Text style={styles.title}>العصر</Text>
                <Text style={styles.sub}>إشعار لطيف</Text>
              </View>
            </View>
            <Switch value={true} onValueChange={() => {}} />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Bell color="#FACC15" size={22} style={{marginLeft: 10}} />
              <View>
                <Text style={styles.title}>المغرب</Text>
                <Text style={styles.sub}>إشعار لطيف</Text>
              </View>
            </View>
            <Switch value={true} onValueChange={() => {}} />
          </View>
        </View>

        <TouchableOpacity style={styles.mainBtn}>
          <Play color="#0D1B2A" size={20} />
          <Text style={styles.mainBtnText}>محاكاة المنبه</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1B2A' },
  scrollContent: { padding: 20 },
  screenTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 20 },
  card: { backgroundColor: '#1B263B', padding: 15, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: '#30363D' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  sub: { color: '#94A3B8', fontSize: 12 },
  badge: { backgroundColor: '#064E3B', color: '#34D399', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, fontSize: 11, marginLeft: 10 },
  mainBtn: { backgroundColor: '#34D399', padding: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  mainBtnText: { color: '#0D1B2A', fontSize: 16, fontWeight: 'bold', marginRight: 8 }
});
                  
