import React, { useState } from 'react';
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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { lookupPlateRegion, plateRegex } from './regions';
import { getTranslation, Language, TranslationKey } from './translations';
import { translateRegion } from './regionTranslations';
import GreekMap from './GreekMap';
import { Analytics } from './Analytics';

export default function App() {
  const [plate, setPlate] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: TranslationKey) => getTranslation(language, key);

  // Derived inline validation state — no extra useState needed
  const trimmed = plate.trim();
  const isValidFormat = plateRegex.test(trimmed);
  // Flag as invalid once the user has typed enough characters to evaluate (3+ chars)
  const showFormatError = trimmed.length >= 3 && !isValidFormat;
  const inputBorderColor = isValidFormat ? '#00cc66' : showFormatError ? '#ff3333' : '#0066ff';

  const lookup = (text: string) => {
    const region = lookupPlateRegion(text);
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

          {/* Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>{t('inputLabel')}</Text>
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
            {showFormatError && <Text style={styles.inputHint}>{t('invalidFormat')}</Text>}
          </View>

          {/* Buttons */}
          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={handleClear}
            accessibilityLabel={t('a11yClearButton')}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>{t('clearButton')}</Text>
          </TouchableOpacity>

          {/* Results */}
          {result && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>{t('regionLabel')}</Text>
              <Text style={styles.resultText}>{translateRegion(result, language)}</Text>
            </View>
          )}

          {/* Map */}
          <GreekMap region={result} language={language} />

          {/* Errors */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>{t('formatTitle')}</Text>
            <Text style={styles.infoText}>{t('formatText')}</Text>
            <Text style={[styles.infoText, { marginTop: 4 }]}>{t('formatExamples')}</Text>
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#0066ff',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    color: '#fff',
    backgroundColor: '#2a2a2a',
  },
  inputHint: {
    color: '#ff6666',
    fontSize: 12,
    marginTop: 6,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButton: {
    backgroundColor: '#666',
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  infoContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0066ff',
  },
  infoTitle: {
    color: '#0066ff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoText: {
    color: '#aaa',
    fontSize: 13,
  },
});
