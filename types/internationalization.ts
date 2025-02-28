export interface Internationalization {
  languages: Map<string, string>;
  dictionary: Map<string, string>;
}

export type InternationalizationData = {
  languages?: Record<string, string>;
  dictionary?: Record<string, string>;
}
