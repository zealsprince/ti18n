const { Ti18n } = require('../dist/index.cjs');

describe('ti18n Basic Usage', () => {
  let i18n;
  
  const enData = {
    languages: {
      en: "English",
      fr: "French",
      de: "German"
    },
    dictionary: {
      greeting: "Hello",
      welcome: "Welcome, {name}!",
      items: "You have {count} items in your cart."
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
      welcome: "Bienvenue, {name} !",
      items: "Vous avez {count} articles dans votre panier."
    }
  };

  beforeEach(() => {
    i18n = new Ti18n();
    i18n.loadLocale('en', enData);
    i18n.loadLocale('fr', frData);
    i18n.addCountryCodeMappings([
      { locale: 'en', code: 'US' },
      { locale: 'fr', code: 'FR' }
    ]);
  });

  test('should load and list available locales', () => {
    expect(i18n.getLocales()).toEqual(['en', 'fr']);
  });

  test('should handle simple translations', () => {
    const greetingKey = i18n.createKey('greeting');
    expect(i18n.translate(greetingKey, 'en')).toBe('Hello');
    expect(i18n.translate(greetingKey, 'fr')).toBe('Bonjour');
  });

  test('should handle translations with Map parameters', () => {
    const welcomeKey = i18n.createKey('welcome');
    const paramsMap = new Map();
    paramsMap.set('name', 'John');
    
    expect(i18n.translate(welcomeKey, 'en', paramsMap)).toBe('Welcome, John!');
    expect(i18n.translate(welcomeKey, 'fr', paramsMap)).toBe('Bienvenue, John !');
  });

  test('should handle translations with Object parameters', () => {
    const itemsKey = i18n.createKey('items');
    const paramsObj = { count: '5' };
    
    expect(i18n.translate(itemsKey, 'en', paramsObj)).toBe('You have 5 items in your cart.');
    expect(i18n.translate(itemsKey, 'fr', paramsObj)).toBe('Vous avez 5 articles dans votre panier.');
  });

  test('should return language names in different locales', () => {
    expect(i18n.getLanguageName('de', 'en')).toBe('German');
    expect(i18n.getLanguageName('de', 'fr')).toBe('Allemand');
  });

  test('should handle country code mappings', () => {
    expect(i18n.localeToCountryCode('en')).toBe('US');
    expect(i18n.localeToCountryCode('fr')).toBe('FR');
    expect(i18n.localeToCountryCode('de')).toBe('XX'); // default fallback
  });
});
