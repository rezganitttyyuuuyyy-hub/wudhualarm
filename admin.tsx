import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { Shield, ArrowLeft, Trophy, User, Mail, Phone, Link, Globe, Calendar, RotateCcw, History } from 'lucide-react-native';
import Constants from 'expo-constants';

interface TopUser {
  id: string;
  display_name: string;
  full_name: string | null;
  email: string | null;
  phone_number: string | null;
  country: string | null;
  social_link: string | null;
  tiktok_link: string | null;
  points: number;
  monthly_points: number;
  streak: number;
  best_streak: number;
}

interface PastWinner {
  year_month: string;
  rank: number;
  activity_score: number;
  display_name: string;
  full_name: string | null;
  email: string | null;
}

function getCurrentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function formatMonthLabel(ym: string): string {
  const [year, month] = ym.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

export default function AdminScreen() {
  const { palette, t } = useApp();
  const { profile: authProfile } = useAuth();
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [pastWinners, setPastWinners] = useState<PastWinner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [resetResult, setResetResult] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: isAdmin } = await supabase.rpc('is_admin');
    if (!isAdmin) {
      setError(t('adminOnly'));
      setLoading(false);
      return;
    }

    const [topResult, winnersResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, display_name, full_name, email, phone_number, country, social_link, tiktok_link, points, monthly_points, streak, best_streak')
        .gt('monthly_points', 0)
        .order('monthly_points', { ascending: false })
        .limit(3),
      supabase
        .from('monthly_winners')
        .select('year_month, rank, activity_score, profile_id, profiles!inner(display_name, full_name, email)')
        .order('year_month', { ascending: false })
        .order('rank', { ascending: true })
        .limit(15),
    ]);

    if (topResult.error) {
      setError(topResult.error.message);
    } else {
      setTopUsers((topResult.data ?? []) as TopUser[]);
    }

    if (!winnersResult.error && winnersResult.data) {
      const mapped = winnersResult.data.map((w: any) => ({
        year_month: w.year_month,
        rank: w.rank,
        activity_score: w.activity_score,
        display_name: w.profiles?.display_name ?? '-',
        full_name: w.profiles?.full_name ?? null,
        email: w.profiles?.email ?? null,
      }));
      setPastWinners(mapped);
    }

    setLoading(false);
  }, [t]);

  useEffect(() => {
    if (!authProfile?.is_admin) {
      router.back();
      return;
    }
    fetchData();
  }, [authProfile, fetchData]);

  const handleReset = async () => {
    setResetting(true);
    setResetResult(null);
    try {
      const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL
        ?? process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
      const anonKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY
        ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

      const response = await fetch(`${supabaseUrl}/functions/v1/monthly-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
        },
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setResetResult(t('resetError') + ': ' + (body.error ?? response.statusText));
      } else {
        const body = await response.json();
        setResetResult(t('resetSuccess'));
        await fetchData();
      }
    } catch (e) {
      setResetResult(t('resetError'));
    }
    setResetting(false);
  };

  const openLink = (url: string) => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      Linking.openURL(url).catch(() => {});
    }
  };

  const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
  const currentMonth = getCurrentYearMonth();

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: palette.bg, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: palette.bg, justifyContent: 'center', alignItems: 'center', padding: 40 }]}>
        <Shield color={palette.error} size={48} strokeWidth={2} />
        <Text style={[styles.errorTitle, { color: palette.error }]}>{error}</Text>
        <TouchableOpacity onPress={() => router.back()} style={[styles.navBackBtn, { borderColor: palette.primary }]}>
          <Text style={[styles.navBackBtnText, { color: palette.primary }]}>{t('close')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pastMonths = [...new Set(pastWinners.map((w) => w.year_month))];

  return (
    <ScrollView style={[styles.container, { backgroundColor: palette.bg }]} contentContainerStyle={styles.content}>
      <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={styles.hero}>
        <TouchableOpacity onPress={() => router.back()} style={styles.heroBack}>
          <ArrowLeft color="#fff" size={24} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.heroIconWrap}>
          <Shield color="#fff" size={32} strokeWidth={2} />
        </View>
        <Text style={styles.heroTitle}>{t('adminDashboard')}</Text>
        <View style={styles.monthBadge}>
          <Calendar color="#fff" size={14} strokeWidth={2} />
          <Text style={styles.monthBadgeText}>{formatMonthLabel(currentMonth)}</Text>
        </View>
      </LinearGradient>

      {/* Current Cycle Header */}
      <View style={styles.body}>
        <View style={styles.cycleHeader}>
          <View>
            <Text style={[styles.cycleTitle, { color: palette.text }]}>{t('currentCycle')}</Text>
            <Text style={[styles.cycleDesc, { color: palette.textMuted }]}>{t('monthlyReset')}</Text>
          </View>
          <TouchableOpacity
            onPress={handleReset}
            disabled={resetting}
            style={[styles.resetBtn, { backgroundColor: palette.primary + '15', borderColor: palette.primary }]}
            activeOpacity={0.7}
          >
            {resetting ? (
              <ActivityIndicator size="small" color={palette.primary} />
            ) : (
              <RotateCcw color={palette.primary} size={16} strokeWidth={2} />
            )}
            <Text style={[styles.resetBtnText, { color: palette.primary }]}>{t('triggerReset')}</Text>
          </TouchableOpacity>
        </View>

        {resetResult && (
          <View style={[styles.resultBanner, { backgroundColor: resetResult.includes(t('resetSuccess')) ? palette.primary + '15' : palette.error + '15' }]}>
            <Text style={[styles.resultText, { color: resetResult.includes(t('resetSuccess')) ? palette.primary : palette.error }]}>{resetResult}</Text>
          </View>
        )}

        {/* Top 3 Current Month */}
        <Text style={[styles.sectionLabel, { color: palette.text }]}>{t('topUsers')} - {formatMonthLabel(currentMonth)}</Text>

        {topUsers.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
            <Text style={[styles.emptyText, { color: palette.textMuted }]}>{t('notQualified')}</Text>
          </View>
        ) : (
          topUsers.map((user, idx) => (
            <View key={user.id} style={[styles.userCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
              <View style={styles.userHeader}>
                <View style={[styles.rankBadge, { backgroundColor: rankColors[idx] + '20' }]}>
                  <Trophy color={rankColors[idx]} size={20} strokeWidth={2} />
                  <Text style={[styles.rankBadgeText, { color: rankColors[idx] }]}>#{idx + 1}</Text>
                </View>
                <View style={styles.userHeaderInfo}>
                  <Text style={[styles.userName, { color: palette.text }]}>{user.display_name}</Text>
                  <Text style={[styles.userPoints, { color: palette.primary }]}>
                    {user.monthly_points} {t('monthlyPoints')}
                  </Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={[styles.statPill, { backgroundColor: palette.surface }]}>
                  <Text style={[styles.statPillLabel, { color: palette.textMuted }]}>{t('totalPoints')}</Text>
                  <Text style={[styles.statPillValue, { color: palette.text }]}>{user.points}</Text>
                </View>
                <View style={[styles.statPill, { backgroundColor: palette.surface }]}>
                  <Text style={[styles.statPillLabel, { color: palette.textMuted }]}>{t('streak')}</Text>
                  <Text style={[styles.statPillValue, { color: palette.text }]}>{user.streak}</Text>
                </View>
                <View style={[styles.statPill, { backgroundColor: palette.surface }]}>
                  <Text style={[styles.statPillLabel, { color: palette.textMuted }]}>{t('bestStreak')}</Text>
                  <Text style={[styles.statPillValue, { color: palette.text }]}>{user.best_streak}</Text>
                </View>
              </View>

              <View style={[styles.detailsSection, { borderTopColor: palette.border }]}>
                <DetailRow icon={<User color={palette.textMuted} size={16} strokeWidth={2} />} label={t('fullNameLabel')} value={user.full_name} palette={palette} />
                <DetailRow icon={<Mail color={palette.textMuted} size={16} strokeWidth={2} />} label={t('emailLabel')} value={user.email} palette={palette} />
                <DetailRow icon={<Phone color={palette.textMuted} size={16} strokeWidth={2} />} label={t('phoneLabel')} value={user.phone_number} palette={palette} />
                <DetailRow icon={<Globe color={palette.textMuted} size={16} strokeWidth={2} />} label={t('country')} value={user.country} palette={palette} />
              </View>

              <View style={[styles.socialSection, { borderTopColor: palette.border }]}>
                <Text style={[styles.socialLabel, { color: palette.textMuted }]}>{t('socialLinks')}</Text>
                <View style={styles.socialBtns}>
                  {user.social_link ? (
                    <TouchableOpacity onPress={() => openLink(user.social_link!)} style={[styles.socialChip, { backgroundColor: palette.primary + '15' }]}>
                      <Link color={palette.primary} size={14} strokeWidth={2} />
                      <Text style={[styles.socialChipText, { color: palette.primary }]} numberOfLines={1}>{user.social_link}</Text>
                    </TouchableOpacity>
                  ) : null}
                  {user.tiktok_link ? (
                    <TouchableOpacity onPress={() => openLink(user.tiktok_link!)} style={[styles.socialChip, { backgroundColor: '#000000' + '10' }]}>
                      <Text style={{ fontSize: 14, fontWeight: '900', color: '#000' }}>T</Text>
                      <Text style={[styles.socialChipText, { color: '#000' }]} numberOfLines={1}>{user.tiktok_link}</Text>
                    </TouchableOpacity>
                  ) : null}
                  {!user.social_link && !user.tiktok_link && (
                    <Text style={[styles.noSocial, { color: palette.textMuted }]}>{t('noSocialLink')}</Text>
                  )}
                </View>
              </View>
            </View>
          ))
        )}

        {/* Past Winners */}
        {pastMonths.length > 0 && (
          <>
            <View style={styles.pastHeader}>
              <History color={palette.textMuted} size={18} strokeWidth={2} />
              <Text style={[styles.sectionLabel, { color: palette.text, marginBottom: 0 }]}>{t('pastWinners')}</Text>
            </View>
            {pastMonths.map((month) => {
              const monthWinners = pastWinners.filter((w) => w.year_month === month);
              return (
                <View key={month} style={[styles.pastCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
                  <Text style={[styles.pastMonth, { color: palette.primary }]}>{formatMonthLabel(month)}</Text>
                  {monthWinners.map((w) => (
                    <View key={`${w.year_month}-${w.rank}`} style={[styles.pastRow, { borderTopColor: palette.border }]}>
                      <View style={[styles.pastRank, { backgroundColor: rankColors[w.rank - 1] + '20' }]}>
                        <Text style={[styles.pastRankText, { color: rankColors[w.rank - 1] }]}>#{w.rank}</Text>
                      </View>
                      <View style={styles.pastInfo}>
                        <Text style={[styles.pastName, { color: palette.text }]}>{w.display_name}</Text>
                        <Text style={[styles.pastScore, { color: palette.textMuted }]}>{w.activity_score} pts</Text>
                      </View>
                      {w.email && <Text style={[styles.pastEmail, { color: palette.textMuted }]} numberOfLines={1}>{w.email}</Text>}
                    </View>
                  ))}
                </View>
              );
            })}
          </>
        )}
      </View>
    </ScrollView>
  );
}

function DetailRow({ icon, label, value, palette }: { icon: React.ReactNode; label: string; value: string | null; palette: any }) {
  return (
    <View style={styles.detailRow}>
      {icon}
      <Text style={[styles.detailLabel, { color: palette.textMuted }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: palette.text }]} numberOfLines={1}>{value || '-'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 40 },
  hero: { alignItems: 'center', paddingTop: 60, paddingBottom: 28, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, position: 'relative' },
  heroBack: { position: 'absolute', top: 52, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  heroIconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  heroTitle: { fontSize: 24, fontWeight: '700', color: '#fff' },
  monthBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginTop: 8 },
  monthBadgeText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  body: { padding: 20, gap: 12 },
  cycleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cycleTitle: { fontSize: 18, fontWeight: '700' },
  cycleDesc: { fontSize: 12, marginTop: 2 },
  resetBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5 },
  resetBtnText: { fontSize: 12, fontWeight: '600' },
  resultBanner: { borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center' },
  resultText: { fontSize: 14, fontWeight: '600' },
  sectionLabel: { fontSize: 16, fontWeight: '700', marginBottom: 8, marginTop: 8 },
  emptyCard: { borderRadius: 16, borderWidth: 1, padding: 24, alignItems: 'center' },
  emptyText: { fontSize: 14 },
  userCard: { borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  userHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  rankBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  rankBadgeText: { fontSize: 16, fontWeight: '800' },
  userHeaderInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: '700' },
  userPoints: { fontSize: 14, fontWeight: '600', marginTop: 2 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, paddingBottom: 16 },
  statPill: { flex: 1, borderRadius: 12, padding: 10, alignItems: 'center' },
  statPillLabel: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  statPillValue: { fontSize: 18, fontWeight: '700', marginTop: 2 },
  detailsSection: { borderTopWidth: 1, padding: 16, gap: 10 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailLabel: { fontSize: 13, width: 80 },
  detailValue: { flex: 1, fontSize: 14, fontWeight: '500' },
  socialSection: { borderTopWidth: 1, padding: 16 },
  socialLabel: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  socialBtns: { gap: 8 },
  socialChip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  socialChipText: { fontSize: 13, fontWeight: '500', flex: 1 },
  noSocial: { fontSize: 13, fontStyle: 'italic' },
  pastHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 },
  pastCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  pastMonth: { fontSize: 14, fontWeight: '700', padding: 14, paddingBottom: 8 },
  pastRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1 },
  pastRank: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  pastRankText: { fontSize: 13, fontWeight: '800' },
  pastInfo: { flex: 1 },
  pastName: { fontSize: 14, fontWeight: '600' },
  pastScore: { fontSize: 12, marginTop: 1 },
  pastEmail: { fontSize: 11, maxWidth: 120 },
  errorTitle: { fontSize: 18, fontWeight: '700', marginTop: 16, textAlign: 'center' },
  navBackBtn: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, borderWidth: 2 },
  navBackBtnText: { fontSize: 15, fontWeight: '600' },
});
