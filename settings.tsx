import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useApp } from '@/lib/AppContext';
import { LANGUAGES } from '@/lib/i18n';
import type { AppLanguage, ThemeMode } from '@/lib/types';
import { Globe, Sun, Moon, Smartphone, Check, Info } from 'lucide-react-native';

export default function SettingsScreen() {
  const { palette, t, langSetting, setLangSetting, themeSetting, setThemeSetting, activeLang } = useApp();

  return (
    <ScrollView style={[styles.container, { backgroundColor: palette.bg }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: palette.text }]}>{t('settings')}</Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>{t('theme')}</Text>
        <View style={[styles.rowGroup, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <ThemeOption icon={<Sun color={palette.accent} size={20} strokeWidth={2} />} label={t('light')} active={themeSetting === 'light'} onPress={() => setThemeSetting('light')} palette={palette} />
          <Divider palette={palette} />
          <ThemeOption icon={<Moon color={palette.primary} size={20} strokeWidth={2} />} label={t('dark')} active={themeSetting === 'dark'} onPress={() => setThemeSetting('dark')} palette={palette} />
          <Divider palette={palette} />
          <ThemeOption icon={<Smartphone color={palette.textMuted} size={20} strokeWidth={2} />} label={t('system')} active={themeSetting === 'system'} onPress={() => setThemeSetting('system')} palette={palette} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>{t('language')}</Text>
        <View style={[styles.rowGroup, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <LangOption label={t('automatic')} active={langSetting === 'auto'} onPress={() => setLangSetting('auto')} palette={palette} />
          <Divider palette={palette} />
          {LANGUAGES.map((l) => (
            <View key={l.code}>
              <LangOption label={l.label} active={langSetting === l.code || (langSetting === 'auto' && activeLang === l.code)} onPress={() => setLangSetting(l.code as AppLanguage)} palette={palette} />
              {l.code !== LANGUAGES[LANGUAGES.length - 1].code && <Divider palette={palette} />}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>{t('about')}</Text>
        <View style={[styles.aboutCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
          <View style={[styles.aboutIcon, { backgroundColor: palette.primary + '22' }]}>
            <Info color={palette.primary} size={24} strokeWidth={2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.aboutTitle, { color: palette.text }]}>{t('appName')}</Text>
            <Text style={[styles.aboutDesc, { color: palette.textMuted }]}>{t('aboutDesc')}</Text>
            <Text style={[styles.version, { color: palette.textMuted }]}>v1.0.0</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function ThemeOption({ icon, label, active, onPress, palette }: { icon: React.ReactNode; label: string; active: boolean; onPress: () => void; palette: ReturnType<typeof useApp>['palette'] }) {
  return (
    <TouchableOpacity style={styles.optionRow} onPress={onPress} activeOpacity={0.7}>
      {icon}
      <Text style={[styles.optionLabel, { color: palette.text }]}>{label}</Text>
      {active && <Check color={palette.primary} size={20} strokeWidth={2.5} />}
    </TouchableOpacity>
  );
}

function LangOption({ label, active, onPress, palette }: { label: string; active: boolean; onPress: () => void; palette: ReturnType<typeof useApp>['palette'] }) {
  return (
    <TouchableOpacity style={styles.optionRow} onPress={onPress} activeOpacity={0.7}>
      <Globe color={active ? palette.primary : palette.textMuted} size={20} strokeWidth={2} />
      <Text style={[styles.optionLabel, { color: palette.text }]}>{label}</Text>
      {active && <Check color={palette.primary} size={20} strokeWidth={2.5} />}
    </TouchableOpacity>
  );
}

function Divider({ palette }: { palette: ReturnType<typeof useApp>['palette'] }) {
  return <View style={[styles.divider, { backgroundColor: palette.border }]} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 24 },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  rowGroup: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16, paddingHorizontal: 16 },
  optionLabel: { flex: 1, fontSize: 16 },
  divider: { height: 1, width: '100%' },
  aboutCard: { flexDirection: 'row', gap: 14, borderRadius: 16, borderWidth: 1, padding: 16 },
  aboutIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  aboutTitle: { fontSize: 18, fontWeight: '700' },
  aboutDesc: { fontSize: 13, marginTop: 6, lineHeight: 20 },
  version: { fontSize: 12, marginTop: 8, fontWeight: '500' },
});
