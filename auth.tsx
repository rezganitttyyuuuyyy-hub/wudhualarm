import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/lib/AuthContext';
import { COUNTRY_NAMES } from '@/lib/locations';
import { Moon, Mail, Lock, User, UserPlus, LogIn, Eye, EyeOff, Phone, Globe, Link, Search, ChevronDown, Check, X } from 'lucide-react-native';

export default function AuthScreen() {
  const { palette, t } = useApp();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [socialLink, setSocialLink] = useState('');
  const [tiktokLink, setTiktokLink] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [countryPickerOpen, setCountryPickerOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const filteredCountries = COUNTRY_NAMES.filter((c) => c.toLowerCase().includes(countrySearch.toLowerCase()));

  const handleSubmit = async () => {
    setError(null);
    if (!email.trim()) {
      setError(t('emailRequired'));
      return;
    }
    if (mode === 'signup' && !email.trim().includes('@')) {
      setError(t('invalidEmail'));
      return;
    }
    if (!password) {
      setError(t('passwordRequired'));
      return;
    }
    if (password.length < 6) {
      setError(t('passwordTooShort'));
      return;
    }
    if (mode === 'signup') {
      if (!fullName.trim()) {
        setError(t('fullNameRequired'));
        return;
      }
      if (!phoneNumber.trim()) {
        setError(t('phoneRequired'));
        return;
      }
      if (!country.trim()) {
        setError(t('countryRequired'));
        return;
      }
    }
    setLoading(true);
    const result = mode === 'signup'
      ? await signUp(email.trim(), password, displayName.trim() || fullName.trim(), {
          full_name: fullName.trim(),
          phone_number: phoneNumber.trim(),
          country: country.trim(),
          social_link: socialLink.trim() || undefined,
          tiktok_link: tiktokLink.trim() || undefined,
        })
      : await signIn(email.trim(), password);
    setLoading(false);
    if (result.error) {
      setError(result.error === 'emailExists' ? t('emailExists') : result.error);
    }
  };

  if (countryPickerOpen) {
    return (
      <View style={[styles.pickerFullScreen, { backgroundColor: palette.bg }]}>
        <View style={styles.pickerHeader}>
          <Text style={[styles.pickerTitle, { color: palette.text }]}>{t('country')}</Text>
          <TouchableOpacity
            onPress={() => { setCountryPickerOpen(false); setCountrySearch(''); }}
            style={[styles.pickerCloseBtn, { backgroundColor: palette.surface }]}
          >
            <X color={palette.text} size={20} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <View style={[styles.searchBox, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Search color={palette.textMuted} size={18} strokeWidth={2} />
          <TextInput
            style={[styles.searchInput, { color: palette.text }]}
            placeholder={t('searchCountry')}
            placeholderTextColor={palette.textMuted}
            value={countrySearch}
            onChangeText={setCountrySearch}
            autoFocus
          />
        </View>
        <ScrollView style={styles.pickerList} keyboardShouldPersistTaps="handled">
          {filteredCountries.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.pickerItem, { borderBottomColor: palette.border }]}
              onPress={() => {
                setCountry(c);
                setCountryPickerOpen(false);
                setCountrySearch('');
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.pickerItemText, { color: palette.text }]}>{c}</Text>
              {country === c && <Check color={palette.primary} size={20} strokeWidth={2.5} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={[styles.container, { backgroundColor: palette.bg }]} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={styles.hero}>
          <View style={styles.heroIconWrap}>
            <Moon color="#fff" size={36} strokeWidth={2} />
          </View>
          <Text style={styles.appName}>{t('appName')}</Text>
          <Text style={styles.tagline}>{t('tagline')}</Text>
        </LinearGradient>

        <View style={styles.body}>
          <View style={styles.tabsRow}>
            <TouchableOpacity
              onPress={() => { setMode('signup'); setError(null); }}
              style={[styles.tab, mode === 'signup' && { borderBottomColor: palette.primary, borderBottomWidth: 2 }]}
            >
              <Text style={[styles.tabText, { color: mode === 'signup' ? palette.primary : palette.textMuted }]}>{t('signUp')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setMode('login'); setError(null); }}
              style={[styles.tab, mode === 'login' && { borderBottomColor: palette.primary, borderBottomWidth: 2 }]}
            >
              <Text style={[styles.tabText, { color: mode === 'login' ? palette.primary : palette.textMuted }]}>{t('login')}</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.heading, { color: palette.text }]}>
            {mode === 'signup' ? t('createProfile') : t('welcomeBack')}
          </Text>

          {mode === 'signup' && (
            <>
              <InputField
                icon={<User color={palette.textMuted} size={20} strokeWidth={2} />}
                placeholder={t('fullName')}
                value={fullName}
                onChangeText={setFullName}
                palette={palette}
              />
              <InputField
                icon={<User color={palette.textMuted} size={20} strokeWidth={2} />}
                placeholder={t('displayName')}
                value={displayName}
                onChangeText={setDisplayName}
                palette={palette}
              />
            </>
          )}

          <InputField
            icon={<Mail color={palette.textMuted} size={20} strokeWidth={2} />}
            placeholder={t('email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            palette={palette}
          />

          {mode === 'signup' && (
            <InputField
              icon={<Phone color={palette.textMuted} size={20} strokeWidth={2} />}
              placeholder={t('phoneNumber')}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              palette={palette}
            />
          )}

          {mode === 'signup' && (
            <TouchableOpacity
              onPress={() => setCountryPickerOpen(true)}
              style={[styles.inputWrap, { backgroundColor: palette.surface, borderColor: palette.border }]}
              activeOpacity={0.7}
            >
              <Globe color={palette.textMuted} size={20} strokeWidth={2} />
              <Text
                style={[styles.input, { color: country ? palette.text : palette.textMuted }]}
                numberOfLines={1}
              >
                {country || t('country')}
              </Text>
              <ChevronDown color={palette.textMuted} size={20} strokeWidth={2} />
            </TouchableOpacity>
          )}

          {mode === 'signup' && (
            <InputField
              icon={<Link color={palette.textMuted} size={20} strokeWidth={2} />}
              placeholder={t('socialLinkPlaceholder')}
              value={socialLink}
              onChangeText={setSocialLink}
              keyboardType="url"
              autoCapitalize="none"
              palette={palette}
            />
          )}

          {mode === 'signup' && (
            <InputField
              icon={<Link color={palette.textMuted} size={20} strokeWidth={2} />}
              placeholder={t('tiktokPlaceholder')}
              value={tiktokLink}
              onChangeText={setTiktokLink}
              keyboardType="url"
              autoCapitalize="none"
              palette={palette}
            />
          )}

          <View style={[styles.inputWrap, { backgroundColor: palette.surface, borderColor: palette.border }]}>
            <Lock color={palette.textMuted} size={20} strokeWidth={2} />
            <TextInput
              style={[styles.input, { color: palette.text }]}
              placeholder={t('password')}
              placeholderTextColor={palette.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
              {showPassword ? <EyeOff color={palette.textMuted} size={20} strokeWidth={2} /> : <Eye color={palette.textMuted} size={20} strokeWidth={2} />}
            </TouchableOpacity>
          </View>

          {error && (
            <View style={[styles.errorBox, { backgroundColor: palette.error + '18' }]}>
              <Text style={[styles.errorText, { color: palette.error }]}>{error}</Text>
            </View>
          )}

          <TouchableOpacity onPress={handleSubmit} disabled={loading} activeOpacity={0.85}>
            <LinearGradient colors={[palette.gradientFrom, palette.gradientTo]} style={[styles.primaryBtn, loading && styles.btnDisabled]}>
              {mode === 'signup' ? <UserPlus color="#fff" size={20} strokeWidth={2} /> : <LogIn color="#fff" size={20} strokeWidth={2} />}
              <Text style={styles.primaryBtnText}>{loading ? '...' : mode === 'signup' ? t('createAccount') : t('login')}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.secureNote}>
            <Lock color={palette.textMuted} size={14} strokeWidth={2} />
            <Text style={[styles.secureNoteText, { color: palette.textMuted }]}>{t('accountSecured')}</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function InputField({ icon, placeholder, value, onChangeText, palette, keyboardType, autoCapitalize }: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  palette: ReturnType<typeof useApp>['palette'];
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'url';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) {
  return (
    <View style={[styles.inputWrap, { backgroundColor: palette.surface, borderColor: palette.border }]}>
      {icon}
      <TextInput
        style={[styles.input, { color: palette.text }]}
        placeholder={placeholder}
        placeholderTextColor={palette.textMuted}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize={autoCapitalize ?? 'sentences'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 40 },
  hero: { alignItems: 'center', paddingTop: 70, paddingBottom: 36, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  heroIconWrap: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  appName: { fontSize: 28, fontWeight: '700', color: '#fff' },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  body: { padding: 24, gap: 14 },
  tabsRow: { flexDirection: 'row', marginBottom: 8 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabText: { fontSize: 15, fontWeight: '600' },
  heading: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 4, height: 54 },
  input: { flex: 1, fontSize: 16, height: '100%' },
  errorBox: { borderRadius: 12, padding: 12, paddingHorizontal: 16 },
  errorText: { fontSize: 14, fontWeight: '500' },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 16, marginTop: 4 },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  btnDisabled: { opacity: 0.5 },
  secureNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12 },
  secureNoteText: { fontSize: 12 },
  pickerFullScreen: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  pickerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  pickerTitle: { fontSize: 22, fontWeight: '700' },
  pickerCloseBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 15 },
  pickerList: { flex: 1 },
  pickerItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1 },
  pickerItemText: { fontSize: 16, fontWeight: '500' },
});
