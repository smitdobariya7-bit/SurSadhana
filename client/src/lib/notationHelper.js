/**
 * Note Notation Converter
 * Converts between English and Hindi classical music notation
 * Supports display modes: english, hindi, both
 */

// Mapping of English notes to Hindi notation
const englishToHindiMap = {
  'S': 'सा',
  'R': 'रे',
  'r': 'रे (कोमल)',
  'G': 'ग',
  'g': 'ग (कोमल)',
  'M': 'म',
  'M#': 'तीव्र म',
  'P': 'प',
  'D': 'ध',
  'd': 'ध (कोमल)',
  'N': 'नि',
  'n': 'नि (कोमल)',
};

/**
 * Convert a single note to specified notation mode
 * @param {string} note - English note (e.g., 'S', 'R', 'M#', 'g')
 * @param {string} mode - Display mode: 'english', 'hindi', 'both'
 * @returns {string} Converted notation
 */
export const convertNote = (note, mode = 'both') => {
  const hindi = englishToHindiMap[note] || note;

  switch (mode) {
    case 'english':
      return note;
    case 'hindi':
      return hindi;
    case 'both':
    default:
      return `${note}(${hindi})`;
  }
};

/**
 * Convert a full notation string (e.g., "S R G M# P D N S")
 * @param {string} notation - Space or comma-separated notes
 * @param {string} mode - Display mode: 'english', 'hindi', 'both'
 * @returns {string} Converted notation with proper spacing
 */
export const convertNotationString = (notation, mode = 'both') => {
  if (!notation) return '';

  // Split by spaces and commas, preserve commas as delimiters
  const parts = notation.split(/(\s+|,)/);

  return parts
    .map(part => {
      // Skip whitespace and commas
      if (!part || /^\s+$/.test(part) || part === ',') {
        return part;
      }
      // Convert note
      return convertNote(part, mode);
    })
    .join('');
};

/**
 * Batch convert all raag notation fields
 * @param {object} raag - Raag object with aaroh, avaroh, pakad fields
 * @param {string} mode - Display mode
 * @returns {object} Raag object with converted notations
 */
export const convertRaagNotations = (raag, mode = 'both') => {
  return {
    ...raag,
    aaroh: convertNotationString(raag.aaroh, mode),
    avaroh: convertNotationString(raag.avaroh, mode),
    pakad: convertNotationString(raag.pakad, mode),
  };
};

/**
 * Get all supported notes
 * @returns {array} Array of supported English notes
 */
export const getSupportedNotes = () => {
  return Object.keys(englishToHindiMap);
};

/**
 * Get Hindi name for a single note
 * @param {string} englishNote - English note name
 * @returns {string} Hindi notation
 */
export const getHindiName = (englishNote) => {
  return englishToHindiMap[englishNote] || englishNote;
};
