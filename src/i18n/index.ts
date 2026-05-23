import { zh, TranslationData } from './zh.js';
import { en } from './en.js';

export type Locale = 'zh' | 'en';

const translations: Record<Locale, TranslationData> = { zh, en };

let currentLocale: Locale = 'zh';

export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

export function detectLocale(): Locale {
  const lang = (process.env.LANG || process.env.LC_ALL || '').toLowerCase();
  if (lang.startsWith('zh')) return 'zh';
  if (lang.startsWith('en')) return 'en';
  return 'zh';
}

export function t(key: string, params?: Record<string, string | number>): string {
  const data = translations[currentLocale];
  const value = getByPath(data, key);
  const text = typeof value === 'string' ? value : key;
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
}

export function getChallengeText(challengeId: string, field: string, fallback: string): string {
  const data = translations[currentLocale];
  const challenge = (data.challenges as Record<string, Record<string, unknown>>)?.[challengeId];
  if (challenge) {
    const val = challenge[field];
    if (typeof val === 'string') return val;
  }
  return fallback;
}

export function getChallengeHints(challengeId: string, fallback: string[]): string[] {
  const data = translations[currentLocale];
  const challenge = (data.challenges as Record<string, Record<string, unknown>>)?.[challengeId];
  if (challenge) {
    const val = challenge.hints;
    if (Array.isArray(val)) return val as string[];
  }
  return fallback;
}

function getByPath(obj: unknown, path: string): unknown {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object') {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return current;
}
