import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { authService, AuthError } from '@/services/auth';
import { getUser } from '@/services/firestore';
import type { User as UserProfile } from '@/types/user';

export interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

export interface AuthActions {
  sendOTP: (phoneNumber: string) => Promise<void>;
  verifyOTP: (code: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

export interface UseAuthReturn extends AuthState, AuthActions {
  error: AuthError | null;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [state, setState] = useState<AuthState>({
    user: null,
    userProfile: null,
    isAuthenticated: false,
    isLoading: true,
    isInitialized: false,
  });
  
  const [error, setError] = useState<AuthError | null>(null);

  // Load user profile from Firestore
  const loadUserProfile = async (user: User): Promise<UserProfile | null> => {
    try {
      if (!user.phoneNumber) return null;
      
      const profile = await getUser(user.phoneNumber);
      return profile;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  };

  // Refresh user profile
  const refreshUserProfile = async (): Promise<void> => {
    try {
      if (state.user?.phoneNumber) {
        const profile = await getUser(state.user.phoneNumber);
        setState(prev => ({
          ...prev,
          userProfile: profile,
        }));
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
    }
  };

  // Send OTP
  const sendOTP = async (phoneNumber: string): Promise<void> => {
    try {
      setError(null);
      setState(prev => ({ ...prev, isLoading: true }));
      
      await authService.sendOTP(phoneNumber);
    } catch (error) {
      setError(error as AuthError);
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Verify OTP
  const verifyOTP = async (code: string): Promise<void> => {
    try {
      setError(null);
      setState(prev => ({ ...prev, isLoading: true }));
      
      const user = await authService.verifyOTP(code);
      const userProfile = await loadUserProfile(user);
      
      setState(prev => ({
        ...prev,
        user,
        userProfile,
        isAuthenticated: true,
        isLoading: false,
      }));
    } catch (error) {
      setError(error as AuthError);
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Sign out
  const signOut = async (): Promise<void> => {
    try {
      setError(null);
      setState(prev => ({ ...prev, isLoading: true }));
      
      await authService.signOut();
      
      setState({
        user: null,
        userProfile: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      setError(error as AuthError);
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Clear error
  const clearError = (): void => {
    setError(null);
  };

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          const userProfile = await loadUserProfile(user);
          setState({
            user,
            userProfile,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
          });
        } else {
          setState({
            user: null,
            userProfile: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true,
          });
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setState({
          user: null,
          userProfile: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
        });
      }
    });

    return () => {
      unsubscribe();
      authService.cleanup();
    };
  }, []);

  return {
    ...state,
    error,
    sendOTP,
    verifyOTP,
    signOut,
    refreshUserProfile,
    clearError,
  };
};