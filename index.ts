import type {
  Internationalization,
  InternationalizationData,
} from "@/types/internationalization";

/**
 * Default i18n header prefix for translation keys
 */
const DEFAULT_I18N_HEADER = "i18n";

/**
 * Default separator used in translation keys
 */
const DEFAULT_I18N_SEPARATOR = "::";

/**
 * Coverage report for a specific locale
 */
export interface CoverageReport {
  locale: string;
  missingKeys: string[];
  extraKeys: string[];
  coverage: number;
}

/**
 * ti18n class for handling internationalization
 */
export class Ti18n {
  private i18ns: Map<string, Internationalization>;
  private header: string;
  private separator: string;
  private coverageReports: Map<string, CoverageReport> = new Map();
  private currentLanguage: string | null = null;
  
  private _keys: string[] = [];

  /**
   * Create a new Ti18n instance
   * @param options Configuration options
   */
  constructor(
    options: {
      header?: string;
      separator?: string;
      keys?: string[];
    } = {}
  ) {
    this.i18ns = new Map();
    this.header = options.header || DEFAULT_I18N_HEADER;
    this.separator = options.separator || DEFAULT_I18N_SEPARATOR;

    if (options.keys) {
      this.loadKeys(options.keys);
    }
  }

  // Key Management
  
  /**
   * Get all defined keys
   * @returns Record of all defined keys
   */
  get keys(): Record<string, string> {
    const result: Record<string, string> = {};
    for (const key of this._keys) {
      result[key] = this.createKey(key);
    }
    return result;
  }

  /**
   * Create a translation key with the proper format
   * @param key The key part of the translation
   * @returns The formatted translation key
   */
  createKey(key: string): string {
    return `${this.header}${this.separator}${key}`;
  }

  /**
   * Add a translation key with the proper format
   * @param key The key part of the translation
   * @returns The formatted translation key
   */
  addKey(key: string): string {
    let formattedKey = key;
    if (!this.hasTranslationHeader(key)) {
      formattedKey = this.createKey(key);
    }

    if (this._keys.includes(formattedKey)) return formattedKey;

    this._keys.push(formattedKey);
    return formattedKey;
  }

  /**
   * Add translation keys for all specified keys
   * @returns Object mapping raw keys to formatted translation keys
   */
  addAllKeys(): Record<string, string> {
    const result: Record<string, string> = {};
    for (const key of this._keys) {
      result[key] = this.addKey(key);
    }
    return result;
  }

  // Language Management

  /**
   * Get the current global language
   * @returns The current language code or null if not set
   */
  getLanguage(): string | null {
    return this.currentLanguage;
  }

  /**
   * Set the global language for translations
   * @param locale The locale code to set as global
   * @throws Error if the locale is not loaded
   */
  setLanguage(locale: string | null) {
    if (locale !== null && !this.hasLocale(locale)) {
      throw new Error(`Locale "${locale}" is not loaded`);
    }
    this.currentLanguage = locale;
  }

  // Loading and Resource Management

  /**
   * Load keys from an array
   * @param keys Array of translation keys
   */
  loadKeys(keys: string[]): void {
    this._keys = [...keys]; // Create a copy to avoid external modifications

    // Re-validate all loaded locales against the new keys
    for (const locale of this.getLocales()) {
      this.validateLocale(locale);
    }
  }

  /**
   * Load internationalization data for a specific locale
   * @param locale The locale code to register the data for
   * @param data The internationalization data
   */
  loadLocale(locale: string, data: InternationalizationData): void {
    if (!data) {
      console.warn(`No data provided for locale "${locale}"`);
      data = {};
    }

    // Ensure required fields exist
    if (!data.languages) data.languages = {};
    if (!data.dictionary) data.dictionary = {};

    const i18n: Internationalization = {
      languages: new Map<string, string>(Object.entries(data.languages)),
      dictionary: new Map<string, string>(Object.entries(data.dictionary)),
    };

    this.i18ns.set(locale, i18n);

    // Validate against keys if available
    if (this._keys.length > 0) {
      const report = this.validateLocale(locale);
      if (report && report.missingKeys.length > 0) {
        console.warn(
          `Locale "${locale}" is missing ${
            report.missingKeys.length
          } translations (${(report.coverage * 100).toFixed(1)}% coverage).`
        );
      }
    }
  }

  /**
   * Load multiple internationalization resources at once
   * @param resources Object mapping locale codes to their data
   */
  loadLocales(resources: Record<string, InternationalizationData>): void {
    for (const [locale, data] of Object.entries(resources)) {
      this.loadLocale(locale, data);
    }
  }

  // Validation and Coverage

  /**
   * Validate a locale against the defined keys
   * @param locale The locale to validate
   * @returns Coverage report for the locale
   */
  validateLocale(locale: string): CoverageReport | null {
    if (this._keys.length === 0 || !this.hasLocale(locale)) return null;

    const i18n = this.i18ns.get(locale)!;
    const dictionaryKeys = Array.from(i18n.dictionary.keys());

    // Find missing and extra keys
    const missingKeys = this._keys.filter(
      (key) => !dictionaryKeys.includes(key)
    );
    const extraKeys = dictionaryKeys.filter((key) => !this._keys.includes(key));

    // Calculate coverage
    const totalKeys = this._keys.length;
    const translatedKeys = totalKeys - missingKeys.length;
    const coverage = totalKeys > 0 ? translatedKeys / totalKeys : 1;

    const report: CoverageReport = {
      locale,
      missingKeys,
      extraKeys,
      coverage,
    };

    this.coverageReports.set(locale, report);
    return report;
  }

  /**
   * Get coverage report for a locale
   * @param locale The locale to get the report for
   * @returns The coverage report
   */
  getCoverageReport(locale: string): CoverageReport | null {
    return this.coverageReports.get(locale) || null;
  }

  /**
   * Get coverage reports for all locales
   * @returns Map of locale to coverage report
   */
  getAllCoverageReports(): Map<string, CoverageReport> {
    return new Map(this.coverageReports);
  }

  // Utility Methods

  /**
   * Get the list of available locales
   * @returns Array of locale codes
   */
  getLocales(): Array<string> {
    return Array.from(this.i18ns.keys());
  }

  /**
   * Check if a locale exists
   * @param locale The locale code to check
   * @returns True if the locale exists
   */
  hasLocale(locale: string): boolean {
    return this.i18ns.has(locale);
  }

  /**
   * Check if a string is a translation key (starts with the header)
   * @param key The string to check
   * @returns True if the string is a translation key
   */
  hasTranslationHeader(key: string): boolean {
    return key.startsWith(this.header);
  }

  // Translation Methods

  /**
   * Translate a key to the specified locale
   * @param key The translation key (format: "i18n::key")
   * @param locale The target locale
   * @param args Optional arguments to replace placeholders
   * @returns The translated string
   */
  translateTo(
    key: string,
    locale: string,
    args?: Map<string, string> | Record<string, string>
  ): string {
    // If this is not a translation key, return it unchanged
    if (!this.hasTranslationHeader(key)) return key;

    const values = key.split(this.separator);
    if (values.length !== 2) return key; // Wrongly formatted key

    const i18n = this.i18ns.get(locale);
    if (!i18n)
      return `${key}${this.separator}${locale}${this.separator}error-missing-locale`;

    const i18nKey = values[1];
    let value = i18n.dictionary.get(i18nKey);
    if (!value)
      return `${key}${this.separator}${locale}${this.separator}error-missing-key`;

    // Replace placeholders with values
    if (args) {
      if (args instanceof Map) {
        args.forEach((v, k) => {
          value = value!.replace(new RegExp(`\\{${k}\\}`, "g"), v);
        });
      } else {
        Object.entries(args).forEach(([k, v]) => {
          value = value!.replace(new RegExp(`\\{${k}\\}`, "g"), v);
        });
      }
    }

    return value;
  }

  /**
   * Translate a key using the global language
   * @param key The translation key (format: "i18n::key")
   * @param args Optional arguments to replace placeholders
   * @returns The translated string
   * @throws Error if no global language is set
   */
  translate(
    key: string,
    args?: Map<string, string> | Record<string, string>
  ): string {
    if (!this.currentLanguage) {
      throw new Error('No global language set. Use currentLanguage setter first or use translateTo() instead.');
    }
    return this.translateTo(key, this.currentLanguage, args);
  }

  /**
   * Get the localized name of a language
   * @param code The language code to get the name for
   * @param locale The locale to translate into
   * @returns The localized language name
   */
  getLanguageName(code: string, locale: string): string {
    const i18n = this.i18ns.get(locale);
    if (!i18n) return `Internationalization '${locale}' not found`;

    const value = i18n.languages.get(code);
    if (!value) return code;

    return value;
  }
}

// Export a default instance for easy use
export const ti18n = new Ti18n();

// Export types
export type {
  Internationalization,
  InternationalizationData,
} from "@/types/internationalization";
