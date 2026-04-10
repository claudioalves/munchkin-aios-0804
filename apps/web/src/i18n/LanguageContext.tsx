import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Language, TranslationKey } from './translations';
import { translations, LANGUAGES } from './translations';

const STORAGE_KEY = 'munchkin-language';
export const LANGUAGE_SETUP_KEY = 'munchkin-language-set';

function detectLanguage(): Language {
  const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
  if (stored && stored in translations) return stored;
  const browser = navigator.language;
  if (browser.startsWith('pt')) return 'pt-BR';
  if (browser.startsWith('de')) return 'de';
  if (browser.startsWith('es')) return 'es';
  return 'en';
}

interface LanguageContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: TranslationKey) => string;
  isLanguageSet: boolean;
  LANGUAGES: typeof LANGUAGES;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => detectLanguage());
  // useState com initializer garante que é lido do localStorage apenas uma vez
  // e nunca volta a false depois de ser definido como true
  const [isLanguageSet, setIsLanguageSet] = useState<boolean>(
    () => localStorage.getItem(LANGUAGE_SETUP_KEY) === '1',
  );

  const setLang = useCallback((l: Language) => {
    localStorage.setItem(STORAGE_KEY, l);
    localStorage.setItem(LANGUAGE_SETUP_KEY, '1');
    setLangState(l);
    setIsLanguageSet(true);
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    return translations[lang][key] ?? translations['pt-BR'][key] ?? key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isLanguageSet, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
