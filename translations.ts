// Translations for English and Greek

export const translations = {
  en: {
    appTitle: 'PlateFinder GR',
    appSubtitle: 'Find Greek car registration area',
    inputLabel: 'Enter License Plate:',
    placeholder: 'e.g., ABE or ABE-1234',
    searchButton: 'Search',
    clearButton: 'Clear',
    regionLabel: 'Region:',
    invalidFormat: 'Use 3 letters, optionally followed by 4 digits: ABE or ABE-1234',
    emptyInput: 'Please enter a license plate',
    notFound: 'Region not found. Please check the plate number.',
    formatTitle: 'Format:',
    formatText: 'ABE or ABE-1234 (uppercase or lowercase)',
    formatExamples: 'Examples: YA, YAB, YAB-1234, ΥΑΒ-1234',
    a11yLanguageToggle: 'Switch to Greek',
    a11ySearchButton: 'Search for plate region',
    a11yClearButton: 'Clear input',
    a11yPlateInput: 'License plate input',
  },
  gr: {
    appTitle: 'PlateFinder GR',
    appSubtitle: 'Βρείτε την περιοχή εγγραφής ενός ελληνικού αυτοκινήτου',
    inputLabel: 'Εισαγάγετε Πινακίδα:',
    placeholder: 'π.χ., ABE ή ABE-1234',
    searchButton: 'Αναζήτηση',
    clearButton: 'Εκκαθάριση',
    regionLabel: 'Περιοχή:',
    invalidFormat: 'Χρησιμοποιήστε 3 γράμματα, προαιρετικά με 4 ψηφία: ABE ή ABE-1234',
    emptyInput: 'Παρακαλώ εισαγάγετε μια πινακίδα',
    notFound: 'Η περιοχή δεν βρέθηκε. Ελέγξτε τον αριθμό πινακίδας.',
    formatTitle: 'Μορφή:',
    formatText: 'ABE ή ABE-1234 (κεφαλαία ή πεζά)',
    formatExamples: 'Παραδείγματα: ΥΑ, ΥΑΒ, ΥΑΒ-1234',
    a11yLanguageToggle: 'Εναλλαγή στα Αγγλικά',
    a11ySearchButton: 'Αναζήτηση περιοχής πινακίδας',
    a11yClearButton: 'Εκκαθάριση εισαγωγής',
    a11yPlateInput: 'Εισαγωγή πινακίδας',
  },
};

export type Language = 'en' | 'gr';
export type TranslationKey = keyof typeof translations.en;

export const getTranslation = (language: Language, key: TranslationKey): string => {
  return translations[language][key] || key;
};
