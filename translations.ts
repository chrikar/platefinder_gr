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
    formatHint: 'Format: 3 letters, optionally followed by 4 digits (e.g. ABE-1234)',
    mapBoundaryLegend: 'Selected boundary',
    mapMarkerLegend: 'Approximate location',
    mapDetailTitle: 'Island detail',
    mapDetailCaption: 'Zoomed view for visibility; it does not indicate more precise boundaries.',
    regionLabel: 'Region:',
    mapCaption:
      'Historical boundaries (Eurostat/GISCO, 2010). Marker-only locations are approximate.',
    mapDescription: 'Map of Greece showing historical prefecture boundaries.',
    invalidFormat: 'Use 3 letters, optionally followed by 4 digits: ABE or ABE-1234',
    notFound: 'No region is mapped to this prefix. Check the first 2 letters or try another plate.',
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
    formatHint: 'Μορφή: 3 γράμματα, προαιρετικά ακολουθούμενα από 4 ψηφία (π.χ. ABE-1234)',
    mapBoundaryLegend: 'Επιλεγμένα όρια',
    mapMarkerLegend: 'Κατά προσέγγιση τοποθεσία',
    mapDetailTitle: 'Λεπτομέρεια νησιού',
    mapDetailCaption: 'Μεγεθυμένη προβολή για καλύτερη ορατότητα· δεν υποδηλώνει ακριβέστερα όρια.',
    regionLabel: 'Περιοχή:',
    mapCaption:
      'Ιστορικά όρια (Eurostat/GISCO, 2010). Οι περιοχές με δείκτη είναι κατά προσέγγιση.',
    mapDescription: 'Χάρτης της Ελλάδας με ιστορικά όρια νομών.',
    invalidFormat: 'Χρησιμοποιήστε 3 γράμματα, προαιρετικά με 4 ψηφία: ABE ή ABE-1234',
    notFound:
      'Δεν υπάρχει αντιστοιχισμένη περιοχή για αυτόν τον κωδικό. Ελέγξτε τα 2 πρώτα γράμματα ή δοκιμάστε άλλη πινακίδα.',
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
