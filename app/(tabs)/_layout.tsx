import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/context/ThemeContext';
import { PixelIcon } from '@/components/icons/PixelIcon';

export default function TabLayout() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 2,
          borderTopColor: colors.border,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
          paddingHorizontal: 20,
          ...(Platform.OS === 'web' ? {
            boxShadow: `0px -2px 8px ${colors.glow}33`
          } : {
            shadowColor: colors.glow,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          }),
          elevation: 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          // Disable scrolling and arrows
          overflow: 'hidden',
          scrollEnabled: false,
        },
        tabBarItemStyle: {
          flex: 1,
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
        },
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 0,
        },
        tabBarButton: undefined,
        tabBarBackground: undefined,
        tabBarBadge: undefined,
        tabBarBadgeStyle: undefined,
        tabBarAccessibilityLabel: undefined,
        tabBarTestID: undefined,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Meet',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <PixelIcon type="heart" size={32} active={focused} />
          ),
          tabBarButton: undefined,
          tabBarBadge: undefined,
          href: '/',
        }}
      />
      <Tabs.Screen
        name="conversations"
        options={{
          title: 'Chat',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <PixelIcon type="chat" size={32} active={focused} />
          ),
          tabBarButton: undefined,
          tabBarBadge: undefined,
          href: '/conversations',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <PixelIcon type="person" size={32} active={focused} />
          ),
          tabBarButton: undefined,
          tabBarBadge: undefined,
          href: '/profile',
        }}
      />
    </Tabs>
  );
}