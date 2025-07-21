import Constants from 'expo-constants';

/**
 * Check if bypass mode is enabled
 */
export const isBypassMode = (): boolean => {
  const bypassMode = Constants.expoConfig?.extra?.BYPASS_MODE || process.env.EXPO_PUBLIC_BYPASS_MODE;
  return bypassMode === 'true' || bypassMode === true;
};

/**
 * Bypass routes for quick navigation during testing
 */
export const bypassRoutes = {
  // Auth routes
  login: '/(auth)/',
  verify: '/(auth)/verify',
  
  // Onboarding routes
  gamerType: '/(onboarding)/gamer-type',
  favoriteGames: '/(onboarding)/favorite-games', 
  meetPreference: '/(onboarding)/meet-preference',
  bio: '/(onboarding)/bio',
  avatar: '/(onboarding)/avatar',
  
  // Main app routes
  tabs: '/(tabs)/',
  meets: '/(tabs)/',
  conversations: '/(tabs)/conversations',
  groups: '/(tabs)/conversations', // Groups now part of conversations
  profile: '/(tabs)/profile',
  
  // Meeting routes
  meetingDetail: '/meeting/test-meeting-id', // Moved outside tabs
} as const;

export type BypassRoute = typeof bypassRoutes[keyof typeof bypassRoutes];

/**
 * Route labels for the bypass menu
 */
export const routeLabels: Record<keyof typeof bypassRoutes, string> = {
  login: '🔐 Login',
  verify: '📱 Verify OTP',
  gamerType: '🎮 Gamer Type',
  favoriteGames: '🎯 Favorite Games',
  meetPreference: '🤝 Meet Preference',
  bio: '📝 Bio',
  avatar: '👤 Avatar',
  tabs: '📱 Main App',
  meets: '📅 Meets',
  conversations: '💬 Conversations',
  groups: '👥 Groups',
  profile: '⚙️ Profile',
  meetingDetail: '📋 Meeting Detail',
};

/**
 * Get current route name for display
 */
export const getCurrentRouteName = (pathname: string): string => {
  // Find matching route
  for (const [key, route] of Object.entries(bypassRoutes)) {
    if (pathname.includes(route) || pathname === route) {
      return routeLabels[key as keyof typeof bypassRoutes];
    }
  }
  
  // Default fallback
  return pathname;
};