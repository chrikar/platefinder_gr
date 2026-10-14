import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Animated,
  Linking,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { lookupPlateRegion, normalizePlateInput, plateRegex } from './regions';
import { getTranslation, Language, TranslationKey } from './translations';
import { translateRegion } from './regionTranslations';
import GreekMap from './GreekMap';
import { Analytics } from './Analytics';
import * as Haptics from 'expo-haptics';

export default function App() {
  const [plate, setPlate] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const isWideLayout = useWindowDimensions().width >= 800;

  useEffect(() => {
    if (result || error) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }
  }, [result, error, fadeAnim]);

  const t = (key: TranslationKey) => getTranslation(language, key);

  // Derived inline validation state — no extra useState needed
  const normalizedPlate = normalizePlateInput(plate);
  const isValidFormat = plateRegex.test(normalizedPlate);
  // Flag as invalid once the user has typed enough characters to evaluate (3+ chars)
  const showFormatError = normalizedPlate.length >= 3 && !isValidFormat;
  const inputBorderColor = isValidFormat ? '#00cc66' : showFormatError ? '#ff3333' : '#0066ff';

  const lookup = (text: string) => {
    const region = lookupPlateRegion(text);
    if (region && region !== result) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setResult(region ?? null);
    setError(region ? null : t('notFound'));
  };

  const handleClear = () => {
    setPlate('');
    setResult(null);
    setError(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Language Toggle */}
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>{t('appTitle')}</Text>
              <Text style={styles.subtitle}>{t('appSubtitle')}</Text>
            </View>
            <TouchableOpacity
              style={styles.languageToggle}
              onPress={() => setLanguage(language === 'en' ? 'gr' : 'en')}
              accessibilityLabel={t('a11yLanguageToggle')}
              accessibilityRole="button"
            >
              <Text style={styles.languageToggleText}>{language === 'en' ? 'EL' : 'EN'}</Text>
            </TouchableOpacity>
          </View>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>{t('inputLabel')}</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { borderColor: inputBorderColor }]}
                placeholder={t('placeholder')}
                placeholderTextColor="#999"
                value={plate}
                accessibilityLabel={t('a11yPlateInput')}
                onChangeText={(text) => {
                  setPlate(text);
                  if (plateRegex.test(normalizePlateInput(text))) {
                    lookup(text);
                  } else {
                    setResult(null);
                    setError(null);
                  }
                }}
                autoCapitalize="characters"
              />
              {plate.length > 0 && (
                <TouchableOpacity
                  style={styles.clearAdornment}
                  onPress={handleClear}
                  accessibilityLabel={t('a11yClearButton')}
                  accessibilityRole="button"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.clearAdornmentText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
            {showFormatError && <Text style={styles.inputHint}>{t('invalidFormat')}</Text>}
          </View>

          {/* Results and map */}
          <View style={[styles.resultsLayout, isWideLayout && styles.resultsLayoutWide]}>
            {result && (
              <Animated.View
                style={[
                  styles.resultContainer,
                  isWideLayout && styles.resultContainerWide,
                  { opacity: fadeAnim },
                ]}
              >
                <Text style={styles.resultLabel}>{t('regionLabel')}</Text>
                <Text style={styles.resultText}>{translateRegion(result, language)}</Text>
              </Animated.View>
            )}

            {error && (
              <Animated.View
                style={[
                  styles.errorContainer,
                  isWideLayout && styles.errorContainerWide,
                  { opacity: fadeAnim },
                ]}
              >
                <Text style={styles.errorText}>{error}</Text>
              </Animated.View>
            )}

            <View style={[styles.mapColumn, isWideLayout && styles.mapColumnWide]}>
              <GreekMap region={result} language={language} />
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerDivider} />
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>© 2026 </Text>
              <TouchableOpacity onPress={() => Linking.openURL('https://github.com/chrikar')}>
                <Text style={styles.footerLink}>Christos Kargas</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {Platform.OS === 'web' ? <Analytics /> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 1040,
    alignSelf: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  header: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
  },
  languageToggle: {
    backgroundColor: '#0066ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  languageToggleText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  inputSection: {
    marginBottom: 24,
  },
  resultsLayout: {
    width: '100%',
  },
  resultsLayoutWide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  mapColumn: {
    width: '100%',
    alignItems: 'center',
  },
  mapColumnWide: {
    flex: 1.4,
    minWidth: 0,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#0066ff',
    borderRadius: 8,
    padding: 12,
    paddingRight: 40,
    fontSize: 18,
    color: '#fff',
    backgroundColor: '#2a2a2a',
  },
  clearAdornment: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  clearAdornmentText: {
    color: '#aaa',
    fontSize: 16,
  },
  inputHint: {
    color: '#ff6666',
    fontSize: 12,
    marginTop: 6,
  },
  resultContainer: {
    backgroundColor: '#0066ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  resultContainerWide: {
    flex: 1,
    marginBottom: 0,
  },
  resultLabel: {
    color: '#ddd',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#ff3333',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorContainerWide: {
    flex: 1,
    marginBottom: 0,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    paddingBottom: 8,
  },
  footerDivider: {
    width: 48,
    height: 1,
    backgroundColor: '#333',
    marginBottom: 16,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: '#555',
    fontSize: 12,
  },
  footerLink: {
    color: '#0066ff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
});
