import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/lib/AppContext';
import { showRewardedAd, isRewardedAdReady, loadRewardedAd } from '@/lib/ads';
import { useState } from 'react';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  rewardLabel: string;
  onReward: () => void;
  onClose: () => void;
}

export default function RewardedAdModal({ visible, title, message, rewardLabel, onReward, onClose }: Props) {
  const { palette, t } = useApp();
  const [loading, setLoading] = useState(false);
  const [adNotReady, setAdNotReady] = useState(false);

  const handleWatch = async () => {
    if (!isRewardedAdReady()) {
      setAdNotReady(true);
      setLoading(true);
      try {
        await loadRewardedAd();
        setAdNotReady(false);
      } catch {
        setLoading(false);
        setAdNotReady(false);
        return;
      }
    }

    setLoading(true);
    await showRewardedAd({
      onReward: () => onReward(),
      onDismiss: () => {
        setLoading(false);
        onClose();
      },
      onError: () => {
        setLoading(false);
      },
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: palette.surface }]}>
          <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={styles.iconWrap}>
            {loading ? <ActivityIndicator color="#fff" size="large" /> : <Text style={styles.icon}>▶</Text>}
          </LinearGradient>
          <Text style={[styles.title, { color: palette.text }]}>
            {loading ? (adNotReady ? t('adLoading') : t('adLoading')) : title}
          </Text>
          <Text style={[styles.message, { color: palette.textMuted }]}>{loading ? t('adLoading') : message}</Text>
          {loading ? (
            <View style={[styles.button, { backgroundColor: palette.surfaceAlt }]}>
              <Text style={[styles.buttonText, { color: palette.textMuted }]}>{t('adLoading')}</Text>
            </View>
          ) : (
            <TouchableOpacity onPress={handleWatch} style={styles.button} activeOpacity={0.85}>
              <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={styles.gradientBtn}>
                <Text style={styles.buttonTextLight}>{rewardLabel}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          {!loading && (
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={[styles.cancelText, { color: palette.textMuted }]}>{t('cancel')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: 24 },
  sheet: { width: '100%', maxWidth: 360, borderRadius: 24, padding: 28, alignItems: 'center' },
  iconWrap: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  icon: { fontSize: 30, color: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  message: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  button: { width: '100%', borderRadius: 14, overflow: 'hidden' },
  gradientBtn: { paddingVertical: 16, alignItems: 'center' },
  buttonText: { fontSize: 16, fontWeight: '600' },
  buttonTextLight: { fontSize: 16, fontWeight: '700', color: '#fff' },
  cancelBtn: { marginTop: 16, padding: 8 },
  cancelText: { fontSize: 14 },
});
