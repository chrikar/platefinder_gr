import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { lookupPlateRegion } from './regions';

export default function App() {
  const [plate, setPlate] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setError(null);
    setResult(null);

    if (!plate.trim()) {
      setError('Please enter a license plate');
      return;
    }

    // Validate Greek plate format (roughly: 3 letters + 4 numbers)
    const plateRegex = /^[A-Z]{3}[-\s]?\d{4}$/i;
    if (!plateRegex.test(plate)) {
      setError('Invalid format. Use: ABC-1234 or ABC 1234');
      return;
    }

    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const region = lookupPlateRegion(plate);
      setLoading(false);

      if (region) {
        setResult(region);
      } else {
        setError('Region not found. Please check the plate number.');
      }
    }, 500);
  };

  const handleClear = () => {
    setPlate('');
    setResult(null);
    setError(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>PlateFinder GR</Text>
            <Text style={styles.subtitle}>Find Greek car registration area</Text>
          </View>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Enter License Plate:</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., ABC-1234"
              placeholderTextColor="#999"
              value={plate}
              onChangeText={setPlate}
              autoCapitalize="characters"
              editable={!loading}
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.searchButton]}
              onPress={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Search</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.clearButton]}
              onPress={handleClear}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
          </View>

          {/* Results */}
          {result && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>Region:</Text>
              <Text style={styles.resultText}>{result}</Text>
            </View>
          )}

          {/* Errors */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Format:</Text>
            <Text style={styles.infoText}>Greek plates: ABC-1234 (3 letters + 4 digits)</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButton: {
    backgroundColor: '#0066ff',
  },
  clearButton: {
    backgroundColor: '#666',
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
