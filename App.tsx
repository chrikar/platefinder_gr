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
  const inputBorderColor = isValidFormat ? '#36b89a' : showFormatError ? '#e87979' : '#3b82f6';

  const lookup = (text: string) => {
    const region = lookupPlateRegion(text);
    if (region && region !== result) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setResult(region ?? null);
    setError(region ? null : t('notFound'));
  };

  const handlePlateChange = (text: string) => {
    setPlate(text);
    if (plateRegex.test(normalizePlateInput(text))) {
      lookup(text);
    } else {
      setResult(null);
      setError(null);
    }
  };

  const handleClear = () => {
    setPlate('');
    setResult(null);
    setError(null);
  };

  const examplePlates = ['YAB-1234', 'NAB-1234', 'YIB-1234'];

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

          <View style={styles.inputSection}>
            <Text style={styles.label}>{t('inputLabel')}</Text>
            <View style={[styles.inputRow, { borderColor: inputBorderColor }]}>
              <View style={styles.plateCountry}>
                <Text style={styles.plateCountryText}>GR</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder={t('placeholder')}
                placeholderTextColor="#8290a3"
                value={plate}
                accessibilityLabel={t('a11yPlateInput')}
                onChangeText={handlePlateChange}
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
            <Text style={[styles.inputHint, showFormatError && styles.inputHintError]}>
              {showFormatError ? t('invalidFormat') : t('formatHint')}
            </Text>
          </View>

          <View style={[styles.resultsLayout, isWideLayout && styles.resultsLayoutWide]}>
            <View style={[styles.resultColumn, isWideLayout && styles.resultColumnWide]}>
              {!result && !error && plate.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateTitle}>{t('emptyStateTitle')}</Text>
                  <Text style={styles.emptyStateBody}>{t('emptyStateBody')}</Text>
                  <View style={styles.exampleRow}>
                    {examplePlates.map((example) => (
                      <TouchableOpacity
                        key={example}
                        style={styles.exampleButton}
                        onPress={() => handlePlateChange(example)}
                        accessibilityRole="button"
                        accessibilityLabel={`${t('a11yPlateInput')}: ${example}`}
                      >
                        <Text style={styles.exampleText}>{example}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

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
                  <View style={styles.prefixRow}>
                    <Text style={styles.prefixLabel}>{t('platePrefixLabel')}</Text>
                    <View style={styles.prefixBadge}>
                      <Text style={styles.prefixCountry}>GR</Text>
                      <Text style={styles.prefixText}>
                        {normalizedPlate.slice(0, 3).toUpperCase()}
                      </Text>
                    </View>
                  </View>
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
            </View>

            <View style={[styles.mapColumn, isWideLayout && styles.mapColumnWide]}>
              <GreekMap region={result} language={language} />
            </View>
          </View>

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
    backgroundColor: '#0b1220',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 1040,
    alignSelf: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  header: {
    flex: 1,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#f4f7fb',
    marginBottom: 8,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 14,
    color: '#a5b1c2',
    lineHeight: 21,
  },
  languageToggle: {
    backgroundColor: '#17243a',
    borderWidth: 1,
    borderColor: '#2b3c57',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    marginTop: 2,
  },
  languageToggleText: {
    color: '#b9d4ff',
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
    alignItems: 'stretch',
    gap: 24,
  },
  resultColumn: {
    width: '100%',
  },
  resultColumnWide: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  mapColumn: {
    width: '100%',
    alignItems: 'center',
  },
  mapColumnWide: {
    flex: 1,
    minWidth: 0,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 58,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: '#f5f7fa',
    overflow: 'hidden',
  },
  plateCountry: {
    width: 48,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1d4f91',
    borderRightWidth: 1,
    borderRightColor: '#d6dfeb',
  },
  plateCountryText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d2dbea',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 44,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
    color: '#172235',
    backgroundColor: '#f5f7fa',
  },
  clearAdornment: {
    position: 'absolute',
    right: 10,
    padding: 4,
  },
  clearAdornmentText: {
    color: '#66758b',
    fontSize: 16,
  },
  inputHint: {
    color: '#9eacc0',
    fontSize: 12,
    marginTop: 8,
  },
  inputHintError: {
    color: '#f19a9a',
  },
  emptyState: {
    backgroundColor: '#111e30',
    borderColor: '#263b56',
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  emptyStateTitle: {
    color: '#f4f7fb',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 5,
  },
  emptyStateBody: {
    color: '#a5b1c2',
    fontSize: 13,
    lineHeight: 19,
  },
  exampleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 13,
  },
  exampleButton: {
    backgroundColor: '#192a40',
    borderWidth: 1,
    borderColor: '#344b68',
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  exampleText: {
    color: '#c8dcfa',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  resultContainer: {
    backgroundColor: '#14243a',
    borderColor: '#2b4a70',
    borderWidth: 1,
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
  },
  resultContainerWide: {
    marginBottom: 0,
  },
  resultLabel: {
    color: '#8ebaff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  resultText: {
    color: '#f4f7fb',
    fontSize: 22,
    fontWeight: 'bold',
  },
  prefixRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 14,
  },
  prefixLabel: {
    color: '#a5b1c2',
    fontSize: 12,
  },
  prefixBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#f5f7fa',
    borderRadius: 6,
  },
  prefixCountry: {
    alignSelf: 'stretch',
    textAlignVertical: 'center',
    backgroundColor: '#1d4f91',
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },
  prefixText: {
    color: '#172235',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  errorContainer: {
    backgroundColor: '#321f2a',
    borderColor: '#68404a',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  errorContainerWide: {
    marginBottom: 0,
  },
  errorText: {
    color: '#ffd2d2',
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
    backgroundColor: '#28364a',
    marginBottom: 16,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: '#718096',
    fontSize: 12,
  },
  footerLink: {
    color: '#8ebaff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
});
