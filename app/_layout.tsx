import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { BypassButton } from '@/components/debug/BypassButton';
import { ErrorBoundary } from '@/components/debug/ErrorBoundary';
import { initI18n } from '@/services/i18n';
import '@/utils/messagingTools'; // Initialize messaging tools

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize i18n first
        await initI18n();
        console.log('App initialized successfully');
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        // Hide splash screen after initialization
        await SplashScreen.hideAsync();
      }
    };

    initializeApp();
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <LanguageProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(onboarding)" />
                <Stack.Screen name="(tabs)" />
              </Stack>
              {/* <ErrorBoundary>
                <BypassButton position="top-right" />
              </ErrorBoundary> */}
              <StatusBar style="auto" />
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}