# ti18n - Tiny Internationalization

[![Build](https://github.com/zealsprince/ti18n/actions/workflows/build.yml/badge.svg)](https://github.com/zealsprince/ti18n/actions/workflows/build.yml)

A lightweight, zero-dependency internationalization library for TypeScript and JavaScript applications.

## Features

- **Lightweight**: Zero dependencies with minimal bundle size impact
- **Simple API**: Easy-to-use interface for translations
- **TypeScript Support**: Full type safety for your projects
- **Flexible Configuration**: Adapts to different project structures
- **Validation Tools**: Track translation coverage and missing keys

## Use Cases

- **Bundle Size Sensitive Applications**: Perfect for mobile or performance-critical web applications
- **Static Sites**: Simple integration with static site generators
- **Small to Medium Projects**: When you don't need the complexity of larger i18n libraries
- **Edge Computing Environments**: Optimized for environments with resource constraints

## Installation

```bash
npm install @zealsprince/ti18n
# or
yarn add @zealsprince/ti18n
# or
pnpm add @zealsprince/ti18n
```

## Basic Usage

```javascript
import { ti18n } from 'ti18n';
// or const { ti18n } = require('ti18n');

// Define keys (recommended approach)
const keys = ['greeting', 'welcome', 'farewell'];

// Create an instance with predefined keys
const i18n = new ti18n({ keys });

// Load language data
i18n.loadLocale('en', {
  languages: { en: "English", fr: "French" },
  dictionary: {
    greeting: "Hello",
    welcome: "Welcome, {name}!",
    farewell: "Goodbye"
  }
});

// Generate type-safe keys for all defined translations
const translationKeys = i18n.createAllKeys();

// Translate using the generated keys (preferred approach)
console.log(i18n.translate(translationKeys.greeting, 'en')); // Output: Hello

// Translation with parameters
console.log(i18n.translate(translationKeys.welcome, 'en', { name: 'John' })); // Output: Welcome, John!

// Validate translation coverage
const report = i18n.getCoverageReport('en');
console.log(`Coverage: ${(report.coverage * 100).toFixed(1)}%`); // Output: Coverage: 100.0%
```

Keep in mind that you will probably want to load both keys and locales from external files.
This example skips that for simplicity but a real-world application would likely involve loading these
from JSON files via a fetch or import statement. In that sense the library won't impose any stylistic
constraints on your project. Bring your own format.

### Alternative Approach (Direct Key Creation)

```javascript
// Create translation keys manually
const greetingKey = i18n.createKey('greeting');
const welcomeKey = i18n.createKey('welcome');

// Translate using individual keys
console.log(i18n.translate(greetingKey, 'en')); // Output: Hello
console.log(i18n.translate(welcomeKey, 'en', { name: 'Alice' })); // Output: Welcome, Alice!
```

## Key Management & Validation

```javascript
// Import your keys from a separate file
import keys from './keys.json';

// Create an instance with keys
const i18n = new ti18n({ keys });

// Load language data for multiple locales
i18n.loadLocales({
  en: enData,
  fr: frData
});

// Generate an object with formatted keys for all defined keys
const translationKeys = i18n.createAllKeys();

// Use generated keys in your application
console.log(i18n.translate(translationKeys.greeting, 'en'));
console.log(i18n.translate(translationKeys.greeting, 'fr'));
```

### Check Translation Coverage

ti18n automatically validates your language files against your defined keys:

```javascript
// Get coverage report for a specific locale
const report = i18n.getCoverageReport('en');
console.log(`Coverage: ${(report.coverage * 100).toFixed(1)}%`);
console.log('Missing keys:', report.missingKeys);
console.log('Extra keys:', report.extraKeys);

// Get reports for all locales
const allReports = i18n.getAllCoverageReports();
```

### Country Code Mappings

```typescript
// Get country code for a locale
i18n.localeToCountryCode("en"); // Returns "US"
```

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/zealsprince/ti18n/blob/main/LICENSE) file for details.
