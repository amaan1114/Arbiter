
import { languageConfig } from "./language.config.js";

// Automatically derives the supported language names
export type Language = keyof typeof languageConfig;

// Checks whether a language is supported
export function isSupportedLanguage(language: string): language is Language {
  return Object.hasOwn(languageConfig, language);
}

// Returns the configuration for a language
export function resolveLanguage(language: string) {
  if (!isSupportedLanguage(language)) {
    throw new Error(`Unsupported language: ${language}`);
  }
  return languageConfig[language];
}
