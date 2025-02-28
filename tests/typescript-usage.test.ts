import {
  Ti18n,
  type InternationalizationData,
  type CountryCodeMapping,
} from "../index";

describe("ti18n TypeScript Integration", () => {
  let i18n: Ti18n;

  const enData: InternationalizationData = {
    languages: {
      en: "English",
      fr: "French",
      de: "German",
    },
    dictionary: {
      greeting: "Hello",
      welcome: "Welcome, {name}!",
      items: "You have {count} items in your cart.",
    },
  };

  const frData: InternationalizationData = {
    languages: {
      en: "Anglais",
      fr: "Français",
      de: "Allemand",
    },
    dictionary: {
      greeting: "Bonjour",
      welcome: "Bienvenue, {name} !",
      items: "Vous avez {count} articles dans votre panier.",
    },
  };

  const countryMappings: CountryCodeMapping[] = [
    { locale: "en", code: "US" },
    { locale: "fr", code: "FR" },
    { locale: "de", code: "DE" },
  ];

  beforeEach(() => {
    i18n = new Ti18n({
      header: "i18n",
      separator: "::",
      countryCodeMappings: countryMappings,
    });

    i18n.loadLocales({
      en: enData,
      fr: frData,
    });
  });

  test("should initialize with correct configuration", () => {
    expect(i18n.getLocales()).toEqual(["en", "fr"]);
  });

  test("should handle simple translations", () => {
    const greetingKey = i18n.createKey("greeting");
    expect(i18n.translate(greetingKey, "en")).toBe("Hello");
    expect(i18n.translate(greetingKey, "fr")).toBe("Bonjour");
  });

  test("should handle translations with parameters", () => {
    const welcomeKey = i18n.createKey("welcome");
    const params = { name: "Alice" };

    expect(i18n.translate(welcomeKey, "en", params)).toBe("Welcome, Alice!");
    expect(i18n.translate(welcomeKey, "fr", params)).toBe("Bienvenue, Alice !");
  });

  test("should correctly return language names", () => {
    expect(i18n.getLanguageName("en", "en")).toBe("English");
    expect(i18n.getLanguageName("fr", "en")).toBe("French");
    expect(i18n.getLanguageName("de", "en")).toBe("German");

    expect(i18n.getLanguageName("en", "fr")).toBe("Anglais");
    expect(i18n.getLanguageName("fr", "fr")).toBe("Français");
    expect(i18n.getLanguageName("de", "fr")).toBe("Allemand");
  });

  test("should map locales to country codes", () => {
    expect(i18n.localeToCountryCode("en")).toBe("US");
    expect(i18n.localeToCountryCode("fr")).toBe("FR");
    expect(i18n.localeToCountryCode("de")).toBe("DE");
  });
});
