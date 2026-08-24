import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/lib/AppContext';
import { PRAYER_KEYS, CAMERA_MANDATORY, ADHAN_RECITERS } from '@/lib/constants';
import type { PrayerKey } from '@/lib/types';
import { showRewardedAd } from '@/lib/ads';
import { Camera, Bell, Lock, ChevronDown, PlayCircle } from 'lucide-react-native';

export default function AlarmsScreen() {
  const { palette, t, alarms, updateAlarm, profile } = useApp();
  const [adModal, setAdModal] = useState<null | { key: PrayerKey; action: 'toggle' | 'mode'; value?: boolean | 'camera' | 'notification' }>(null);
  const [adLoading, setAdLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // When user tries to enable or set camera mode on a strict prayer (Fajr/Isha), gate behind ad
  const handleToggle = (key: PrayerKey, value: boolean) => {
    const isStrict = CAMERA_MANDATORY.includes(key);
    if (isStrict && value && !alarms[key].enabled) {
      // Enabling a strict alarm requires watching an ad
      setAdModal({ key, action: 'toggle', value });
    } else {
      updateAlarm(key, { enabled: value });
    }
  };

  const handleModeChange = (key: PrayerKey, mode: 'camera' | 'notification') => {
    const isStrict = CAMERA_MANDATORY.includes(key);
    if (isStrict && mode === 'camera' && alarms[key].mode !== 'camera') {
      // Switching to camera mode on a strict prayer requires watching an ad
      setAdModal({ key, action: 'mode', value: mode });
    } else {
      updateAlarm(key, { mode });
    }
  };

  const handleWatchAdAndSave = async () => {
    if (!adModal) return;
    setAdLoading(true);
    await showRewardedAd({
      onReward: () => {
        if (adModal.action === 'toggle') {
          updateAlarm(adModal.key, { enabled: adModal.value as boolean });
        } else if (adModal.action === 'mode') {
          updateAlarm(adModal.key, { mode: adModal.value as 'camera' | 'notification' });
        }
        showToast(t('adRewarded'));
      },
      onDismiss: () => {
        setAdLoading(false);
        setAdModal(null);
      },
      onError: () => {
        setAdLoading(false);
        showToast(t('adNotReady'));
      },
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: palette.bg }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: palette.text }]}>{t('alarmSettings')}</Text>
      <Text style={[styles.subtitle, { color: palette.textMuted }]}>
        {t('cameraModeDesc')}
      </Text>

      {toast && (
        <View style={styles.toastWrap}>
          <View style={[styles.toast, { backgroundColor: palette.primary }]}>
            <Text style={styles.toastText}>{toast}</Text>
          </View>
        </View>
      )}

      <View style={styles.list}>
        {PRAYER_KEYS.map((key) => {
          const alarm = alarms[key];
          const isCamera = CAMERA_MANDATORY.includes(key);
          return (
            <AlarmRow
              key={key}
              prayerKey={key}
              enabled={alarm.enabled}
              mode={alarm.mode}
              soundId={alarm.soundId}
              isMandatory={isCamera}
              premiumUnlocked={profile.premiumUnlocked}
              unlockedReciters={profile.unlockedReciters}
              onToggle={(v) => handleToggle(key, v)}
              onModeChange={(m) => handleModeChange(key, m)}
              onSoundChange={(s) => updateAlarm(key, { soundId: s })}
            />
          );
        })}
      </View>

      {/* Rewarded Ad Modal for strict alarm activation */}
      <Modal visible={!!adModal} transparent animationType="fade" onRequestClose={() => !adLoading && setAdModal(null)}>
        <View style={styles.adOverlay}>
          <View style={[styles.adSheet, { backgroundColor: palette.surface }]}>
            <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={styles.adIconWrap}>
              {adLoading ? <ActivityIndicator color="#fff" size="large" /> : <PlayCircle color="#fff" size={36} strokeWidth={2} />}
            </LinearGradient>
            <Text style={[styles.adTitle, { color: palette.text }]}>{adLoading ? t('adLoading') : t('adRequiredAlarm')}</Text>
            <Text style={[styles.adDesc, { color: palette.textMuted }]}>{adLoading ? t('adLoading') : t('adRequiredAlarmDesc')}</Text>
            {adLoading ? (
              <View style={[styles.adBtn, { backgroundColor: palette.surfaceAlt }]}>
                <Text style={[styles.adBtnText, { color: palette.textMuted }]}>{t('adLoading')}</Text>
              </View>
            ) : (
              <TouchableOpacity onPress={handleWatchAdAndSave} activeOpacity={0.85}>
                <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={styles.adBtn}>
                  <Text style={styles.adBtnTextLight}>{t('watchAdToActivate')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            {!adLoading && (
              <TouchableOpacity onPress={() => setAdModal(null)} style={styles.adCancelBtn}>
                <Text style={[styles.adCancelText, { color: palette.textMuted }]}>{t('cancel')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

interface RowProps {
  prayerKey: PrayerKey;
  enabled: boolean;
  mode: 'camera' | 'notification';
  soundId: string;
  isMandatory: boolean;
  premiumUnlocked: boolean;
  unlockedReciters: string[];
  onToggle: (v: boolean) => void;
  onModeChange: (m: 'camera' | 'notification') => void;
  onSoundChange: (s: string) => void;
}

function AlarmRow(props: RowProps) {
  const { palette, t } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const { prayerKey, enabled, mode, soundId, isMandatory, premiumUnlocked, unlockedReciters } = props;

  const reciter = ADHAN_RECITERS.find((r) => r.id === soundId);

  return (
    <View style={[styles.row, { backgroundColor: palette.card, borderColor: palette.border }]}>
      <View style={styles.rowTop}>
        <View style={styles.rowLeft}>
          <View style={[styles.iconWrap, { backgroundColor: palette.surfaceAlt }]}>
            {mode === 'camera' ? <Camera color={palette.primary} size={20} strokeWidth={2} /> : <Bell color={palette.accent} size={20} strokeWidth={2} />}
          </View>
          <View>
            <Text style={[styles.prayerName, { color: palette.text }]}>{t(prayerKey)}</Text>
            <Text style={[styles.modeText, { color: palette.textMuted }]}>
              {mode === 'camera' ? t('cameraMode') : t('notificationMode')}
            </Text>
          </View>
        </View>
        <View style={styles.rowRight}>
          {isMandatory && (
            <View style={[styles.tag, { backgroundColor: palette.primary + '22' }]}>
              <Text style={[styles.tagText, { color: palette.primary }]}>{t('mandatory')}</Text>
            </View>
          )}
          <Switch
            value={enabled}
            onValueChange={props.onToggle}
            trackColor={{ false: palette.border, true: palette.primary }}
            thumbColor={enabled ? '#fff' : palette.textMuted}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.expandBtn} onPress={() => setExpanded((e) => !e)}>
        <Text style={[styles.expandText, { color: palette.textMuted }]}>{expanded ? t('close') : t('alarmSettings')}</Text>
        <ChevronDown color={palette.textMuted} size={16} strokeWidth={2} style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }} />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expanded}>
          <View style={[styles.modeRow, { borderColor: palette.border }]}>
            <ModeOption
              label={t('cameraMode')}
              desc={t('cameraModeDesc')}
              active={mode === 'camera'}
              onPress={() => props.onModeChange('camera')}
              palette={palette}
              icon={<Camera color={mode === 'camera' ? '#fff' : palette.text} size={18} strokeWidth={2} />}
            />
            <View style={[styles.divider, { backgroundColor: palette.border }]} />
            <ModeOption
              label={t('notificationMode')}
              desc={t('notificationModeDesc')}
              active={mode === 'notification'}
              onPress={() => props.onModeChange('notification')}
              palette={palette}
              icon={<Bell color={mode === 'notification' ? '#fff' : palette.text} size={18} strokeWidth={2} />}
            />
          </View>

          <TouchableOpacity style={[styles.reciterBtn, { backgroundColor: palette.surfaceAlt }]} onPress={() => setPickerOpen(true)}>
            <Text style={[styles.reciterLabel, { color: palette.textMuted }]}>{t('reciter')}</Text>
            <View style={styles.reciterRight}>
              <Text style={[styles.reciterName, { color: palette.text }]}>{reciter?.name ?? soundId}</Text>
              <ChevronDown color={palette.textMuted} size={16} strokeWidth={2} />
            </View>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={pickerOpen} transparent animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <View style={styles.pickerOverlay}>
          <View style={[styles.pickerSheet, { backgroundColor: palette.surface }]}>
            <Text style={[styles.pickerTitle, { color: palette.text }]}>{t('reciter')}</Text>
            {ADHAN_RECITERS.map((r) => {
              const locked = r.premium && !premiumUnlocked && !unlockedReciters.includes(r.id);
              return (
                <TouchableOpacity
                  key={r.id}
                  style={[styles.pickerItem, { borderColor: r.id === soundId ? palette.primary : palette.border }, r.id === soundId && { backgroundColor: palette.primary + '11' }]}
                  onPress={() => {
                    if (!locked) {
                      props.onSoundChange(r.id);
                      setPickerOpen(false);
                    }
                  }}
                >
                  <Text style={[styles.pickerItemText, { color: locked ? palette.textMuted : palette.text }]}>{r.name}</Text>
                  {locked && <Lock color={palette.textMuted} size={16} strokeWidth={2} />}
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity onPress={() => setPickerOpen(false)} style={styles.pickerClose}>
              <Text style={[styles.pickerCloseText, { color: palette.primary }]}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function ModeOption({ label, desc, active, onPress, palette, icon }: { label: string; desc: string; active: boolean; onPress: () => void; palette: ReturnType<typeof useApp>['palette']; icon: React.ReactNode }) {
  return (
    <TouchableOpacity style={styles.modeOption} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.modeIcon, { backgroundColor: active ? palette.primary : palette.surfaceAlt }]}>{icon}</View>
      <View style={styles.modeInfo}>
        <Text style={[styles.modeLabel, { color: palette.text }]}>{label}</Text>
        <Text style={[styles.modeDesc, { color: palette.textMuted }]}>{desc}</Text>
      </View>
      <View style={[styles.radio, { borderColor: active ? palette.primary : palette.border }, active && { backgroundColor: palette.primary }]}>
        {active && <View style={styles.radioDot} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 6 },
  subtitle: { fontSize: 14, marginBottom: 20, lineHeight: 20 },
  toastWrap: { marginBottom: 8 },
  toast: { borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center', alignSelf: 'center' },
  toastText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  list: { gap: 12 },
  row: { borderRadius: 16, borderWidth: 1, padding: 16 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  prayerName: { fontSize: 18, fontWeight: '600' },
  modeText: { fontSize: 12, marginTop: 2 },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  expandBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, paddingVertical: 8 },
  expandText: { fontSize: 13, fontWeight: '500' },
  expanded: { marginTop: 8, gap: 12 },
  modeRow: { borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
  modeOption: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  modeIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  modeInfo: { flex: 1 },
  modeLabel: { fontSize: 15, fontWeight: '600' },
  modeDesc: { fontSize: 12, marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  divider: { height: 1, width: '100%' },
  reciterBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 12, padding: 14 },
  reciterLabel: { fontSize: 13 },
  reciterRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  reciterName: { fontSize: 14, fontWeight: '600' },
  pickerOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  pickerSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  pickerTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  pickerItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  pickerItemText: { fontSize: 15, fontWeight: '500' },
  pickerClose: { alignItems: 'center', padding: 14, marginTop: 8 },
  pickerCloseText: { fontSize: 16, fontWeight: '600' },
  adOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)', padding: 24 },
  adSheet: { width: '100%', maxWidth: 360, borderRadius: 24, padding: 28, alignItems: 'center' },
  adIconWrap: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  adTitle: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  adDesc: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  adBtn: { width: '100%', paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  adBtnText: { fontSize: 16, fontWeight: '600' },
  adBtnTextLight: { fontSize: 16, fontWeight: '700', color: '#fff' },
  adCancelBtn: { marginTop: 16, padding: 8 },
  adCancelText: { fontSize: 14 },
});
