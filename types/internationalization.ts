export interface Internationalization {
  /**
   * Map of language codes to their localized names
   * e.g. { "en": "English", "fr": "French" }
   */
  languages: Map<string, string>;

  /**
   * Map of translation keys to their localized values
   * e.g. { "greeting": "Hello", "farewell": "Goodbye" }
   */
  dictionary: Map<string, string>;
}

/**
 * Plain object representation of internationalization data
 * (used for loading from JSON files)
 */
export interface InternationalizationData {
  languages?: Record<string, string>;
  dictionary?: Record<string, string>;
}

/**
 * Country code mapping for locales
 */
export interface CountryCodeMapping {
  locale: string;
  code: string;
}
