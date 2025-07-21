import {
  auth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut,
  onAuthStateChanged,
  User,
} from './firebase';
import { createUser, getUser } from './firestore';
import { formatPhoneNumber, validatePhoneNumber } from '@/utils/validation';
import type { CreateUserData } from '@/types/user';

export interface ConfirmationResult {
  confirm: (verificationCode: string) => Promise<User>;
}

export interface AuthError {
  code: string;
  message: string;
}

class AuthDebugService {
  private recaptchaVerifier: RecaptchaVerifier | null = null;
  private confirmationResult: ConfirmationResult | null = null;
  private debugPhoneNumber: string = '';

  // Initialize reCAPTCHA verifier
  initializeRecaptcha = async (containerId: string): Promise<void> => {
    try {
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.clear();
      }

      this.recaptchaVerifier = new RecaptchaVerifier(
        containerId,
        {
          size: 'invisible',
          callback: () => {
            console.log('reCAPTCHA solved');
          },
          'expired-callback': () => {
            console.log('reCAPTCHA expired');
          },
        },
        auth
      );

      await this.recaptchaVerifier.render();
      console.log('reCAPTCHA initialized');
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
      // Don't throw in debug mode, just log
      console.log('Debug mode: Skipping reCAPTCHA initialization');
    }
  };

  // Send OTP to phone number (debug version)
  sendOTP = async (phoneNumber: string): Promise<void> => {
    try {
      // Validate phone number format
      if (!validatePhoneNumber(phoneNumber)) {
        throw new Error('Invalid phone number format');
      }

      // Store for debug verification
      this.debugPhoneNumber = phoneNumber;

      // In debug mode, create a mock confirmation result
      this.confirmationResult = {
        confirm: async (verificationCode: string) => {
          // Accept any 6-digit code in debug mode
          if (verificationCode.length === 6) {
            console.log('Debug mode: Mock authentication successful');
            
            // Create a mock user for testing
            const mockUser = {
              uid: `debug_${Date.now()}`,
              phoneNumber: this.debugPhoneNumber,
              email: null,
              displayName: null,
              photoURL: null,
              emailVerified: false,
              isAnonymous: false,
              metadata: {
                creationTime: new Date().toISOString(),
                lastSignInTime: new Date().toISOString(),
              },
              providerData: [],
              refreshToken: 'debug-refresh-token',
              tenantId: null,
              delete: async () => {},
              getIdToken: async () => 'debug-id-token',
              getIdTokenResult: async () => ({} as any),
              reload: async () => {},
              toJSON: () => ({}),
            } as User;

            return mockUser;
          } else {
            throw new Error('Invalid verification code');
          }
        }
      };

      console.log('Debug mode: Mock OTP sent successfully');
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw this.handleAuthError(error);
    }
  };

  // Verify OTP and complete authentication (debug version)
  verifyOTP = async (verificationCode: string): Promise<User> => {
    try {
      if (!this.confirmationResult) {
        throw new Error('No confirmation result available');
      }

      // Confirm the verification code
      const result = await this.confirmationResult.confirm(verificationCode);
      
      console.log('Debug mode: User authenticated successfully');
      return result;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw this.handleAuthError(error);
    }
  };

  // Get current user
  getCurrentUser = (): User | null => {
    return auth.currentUser;
  };

  // Sign out
  signOut = async (): Promise<void> => {
    try {
      await signOut(auth);
      this.confirmationResult = null;
      this.debugPhoneNumber = '';
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      throw this.handleAuthError(error);
    }
  };

  // Listen to auth state changes
  onAuthStateChanged = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  };

  // Create user profile after successful authentication
  createUserProfile = async (userData: CreateUserData): Promise<void> => {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      await createUser(currentUser.uid, {
        ...userData,
        phoneNumber: currentUser.phoneNumber || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log('User profile created successfully');
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw this.handleAuthError(error);
    }
  };

  // Get user profile
  getUserProfile = async (userId: string) => {
    try {
      return await getUser(userId);
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw this.handleAuthError(error);
    }
  };

  // Handle auth errors
  private handleAuthError = (error: any): AuthError => {
    let code = 'unknown-error';
    let message = 'An unexpected error occurred';

    if (error?.code) {
      code = error.code;
      
      switch (error.code) {
        case 'auth/invalid-phone-number':
          message = 'Invalid phone number format';
          break;
        case 'auth/too-many-requests':
          message = 'Too many attempts. Please try again later';
          break;
        case 'auth/invalid-verification-code':
          message = 'Invalid verification code';
          break;
        case 'auth/code-expired':
          message = 'Verification code has expired';
          break;
        case 'auth/network-request-failed':
          message = 'Network error. Please check your internet connection';
          break;
        default:
          message = error.message || message;
      }
    } else if (error?.message) {
      message = error.message;
    }

    return { code, message };
  };
}

// Export singleton instance
const authDebugService = new AuthDebugService();
export default authDebugService;