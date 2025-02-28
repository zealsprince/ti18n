export interface Internationalization {
  languages: Map<string, string>;
  dictionary: Map<string, string>;
}

export type InternationalizationData = {
  languages?: Record<string, string>;
  dictionary?: Record<string, string>;
}

/**
 * Convert a kebab-case string to camelCase literal type
 */
export type KebabToCamelCase<S extends string> = 
  S extends `${infer First}-${infer Rest}`
    ? `${First}${Capitalize<KebabToCamelCase<Rest>>}`
    : S;

/**
 * Convert a snake_case string to camelCase literal type
 */
export type SnakeToCamelCase<S extends string> = 
  S extends `${infer First}_${infer Rest}`
    ? `${First}${Capitalize<SnakeToCamelCase<Rest>>}`
    : S;

/**
 * Convert dot.case string to camelCase literal type
 */
export type DotToCamelCase<S extends string> = 
  S extends `${infer First}.${infer Rest}`
    ? `${First}${Capitalize<DotToCamelCase<Rest>>}`
    : S;

/**
 * Convert kebab-case, snake_case, or dot.case string to camelCase literal type
 */
export type ToCamelCase<S extends string> = 
  S extends `${infer First}-${infer Rest}`
    ? `${First}${Capitalize<ToCamelCase<Rest>>}`
    : S extends `${infer First}_${infer Rest}`
      ? `${First}${Capitalize<ToCamelCase<Rest>>}`
      : S extends `${infer First}.${infer Rest}`
        ? `${First}${Capitalize<ToCamelCase<Rest>>}`
        : S;

/**
 * Maps translation keys to their TypeScript-friendly camelCase names
 */
export type TranslationKeys<K extends string = string> = {
  [P in K as ToCamelCase<P>]: `${string}::${P}`;
};
