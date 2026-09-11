import { en, Translations } from "./en";
import { hi } from "./hi";
import { mr } from "./mr";

export type Language = "en" | "hi" | "mr";

export const translations: Record<Language, Translations> = {
  en,
  hi,
  mr,
};

export const languageNames: Record<Language, string> = {
  en: "English",
  hi: "हिंदी",
  mr: "मराठी",
};

/**
 * Normalizes input language string (e.g. "English", "हिंदी", "en", "mr") into a valid Language code
 */
export function normalizeLanguage(lang: string | null | undefined): Language {
  if (!lang) return "en";
  const lower = lang.toLowerCase().trim();
  if (lower === "en" || lower === "english") return "en";
  if (lower === "hi" || lower === "hindi" || lower === "हिंदी") return "hi";
  if (lower === "mr" || lower === "marathi" || lower === "मराठी") return "mr";
  return "en";
}

/**
 * Safely resolves a nested dot-notation key (e.g. "nav.home") from the translation dictionary
 */
export function getTranslation(
  lang: Language,
  path: string,
  params?: Record<string, string | number>
): string {
  const keys = path.split(".");
  
  // Try selected language
  let current: any = translations[lang] || translations.en;
  for (const k of keys) {
    if (current && typeof current === "object" && k in current) {
      current = current[k];
    } else {
      current = undefined;
      break;
    }
  }

  // Fallback to English if not found
  if (current === undefined || typeof current !== "string") {
    let fallbackCurrent: any = translations.en;
    for (const k of keys) {
      if (fallbackCurrent && typeof fallbackCurrent === "object" && k in fallbackCurrent) {
        fallbackCurrent = fallbackCurrent[k];
      } else {
        fallbackCurrent = undefined;
        break;
      }
    }
    current = fallbackCurrent;
  }

  // If still not a string, return the path
  if (typeof current !== "string") {
    return path;
  }

  // Parameter interpolation (e.g. {current})
  if (params) {
    let result = current;
    for (const [pKey, pVal] of Object.entries(params)) {
      result = result.replace(new RegExp(`\\{${pKey}\\}`, "g"), String(pVal));
    }
    return result;
  }

  return current;
}

export { en, hi, mr };
export type { Translations };
