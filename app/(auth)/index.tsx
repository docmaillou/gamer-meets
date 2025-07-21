import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { useAuthTranslation } from '@/hooks/useTranslation';
import { useAuthContext } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { validatePhoneNumber } from '@/utils/validation';
import { getUserCountry } from '@/utils/location';
import { PixelIcon } from '@/components/icons/PixelIcon';
import authService from '@/services/auth';

export default function PhoneLoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const router = useRouter();
  const { t } = useAuthTranslation();
  const { error, clearError } = useAuthContext();
  const { colors } = useTheme();

  useEffect(() => {
    // Request location and set country code
    const initializeCountry = async () => {
      const countryInfo = await getUserCountry();
      if (countryInfo) {
        setCountryCode(countryInfo.callingCode);
      }
    };

    initializeCountry();

    // Initialize reCAPTCHA for web
    if (Platform.OS === 'web') {
      const initRecaptcha = async () => {
        try {
          await authService.initializeRecaptcha('recaptcha-container');
        } catch (error) {
          console.error('Failed to initialize reCAPTCHA:', error);
        }
      };
      
      initRecaptcha();
    }
  }, []);

  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(text);
    
    // Clear error when user types
    if (phoneError) {
      setPhoneError('');
    }
    if (error) {
      clearError();
    }
  };

  const handleCountryChange = (dialCode: string) => {
    setCountryCode(dialCode);
  };

  const validateForm = (): boolean => {
    if (!phoneNumber.trim()) {
      setPhoneError(t('errors.phoneRequired'));
      return false;
    }

    const fullNumber = `${countryCode}${phoneNumber}`;
    if (!validatePhoneNumber(fullNumber)) {
      setPhoneError(t('errors.phoneInvalid'));
      return false;
    }

    return true;
  };

  const handleContinue = async () => {
    console.log('Button clicked - handleContinue called');
    console.log('Phone number:', phoneNumber);
    console.log('Country code:', countryCode);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    console.log('Form validation passed, starting loading...');
    setLoading(true);
    
    try {
      const fullNumber = `${countryCode}${phoneNumber}`;
      console.log('Sending OTP to:', fullNumber);
      
      // For testing, let's skip actual OTP sending and go directly to verify
      if (__DEV__) {
        console.log('Development mode: Skipping OTP, going to verify screen');
        router.push({
          pathname: '/(auth)/verify',
          params: { phoneNumber: fullNumber },
        });
        return;
      }
      
      await authService.sendOTP(fullNumber);
      
      console.log('OTP sent successfully, navigating to verify screen');
      // Navigate to verification screen
      router.push({
        pathname: '/(auth)/verify',
        params: { phoneNumber: fullNumber },
      });
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert(
        t('common.error'),
        error instanceof Error ? error.message : t('errors.unknownError')
      );
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <PixelIcon type="sword" size={64} active />
              </View>
              <Text style={styles.appName}>GAMER MEETS</Text>
              <Text style={styles.tagline}>GAMING DATING APP</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{t('phoneLogin.title').toUpperCase()}</Text>
                <Text style={styles.subtitle}>{t('phoneLogin.subtitle')}</Text>
              </View>

              <View style={styles.form}>
                <PhoneInput
                  label={t('phoneLogin.phoneLabel')}
                  value={phoneNumber}
                  onChangeText={handlePhoneNumberChange}
                  countryCode={countryCode}
                  onCountryChange={handleCountryChange}
                  placeholder="514 123 4567"
                  error={phoneError || (error ? t(`errors.${error.code}`) : '')}
                  required
                />
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  title={t('phoneLogin.continue')}
                  onPress={handleContinue}
                  loading={loading}
                  disabled={!phoneNumber.trim()}
                />
              </View>

              <Text style={styles.disclaimer}>
                {t('phoneLogin.disclaimer')}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* reCAPTCHA container for web */}
        {Platform.OS === 'web' && (
          <div id="recaptcha-container" style={{ visibility: 'hidden' }} />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: colors.primary,
    shadowColor: colors.glow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.accent,
    fontFamily: 'monospace',
    letterSpacing: 1,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.glow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  form: {
    marginBottom: 24,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  disclaimer: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: 'monospace',
  },
});