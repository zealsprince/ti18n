import {
  Ti18n,
  type InternationalizationData,
} from "../index";

describe("ti18n TypeScript Integration", () => {
  let i18n: Ti18n<"greeting" | "welcome" | "items">;

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
    // TypeScript should infer these with their specific types
    const greetingKey = i18n.keys.greeting; // Type is "i18n::greeting"
    const welcomeKey = i18n.keys.welcome;   // Type is "i18n::welcome"
    const itemsKey = i18n.keys.items;       // Type is "i18n::items"

    expect(greetingKey).toBe("i18n::greeting");
    expect(welcomeKey).toBe("i18n::welcome");
    expect(itemsKey).toBe("i18n::items");

    // @ts-expect-error - This should not compile as the key doesn't exist
    i18n.keys.nonexistent;
  });

  test("should handle kebab-case keys with camelCase conversion", () => {
    const kebabI18n = new Ti18n<"user-name" | "last-login-date">({
      header: "i18n",
      separator: "::",
      keys: ["user-name", "last-login-date"]
    });

    const kebabData: InternationalizationData = {
      languages: { en: "English" },
      dictionary: {
        "user-name": "User: {name}",
        "last-login-date": "Last login: {date}"
      }
    };

    kebabI18n.loadLocales({ en: kebabData });

    // Keys should be accessible in camelCase
    expect(kebabI18n.keys.userName).toBe("i18n::user-name");
    expect(kebabI18n.keys.lastLoginDate).toBe("i18n::last-login-date");

    // Translation should work with the converted keys
    expect(kebabI18n.translateTo(kebabI18n.keys.userName, "en", { name: "John" }))
      .toBe("User: John");
    expect(kebabI18n.translateTo(kebabI18n.keys.lastLoginDate, "en", { date: "2023-01-01" }))
      .toBe("Last login: 2023-01-01");
  });

  test("should handle snake_case keys with camelCase conversion", () => {
    const snakeI18n = new Ti18n<"user_info" | "last_login_time">({
      header: "i18n",
      separator: "::",
      keys: ["user_info", "last_login_time"]
    });

    const snakeData: InternationalizationData = {
      languages: { en: "English" },
      dictionary: {
        "user_info": "User information: {info}",
        "last_login_time": "Last login at: {time}"
      }
    };

    snakeI18n.loadLocales({ en: snakeData });

    // Keys should be accessible in camelCase
    expect(snakeI18n.keys.userInfo).toBe("i18n::user_info");
    expect(snakeI18n.keys.lastLoginTime).toBe("i18n::last_login_time");

    // Translation should work with the converted keys
    expect(snakeI18n.translateTo(snakeI18n.keys.userInfo, "en", { info: "Admin" }))
      .toBe("User information: Admin");
    expect(snakeI18n.translateTo(snakeI18n.keys.lastLoginTime, "en", { time: "12:00" }))
      .toBe("Last login at: 12:00");
  });

  test("should handle mixed kebab-case and snake_case keys", () => {
    const mixedI18n = new Ti18n<"user-role" | "last_seen_at" | "account-status" | "login_count">({
      header: "i18n",
      separator: "::",
      keys: ["user-role", "last_seen_at", "account-status", "login_count"]
    });

    const mixedData: InternationalizationData = {
      languages: { en: "English" },
      dictionary: {
        "user-role": "Role: {role}",
        "last_seen_at": "Last seen: {time}",
        "account-status": "Status: {status}",
        "login_count": "Total logins: {count}"
      }
    };

    mixedI18n.loadLocales({ en: mixedData });

    // Keys should be accessible in camelCase regardless of original format
    expect(mixedI18n.keys.userRole).toBe("i18n::user-role");
    expect(mixedI18n.keys.lastSeenAt).toBe("i18n::last_seen_at");
    expect(mixedI18n.keys.accountStatus).toBe("i18n::account-status");
    expect(mixedI18n.keys.loginCount).toBe("i18n::login_count");

    // Translation should work with the converted keys
    expect(mixedI18n.translateTo(mixedI18n.keys.userRole, "en", { role: "Admin" }))
      .toBe("Role: Admin");
    expect(mixedI18n.translateTo(mixedI18n.keys.lastSeenAt, "en", { time: "10:30" }))
      .toBe("Last seen: 10:30");
    expect(mixedI18n.translateTo(mixedI18n.keys.accountStatus, "en", { status: "Active" }))
      .toBe("Status: Active");
    expect(mixedI18n.translateTo(mixedI18n.keys.loginCount, "en", { count: "5" }))
      .toBe("Total logins: 5");
  });

  test("should handle dot notation keys with camelCase conversion", () => {
    const dotI18n = new Ti18n<"auth.login.success" | "user.settings.theme">({
      header: "i18n",
      separator: "::",
      keys: ["auth.login.success", "user.settings.theme"]
    });

    const dotData: InternationalizationData = {
      languages: { en: "English" },
      dictionary: {
        "auth.login.success": "Login successful",
        "user.settings.theme": "Theme: {theme}"
      }
    };

    dotI18n.loadLocales({ en: dotData });

    // Keys should be accessible in camelCase
    expect(dotI18n.keys.authLoginSuccess).toBe("i18n::auth.login.success");
    expect(dotI18n.keys.userSettingsTheme).toBe("i18n::user.settings.theme");

    // Translation should work with the converted keys
    expect(dotI18n.translateTo(dotI18n.keys.authLoginSuccess, "en")).toBe("Login successful");
    expect(dotI18n.translateTo(dotI18n.keys.userSettingsTheme, "en", { theme: "dark" }))
      .toBe("Theme: dark");
  });
});
