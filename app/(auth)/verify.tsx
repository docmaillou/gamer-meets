import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { useAuthTranslation } from '@/hooks/useTranslation';
import { useAuthContext } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { validateOTP } from '@/utils/validation';
import authService from '@/services/auth';

export default function VerifyScreen() {
  // All hooks must be called in the same order every time
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useAuthTranslation();
  const { error, clearError } = useAuthContext();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  
  // State hooks
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [timer, setTimer] = useState(60);

  // Refs
  const otpRefs = useRef<(TextInput | null)[]>([]);

  // Derived values
  const phoneNumber = params.phoneNumber as string;

  // Timer for resend functionality
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (text: string, index: number) => {
    // Only allow digits
    const cleanText = text.replace(/\D/g, '');
    
    if (cleanText.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = cleanText;
      setOtp(newOtp);

      // Clear error when user types
      if (otpError) {
        setOtpError('');
      }
      if (error) {
        clearError();
      }

      // Auto-focus next input
      if (cleanText && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace
      otpRefs.current[index - 1]?.focus();
    }
  };

  const validateForm = (): boolean => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setOtpError(t('errors.codeRequired'));
      return false;
    }

    if (!validateOTP(otpString)) {
      setOtpError(t('errors.codeInvalid'));
      return false;
    }

    return true;
  };

  const handleVerify = async () => {
    console.log('Verify button clicked');
    console.log('OTP entered:', otp.join(''));
    
    if (!validateForm()) {
      console.log('OTP validation failed');
      return;
    }

    console.log('OTP validation passed');
    setLoading(true);
    
    try {
      const otpString = otp.join('');
      
      // For development, accept any 6-digit code and redirect to onboarding
      if (__DEV__) {
        console.log('Development mode: Accepting OTP and redirecting to onboarding');
        // Simulate successful authentication
        router.replace('/(onboarding)/gamer-type');
        return;
      }
      
      await authService.verifyOTP(otpString);
      
      console.log('OTP verification successful');
      // Navigation will be handled by the auth state change
      // The index.tsx will redirect based on authentication state
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert(
        t('common.error'),
        error instanceof Error ? error.message : t('errors.unknownError')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    
    setResendLoading(true);
    
    try {
      await authService.sendOTP(phoneNumber);
      setTimer(60);
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
      
      Alert.alert(
        'Code renvoyé',
        t('verification.resendSuccess')
      );
    } catch (error) {
      console.error('Error resending OTP:', error);
      Alert.alert(
        'Erreur',
        error instanceof Error ? error.message : t('errors.unknownError')
      );
    } finally {
      setResendLoading(false);
    }
  };

  const canVerify = otp.every(digit => digit !== '') && !loading;
  const canResend = timer === 0 && !resendLoading;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('verification.title')}</Text>
            <Text style={styles.subtitle}>{t('verification.subtitle')}</Text>
            <Text style={styles.phoneNumber}>
              {t('verification.sentTo', { phoneNumber })}
            </Text>
          </View>

          <View style={styles.otpContainer}>
            <View style={styles.otpInputs}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (otpRefs.current[index] = ref)}
                  style={[
                    styles.otpInput,
                    digit && styles.otpInputFilled,
                    otpError && styles.otpInputError,
                  ]}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  autoFocus={index === 0}
                />
              ))}
            </View>

            {(otpError || error) && (
              <Text style={styles.errorText}>
                {otpError || (error ? t(`errors.${error.code}`) : '')}
              </Text>
            )}

            <TouchableOpacity
              style={styles.resendContainer}
              onPress={handleResend}
              disabled={!canResend}
            >
              <Text style={[styles.resendText, !canResend && styles.resendDisabled]}>
                {timer > 0 
                  ? `${t('verification.resend')} (${timer}s)`
                  : t('verification.resend')
                }
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Button
              title={t('verification.verify')}
              onPress={handleVerify}
              loading={loading}
              disabled={!canVerify}
            />
          </View>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    fontFamily: 'monospace',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  phoneNumber: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  otpContainer: {
    flex: 1,
    alignItems: 'center',
  },
  otpInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 4,
    backgroundColor: colors.surface,
    color: colors.text,
    fontFamily: 'monospace',
  },
  otpInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    color: colors.primary,
  },
  otpInputError: {
    borderColor: colors.error,
    backgroundColor: colors.surface,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  resendContainer: {
    marginTop: 20,
  },
  resendText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'monospace',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  resendDisabled: {
    color: colors.textSecondary,
  },
  footer: {
    paddingBottom: 40,
  },
});