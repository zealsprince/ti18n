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
  private i18ns = new Map<string, Internationalization>();
  private header: string;
  private separator: string;
  private coverageReports = new Map<string, CoverageReport>();
  private currentLanguage: string | null = null;
  private _keys: string[] = [];

  /**
   * Create a new Ti18n instance
   * @param options Configuration options
   */
  constructor({
    header = DEFAULT_I18N_HEADER,
    separator = DEFAULT_I18N_SEPARATOR,
    keys,
  }: {
    header?: string;
    separator?: string;
    keys?: string[];
  } = {}) {
    this.header = header;
    this.separator = separator;
    if (keys?.length) this._keys = keys;
  }

  // Key Management
  
  /**
   * Get all defined keys
   * @returns Record of all defined keys
   */
  get keys(): Record<string, string> {
    return Object.fromEntries(this._keys.map(k => [k, this.createKey(k)]));
  }

  /**
   * Create a translation key with the proper format
   * @param key The key part of the translation
   * @returns The formatted translation key
   */
  private createKey(key: string): string {
    return this.header + this.separator + key;
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
  setLanguage(locale: string | null): void {
    if (locale !== null && !this.i18ns.has(locale)) {
      throw new Error(`Locale "${locale}" is not loaded`);
    }
    this.currentLanguage = locale;
  }

  // Loading and Resource Management

  /**
   * Load a translation key with the proper format
   * @param key The key part of the translation
   * @returns The formatted translation key
   */
  loadKey(key: string): string {
    const formattedKey = this.hasTranslationHeader(key) ? key : this.createKey(key);
    if (!this._keys.includes(formattedKey)) {
      this._keys.push(formattedKey);
    }
    return formattedKey;
  }

  /**
   * Load keys from an array
   * @param keys Array of translation keys
   */
  loadKeys(keys: string[]): void {
    keys.forEach(key => this.loadKey(key));
  }

  /**
   * Load internationalization data for a specific locale
   * @param locale The locale code to register the data for
   * @param data The internationalization data
   */
  loadLocale(locale: string, data: InternationalizationData = {}): void {
    const i18n: Internationalization = {
      languages: new Map(Object.entries(data.languages || {})),
      dictionary: new Map(Object.entries(data.dictionary || {}))
    };
    this.i18ns.set(locale, i18n);
    
    if (this._keys.length) {
      const report = this.validateLocale(locale);
      if (report?.missingKeys.length) {
        console.warn(
          `Locale "${locale}" missing ${report.missingKeys.length} translations (${(report.coverage * 100).toFixed(1)}% coverage)`
        );
      }
    }
  }

  /**
   * Load multiple internationalization resources at once
   * @param resources Object mapping locale codes to their data
   */
  loadLocales(resources: Record<string, InternationalizationData>): void {
    Object.entries(resources).forEach(([locale, data]) => this.loadLocale(locale, data));
  }

  // Validation and Coverage

  /**
   * Validate a locale against the defined keys
   * @param locale The locale to validate
   * @returns Coverage report for the locale
   */
  validateLocale(locale: string): CoverageReport | null {
    const i18n = this.i18ns.get(locale);
    if (!this._keys.length || !i18n) return null;

    const dictionaryKeys = new Set(i18n.dictionary.keys());
    const keysSet = new Set(this._keys);

    // Find missing and extra keys
    const missingKeys = this._keys.filter(k => !dictionaryKeys.has(k));
    const extraKeys = Array.from(dictionaryKeys).filter(k => !keysSet.has(k));

    // Calculate coverage
    const report: CoverageReport = {
      locale,
      missingKeys,
      extraKeys,
      coverage: (this._keys.length - missingKeys.length) / this._keys.length || 1
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
  getLocales(): string[] {
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

    const [header, translationKey] = key.split(this.separator);
    if (!translationKey) return key;

    const i18n = this.i18ns.get(locale);
    if (!i18n) return `${key}${this.separator}${locale}${this.separator}error-missing-locale`;

    let value = i18n.dictionary.get(translationKey);
    if (!value) return `${key}${this.separator}${locale}${this.separator}error-missing-key`;

    // Replace placeholders with values
    if (args) {
      const entries = args instanceof Map ? args.entries() : Object.entries(args);
      for (const [k, v] of entries) {
        value = value.replaceAll(`{${k}}`, v);
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
      throw new Error('No global language set. Use setLanguage first or use translateTo instead.');
    }
    return this.translateTo(key, this.currentLanguage, args);
  }

  /**
   * Get the localized name of a language
   * @param locale The locale to get the name for
   * @param localeTo The locale to translate into
   * @returns The localized language name
   */
  getLanguageName(locale: string, localeTo: string): string {
    const i18n = this.i18ns.get(localeTo);
    return i18n?.languages.get(locale) || locale;
  }
}

// Export a default instance for easy use
export const ti18n = new Ti18n();

// Export types
export type {
  Internationalization,
  InternationalizationData,
} from "@/types/internationalization";
