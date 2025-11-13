import { createContext, useContext, useState, ReactNode } from 'react';
import { Language, translations, convertToSimplified } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: typeof translations.tc;
  convertText: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('tc');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'tc' ? 'sc' : 'tc');
  };

  const convertText = (text: string) => {
    return language === 'sc' ? convertToSimplified(text) : text;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      toggleLanguage,
      t: translations[language],
      convertText,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
