// Translations for English and Greek

export const translations = {
  en: {
    appTitle: 'PlateFinder GR',
    appSubtitle: 'Find Greek car registration area',
    inputLabel: 'Enter License Plate:',
    placeholder: 'e.g., ABE-1234',
    searchButton: 'Search',
    clearButton: 'Clear',
    regionLabel: 'Region:',
    invalidFormat: 'Invalid format. Use: ABE-1234 or ABE 1234',
    emptyInput: 'Please enter a license plate',
    notFound: 'Region not found. Please check the plate number.',
    formatTitle: 'Format:',
    formatText: 'ABE-1234 (uppercase or lowercase)',
    formatExamples: 'Examples: YA-1234, ya-1234, ΥΑ-1234, υα-1234',
  },
  gr: {
    appTitle: 'PlateFinder GR',
    appSubtitle: 'Βρείτε την περιοχή εγγραφής του ελληνικού αυτοκινήτου',
    inputLabel: 'Εισαγάγετε Πινακίδα:',
    placeholder: 'π.χ., ABE-1234',
    searchButton: 'Αναζήτηση',
    clearButton: 'Εκκαθάριση',
    regionLabel: 'Περιοχή:',
    invalidFormat: 'Μη έγκυρη μορφή. Χρησιμοποιήστε: ABE-1234 ή ABE 1234',
    emptyInput: 'Παρακαλώ εισαγάγετε μια πινακίδα',
    notFound: 'Η περιοχή δεν βρέθηκε. Ελέγξτε τον αριθμό πινακίδας.',
    formatTitle: 'Μορφή:',
    formatText: 'ABE-1234 (κεφαλαία ή πεζά)',
    formatExamples: 'Παραδείγματα: YA-1234, ya-1234, ΥΑ-1234, υα-1234',
  },
};

export type Language = 'en' | 'gr';

export const getTranslation = (language: Language, key: keyof typeof translations.en): string => {
  return translations[language][key] || key;
};
