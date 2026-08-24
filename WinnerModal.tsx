import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Share, Linking, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/lib/AppContext';
import { Trophy, Copy, Check, MessageCircle, X, Crown, Award, Gift } from 'lucide-react-native';

interface WinnerInfo {
  id: string;
  rank: number;
  verification_code: string;
  prize_amount: number;
  status: string;
}

interface Props {
  visible: boolean;
  winners: WinnerInfo[];
  onClose: () => void;
}

export default function WinnerModal({ visible, winners, onClose }: Props) {
  const { palette, t } = useApp();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set());

  const handleCopy = async (code: string) => {
    if (Platform.OS === 'web') {
      navigator.clipboard?.writeText(code);
    } else {
      await Share.share({ message: code });
    }
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleWhatsApp = (code: string, rank: number) => {
    const message = `${t('whatsappMessage')} ${code} (${t('winnerRank')} #${rank})`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
    setClaimedIds((prev) => new Set(prev).add(code));
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: palette.surface }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X color={palette.textMuted} size={22} strokeWidth={2} />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={styles.trophyWrap}>
              <Trophy color="#fff" size={48} strokeWidth={2} />
            </LinearGradient>
            <Text style={[styles.celebrateTitle, { color: palette.text }]}>{t('congratulations')}</Text>
            <Text style={[styles.celebrateSubtitle, { color: palette.primary }]}>{t('youAreWinner')}</Text>
            <Text style={[styles.celebrateDesc, { color: palette.textMuted }]}>{t('top3Winners')}</Text>

            {winners.map((winner) => (
              <View key={winner.id} style={[styles.winnerCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
                <View style={styles.winnerHeader}>
                  <View style={[styles.rankBadge, { backgroundColor: winner.rank === 1 ? '#D4AF37' : winner.rank === 2 ? '#C0C0C0' : '#CD7F32' }]}>
                    <Text style={styles.rankText}>#{winner.rank}</Text>
                  </View>
                  <Gift color={palette.accent} size={28} strokeWidth={2} />
                </View>

                <Text style={[styles.codeLabel, { color: palette.textMuted }]}>{t('yourVerificationCode')}</Text>
                <View style={[styles.codeBox, { backgroundColor: palette.surfaceAlt, borderColor: palette.border }]}>
                  <Text style={[styles.codeText, { color: palette.text }]}>{winner.verification_code}</Text>
                </View>
                <Text style={[styles.codeDesc, { color: palette.textMuted }]}>{t('verificationCodeDesc')}</Text>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    onPress={() => handleCopy(winner.verification_code)}
                    style={[styles.copyBtn, { borderColor: palette.primary, backgroundColor: palette.surface }]}
                  >
                    {copiedCode === winner.verification_code ? (
                      <Check color={palette.success} size={18} strokeWidth={2.5} />
                    ) : (
                      <Copy color={palette.primary} size={18} strokeWidth={2} />
                    )}
                    <Text style={[styles.copyBtnText, { color: palette.primary }]}>
                      {copiedCode === winner.verification_code ? t('codeCopied') : t('copyCode')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleWhatsApp(winner.verification_code, winner.rank)}
                    activeOpacity={0.85}
                    style={styles.whatsappBtnWrap}
                  >
                    <LinearGradient colors={['#25D366', '#128C7E']} style={styles.whatsappBtn}>
                      <MessageCircle color="#fff" size={18} strokeWidth={2} />
                      <Text style={styles.whatsappBtnText}>{t('claimViaWhatsapp')}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {claimedIds.has(winner.verification_code) && (
                  <View style={[styles.claimedTag, { backgroundColor: palette.success + '18' }]}>
                    <Check color={palette.success} size={16} strokeWidth={2.5} />
                    <Text style={[styles.claimedText, { color: palette.success }]}>{t('verificationSubmitted')}</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity onPress={onClose} activeOpacity={0.85} style={styles.fullWidth}>
            <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={styles.closeBtn2}>
              <Text style={styles.closeBtnText}>{t('close')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)', padding: 16 },
  sheet: { width: '100%', maxWidth: 400, borderRadius: 28, padding: 24, maxHeight: '90%' },
  closeBtn: { position: 'absolute', top: 12, right: 12, padding: 8, zIndex: 10 },
  scrollContent: { alignItems: 'center', paddingBottom: 16, paddingTop: 8 },
  trophyWrap: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  celebrateTitle: { fontSize: 28, fontWeight: '700', textAlign: 'center' },
  celebrateSubtitle: { fontSize: 20, fontWeight: '700', marginTop: 8, textAlign: 'center' },
  celebrateDesc: { fontSize: 14, textAlign: 'center', marginTop: 8, marginBottom: 20 },
  winnerCard: { width: '100%', borderRadius: 20, borderWidth: 1, padding: 20, marginBottom: 16 },
  winnerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  rankBadge: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  rankText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  codeLabel: { fontSize: 13, fontWeight: '600', alignSelf: 'flex-start', marginBottom: 8 },
  codeBox: { width: '100%', borderRadius: 14, borderWidth: 2, borderStyle: 'dashed', padding: 16, alignItems: 'center' },
  codeText: { fontSize: 22, fontWeight: '700', letterSpacing: 2, fontVariant: ['tabular-nums'] },
  codeDesc: { fontSize: 12, textAlign: 'center', marginTop: 8, marginBottom: 16 },
  actionRow: { flexDirection: 'row', gap: 10, width: '100%' },
  copyBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14, borderWidth: 2 },
  copyBtnText: { fontSize: 14, fontWeight: '600' },
  whatsappBtnWrap: { flex: 1 },
  whatsappBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14 },
  whatsappBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  claimedTag: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginTop: 12, alignSelf: 'center' },
  claimedText: { fontSize: 13, fontWeight: '600' },
  fullWidth: { width: '100%', marginTop: 12 },
  closeBtn2: { paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  closeBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
