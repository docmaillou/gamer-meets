import { useTranslation as useI18nTranslation } from 'react-i18next';
import { changeLanguage as changeI18nLanguage, getCurrentLanguage } from '@/services/i18n';

export interface TranslationHook {
  t: (key: string, options?: Record<string, unknown>) => string;
  language: 'fr' | 'en';
  changeLanguage: (language: 'fr' | 'en') => Promise<void>;
  isReady: boolean;
}

export const useTranslation = (namespace?: string): TranslationHook => {
  const { t: i18nT, ready, i18n } = useI18nTranslation();
  
  const t = (key: string, options?: Record<string, unknown>): string => {
    // If namespace is provided in options, use it directly
    if (options?.ns) {
      return i18nT(key, options);
    }
    
    // Otherwise use the provided namespace or default to no namespace
    const translationOptions = namespace ? { ...options, ns: namespace } : options;
    return i18nT(key, translationOptions);
  };
  
  const changeLanguage = async (language: 'fr' | 'en'): Promise<void> => {
    await changeI18nLanguage(language);
  };
  
  const language = (i18n.language === 'en' ? 'en' : 'fr') as 'fr' | 'en';
  
  return {
    t,
    language,
    changeLanguage,
    isReady: ready,
  };
};

// Convenience hooks for specific namespaces
export const useCommonTranslation = () => useTranslation('common');
export const useAuthTranslation = () => useTranslation('auth');
export const useOnboardingTranslation = () => useTranslation('onboarding');
export const useMeetsTranslation = () => useTranslation('meets');
export const useChatTranslation = () => useTranslation('chat');
export const useProfileTranslation = () => useTranslation('profile');
export const useGroupTranslation = () => useTranslation('groups');