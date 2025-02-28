import {
  Ti18n,
  type InternationalizationData,
} from "../index";

describe("ti18n TypeScript Integration", () => {
  let i18n: Ti18n;

  const keys = ["greeting", "welcome", "items"];

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

  beforeEach(() => {
    i18n = new Ti18n({
      header: "i18n",
      separator: "::",
      keys
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
    expect(i18n.translateTo(i18n.keys.greeting, "en")).toBe("Hello");
    expect(i18n.translateTo(i18n.keys.greeting, "fr")).toBe("Bonjour");
  });

  test("should handle translations with parameters", () => {
    const params = { name: "Alice" };
    
    expect(i18n.translateTo(i18n.keys.welcome, "en", params)).toBe("Welcome, Alice!");
    expect(i18n.translateTo(i18n.keys.welcome, "fr", params)).toBe("Bienvenue, Alice !");
  });

  test("should correctly return language names", () => {
    expect(i18n.getLanguageName("en", "en")).toBe("English");
    expect(i18n.getLanguageName("fr", "en")).toBe("French");
    expect(i18n.getLanguageName("de", "en")).toBe("German");

    expect(i18n.getLanguageName("en", "fr")).toBe("Anglais");
    expect(i18n.getLanguageName("fr", "fr")).toBe("Français");
    expect(i18n.getLanguageName("de", "fr")).toBe("Allemand");
  });

  test("should handle global language setting in TypeScript", () => {
    const params = { name: "Alice" };

    // Should throw with proper type checking
    expect(() => i18n.translate("welcomeKey")).toThrow("No global language set");

    i18n.setLanguage("en");
    expect(i18n.getLanguage()).toBe("en");
    expect(i18n.translate(i18n.keys.welcome, params)).toBe("Welcome, Alice!");

    i18n.setLanguage("fr");
    expect(i18n.translate(i18n.keys.welcome, params)).toBe("Bienvenue, Alice !");
  });

  test("should use keys getter with type safety", () => {
    // TypeScript should infer these as strings
    const greetingKey: string = i18n.keys.greeting;
    const welcomeKey: string = i18n.keys.welcome;
    
    expect(greetingKey).toBe("i18n::greeting");
    expect(welcomeKey).toBe("i18n::welcome");
  });
});
