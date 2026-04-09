// Greek license plate region mapping
// First 2-3 letters of Greek plate indicate the prefecture/region

export const greekRegions = {
  // Athens & Attica
  'AAN': 'Athens (Attica)',
  'AAP': 'Athens (Attica)',
  'ABA': 'Athens (Attica)',
  'ABP': 'Athens (Attica)',
  'ATA': 'Athens (Attica)',
  'ATP': 'Athens (Attica)',
  'AVA': 'Athens (Attica)',
  'AVP': 'Athens (Attica)',
  'AMA': 'Athens (Attica)',
  'AMP': 'Athens (Attica)',
  'AEA': 'Athens (Attica)',
  'AEP': 'Athens (Attica)',
  'AZA': 'Athens (Attica)',
  'AZP': 'Athens (Attica)',
  'AIA': 'Athens (Attica)',
  'AIP': 'Athens (Attica)',
  'AKA': 'Athens (Attica)',
  'AKP': 'Athens (Attica)',
  'AΛA': 'Athens (Attica)',
  'AΛP': 'Athens (Attica)',
  'ANA': 'Athens (Attica)',
  'ANP': 'Athens (Attica)',
  'AΞA': 'Athens (Attica)',
  'AΞP': 'Athens (Attica)',
  'AOA': 'Athens (Attica)',
  'AOP': 'Athens (Attica)',
  'APA': 'Athens (Attica)',
  'APP': 'Athens (Attica)',
  'APA': 'Athens (Attica)',
  'ARA': 'Athens (Attica)',
  'ARP': 'Athens (Attica)',
  'ASA': 'Athens (Attica)',
  'ASP': 'Athens (Attica)',
  'ATA': 'Athens (Attica)',
  'ATP': 'Athens (Attica)',
  'AUA': 'Athens (Attica)',
  'AUP': 'Athens (Attica)',
  'AFA': 'Athens (Attica)',
  'AFP': 'Athens (Attica)',
  'AXA': 'Athens (Attica)',
  'AXP': 'Athens (Attica)',
  'AYA': 'Athens (Attica)',
  'AYP': 'Athens (Attica)',
  'AOA': 'Athens (Attica)',
  // Thessaloniki
  'BAN': 'Thessaloniki',
  'BAP': 'Thessaloniki',
  'BBA': 'Thessaloniki',
  'BBP': 'Thessaloniki',
  'BEA': 'Thessaloniki',
  'BEP': 'Thessaloniki',
  // Larissa
  'BZA': 'Larissa',
  'BZP': 'Larissa',
  // Volos
  'BIA': 'Volos',
  'BIP': 'Volos',
  // Patras
  'BKA': 'Patras',
  'BKP': 'Patras',
  // Heraklion
  'BΛA': 'Heraklion (Crete)',
  'BΛP': 'Heraklion (Crete)',
  // Rethymno
  'BNA': 'Rethymno (Crete)',
  'BNP': 'Rethymno (Crete)',
  // Chania
  'BΞA': 'Chania (Crete)',
  'BΞP': 'Chania (Crete)',
  // Ioannina
  'BOA': 'Ioannina',
  'BOP': 'Ioannina',
  // Kalamata
  'BPA': 'Kalamata',
  'BPP': 'Kalamata',
  // Corinth
  'BRA': 'Corinth',
  'BRP': 'Corinth',
  // Tripoli
  'BSA': 'Tripoli',
  'BSP': 'Tripoli',
  // Pyrgos
  'BTA': 'Pyrgos',
  'BTP': 'Pyrgos',
  // Agrinio
  'BUA': 'Agrinio',
  'BUP': 'Agrinio',
  // Mytilene
  'BFA': 'Mytilene (Lesbos)',
  'BFP': 'Mytilene (Lesbos)',
  // Rhodes
  'BXA': 'Rhodes',
  'BXP': 'Rhodes',
  // Chios
  'BYA': 'Chios',
  'BYP': 'Chios',
  // Samos
  'BOA': 'Samos',
  // Kos
  'BPA': 'Kos',
};

export const lookupPlateRegion = (plate: string): string | null => {
  // Remove special characters and convert to uppercase
  const cleanPlate = plate.replace(/[-\s]/g, '').toUpperCase();

  // Extract first 2-3 letters (the region code)
  const regionCode = cleanPlate.substring(0, 3);

  // Try 3-letter code first, then 2-letter
  if (greekRegions[regionCode]) {
    return greekRegions[regionCode];
  }

  const twoLetterCode = cleanPlate.substring(0, 2);
  if (greekRegions[twoLetterCode]) {
    return greekRegions[twoLetterCode];
  }

  return null;
};
