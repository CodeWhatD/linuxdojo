import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, setLocale, detectLocale, t as _t } from './index.js';
import { loadProgress, saveProgress } from '../utils/storage.js';

interface LocaleContextValue {
  locale: Locale;
  setLocaleNext: (locale: Locale) => void;
  toggleLocale: () => void;
  t: typeof _t;
}

const LOCALE_ORDER: Locale[] = ['zh', 'en'];

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'zh',
  setLocaleNext: () => {},
  toggleLocale: () => {},
  t: _t,
});

function getInitialLocale(): Locale {
  const saved = loadProgress().locale;
  if (saved === 'zh' || saved === 'en') return saved;
  return detectLocale();
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    setLocale(locale);
  }, [locale]);

  const setLocaleNext = (l: Locale) => {
    setLocaleState(l);
    const data = loadProgress();
    data.locale = l;
    saveProgress(data);
  };

  const toggleLocale = () => {
    const idx = LOCALE_ORDER.indexOf(locale);
    setLocaleNext(LOCALE_ORDER[(idx + 1) % LOCALE_ORDER.length]);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocaleNext, toggleLocale, t: _t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
