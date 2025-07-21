import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthContext } from '@/context/AuthContext';

export default function Index() {
  const { isAuthenticated, isLoading, isInitialized, userProfile } = useAuthContext();

  // Show loading spinner while authentication state is being determined
  if (!isInitialized || isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // If not authenticated, redirect to auth
  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }

  // If authenticated but no profile data, redirect to onboarding
  if (isAuthenticated && (!userProfile || !userProfile.bio || userProfile.games.length === 0)) {
    return <Redirect href="/(onboarding)/gamer-type" />;
  }

  // If authenticated and profile complete, redirect to main app
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});