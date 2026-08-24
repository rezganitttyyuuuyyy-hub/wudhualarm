import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { ADHAN_RECITERS, APP_THEMES, BADGES } from '@/lib/constants';
import RewardedAdModal from '@/components/RewardedAdModal';

import { Flame, Coins, Star, Lock, Check, Crown, Award, Ticket, PlayCircle, Camera, Bell, Palette, Sparkles } from 'lucide-react-native';

const FEATURE_COSTS = {
  camera: 50,
  strictAlarm: 80,
  adhan: 40,
  themes: 60,
};

export default function RewardsScreen() {
  const { palette, t, profile, grantSkipPass, unlockPremium, unlockReciter, unlockTheme, unlockBadge, addPoints } = useApp();
  const { profile: authProfile } = useAuth();
  const [adModal, setAdModal] = useState<null | { type: 'skip' | 'premium' | 'reciter' | 'theme' | 'badge' | 'ads'; id?: string }>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const awardAdPoints = async () => {
    const points = 2;
    addPoints(points);
    showToast(`+${points} ${t('points')}!`);
    if (authProfile) {
      await supabase.from('point_transactions').insert({
        profile_id: authProfile.id,
        source: 'ad',
        amount: points,
        description: 'Watched rewarded ad',
      });
      await supabase
        .from('profiles')
        .update({ monthly_points: (authProfile.monthly_points ?? 0) + points })
        .eq('id', authProfile.id);
    }
  };

  const handleReward = () => {
    if (!adModal) return;
    if (adModal.type === 'skip') {
      grantSkipPass(1);
    } else if (adModal.type === 'premium') {
      unlockPremium();
    } else if (adModal.type === 'reciter' && adModal.id) {
      unlockReciter(adModal.id);
    } else if (adModal.type === 'theme' && adModal.id) {
      unlockTheme(adModal.id);
    } else if (adModal.type === 'badge' && adModal.id) {
      unlockBadge(adModal.id);
    } else if (adModal.type === 'ads') {
      awardAdPoints();
    }
  };

  const unlockFeature = async (feature: 'camera' | 'strictAlarm' | 'adhan' | 'themes') => {
    const cost = FEATURE_COSTS[feature];
    if (profile.points < cost) {
      showToast(t('insufficientPoints'));
      return;
    }
    // Deduct points by adding a negative transaction
    addPoints(-cost);
    if (authProfile) {
      await supabase.from('point_transactions').insert({
        profile_id: authProfile.id,
        source: 'admin',
        amount: -cost,
        description: `Unlocked: ${feature}`,
      });
    }
    if (feature === 'camera' || feature === 'strictAlarm') {
      unlockPremium();
    } else if (feature === 'adhan') {
      unlockReciter('egypt');
      unlockReciter('turkey');
    } else if (feature === 'themes') {
      unlockTheme('sand');
      unlockTheme('rose');
    }
    showToast(t('unlockPremium') + '!');
  };

  const modalConfig = () => {
    if (!adModal) return null;
    const base = { onReward: handleReward, onClose: () => setAdModal(null) };
    switch (adModal.type) {
      case 'skip':
        return { ...base, title: t('getSkipPass'), message: t('skipPassDesc'), rewardLabel: t('watchAd') };
      case 'premium':
        return { ...base, title: t('unlockPremium'), message: t('unlockPremiumDesc'), rewardLabel: t('watchAd') };
      case 'reciter':
        return { ...base, title: t('unlock'), message: t('watchAdToUnlock'), rewardLabel: t('watchAd') };
      case 'theme':
        return { ...base, title: t('unlock'), message: t('watchAdToUnlock'), rewardLabel: t('watchAd') };
      case 'badge':
        return { ...base, title: t('unlock'), message: t('watchAdToUnlock'), rewardLabel: t('watchAd') };
      case 'ads':
        return { ...base, title: t('watchAdEarn'), message: t('watchAdDesc'), rewardLabel: t('watchAd') };
    }
  };

  const cfg = modalConfig();

  return (
    <ScrollView style={[styles.container, { backgroundColor: palette.bg }]} contentContainerStyle={styles.content}>
      <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={styles.hero}>
        <Crown color="#fff" size={32} strokeWidth={2} />
        <Text style={styles.heroTitle}>{t('rewards')}</Text>
        <Text style={styles.heroSubtitle}>{t('tagline')}</Text>
      </LinearGradient>

      {toast && (
        <View style={styles.toastWrap}>
          <View style={[styles.toast, { backgroundColor: palette.primary }]}>
            <Text style={styles.toastText}>{toast}</Text>
          </View>
        </View>
      )}

      <View style={styles.progressSection}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>{t('yourProgress')}</Text>
        <View style={styles.progressGrid}>
          <ProgressCard icon={<Coins color={palette.primary} size={24} strokeWidth={2} />} value={String(profile.points)} label={t('totalPoints')} palette={palette} />
          <ProgressCard icon={<Flame color={palette.accent} size={24} strokeWidth={2} />} value={String(profile.streak)} label={t('currentStreak')} palette={palette} />
        </View>
      </View>

      {/* Ads Watching Section - 2 points */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>{t('adsWatching')}</Text>
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <View style={styles.cardLeft}>
            <View style={[styles.cardIcon, { backgroundColor: palette.primary + '22' }]}>
              <PlayCircle color={palette.primary} size={24} strokeWidth={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: palette.text }]}>{t('watchAdEarn')}</Text>
              <Text style={[styles.cardDesc, { color: palette.textMuted }]}>{t('watchAdDesc')}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setAdModal({ type: 'ads' })} activeOpacity={0.85}>
            <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={styles.btn}>
              <Text style={styles.btnText}>+2</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Feature Unlocking via Points */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>{t('unlockFeatures')}</Text>
        <Text style={[styles.sectionHint, { color: palette.textMuted }]}>{t('unlockFeaturesDesc')}</Text>
        <View style={styles.balanceRow}>
          <Coins color={palette.primary} size={20} strokeWidth={2} />
          <Text style={[styles.balanceText, { color: palette.text }]}>{t('pointsBalance')}: {profile.points}</Text>
        </View>
        <View style={styles.featureList}>
          <FeatureCard
            icon={<Camera color={profile.premiumUnlocked ? palette.success : palette.primary} size={22} strokeWidth={2} />}
            title={t('featureCamera')}
            cost={FEATURE_COSTS.camera}
            unlocked={profile.premiumUnlocked}
            canAfford={profile.points >= FEATURE_COSTS.camera}
            onPress={() => unlockFeature('camera')}
            palette={palette}
            t={t}
          />
          <FeatureCard
            icon={<Bell color={profile.premiumUnlocked ? palette.success : palette.primary} size={22} strokeWidth={2} />}
            title={t('featureStrictAlarm')}
            cost={FEATURE_COSTS.strictAlarm}
            unlocked={profile.premiumUnlocked}
            canAfford={profile.points >= FEATURE_COSTS.strictAlarm}
            onPress={() => unlockFeature('strictAlarm')}
            palette={palette}
            t={t}
          />
          <FeatureCard
            icon={<Sparkles color={profile.unlockedReciters.includes('egypt') ? palette.success : palette.primary} size={22} strokeWidth={2} />}
            title={t('featureAdhan')}
            cost={FEATURE_COSTS.adhan}
            unlocked={profile.unlockedReciters.includes('egypt')}
            canAfford={profile.points >= FEATURE_COSTS.adhan}
            onPress={() => unlockFeature('adhan')}
            palette={palette}
            t={t}
          />
          <FeatureCard
            icon={<Palette color={profile.unlockedThemes.includes('sand') ? palette.success : palette.primary} size={22} strokeWidth={2} />}
            title={t('featureThemes')}
            cost={FEATURE_COSTS.themes}
            unlocked={profile.unlockedThemes.includes('sand')}
            canAfford={profile.points >= FEATURE_COSTS.themes}
            onPress={() => unlockFeature('themes')}
            palette={palette}
            t={t}
          />
        </View>
      </View>

      {/* Skip Pass */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>{t('skipPass')}</Text>
        <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <View style={styles.cardLeft}>
            <View style={[styles.cardIcon, { backgroundColor: palette.accent + '22' }]}>
              <Ticket color={palette.accent} size={24} strokeWidth={2} />
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: palette.text }]}>{t('skipPass')}</Text>
              <Text style={[styles.cardDesc, { color: palette.textMuted }]}>{t('skipPassDesc')}</Text>
              <Text style={[styles.cardCount, { color: palette.primary }]}>
                {profile.skipPasses} {t('skipPass')}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setAdModal({ type: 'skip' })} activeOpacity={0.85}>
            <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={styles.btn}>
              <Text style={styles.btnText}>{t('watchAd')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Reciters */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>{t('reciters')}</Text>
        <View style={styles.grid}>
          {ADHAN_RECITERS.map((r) => {
            const unlocked = profile.unlockedReciters.includes(r.id) || profile.premiumUnlocked;
            return (
              <View key={r.id} style={[styles.gridCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
                <View style={styles.gridTop}>
                  {r.premium && !unlocked ? (
                    <Lock color={palette.textMuted} size={20} strokeWidth={2} />
                  ) : (
                    <Check color={palette.success} size={20} strokeWidth={2.5} />
                  )}
                </View>
                <Text style={[styles.gridName, { color: palette.text }]}>{r.name}</Text>
                {r.premium && !unlocked ? (
                  <TouchableOpacity onPress={() => setAdModal({ type: 'reciter', id: r.id })} style={[styles.miniBtn, { borderColor: palette.primary }]}>
                    <Text style={[styles.miniBtnText, { color: palette.primary }]}>{t('unlock')}</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={[styles.unlockedSmall, { color: palette.success }]}>{t('active')}</Text>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Themes */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>{t('themes')}</Text>
        <View style={styles.grid}>
          {APP_THEMES.map((th) => {
            const unlocked = profile.unlockedThemes.includes(th.id) || profile.premiumUnlocked;
            return (
              <View key={th.id} style={[styles.gridCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
                <View style={[styles.themeSwatch, { backgroundColor: th.id === 'rose' ? '#E11D48' : th.id === 'gold' ? '#D4AF37' : th.id === 'sand' ? '#D2B48C' : th.id === 'midnight' ? '#1E3A5F' : '#0E7C66' }]} />
                <Text style={[styles.gridName, { color: palette.text }]}>{th.name}</Text>
                {th.premium && !unlocked ? (
                  <TouchableOpacity onPress={() => setAdModal({ type: 'theme', id: th.id })} style={[styles.miniBtn, { borderColor: palette.primary }]}>
                    <Text style={[styles.miniBtnText, { color: palette.primary }]}>{t('unlock')}</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={[styles.unlockedSmall, { color: palette.success }]}>{t('active')}</Text>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Badges */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>{t('badges')}</Text>
        <View style={styles.grid}>
          {BADGES.map((b) => {
            const unlocked = profile.streak >= b.threshold;
            return (
              <View key={b.id} style={[styles.gridCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
                <View style={[styles.badgeIcon, { backgroundColor: unlocked ? palette.accent + '22' : palette.surfaceAlt }]}>
                  {unlocked ? <Award color={palette.accent} size={24} strokeWidth={2} /> : <Lock color={palette.textMuted} size={20} strokeWidth={2} />}
                </View>
                <Text style={[styles.gridName, { color: palette.text }]}>{b.name}</Text>
                <Text style={[styles.gridDesc, { color: palette.textMuted }]}>{b.description}</Text>
                <Text style={[styles.gridThreshold, { color: unlocked ? palette.success : palette.textMuted }]}>
                  {b.threshold} {t('days')}
                </Text>
              </View>
            );
          })}
        </View>
      </View>


      {cfg && <RewardedAdModal visible={!!adModal} title={cfg.title} message={cfg.message} rewardLabel={cfg.rewardLabel} onReward={cfg.onReward} onClose={cfg.onClose} />}
    </ScrollView>
  );
}

function ProgressCard({ icon, value, label, palette }: { icon: React.ReactNode; value: string; label: string; palette: ReturnType<typeof useApp>['palette'] }) {
  return (
    <View style={[styles.progressCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
      {icon}
      <Text style={[styles.progressValue, { color: palette.text }]}>{value}</Text>
      <Text style={[styles.progressLabel, { color: palette.textMuted }]}>{label}</Text>
    </View>
  );
}

function FeatureCard({ icon, title, cost, unlocked, canAfford, onPress, palette, t }: {
  icon: React.ReactNode;
  title: string;
  cost: number;
  unlocked: boolean;
  canAfford: boolean;
  onPress: () => void;
  palette: ReturnType<typeof useApp>['palette'];
  t: (k: string) => string;
}) {
  return (
    <View style={[styles.featureCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
      <View style={[styles.featureIcon, { backgroundColor: palette.surfaceAlt }]}>
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.featureTitle, { color: palette.text }]}>{title}</Text>
        <Text style={[styles.featureCost, { color: canAfford ? palette.primary : palette.textMuted }]}>
          {t('cost')}: {cost} {t('points')}
        </Text>
      </View>
      {unlocked ? (
        <View style={[styles.unlockedTag, { backgroundColor: palette.success + '22' }]}>
          <Check color={palette.success} size={16} strokeWidth={2.5} />
          <Text style={[styles.unlockedText, { color: palette.success }]}>{t('active')}</Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={onPress}
          disabled={!canAfford}
          style={[styles.featureBtn, { backgroundColor: canAfford ? palette.primary : palette.border }]}
        >
          <Text style={[styles.featureBtnText, { color: canAfford ? '#fff' : palette.textMuted }]}>{t('unlockNow')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 40 },
  hero: { alignItems: 'center', paddingTop: 56, paddingBottom: 32, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, marginBottom: 20 },
  heroTitle: { fontSize: 26, fontWeight: '700', color: '#fff', marginTop: 12 },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  toastWrap: { paddingHorizontal: 20, marginBottom: 8 },
  toast: { borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center', alignSelf: 'center' },
  toastText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  progressSection: { paddingHorizontal: 20, marginBottom: 24 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  sectionHint: { fontSize: 13, color: '#94A3B8', marginBottom: 12 },
  balanceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  balanceText: { fontSize: 15, fontWeight: '600' },
  progressGrid: { flexDirection: 'row', gap: 12 },
  progressCard: { flex: 1, borderRadius: 16, borderWidth: 1, padding: 16, alignItems: 'center', gap: 6 },
  progressValue: { fontSize: 28, fontWeight: '700' },
  progressLabel: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 16, borderWidth: 1, padding: 16 },
  cardLeft: { flexDirection: 'row', gap: 12, flex: 1 },
  cardIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardDesc: { fontSize: 12, color: '#94A3B8', marginTop: 2, flexShrink: 1 },
  cardCount: { fontSize: 13, fontWeight: '600', marginTop: 6 },
  btn: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12 },
  btnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  featureList: { gap: 10 },
  featureCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, borderWidth: 1, padding: 14 },
  featureIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  featureTitle: { fontSize: 14, fontWeight: '600' },
  featureCost: { fontSize: 12, marginTop: 2 },
  featureBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  featureBtnText: { fontSize: 13, fontWeight: '700' },
  unlockedTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
  unlockedText: { fontSize: 12, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridCard: { width: '47%', flexGrow: 1, borderRadius: 14, borderWidth: 1, padding: 16, alignItems: 'center', gap: 8 },
  gridTop: { height: 24 },
  gridName: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
  gridDesc: { fontSize: 11, textAlign: 'center' },
  gridThreshold: { fontSize: 12, fontWeight: '600' },
  miniBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5 },
  miniBtnText: { fontSize: 13, fontWeight: '600' },
  unlockedSmall: { fontSize: 12, fontWeight: '600' },
  themeSwatch: { width: 40, height: 40, borderRadius: 20 },
  badgeIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
});
