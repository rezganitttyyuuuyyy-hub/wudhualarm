import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { showRewardedAd } from '@/lib/ads';

import { Brain, Check, X, Coins, Trophy, Lock, PlayCircle, RefreshCw } from 'lucide-react-native';

const MAX_ATTEMPTS = 5;
const POINTS_PER_CORRECT = 1.5;

interface GeneratedPuzzle {
  key: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'a' | 'b' | 'c' | 'd';
  difficulty: string;
  category: string;
}

export default function PuzzlesScreen() {
  const { palette, t, activeLang, profile, addPoints } = useApp();
  const { profile: authProfile } = useAuth();
  const [puzzleQueue, setPuzzleQueue] = useState<GeneratedPuzzle[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<'a' | 'b' | 'c' | 'd' | null>(null);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [loading, setLoading] = useState(true);
  const [pointsGained, setPointsGained] = useState<number | null>(null);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [adUnlocked, setAdUnlocked] = useState(false);
  const [adModal, setAdModal] = useState(false);
  const [adLoading, setAdLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [solvedCount, setSolvedCount] = useState(0);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const fetchPuzzles = useCallback(async (excludeKeys: string[] = []) => {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
    const excludeParam = excludeKeys.length > 0 ? `&exclude=${encodeURIComponent(excludeKeys.join(','))}` : '';
    const url = `${supabaseUrl}/functions/v1/generate-puzzles?lang=${activeLang}&count=5${excludeParam}`;

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token ?? '';
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      setLoading(false);
      return;
    }

    const data = await response.json();
    if (data.puzzles && Array.isArray(data.puzzles)) {
      setPuzzleQueue((prev) => [...prev, ...data.puzzles]);
    }
    setLoading(false);
  }, [activeLang]);

  useEffect(() => {
    fetchPuzzles();
  }, [fetchPuzzles]);

  const current = puzzleQueue[currentIdx];
  const attemptsExhausted = attemptsUsed >= MAX_ATTEMPTS && !adUnlocked;

  const handleSubmit = async () => {
    if (!current || !selected || !authProfile) return;
    const isCorrect = selected === current.correct_answer;
    setResult(isCorrect ? 'correct' : 'incorrect');
    setAttemptsUsed((n) => n + 1);

    if (isCorrect) {
      setPointsGained(POINTS_PER_CORRECT);
      addPoints(POINTS_PER_CORRECT);
      setSolvedCount((n) => n + 1);

      await supabase.from('puzzle_attempts').insert({
        profile_id: authProfile.id,
        puzzle_key: current.key,
        selected_answer: selected,
        is_correct: true,
        points_awarded: POINTS_PER_CORRECT,
        question: current.question,
        correct_answer: current.correct_answer,
      });

      await supabase.from('point_transactions').insert({
        profile_id: authProfile.id,
        source: 'puzzle',
        amount: POINTS_PER_CORRECT,
        description: 'Puzzle solved correctly',
      });

      await supabase
        .from('profiles')
        .update({ monthly_points: (authProfile.monthly_points ?? 0) + POINTS_PER_CORRECT })
        .eq('id', authProfile.id);
    } else {
      await supabase.from('puzzle_attempts').insert({
        profile_id: authProfile.id,
        puzzle_key: current.key,
        selected_answer: selected,
        is_correct: false,
        points_awarded: 0,
        question: current.question,
        correct_answer: current.correct_answer,
      });
    }
  };

  const nextPuzzle = () => {
    setSelected(null);
    setResult(null);
    setPointsGained(null);

    // If we're near the end of the queue, fetch more puzzles
    if (currentIdx + 1 >= puzzleQueue.length - 2) {
      const solvedKeys = puzzleQueue.map((p) => p.key);
      fetchPuzzles(solvedKeys);
    }

    setCurrentIdx((i) => i + 1);

    // Check if attempts exhausted after this next puzzle
    if (attemptsUsed + 1 >= MAX_ATTEMPTS && !adUnlocked) {
      // Will be blocked on next attempt
    }
  };

  const handleWatchAdForRefill = async () => {
    setAdLoading(true);
    await showRewardedAd({
      onReward: () => {
        setAdUnlocked(true);
        setAttemptsUsed(0);
        showToast(t('adRewarded'));
      },
      onDismiss: () => {
        setAdLoading(false);
        setAdModal(false);
      },
      onError: () => {
        setAdLoading(false);
        showToast(t('adNotReady'));
      },
    });
  };

  if (loading && puzzleQueue.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: palette.bg }, styles.center]}>
        <ActivityIndicator size="large" color={palette.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: palette.bg }]} contentContainerStyle={styles.content}>
      <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={styles.hero}>
        <Brain color="#fff" size={32} strokeWidth={2} />
        <Text style={styles.heroTitle}>{t('puzzles')}</Text>
        <Text style={styles.heroSubtitle}>{t('puzzlesDesc')}</Text>
        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <Coins color="#fff" size={18} strokeWidth={2} />
            <Text style={styles.heroStatText}>{profile.points}</Text>
          </View>
          <View style={styles.heroStat}>
            <Trophy color="#fff" size={18} strokeWidth={2} />
            <Text style={styles.heroStatText}>{solvedCount}</Text>
          </View>
        </View>
      </LinearGradient>

      {toast && (
        <View style={styles.toastWrap}>
          <View style={[styles.toast, { backgroundColor: palette.primary }]}>
            <Text style={styles.toastText}>{toast}</Text>
          </View>
        </View>
      )}

      <View style={styles.body}>
        {/* Attempts indicator */}
        <View style={[styles.limitBar, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <View style={styles.limitLeft}>
            <Text style={[styles.limitText, { color: palette.text }]}>
              {t('attempts')}: {Math.min(attemptsUsed, MAX_ATTEMPTS)}/{MAX_ATTEMPTS}
            </Text>
            {attemptsExhausted && (
              <Text style={[styles.limitHint, { color: palette.error }]}>{t('watchAdForMore')}</Text>
            )}
            {adUnlocked && attemptsUsed < MAX_ATTEMPTS && (
              <Text style={[styles.limitHint, { color: palette.success }]}>{t('unlockedMore')}</Text>
            )}
          </View>
          {attemptsExhausted && (
            <TouchableOpacity onPress={() => setAdModal(true)} activeOpacity={0.85}>
              <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={styles.limitBtn}>
                <PlayCircle color="#fff" size={16} strokeWidth={2} />
                <Text style={styles.limitBtnText}>{t('watchAd')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {current && !attemptsExhausted ? (
          <View style={[styles.puzzleCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
            <View style={styles.puzzleHeader}>
              <View style={[styles.diffTag, { backgroundColor: palette.primary + '18' }]}>
                <Text style={[styles.diffText, { color: palette.primary }]}>{current.difficulty.toUpperCase()}</Text>
              </View>
            </View>

            <Text style={[styles.question, { color: palette.text }]}>{current.question}</Text>

            <View style={styles.options}>
              {(['a', 'b', 'c', 'd'] as const).map((opt) => {
                const optionText = current[`option_${opt}` as keyof GeneratedPuzzle] as string;
                const isSelected = selected === opt;
                const showResult = result !== null;
                const isCorrectAnswer = current.correct_answer === opt;
                const isWrong = isSelected && !isCorrectAnswer;
                return (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => !result && setSelected(opt)}
                    disabled={!!result}
                    style={[
                      styles.option,
                      { backgroundColor: palette.surface, borderColor: palette.border },
                      isSelected && !showResult && { borderColor: palette.primary, borderWidth: 2 },
                      showResult && isCorrectAnswer && { backgroundColor: palette.success + '15', borderColor: palette.success, borderWidth: 2 },
                      showResult && isWrong && { backgroundColor: palette.error + '15', borderColor: palette.error, borderWidth: 2 },
                    ]}
                  >
                    <View style={[styles.optionLetter, { backgroundColor: palette.surfaceAlt }, isSelected && !showResult && { backgroundColor: palette.primary }, showResult && isCorrectAnswer && { backgroundColor: palette.success }, showResult && isWrong && { backgroundColor: palette.error }]}>
                      <Text style={[styles.optionLetterText, { color: palette.text }, (isSelected && !showResult || (showResult && (isCorrectAnswer || isWrong))) && { color: '#fff' }]}>{opt.toUpperCase()}</Text>
                    </View>
                    <Text style={[styles.optionText, { color: palette.text }]}>{optionText}</Text>
                    {showResult && isCorrectAnswer && <Check color={palette.success} size={20} strokeWidth={2.5} />}
                    {showResult && isWrong && <X color={palette.error} size={20} strokeWidth={2.5} />}
                  </TouchableOpacity>
                );
              })}
            </View>

            {result === 'correct' && pointsGained !== null && (
              <View style={[styles.resultBox, { backgroundColor: palette.success + '15' }]}>
                <Text style={[styles.resultText, { color: palette.success }]}>{t('correct')}</Text>
                <Text style={[styles.pointsText, { color: palette.success }]}>+{pointsGained} {t('points')}</Text>
              </View>
            )}
            {result === 'incorrect' && (
              <View style={[styles.resultBox, { backgroundColor: palette.error + '15' }]}>
                <Text style={[styles.resultText, { color: palette.error }]}>{t('incorrect')}</Text>
              </View>
            )}

            {!result ? (
              <TouchableOpacity onPress={handleSubmit} disabled={!selected} activeOpacity={0.85}>
                <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={[styles.submitBtn, !selected && styles.btnDisabled]}>
                  <Text style={styles.submitBtnText}>{t('submitAnswer')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={nextPuzzle} activeOpacity={0.85}>
                <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={styles.submitBtn}>
                  <Text style={styles.submitBtnText}>{t('nextPuzzle')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        ) : attemptsExhausted ? (
          <View style={[styles.lockedCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
            <Lock color={palette.textMuted} size={40} strokeWidth={2} />
            <Text style={[styles.lockedTitle, { color: palette.text }]}>{t('dailyLimitReached')}</Text>
            <Text style={[styles.lockedDesc, { color: palette.textMuted }]}>{t('watchAdForMore')}</Text>
            <TouchableOpacity onPress={() => setAdModal(true)} activeOpacity={0.85}>
              <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={styles.lockedBtn}>
                <PlayCircle color="#fff" size={20} strokeWidth={2} />
                <Text style={styles.lockedBtnText}>{t('watchAd')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.emptyCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
            <ActivityIndicator size="large" color={palette.primary} />
            <Text style={[styles.emptyTitle, { color: palette.textMuted }]}>{t('adLoading')}</Text>
          </View>
        )}

      </View>

      {/* Rewarded Ad Modal for refilling attempts */}
      <Modal visible={adModal} transparent animationType="fade" onRequestClose={() => !adLoading && setAdModal(false)}>
        <View style={styles.adOverlay}>
          <View style={[styles.adSheet, { backgroundColor: palette.surface }]}>
            <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={styles.adIconWrap}>
              {adLoading ? <ActivityIndicator color="#fff" size="large" /> : <PlayCircle color="#fff" size={36} strokeWidth={2} />}
            </LinearGradient>
            <Text style={[styles.adTitle, { color: palette.text }]}>{adLoading ? t('adLoading') : t('watchAdForMore')}</Text>
            <Text style={[styles.adDesc, { color: palette.textMuted }]}>{adLoading ? t('adLoading') : t('watchAdDesc')}</Text>
            {adLoading ? (
              <View style={[styles.adBtn, { backgroundColor: palette.surfaceAlt }]}>
                <Text style={[styles.adBtnText, { color: palette.textMuted }]}>{t('adLoading')}</Text>
              </View>
            ) : (
              <TouchableOpacity onPress={handleWatchAdForRefill} activeOpacity={0.85}>
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  content: { paddingBottom: 32 },
  hero: { alignItems: 'center', paddingTop: 56, paddingBottom: 32, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  heroTitle: { fontSize: 26, fontWeight: '700', color: '#fff', marginTop: 12 },
  heroSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4, textAlign: 'center', paddingHorizontal: 40 },
  heroStats: { flexDirection: 'row', gap: 24, marginTop: 16 },
  heroStat: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  heroStatText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  toastWrap: { paddingHorizontal: 20, marginBottom: 8 },
  toast: { borderRadius: 12, paddingVertical: 12, paddingHorizontal: 20, alignItems: 'center', alignSelf: 'center' },
  toastText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  body: { padding: 20, gap: 20 },
  limitBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 14, borderWidth: 1, padding: 14 },
  limitLeft: { flex: 1 },
  limitText: { fontSize: 14, fontWeight: '600' },
  limitHint: { fontSize: 12, marginTop: 4 },
  limitBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
  limitBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  puzzleCard: { borderRadius: 20, borderWidth: 1, padding: 20 },
  puzzleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  diffTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  diffText: { fontSize: 11, fontWeight: '700' },
  question: { fontSize: 18, fontWeight: '600', lineHeight: 26, marginBottom: 16 },
  options: { gap: 10 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, borderWidth: 1, padding: 14 },
  optionLetter: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  optionLetterText: { fontSize: 14, fontWeight: '700' },
  optionText: { flex: 1, fontSize: 15 },
  resultBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 14, padding: 16, marginTop: 16 },
  resultText: { fontSize: 18, fontWeight: '700' },
  pointsText: { fontSize: 18, fontWeight: '700' },
  submitBtn: { paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 16 },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  btnDisabled: { opacity: 0.5 },
  emptyCard: { borderRadius: 20, borderWidth: 1, padding: 32, alignItems: 'center', gap: 16 },
  emptyTitle: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
  lockedCard: { borderRadius: 20, borderWidth: 1, padding: 32, alignItems: 'center', gap: 16 },
  lockedTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  lockedDesc: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  lockedBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 14, marginTop: 8 },
  lockedBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
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
