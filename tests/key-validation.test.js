const { Ti18n } = require('../dist/index.cjs');

describe('ti18n Key Validation and Coverage', () => {
  const keys = ['greeting', 'farewell', 'welcome', 'items'];
  const enData = {
    languages: {
      en: "English",
      fr: "French",
      de: "German"
    },
    dictionary: {
      greeting: "Hello",
      farewell: "Goodbye",
      welcome: "Welcome",
      items: "You have {count} items in your cart"
    }
  };

  const frData = {
    languages: {
      en: "Anglais",
      fr: "Français",
      de: "Allemand"
    },
    dictionary: {
      greeting: "Bonjour",
      farewell: "Au revoir",
      welcome: "Bienvenue",
      items: "Vous avez {count} articles dans votre panier"
    }
  };

  const incompleteData = {
    languages: {
      en: "Inglés",
      es: "Español"
    },
    dictionary: {
      greeting: "¡Hola!",
      farewell: "¡Adiós!",
      items: "Tienes {count} artículos en tu carrito."
    }
  };

  const countryCodeMappings = [
    { locale: "en", code: "US" },
    { locale: "fr", code: "FR" },
    { locale: "es", code: "ES" }
  ];

  let i18n;

  beforeEach(() => {
    i18n = new Ti18n({
      countryCodeMappings,
      keys
    });
  });

  test('should properly track defined keys', () => {
    expect(i18n.getDefinedKeys()).toEqual(keys);
  });

  test('should load complete language files without warnings', () => {
    i18n.loadLocale('en', enData);
    i18n.loadLocale('fr', frData);
    
    const coverageReports = i18n.getAllCoverageReports();
    expect(coverageReports.get('en').coverage).toBe(1);
    expect(coverageReports.get('fr').coverage).toBe(1);
    expect(coverageReports.get('en').missingKeys).toHaveLength(0);
    expect(coverageReports.get('fr').missingKeys).toHaveLength(0);
  });

  test('should detect missing keys in incomplete language files', () => {
    i18n.loadLocale('es', incompleteData);
    
    const coverageReport = i18n.getAllCoverageReports().get('es');
    expect(coverageReport.coverage).toBeLessThan(1);
    expect(coverageReport.missingKeys).toContain('welcome');
  });

  test('should generate key objects for all defined keys', () => {
    const generatedKeys = i18n.createAllKeys();
    
    expect(Object.keys(generatedKeys)).toEqual(keys);
    expect(typeof generatedKeys.greeting).toBe('string');
    expect(typeof generatedKeys.farewell).toBe('string');
  });

  test('should handle translations with generated keys', () => {
    i18n.loadLocale('en', enData);
    const keys = i18n.createAllKeys();
    
    expect(i18n.translate(keys.greeting, 'en')).toBe('Hello');
    expect(i18n.translate(keys.farewell, 'en')).toBe('Goodbye');
  });

  test('should generate accurate coverage reports', () => {
    i18n.loadLocale('en', enData);
    i18n.loadLocale('fr', frData);
    i18n.loadLocale('es', incompleteData);
    
    const reports = i18n.getAllCoverageReports();
    
    expect(reports.size).toBe(3);
    expect(reports.get('en').coverage).toBe(1);
    expect(reports.get('fr').coverage).toBe(1);
    expect(reports.get('es').coverage).toBeLessThan(1);
    
    const esReport = reports.get('es');
    expect(esReport.missingKeys).toContain('welcome');
    expect(esReport.missingKeys).toHaveLength(1);
  });
});
