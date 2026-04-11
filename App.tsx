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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { lookupPlateRegion, plateRegex } from './regions';
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

  useEffect(() => {
    if (result || error) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [result, error, fadeAnim]);

  const t = (key: TranslationKey) => getTranslation(language, key);

  // Derived inline validation state — no extra useState needed
  const trimmed = plate.trim();
  const isValidFormat = plateRegex.test(trimmed);
  // Flag as invalid once the user has typed enough characters to evaluate (3+ chars)
  const showFormatError = trimmed.length >= 3 && !isValidFormat;
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
      <StatusBar style="light" backgroundColor="#1a1a1a" translucent />
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

          {/* Map */}
          <GreekMap region={result} language={language} />

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
                  if (plateRegex.test(text.trim())) {
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

          {/* Results */}
          {result && (
            <Animated.View style={[styles.resultContainer, { opacity: fadeAnim }]}>
              <Text style={styles.resultLabel}>{t('regionLabel')}</Text>
              <Text style={styles.resultText}>{translateRegion(result, language)}</Text>
            </Animated.View>
          )}

          {/* Errors */}
          {error && (
            <Animated.View style={[styles.errorContainer, { opacity: fadeAnim }]}>
              <Text style={styles.errorText}>{error}</Text>
            </Animated.View>
          )}
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
  errorText: {
    color: '#fff',
    fontSize: 14,
  },
});
