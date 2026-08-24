import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Modal, ActivityIndicator, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { showRewardedAd } from '@/lib/ads';
import WinnerModal from '@/components/WinnerModal';

import { User, LogOut, Mail, Trophy, Crown, Flame, Coins, PlayCircle, RefreshCw, Instagram, Facebook, Info, Shield } from 'lucide-react-native';
import { router } from 'expo-router';

const INSTAGRAM_URL = 'https://www.instagram.com/wudhu_alarm?igsh=bDJ3NGtoNGNhOWVm';
const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61593441058066';
const TIKTOK_URL = 'https://www.tiktok.com/@wudhualarm1_a2';

interface LeaderboardEntry {
  id: string;
  display_name: string;
  streak: number;
  points: number;
  monthly_points: number;
  is_you?: boolean;
}

interface WinnerInfo {
  id: string;
  rank: number;
  verification_code: string;
  prize_amount: number;
  status: string;
}

export default function ProfileScreen() {
  const { palette, t, profile } = useApp();
  const { profile: authProfile, signOut } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [winnerModal, setWinnerModal] = useState(false);
  const [winners, setWinners] = useState<WinnerInfo[]>([]);
  const [adModal, setAdModal] = useState(false);
  const [adLoading, setAdLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const fetchLeaderboard = useCallback(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, streak, points, monthly_points')
      .gt('monthly_points', 0)
      .order('monthly_points', { ascending: false })
      .limit(3);

    if (error || !data) return;
    const entries: LeaderboardEntry[] = data.map((p) => ({
      id: p.id,
      display_name: p.display_name,
      streak: p.streak,
      points: p.points,
      monthly_points: p.monthly_points ?? 0,
      is_you: authProfile?.id === p.id,
    }));
    setLeaderboard(entries);
  }, [authProfile]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  useEffect(() => {
    if (!authProfile) return;
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    (async () => {
      const { data } = await supabase
        .from('monthly_winners')
        .select('id, rank, verification_code, prize_amount, status, profile_id')
        .eq('year_month', yearMonth)
        .order('rank', { ascending: true });
      if (data && data.length > 0) {
        const myWins = data.filter((w) => w.profile_id === authProfile.id && w.status === 'notified' && w.verification_code);
        if (myWins.length > 0) {
          setWinners(myWins as WinnerInfo[]);
          setWinnerModal(true);
        }
      }
    })();
  }, [authProfile]);

  const handleRefresh = () => {
    setAdModal(true);
  };

  const handleWatchAdAndRefresh = async () => {
    setAdLoading(true);
    await showRewardedAd({
      onReward: () => {
        showToast(t('adRewarded'));
      },
      onDismiss: async () => {
        setAdLoading(false);
        setAdModal(false);
        setRefreshing(true);
        await fetchLeaderboard();
        setRefreshing(false);
      },
      onError: () => {
        setAdLoading(false);
        showToast(t('adNotReady'));
      },
    });
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
  const rankLabels = ['1st', '2nd', '3rd'];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: palette.bg }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[palette.primary]} tintColor={palette.primary} />}
    >
      <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={styles.hero}>
        <View style={styles.heroIconWrap}>
          <User color="#fff" size={36} strokeWidth={2} />
        </View>
        <Text style={styles.heroName}>{authProfile?.display_name ?? 'User'}</Text>
        {authProfile?.email && (
          <View style={styles.emailTag}>
            <Mail color="#fff" size={14} strokeWidth={2} />
            <Text style={styles.emailTagText}>{authProfile.email}</Text>
          </View>
        )}
      </LinearGradient>

      {toast && (
        <View style={styles.toastWrap}>
          <View style={[styles.toast, { backgroundColor: palette.primary }]}>
            <Text style={styles.toastText}>{toast}</Text>
          </View>
        </View>
      )}

      <View style={styles.statsGrid}>
        <StatCard icon={<Flame color={palette.accent} size={24} strokeWidth={2} />} value={String(profile.streak)} label={t('currentStreak')} palette={palette} />
        <StatCard icon={<Coins color={palette.primary} size={24} strokeWidth={2} />} value={String(profile.points)} label={t('totalPoints')} palette={palette} />
        <StatCard icon={<Trophy color={palette.warning} size={24} strokeWidth={2} />} value={String(authProfile?.monthly_points ?? 0)} label={t('monthlyPoints')} palette={palette} />
        {profile.premiumUnlocked && <StatCard icon={<Crown color={palette.accent} size={24} strokeWidth={2} />} value={t('active')} label={t('premium')} palette={palette} />}
      </View>

      {/* Top 3 Leaderboard */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>{t('leaderboard')}</Text>
          <Text style={[styles.sectionHint, { color: palette.textMuted }]}>{t('monthlyReset')}</Text>
        </View>

        <TouchableOpacity onPress={handleRefresh} activeOpacity={0.85} style={styles.refreshBtnWrap}>
          <View style={[styles.refreshBtn, { backgroundColor: palette.surface, borderColor: palette.primary }]}>
            <RefreshCw color={palette.primary} size={18} strokeWidth={2} />
            <Text style={[styles.refreshBtnText, { color: palette.primary }]}>{t('refreshLeaderboard')}</Text>
          </View>
        </TouchableOpacity>

        <View style={[styles.leaderboardCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
          {leaderboard.length === 0 ? (
            <Text style={[styles.emptyText, { color: palette.textMuted }]}>{t('notQualified')}</Text>
          ) : (
            leaderboard.map((entry, idx) => (
              <View
                key={entry.id}
                style={[
                  styles.leaderboardRow,
                  { borderBottomColor: palette.border },
                  idx === leaderboard.length - 1 && { borderBottomWidth: 0 },
                  entry.is_you && { backgroundColor: palette.primary + '08' },
                ]}
              >
                <View style={[styles.rankWrap, { backgroundColor: rankColors[idx] + '25' }]}>
                  <Text style={[styles.rankText, { color: rankColors[idx] }]}>{rankLabels[idx]}</Text>
                </View>
                <View style={styles.leaderboardInfo}>
                  <Text style={[styles.leaderboardName, { color: palette.text }]}>
                    {entry.display_name}
                    {entry.is_you && <Text style={[styles.youTag, { color: palette.primary }]}>  ({t('you')})</Text>}
                  </Text>
                  <Text style={[styles.leaderboardSub, { color: palette.textMuted }]}>
                    {entry.monthly_points} {t('monthlyPoints')} · {entry.streak} {t('streak')}
                  </Text>
                </View>
                <Trophy color={rankColors[idx]} size={20} strokeWidth={2} />
              </View>
            ))
          )}
        </View>

        {/* Competition rules + social links */}
        <View style={[styles.rulesCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <View style={styles.rulesHeader}>
            <Info color={palette.primary} size={18} strokeWidth={2} />
            <Text style={[styles.rulesTitle, { color: palette.text }]}>{t('competitionRules')}</Text>
          </View>
          <Text style={[styles.rulesDesc, { color: palette.textMuted }]}>{t('competitionRulesDesc')}</Text>
          <View style={styles.socialRow}>
            <TouchableOpacity
              onPress={() => openLink(INSTAGRAM_URL)}
              style={[styles.socialBtn, { backgroundColor: '#E1306C' + '18', borderColor: '#E1306C' }]}
              activeOpacity={0.85}
            >
              <Instagram color="#E1306C" size={20} strokeWidth={2} />
              <Text style={[styles.socialBtnText, { color: '#E1306C' }]}>Instagram</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openLink(FACEBOOK_URL)}
              style={[styles.socialBtn, { backgroundColor: '#1877F2' + '18', borderColor: '#1877F2' }]}
              activeOpacity={0.85}
            >
              <Facebook color="#1877F2" size={20} strokeWidth={2} />
              <Text style={[styles.socialBtnText, { color: '#1877F2' }]}>Facebook</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.socialRow, { marginTop: 8 }]}>
            <TouchableOpacity
              onPress={() => openLink(TIKTOK_URL)}
              style={[styles.socialBtn, { backgroundColor: '#000000' + '10', borderColor: '#000000' }]}
              activeOpacity={0.85}
            >
              <Text style={[styles.tiktokIcon, { color: '#000000' }]}>T</Text>
              <Text style={[styles.socialBtnText, { color: '#000000' }]}>TikTok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>


      {/* Admin Dashboard Button */}
      {authProfile?.is_admin && (
        <TouchableOpacity onPress={() => router.push('/admin')} activeOpacity={0.85} style={styles.fullWidth}>
          <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={styles.adminBtn}>
            <Shield color="#fff" size={20} strokeWidth={2} />
            <Text style={styles.adminBtnText}>{t('adminDashboard')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={signOut} activeOpacity={0.85} style={styles.fullWidth}>
        <View style={[styles.logoutBtn, { backgroundColor: palette.surface, borderColor: palette.error }]}>
          <LogOut color={palette.error} size={20} strokeWidth={2} />
          <Text style={[styles.logoutBtnText, { color: palette.error }]}>{t('logout')}</Text>
        </View>
      </TouchableOpacity>

      <WinnerModal visible={winnerModal} winners={winners} onClose={() => setWinnerModal(false)} />

      <Modal visible={adModal} transparent animationType="fade" onRequestClose={() => !adLoading && setAdModal(false)}>
        <View style={styles.adOverlay}>
          <View style={[styles.adSheet, { backgroundColor: palette.surface }]}>
            <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={styles.adIconWrap}>
              {adLoading ? <ActivityIndicator color="#fff" size="large" /> : <PlayCircle color="#fff" size={36} strokeWidth={2} />}
            </LinearGradient>
            <Text style={[styles.adTitle, { color: palette.text }]}>{adLoading ? t('adLoading') : t('refreshLeaderboard')}</Text>
            <Text style={[styles.adDesc, { color: palette.textMuted }]}>{adLoading ? t('adLoading') : t('refreshLeaderboardDesc')}</Text>
            {adLoading ? (
              <View style={[styles.adBtn, { backgroundColor: palette.surfaceAlt }]}>
                <Text style={[styles.adBtnText, { color: palette.textMuted }]}>{t('adLoading')}</Text>
              </View>
            ) : (
              <TouchableOpacity onPress={handleWatchAdAndRefresh} activeOpacity={0.85}>
                <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={styles.adBtn}>
                  <Text style={styles.adBtnTextLight}>{t('watchAd')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            {!adLoading && (
              <TouchableOpacity onPress={() => setAdModal(false)} style={styles.adCancelBtn}>
                <Text style={[styles.adCancelText, { color: palette.textMuted }]}>{t('cancel')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function StatCard({ icon, value, label, palette }: { icon: React.ReactNode; value: string; label: string; palette: ReturnType<typeof useApp>['palette'] }) {
  return (
    <View style={[styles.statCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
      {icon}
      <Text style={[styles.statValue, { color: palette.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: palette.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 32 },
  hero: { alignItems: 'center', paddingTop: 60, paddingBottom: 32, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  heroIconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  heroName: { fontSize: 24, fontWeight: '700', color: '#fff' },
  emailTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginTop: 8 },
  emailTagText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  toastWrap: { paddingHorizontal: 20, marginBottom: 8 },
  toast: { borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center', alignSelf: 'center' },
  toastText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 12, marginTop: 20 },
  statCard: { width: '47%', flexGrow: 1, borderRadius: 16, borderWidth: 1, padding: 16, alignItems: 'center', gap: 6 },
  statValue: { fontSize: 24, fontWeight: '700' },
  statLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
  section: { paddingHorizontal: 20, marginTop: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  sectionHint: { fontSize: 12 },
  refreshBtnWrap: { marginBottom: 12 },
  refreshBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 14, borderWidth: 2, borderStyle: 'dashed' },
  refreshBtnText: { fontSize: 14, fontWeight: '600' },
  leaderboardCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  leaderboardRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, gap: 12 },
  rankWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  rankText: { fontSize: 13, fontWeight: '800' },
  leaderboardInfo: { flex: 1 },
  leaderboardName: { fontSize: 15, fontWeight: '600' },
  youTag: { fontSize: 13, fontWeight: '600' },
  leaderboardSub: { fontSize: 12, marginTop: 2 },
  emptyText: { padding: 24, textAlign: 'center', fontSize: 14 },
  rulesCard: { borderRadius: 16, borderWidth: 1, padding: 20, marginTop: 16 },
  rulesHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  rulesTitle: { fontSize: 16, fontWeight: '700' },
  rulesDesc: { fontSize: 13, lineHeight: 20, marginBottom: 16 },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5 },
  socialBtnText: { fontSize: 14, fontWeight: '600' },
  tiktokIcon: { fontSize: 18, fontWeight: '900' },
  fullWidth: { paddingHorizontal: 20, marginTop: 16 },
  adminBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 14, borderRadius: 14 },
  adminBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 14, borderRadius: 14, borderWidth: 2, borderStyle: 'dashed' },
  logoutBtnText: { fontSize: 15, fontWeight: '600' },
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
