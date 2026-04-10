// Translations for English and Greek

export const translations = {
  en: {
    appTitle: 'PlateFinder GR',
    appSubtitle: 'Find Greek car registration area',
    inputLabel: 'Enter License Plate:',
    placeholder: 'e.g., ABE or ABE-1234',
    regionLabel: 'Region:',
    invalidFormat: 'Use 3 letters, optionally followed by 4 digits: ABE or ABE-1234',
    notFound: 'Region not found. Please check the plate number.',
    a11yLanguageToggle: 'Switch to Greek',
    a11yClearButton: 'Clear input',
    a11yPlateInput: 'License plate input',
  },
  gr: {
    appTitle: 'PlateFinder GR',
    appSubtitle: 'Βρείτε την περιοχή εγγραφής ενός ελληνικού αυτοκινήτου',
    inputLabel: 'Εισαγάγετε Πινακίδα:',
    placeholder: 'π.χ., ABE ή ABE-1234',
    regionLabel: 'Περιοχή:',
    invalidFormat: 'Χρησιμοποιήστε 3 γράμματα, προαιρετικά με 4 ψηφία: ABE ή ABE-1234',
    notFound: 'Η περιοχή δεν βρέθηκε. Ελέγξτε τον αριθμό πινακίδας.',
    a11yLanguageToggle: 'Εναλλαγή στα Αγγλικά',
    a11yClearButton: 'Εκκαθάριση εισαγωγής',
    a11yPlateInput: 'Εισαγωγή πινακίδας',
  },
};

export type Language = 'en' | 'gr';
export type TranslationKey = keyof typeof translations.en;

export const getTranslation = (language: Language, key: TranslationKey): string => {
  return translations[language][key] || key;
};
