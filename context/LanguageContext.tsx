import React, { createContext, useContext, ReactNode } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface LanguageContextType {
  language: 'fr' | 'en';
  changeLanguage: (language: 'fr' | 'en') => Promise<void>;
  isReady: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ 
  children 
}) => {
  const { language, changeLanguage, isReady } = useTranslation();
  
  const value = {
    language,
    changeLanguage,
    isReady,
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};