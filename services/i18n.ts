import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

import { resources } from '@/translations';

const LANGUAGE_STORAGE_KEY = 'user_language';

export const initI18n = async (): Promise<void> => {
  try {
    // Get device locale but default to French as per requirements
    const deviceLocale = Localization.locale;
    const deviceLanguage = deviceLocale.startsWith('en') ? 'en' : 'fr';
    
    // Load saved language preference
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    const initialLanguage = savedLanguage === 'en' || savedLanguage === 'fr' 
      ? savedLanguage 
      : 'fr'; // French as default per requirements
    
    await i18n
      .use(initReactI18next)
      .init({
        compatibilityJSON: 'v3', // For React Native compatibility
        resources,
        lng: initialLanguage,
        fallbackLng: 'fr', // French fallback
        interpolation: {
          escapeValue: false, // React already escapes
        },
        react: {
          useSuspense: false, // For React Native
        },
        returnObjects: true,
        returnEmptyString: false,
        returnNull: false,
        debug: false, // Disable debug to reduce console noise
      });
      
    console.log('i18n initialized with language:', initialLanguage);
  } catch (error) {
    console.error('Failed to initialize i18n:', error);
    // Fallback initialization with French
    await i18n
      .use(initReactI18next)
      .init({
        compatibilityJSON: 'v3',
        resources,
        lng: 'fr',
        fallbackLng: 'fr',
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
      });
  }
};

export const changeLanguage = async (language: 'fr' | 'en'): Promise<void> => {
  try {
    await i18n.changeLanguage(language);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    console.log('Language changed to:', language);
  } catch (error) {
    console.error('Failed to change language:', error);
    throw error;
  }
};

export const getCurrentLanguage = (): 'fr' | 'en' => {
  const currentLang = i18n.language;
  return currentLang === 'en' ? 'en' : 'fr';
};

export default i18n;