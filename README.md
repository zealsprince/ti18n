# ti18n - Tiny Internationalization

[![Build & Test](https://github.com/zealsprince/ti18n/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/zealsprince/ti18n/actions/workflows/build.yml)

A lightweight, zero-dependency internationalization library for TypeScript and JavaScript applications.

## Features

- **Lightweight**: Zero dependencies with minimal bundle size impact
- **Simple API**: Easy-to-use interface for translations
- **TypeScript Support**: Full type safety for your projects
- **Flexible Configuration**: Adapts to different project structures
- **Validation Tools**: Track translation coverage and missing keys
- **Parameters**: Support for dynamic values in translations
- **Language Aliases**: Support for language aliases within the same locale

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

// Import your keys which consist of a list of strings.
import keys from '@/resources/i18n/keys.json';

// Import your language data - refer to the Language Data section for more details.
import enData from '@/resources/i18n//en.json';
import frData from '@/resources/i18n//fr.json';

// Create an instance with keys
const i18n = new ti18n({ keys });

// Load language data for multiple locales
i18n.loadLocales({
  en: enData,
  fr: frData
});

// Set the default locale
i18n.setLanguage('en');

// Use generated keys in your application
console.log(i18n.translate(i18n.keys.greeting));

// Translate using a specific language
console.log(i18n.translateTo(i18n.keys.greeting, 'fr'));

// Get a translation coverage report for a specific locale
const report = i18n.getCoverageReport('en');
console.log(`Coverage: ${(report.coverage * 100).toFixed(1)}%`); // Output: Coverage: 100.0%
```

## Advanced Usage / Data Structure

```javascript
// Define keys
const keys = ['greeting', 'welcome', 'farewell'];

// Create an instance with predefined keys
const i18n = new ti18n({ keys });
```

> ![NOTE]
> Keys although in their definition without headers will be prefixed with a header and separator when used in translations. This is to avoid any ambiguity. The default header is `i18n` and the default separator is `::`. You can change these in the constructor.

```javascript
// Load language data
i18n.loadLocale('en', {
  languages: { en: "English", fr: "French" },
  dictionary: {
    greeting: "Hello",
    welcome: "Welcome, {name}!",
    farewell: "Goodbye"
  }
});

// Set the default locale
i18n.setLanguage('en');

// Translate using the generated keys (preferred approach)
console.log(i18n.translate(i18n.keys.greeting)); // Output: Hello

// Translation with parameters
console.log(i18n.translate(i18n.keys.welcome, { name: 'John' })); // Output: Welcome, John!

// Alternatively, you can translate using a specific language. You can also specify the key yourself.
// Keep in mind, the header and separator here are the defaults. You can modify them in the constructor.
console.log(i18n.translateTo('i18n::greeting', 'en')); // Output: Hello

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

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/zealsprince/ti18n/blob/main/LICENSE) file for details.
