// Translations for English and Greek

export const translations = {
  en: {
    appTitle: 'PlateFinder GR',
    appSubtitle: 'Find Greek car registration area',
    inputLabel: 'Enter License Plate:',
    placeholder: 'e.g., ABE or ABE-1234',
    emptyStateTitle: 'Find where a plate is from',
    emptyStateBody: 'Enter a plate or try an example:',
    platePrefixLabel: 'Plate prefix',
    regionLabel: 'Region:',
    mapCaption:
      'Historical boundaries (Eurostat/GISCO, 2010). Marker-only locations are approximate.',
    mapDescription: 'Map of Greece showing historical prefecture boundaries.',
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
    emptyStateTitle: 'Βρείτε από πού είναι μια πινακίδα',
    emptyStateBody: 'Εισαγάγετε μια πινακίδα ή δοκιμάστε ένα παράδειγμα:',
    platePrefixLabel: 'Κωδικός πινακίδας',
    regionLabel: 'Περιοχή:',
    mapCaption:
      'Ιστορικά όρια (Eurostat/GISCO, 2010). Οι περιοχές με δείκτη είναι κατά προσέγγιση.',
    mapDescription: 'Χάρτης της Ελλάδας με ιστορικά όρια νομών.',
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
