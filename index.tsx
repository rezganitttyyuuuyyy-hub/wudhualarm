import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/lib/AppContext';
import { getPrayerTimesForToday, getNextPrayer, fetchPrayerTimesFromAPI } from '@/lib/prayerTimes';
import { COUNTRIES } from '@/lib/locations';
import { detectUserLocation } from '@/lib/geolocation';
import CountdownTimer from '@/components/CountdownTimer';
import PrayerCard from '@/components/PrayerCard';
import StatsBar from '@/components/StatsBar';

import { Moon, Bell, MapPin, ChevronDown, Check, Search, BellRing, Navigation, AlertTriangle } from 'lucide-react-native';
import { requestNotificationPermission, scheduleAllPrayerAlarms, getNotificationPermissionStatus } from '@/lib/notifications';
import { router } from 'expo-router';
import type { PrayerTime } from '@/lib/types';

export default function HomeScreen() {
  const { palette, t, location, setLocation, alarms } = useApp();
  const [times, setTimes] = useState<PrayerTime[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [citySearch, setCitySearch] = useState('');
  const [notifGranted, setNotifGranted] = useState(false);
  const [alarmsScheduled, setAlarmsScheduled] = useState(0);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState(false);

  useEffect(() => {
    loadTimes();
  }, [location]);

  useEffect(() => {
    getNotificationPermissionStatus().then(setNotifGranted);
  }, []);

  // Auto-detect GPS on first load if no location is saved
  useEffect(() => {
    if (!location) {
      handleGPSDetect();
    }
  }, []);

  const loadTimes = useCallback(async () => {
    let prayerTimes: PrayerTime[];
    if (location) {
      setRefreshing(true);
      const apiTimes = await fetchPrayerTimesFromAPI(location.lat, location.lng);
      prayerTimes = getPrayerTimesForToday(apiTimes ?? undefined);
      setRefreshing(false);
    } else {
      prayerTimes = getPrayerTimesForToday();
    }
    setTimes(prayerTimes);

    if (notifGranted) {
      const enabledKeys = Object.keys(alarms).filter((k) => alarms[k]?.enabled);
      const count = await scheduleAllPrayerAlarms(prayerTimes, enabledKeys, t);
      setAlarmsScheduled(count);
    }
  }, [location, alarms, notifGranted, t]);

  const refresh = useCallback(() => {
    loadTimes();
  }, [loadTimes]);

  const handleGPSDetect = async () => {
    setGpsLoading(true);
    setGpsError(false);
    try {
      const detected = await detectUserLocation();
      if (detected) {
        setLocation(detected);
        setGpsError(false);
      } else {
        setGpsError(true);
      }
    } catch {
      setGpsError(true);
    }
    setGpsLoading(false);
  };

  const next = getNextPrayer(times);

  const filteredCountries = COUNTRIES.filter((c) =>
    c.country.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleSelectCountry = (country: string) => {
    setSelectedCountry(country);
    setCitySearch('');
  };

  const handleSelectCity = (countryName: string, cityName: string, lat: number, lng: number) => {
    setLocation({ country: countryName, city: cityName, lat, lng });
    setPickerOpen(false);
    setSelectedCountry(null);
    setCountrySearch('');
    setCitySearch('');
  };

  const currentCountryData = selectedCountry ? COUNTRIES.find((c) => c.country === selectedCountry) : null;
  const filteredCities = currentCountryData
    ? currentCountryData.cities.filter((c) => c.name.toLowerCase().includes(citySearch.toLowerCase()))
    : [];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: palette.bg }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[palette.primary]} tintColor={palette.primary} />}
    >
      <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.appName}>{t('appName')}</Text>
            <Text style={styles.tagline}>{t('tagline')}</Text>
          </View>
          <Moon color="#fff" size={28} strokeWidth={2} />
        </View>
        {next && (
          <View style={styles.countdownWrap}>
            <Text style={styles.nextLabel}>{t('nextPrayer')}</Text>
            <Text style={styles.nextName}>{t(next.key)}</Text>
            <CountdownTimer target={next.timestamp} size="lg" />
          </View>
        )}
      </LinearGradient>

      <View style={styles.body}>
        <StatsBar />

        {/* Location Section */}
        <View style={styles.locationSection}>
          {/* GPS Button */}
          <TouchableOpacity
            onPress={handleGPSDetect}
            disabled={gpsLoading}
            style={[styles.gpsBtn, { backgroundColor: palette.primary + '12', borderColor: palette.primary }]}
            activeOpacity={0.7}
          >
            {gpsLoading ? (
              <ActivityIndicator size="small" color={palette.primary} />
            ) : (
              <Navigation color={palette.primary} size={18} strokeWidth={2} />
            )}
            <Text style={[styles.gpsBtnText, { color: palette.primary }]}>
              {gpsLoading ? t('detectingLocation') : t('useGPS')}
            </Text>
          </TouchableOpacity>

          {gpsError && (
            <View style={[styles.gpsErrorBanner, { backgroundColor: palette.warning + '12' }]}>
              <AlertTriangle color={palette.warning} size={16} strokeWidth={2} />
              <Text style={[styles.gpsErrorText, { color: palette.warning }]}>{t('gpsError')}</Text>
            </View>
          )}

          {/* Current location display + manual picker */}
          <TouchableOpacity
            onPress={() => setPickerOpen(true)}
            style={[styles.locBtn, { backgroundColor: palette.surface, borderColor: palette.border }]}
            activeOpacity={0.7}
          >
            <MapPin color={palette.primary} size={20} strokeWidth={2} />
            <View style={styles.locTextWrap}>
              <Text style={[styles.locLabel, { color: palette.textMuted }]}>{t('location')}</Text>
              <Text style={[styles.locValue, { color: palette.text }]}>
                {location ? `${location.city}, ${location.country}` : t('selectLocation')}
              </Text>
            </View>
            <ChevronDown color={palette.textMuted} size={20} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>{t('todayPrayers')}</Text>
          <Text style={[styles.hint, { color: palette.textMuted }]}>
            {location ? `${location.city}` : t('locationHint')}
          </Text>
        </View>

        <View style={styles.prayerList}>
          {times.map((p) => (
            <PrayerCard key={p.key} prayer={p} isNext={next?.key === p.key} />
          ))}
        </View>

        {!notifGranted && (
          <TouchableOpacity
            style={[styles.notifBtn, { backgroundColor: palette.warning + '15', borderColor: palette.warning }]}
            onPress={async () => {
              const granted = await requestNotificationPermission();
              setNotifGranted(granted);
              if (granted && times.length > 0) {
                const enabledKeys = Object.keys(alarms).filter((k) => alarms[k]?.enabled);
                const count = await scheduleAllPrayerAlarms(times, enabledKeys, t);
                setAlarmsScheduled(count);
              }
            }}
            activeOpacity={0.85}
          >
            <BellRing color={palette.warning} size={20} strokeWidth={2} />
            <Text style={[styles.notifBtnText, { color: palette.warning }]}>{t('notificationPermission')}</Text>
          </TouchableOpacity>
        )}

        {notifGranted && alarmsScheduled > 0 && (
          <View style={[styles.scheduledBanner, { backgroundColor: palette.primary + '12' }]}>
            <Bell color={palette.primary} size={16} strokeWidth={2} />
            <Text style={[styles.scheduledText, { color: palette.primary }]}>
              {alarmsScheduled} {t('alarmScheduled')}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.simBtn, { backgroundColor: palette.surface, borderColor: palette.primary }]}
          onPress={() => router.push('/alarm-ring?key=fajr')}
          activeOpacity={0.85}
        >
          <Bell color={palette.primary} size={20} strokeWidth={2} />
          <Text style={[styles.simBtnText, { color: palette.primary }]}>{t('simulateAlarm')}</Text>
        </TouchableOpacity>

      </View>

      {/* Location Picker Modal (manual fallback) */}
      <Modal visible={pickerOpen} transparent animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <View style={styles.pickerOverlay}>
          <View style={[styles.pickerSheet, { backgroundColor: palette.surface }]}>
            <View style={styles.pickerHeader}>
              <Text style={[styles.pickerTitle, { color: palette.text }]}>{t('selectLocation')}</Text>
              <TouchableOpacity onPress={() => setPickerOpen(false)}>
                <Text style={[styles.pickerClose, { color: palette.primary }]}>{t('close')}</Text>
              </TouchableOpacity>
            </View>

            {/* GPS option inside modal too */}
            <TouchableOpacity
              onPress={async () => {
                await handleGPSDetect();
                if (!gpsError) setPickerOpen(false);
              }}
              disabled={gpsLoading}
              style={[styles.modalGpsBtn, { backgroundColor: palette.primary + '10', borderColor: palette.primary }]}
              activeOpacity={0.7}
            >
              {gpsLoading ? (
                <ActivityIndicator size="small" color={palette.primary} />
              ) : (
                <Navigation color={palette.primary} size={18} strokeWidth={2} />
              )}
              <Text style={[styles.modalGpsBtnText, { color: palette.primary }]}>{t('useGPS')}</Text>
            </TouchableOpacity>

            <Text style={[styles.orText, { color: palette.textMuted }]}>{t('orSelectManually')}</Text>

            {!selectedCountry ? (
              <>
                <View style={[styles.searchBox, { backgroundColor: palette.card, borderColor: palette.border }]}>
                  <Search color={palette.textMuted} size={18} strokeWidth={2} />
                  <TextInput
                    style={[styles.searchInput, { color: palette.text }]}
                    placeholder={t('searchCountry')}
                    placeholderTextColor={palette.textMuted}
                    value={countrySearch}
                    onChangeText={setCountrySearch}
                  />
                </View>
                <ScrollView style={styles.pickerList}>
                  {filteredCountries.map((c) => (
                    <TouchableOpacity
                      key={c.country}
                      style={[styles.pickerItem, { borderBottomColor: palette.border }]}
                      onPress={() => handleSelectCountry(c.country)}
                    >
                      <Text style={[styles.pickerItemText, { color: palette.text }]}>{c.country}</Text>
                      <ChevronDown color={palette.textMuted} size={18} strokeWidth={2} style={{ transform: [{ rotate: '-90deg' }] }} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.backBtn, { borderColor: palette.border }]}
                  onPress={() => setSelectedCountry(null)}
                >
                  <ChevronDown color={palette.primary} size={18} strokeWidth={2} style={{ transform: [{ rotate: '90deg' }] }} />
                  <Text style={[styles.backBtnText, { color: palette.primary }]}>{selectedCountry}</Text>
                </TouchableOpacity>
                <View style={[styles.searchBox, { backgroundColor: palette.card, borderColor: palette.border }]}>
                  <Search color={palette.textMuted} size={18} strokeWidth={2} />
                  <TextInput
                    style={[styles.searchInput, { color: palette.text }]}
                    placeholder={t('searchCity')}
                    placeholderTextColor={palette.textMuted}
                    value={citySearch}
                    onChangeText={setCitySearch}
                  />
                </View>
                <ScrollView style={styles.pickerList}>
                  {filteredCities.map((city) => (
                    <TouchableOpacity
                      key={city.name}
                      style={[styles.pickerItem, { borderBottomColor: palette.border }]}
                      onPress={() => handleSelectCity(selectedCountry, city.name, city.lat, city.lng)}
                    >
                      <View style={styles.cityItemLeft}>
                        <MapPin color={palette.primary} size={18} strokeWidth={2} />
                        <Text style={[styles.pickerItemText, { color: palette.text }]}>{city.name}</Text>
                      </View>
                      <Check color={location?.city === city.name ? palette.primary : 'transparent'} size={20} strokeWidth={2.5} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 32 },
  hero: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 28, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  appName: { fontSize: 26, fontWeight: '700', color: '#fff' },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  countdownWrap: { alignItems: 'center', gap: 8 },
  nextLabel: { fontSize: 13, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: 1.5 },
  nextName: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 4 },
  body: { padding: 20, gap: 20 },
  locationSection: { gap: 10 },
  gpsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14, borderWidth: 1.5 },
  gpsBtnText: { fontSize: 15, fontWeight: '600' },
  gpsErrorBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  gpsErrorText: { fontSize: 13, fontWeight: '500', flex: 1 },
  locBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, borderWidth: 1, padding: 14 },
  locTextWrap: { flex: 1 },
  locLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
  locValue: { fontSize: 15, fontWeight: '600', marginTop: 2 },
  sectionHeader: { marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  hint: { fontSize: 12, marginTop: 2 },
  prayerList: { gap: 10 },
  simBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14, borderWidth: 2, borderStyle: 'dashed' },
  simBtnText: { fontSize: 15, fontWeight: '600' },
  notifBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14, borderWidth: 1.5 },
  notifBtnText: { fontSize: 14, fontWeight: '600' },
  scheduledBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10, borderRadius: 12 },
  scheduledText: { fontSize: 13, fontWeight: '600' },
  pickerOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  pickerSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '85%' },
  pickerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  pickerTitle: { fontSize: 20, fontWeight: '700' },
  pickerClose: { fontSize: 16, fontWeight: '600' },
  modalGpsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14, borderWidth: 1.5, marginBottom: 8 },
  modalGpsBtnText: { fontSize: 15, fontWeight: '600' },
  orText: { fontSize: 13, textAlign: 'center', marginBottom: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 15 },
  pickerList: { maxHeight: 360 },
  pickerItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1 },
  pickerItemText: { fontSize: 16, fontWeight: '500' },
  cityItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, borderBottomWidth: 1, marginBottom: 12 },
  backBtnText: { fontSize: 16, fontWeight: '600' },
});
