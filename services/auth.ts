import {
  auth,
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged,
  User,
} from './firebase';
import { Platform } from 'react-native';
import { createUser, getUser } from './firestore';
import { formatPhoneNumber, validatePhoneNumber, validateRateLimit } from '@/utils/validation';
import { SecurityUtils, AuthSecurityUtils } from '@/utils/security';
import type { CreateUserData } from '@/types/user';

export interface ConfirmationResult {
  confirm: (verificationCode: string) => Promise<User>;
}

export interface AuthError {
  code: string;
  message: string;
}

class AuthService {
  private confirmationResult: ConfirmationResult | null = null;

  // Send OTP to phone number with security measures
  sendOTP = async (phoneNumber: string): Promise<void> => {
    try {
      // Rate limiting check
      if (!validateRateLimit(`otp_${phoneNumber}`, 3, 300000)) { // 3 attempts per 5 minutes
        throw new Error('Too many OTP requests. Please wait before trying again.');
      }

      // Sanitize and validate phone number
      const sanitizedNumber = SecurityUtils.sanitizePhoneNumber(phoneNumber);
      if (!validatePhoneNumber(sanitizedNumber)) {
        throw new Error('Invalid phone number format');
      }

      // Format phone number
      const formattedNumber = formatPhoneNumber(sanitizedNumber);

      // Additional security: Check for suspicious patterns
      if (this.isSuspiciousPhoneNumber(formattedNumber)) {
        throw new Error('Phone number not allowed');
      }

      // Send verification code (React Native doesn't need reCAPTCHA)
      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedNumber
      );

      this.confirmationResult = confirmation;
      console.log('OTP sent successfully');
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw this.handleAuthError(error);
    }
  };

  // Verify OTP and complete authentication with security measures
  verifyOTP = async (verificationCode: string): Promise<User> => {
    try {
      // Rate limiting for OTP verification attempts
      if (!validateRateLimit('otp_verify', 5, 300000)) { // 5 attempts per 5 minutes
        throw new Error('Too many verification attempts. Please wait before trying again.');
      }

      if (!this.confirmationResult) {
        throw new Error('No confirmation result available');
      }

      // Sanitize and validate OTP
      const sanitizedCode = verificationCode.replace(/\D/g, '');
      if (sanitizedCode.length !== 6) {
        throw new Error('Invalid verification code format');
      }

      // Confirm the verification code
      const result = await this.confirmationResult.confirm(sanitizedCode);
      const user = result.user;

      if (!user) {
        throw new Error('Authentication failed');
      }

      // Check if user profile exists, create if not
      await this.ensureUserProfile(user);

      console.log('OTP verified successfully');
      return user;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw this.handleAuthError(error);
    }
  };

  // Create user profile if it doesn't exist
  private ensureUserProfile = async (user: User): Promise<void> => {
    try {
      if (!user.phoneNumber) {
        throw new Error('Phone number not available');
      }

      const existingUser = await getUser(user.phoneNumber);
      
      if (!existingUser) {
        // Create default user profile
        const defaultUserData: CreateUserData = {
          phoneNumber: user.phoneNumber,
          gamerType: 'casual',
          games: [],
          meetType: 'mixed',
          bio: '',
          language: 'fr', // French as default
        };

        await createUser(user.phoneNumber, defaultUserData);
        console.log('User profile created');
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error);
      throw error;
    }
  };

  // Sign out current user
  signOut = async (): Promise<void> => {
    try {
      await signOut(auth);
      this.confirmationResult = null;
      console.log('User signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      throw this.handleAuthError(error);
    }
  };

  // Get current user
  getCurrentUser = (): User | null => {
    return auth.currentUser;
  };

  // Subscribe to auth state changes
  onAuthStateChanged = (callback: (user: User | null) => void): (() => void) => {
    return onAuthStateChanged(auth, callback);
  };

  // Security: Check for suspicious phone number patterns
  private isSuspiciousPhoneNumber = (phoneNumber: string): boolean => {
    // Block test/fake numbers
    const suspiciousPatterns = [
      /^\+1555/,      // Common test numbers
      /^\+15005550/,  // Twilio test numbers
      /^\+1999/,      // Common fake numbers
      /^(\+1|1)?([0-9])\2{9}$/, // All same digits
    ];

    return suspiciousPatterns.some(pattern => pattern.test(phoneNumber));
  };

  // Handle authentication errors
  private handleAuthError = (error: unknown): AuthError => {
    // Log security-relevant errors
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const firebaseError = error as { code: string };
      if (firebaseError.code === 'auth/too-many-requests') {
        console.warn('Security Alert: Rate limit exceeded for authentication');
      }
    }
    if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
      const firebaseError = error as { code: string; message: string };
      
      switch (firebaseError.code) {
        case 'auth/invalid-phone-number':
          return {
            code: 'invalid-phone',
            message: 'Invalid phone number format',
          };
        case 'auth/too-many-requests':
          return {
            code: 'too-many-requests',
            message: 'Too many requests. Please try again later',
          };
        case 'auth/invalid-verification-code':
          return {
            code: 'invalid-code',
            message: 'Invalid verification code',
          };
        case 'auth/code-expired':
          return {
            code: 'code-expired',
            message: 'Verification code has expired',
          };
        case 'auth/network-request-failed':
          return {
            code: 'network-error',
            message: 'Network error. Please check your connection',
          };
        default:
          return {
            code: 'unknown-error',
            message: firebaseError.message || 'An unknown error occurred',
          };
      }
    }

    return {
      code: 'unknown-error',
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  };

  // Clean up resources
  cleanup = (): void => {
    this.confirmationResult = null;
  };
}

// Export singleton instance
export const authService = new AuthService();
export default authService;