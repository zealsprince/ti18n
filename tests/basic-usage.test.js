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
    const keys = ['greeting', 'welcome', 'items'];
    i18n = new Ti18n({ keys });
    i18n.loadLocale('en', enData);
    i18n.loadLocale('fr', frData);
  });

  test('should load and list available locales', () => {
    expect(i18n.getLocales()).toEqual(['en', 'fr']);
  });

  test('should handle simple translations', () => {
    const greetingKey = i18n.createKey('greeting');
    expect(i18n.translateTo(greetingKey, 'en')).toBe('Hello');
    expect(i18n.translateTo(greetingKey, 'fr')).toBe('Bonjour');
  });

  test('should handle translations with Map parameters', () => {
    const welcomeKey = i18n.createKey('welcome');
    const paramsMap = new Map();
    paramsMap.set('name', 'John');
    
    expect(i18n.translateTo(welcomeKey, 'en', paramsMap)).toBe('Welcome, John!');
    expect(i18n.translateTo(welcomeKey, 'fr', paramsMap)).toBe('Bienvenue, John !');
  });

  test('should handle translations with Object parameters', () => {
    const itemsKey = i18n.createKey('items');
    const paramsObj = { count: '5' };
    
    expect(i18n.translateTo(itemsKey, 'en', paramsObj)).toBe('You have 5 items in your cart.');
    expect(i18n.translateTo(itemsKey, 'fr', paramsObj)).toBe('Vous avez 5 articles dans votre panier.');
  });

  test('should return language names in different locales', () => {
    expect(i18n.getLanguageName('de', 'en')).toBe('German');
    expect(i18n.getLanguageName('de', 'fr')).toBe('Allemand');
  });

  test('should handle global language setting', () => {
    const greetingKey = i18n.createKey('greeting');
    const welcomeKey = i18n.createKey('welcome');
    
    expect(() => i18n.translate(greetingKey)).toThrow('No global language set');
    
    i18n.setLanguage('en');
    expect(i18n.getLanguage()).toBe('en');
    expect(i18n.translate(greetingKey)).toBe('Hello');
    expect(i18n.translate(welcomeKey, { name: 'John' })).toBe('Welcome, John!');
    
    i18n.setLanguage('fr');
    expect(i18n.translate(greetingKey)).toBe('Bonjour');
    expect(i18n.translate(welcomeKey, { name: 'John' })).toBe('Bienvenue, John !');
    
    expect(() => i18n.setLanguage('es')).toThrow('Locale "es" is not loaded');
  });

  test('should maintain backward compatibility with translateTo', () => {
    const greetingKey = i18n.createKey('greeting');
    
    i18n.setLanguage('fr');
    expect(i18n.translateTo(greetingKey, 'en')).toBe('Hello');
    expect(i18n.translate(greetingKey)).toBe('Bonjour');
  });

  test('should use keys getter', () => {
    expect(i18n.keys.greeting).toBe(i18n.createKey('greeting'));
    expect(i18n.keys.welcome).toBe(i18n.createKey('welcome'));
    expect(i18n.keys.items).toBe(i18n.createKey('items'));
  });
});
