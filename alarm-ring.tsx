import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, router } from 'expo-router';
import { useApp } from '@/lib/AppContext';
import { CAMERA_MANDATORY } from '@/lib/constants';
import { Camera, Check, X, Ticket, AlertCircle, Droplets } from 'lucide-react-native';

export default function AlarmRingScreen() {
  const { palette, t, alarms, profile, useSkipPass, recordPrayer, addPoints } = useApp();
  const params = useLocalSearchParams<{ key?: string }>();
  const prayerKey = (params.key ?? 'fajr') as 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  const isCameraMode = CAMERA_MANDATORY.includes(prayerKey) && alarms[prayerKey]?.mode === 'camera';

  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const captureAndVerify = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        skipProcessing: true,
      });
      if (photo?.uri) {
        setCapturedPhoto(photo.uri);
        setVerified(true);
        addPoints(5);
        setTimeout(() => {
          recordPrayer(prayerKey, true);
          router.back();
        }, 1800);
      } else {
        setCapturing(false);
      }
    } catch {
      setCapturing(false);
    }
  };

  const handleSkipPass = () => {
    if (useSkipPass()) {
      recordPrayer(prayerKey, false);
      router.back();
    }
  };

  const handleDismiss = () => {
    recordPrayer(prayerKey, false);
    router.back();
  };

  // Notification mode: simple dismiss
  if (!isCameraMode) {
    return (
      <View style={[styles.container, { backgroundColor: palette.bg }]}>
        <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={styles.ringHero}>
          <View style={styles.ringIconWrap}>
            <Droplets color="#fff" size={36} strokeWidth={2} />
          </View>
          <Text style={styles.ringTitle}>{t('wakeUpFor')}</Text>
          <Text style={styles.ringPrayer}>{t(prayerKey)}</Text>
        </LinearGradient>
        <View style={styles.body}>
          <Text style={[styles.gentleText, { color: palette.textMuted }]}>{t('tapToDismiss')}</Text>
          <TouchableOpacity onPress={handleDismiss} activeOpacity={0.85}>
            <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={styles.actionBtn}>
              <Check color="#fff" size={24} strokeWidth={2.5} />
              <Text style={styles.actionBtnText}>{t('stopAlarm')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Camera mode - strict photo capture required
  const camGranted = permission?.granted;

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={styles.ringHero}>
        <View style={styles.ringIconWrap}>
          <Camera color="#fff" size={36} strokeWidth={2} />
        </View>
        <Text style={styles.ringTitle}>{t('alarmRinging')}</Text>
        <Text style={styles.ringPrayer}>{t('wakeUpFor')} {t(prayerKey)}</Text>
      </LinearGradient>

      <View style={styles.body}>
        {/* Permission request */}
        {!camGranted && Platform.OS !== 'web' && (
          <View style={[styles.permissionBox, { backgroundColor: palette.card, borderColor: palette.border }]}>
            <AlertCircle color={palette.warning} size={28} strokeWidth={2} />
            <Text style={[styles.permissionText, { color: palette.text }]}>
              {t('pointCameraAtTap')}
            </Text>
            <TouchableOpacity onPress={requestPermission} style={[styles.permissionBtn, { backgroundColor: palette.primary }]}>
              <Text style={styles.permissionBtnText}>Grant Camera</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Live camera preview */}
        {camGranted && Platform.OS !== 'web' && !verified && (
          <View style={styles.cameraWrap}>
            <CameraView ref={cameraRef} style={styles.camera} facing="back" />
            <View style={styles.scanOverlay}>
              <View style={styles.scanFrame}>
                <Droplets color="rgba(255,255,255,0.8)" size={32} strokeWidth={2} />
                <Text style={styles.scanFrameText}>{t('pointCameraAtTap')}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Web fallback */}
        {Platform.OS === 'web' && !verified && (
          <View style={[styles.webCamPlaceholder, { backgroundColor: palette.surface, borderColor: palette.border }]}>
            <Camera color={palette.textMuted} size={48} strokeWidth={1.5} />
            <Text style={[styles.webCamText, { color: palette.textMuted }]}>Camera preview available on mobile devices</Text>
          </View>
        )}

        {/* Verified state with photo preview */}
        {verified && (
          <View style={styles.verifiedBox}>
            {capturedPhoto && (
              <Image source={{ uri: capturedPhoto }} style={styles.capturedImage} />
            )}
            <View style={styles.verifiedIcon}>
              <Check color="#fff" size={48} strokeWidth={3} />
            </View>
            <Text style={styles.verifiedText}>{t('photoVerified')}</Text>
          </View>
        )}

        {/* Action buttons */}
        {!verified && (
          <View style={styles.actions}>
            {/* Capture button */}
            <TouchableOpacity
              onPress={captureAndVerify}
              disabled={capturing || (!camGranted && Platform.OS !== 'web')}
              activeOpacity={0.85}
              style={styles.actionTouch}
            >
              <LinearGradient
                colors={[palette.gradientFrom, palette.gradientTo]}
                style={[styles.actionBtn, (capturing || (!camGranted && Platform.OS !== 'web')) && styles.btnDisabled]}
              >
                <Camera color="#fff" size={22} strokeWidth={2} />
                <Text style={styles.actionBtnText}>
                  {capturing ? t('scanning') : t('capturePhoto')}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Skip pass */}
            <TouchableOpacity
              onPress={handleSkipPass}
              disabled={profile.skipPasses <= 0}
              activeOpacity={0.85}
              style={[styles.skipBtn, { borderColor: palette.accent }, profile.skipPasses <= 0 && styles.btnDisabled]}
            >
              <Ticket color={profile.skipPasses > 0 ? palette.accent : palette.textMuted} size={20} strokeWidth={2} />
              <Text style={[styles.skipBtnText, { color: profile.skipPasses > 0 ? palette.accent : palette.textMuted }]}>
                {profile.skipPasses > 0 ? `${t('useSkipPass')} (${profile.skipPasses})` : t('noSkipPass')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  ringHero: { alignItems: 'center', paddingTop: 70, paddingBottom: 32, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  ringIconWrap: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  ringTitle: { fontSize: 18, color: 'rgba(255,255,255,0.85)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  ringPrayer: { fontSize: 28, color: '#fff', fontWeight: '700', marginTop: 4 },
  body: { flex: 1, padding: 20, gap: 20, alignItems: 'center' },
  gentleText: { fontSize: 15, marginTop: 40 },
  cameraWrap: { width: '100%', borderRadius: 20, overflow: 'hidden', position: 'relative' },
  camera: { width: '100%', height: 340, borderRadius: 20 },
  scanOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  scanFrame: { width: 220, height: 220, borderRadius: 24, borderWidth: 3, borderColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center', gap: 12 },
  scanFrameText: { fontSize: 12, color: 'rgba(255,255,255,0.85)', textAlign: 'center', paddingHorizontal: 16, lineHeight: 18 },
  webCamPlaceholder: { width: '100%', height: 240, borderRadius: 20, borderWidth: 2, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 12 },
  webCamText: { fontSize: 14, textAlign: 'center' },
  permissionBox: { alignItems: 'center', gap: 12, borderRadius: 16, borderWidth: 1, padding: 24 },
  permissionText: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  permissionBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  permissionBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  verifiedBox: { alignItems: 'center', gap: 16, marginTop: 20, width: '100%' },
  capturedImage: { width: '100%', height: 200, borderRadius: 16, marginBottom: 8 },
  verifiedIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#16A34A', alignItems: 'center', justifyContent: 'center' },
  verifiedText: { fontSize: 18, fontWeight: '700', color: '#16A34A', textAlign: 'center' },
  actions: { width: '100%', gap: 12, marginTop: 8 },
  actionTouch: { width: '100%' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 16 },
  actionBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  skipBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14, borderWidth: 2, borderStyle: 'dashed' },
  skipBtnText: { fontSize: 14, fontWeight: '600' },
  btnDisabled: { opacity: 0.5 },
});
