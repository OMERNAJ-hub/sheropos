import { useCallback } from 'react';
import { translations } from '@/lib/i18n/translations';
import { create } from 'zustand';

type Language = 'ar' | 'en';

interface I18nStore {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useI18nStore = create<I18nStore>((set) => ({
  language: 'ar',
  setLanguage: (language) => set({ language }),
}));

export function useTranslation() {
  const { language, setLanguage } = useI18nStore();

  const t = useCallback((key: string) => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return value || key;
  }, [language]);

  return {
    t,
    language,
    setLanguage,
  };
}
