import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { PixelIcon } from '@/components/icons/PixelIcon';
import { isBypassMode, bypassRoutes, routeLabels, getCurrentRouteName, BypassRoute } from '@/utils/bypass';
import { showMessagingTools } from '@/utils/messagingTools';

interface BypassButtonProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const BypassButton: React.FC<BypassButtonProps> = ({
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { colors } = useTheme();

  // Don't render if bypass mode is disabled
  if (!isBypassMode()) {
    return null;
  }

  const handleNavigate = useCallback((route: BypassRoute) => {
    console.log(`[BYPASS] Navigating to: ${route}`);
    setIsVisible(false);
    
    // Use setTimeout to prevent React queue issues
    setTimeout(() => {
      // Special handling for certain routes
      if (route.includes('verify')) {
        router.push({
          pathname: route as any,
          params: { phoneNumber: '+15141234567' }
        });
      } else {
        router.push(route as any);
      }
    }, 100);
  }, [router]);

  const getPositionStyle = useMemo(() => {
    const baseStyles: any = {
      position: 'absolute',
      zIndex: 9999,
    };

    switch (position) {
      case 'top-left':
        return { ...baseStyles, top: Platform.OS === 'ios' ? 50 : 20, left: 20 };
      case 'top-right':
        return { ...baseStyles, top: Platform.OS === 'ios' ? 50 : 20, right: 20 };
      case 'bottom-left':
        return { ...baseStyles, bottom: Platform.OS === 'ios' ? 90 : 20, left: 20 };
      case 'bottom-right':
        return { ...baseStyles, bottom: Platform.OS === 'ios' ? 90 : 20, right: 20 };
      default:
        return { ...baseStyles, top: Platform.OS === 'ios' ? 50 : 20, right: 20 };
    }
  }, [position]);

  const styles = createStyles(colors);

  return (
    <>
      <TouchableOpacity
        style={[styles.bypassButton, getPositionStyle]}
        onPress={() => setIsVisible(true)}
        activeOpacity={0.7}
      >
        <PixelIcon type="settings" size={20} active />
        <Text style={styles.bypassButtonText}>BYPASS</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsVisible(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>ADMIN BYPASS MODE</Text>
              <TouchableOpacity
                onPress={() => setIsVisible(false)}
                style={styles.closeButton}
              >
                <PixelIcon type="arrow" size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.currentRoute}>
              <Text style={styles.currentRouteLabel}>Current Route:</Text>
              <Text style={styles.currentRouteValue}>{getCurrentRouteName(pathname)}</Text>
              <Text style={styles.currentRoutePath}>{pathname}</Text>
            </View>

            <ScrollView style={styles.routesList}>
              <Text style={styles.sectionTitle}>AUTHENTICATION</Text>
              {['login', 'verify'].map((key) => (
                <TouchableOpacity
                  key={key}
                  style={styles.routeItem}
                  onPress={() => handleNavigate(bypassRoutes[key as keyof typeof bypassRoutes])}
                >
                  <Text style={styles.routeLabel}>
                    {routeLabels[key as keyof typeof routeLabels]}
                  </Text>
                  <PixelIcon type="arrow" size={16} />
                </TouchableOpacity>
              ))}

              <Text style={styles.sectionTitle}>ONBOARDING</Text>
              {['gamerType', 'favoriteGames', 'meetPreference', 'bio', 'avatar'].map((key) => (
                <TouchableOpacity
                  key={key}
                  style={styles.routeItem}
                  onPress={() => handleNavigate(bypassRoutes[key as keyof typeof bypassRoutes])}
                >
                  <Text style={styles.routeLabel}>
                    {routeLabels[key as keyof typeof routeLabels]}
                  </Text>
                  <PixelIcon type="arrow" size={16} />
                </TouchableOpacity>
              ))}

              <Text style={styles.sectionTitle}>MAIN APP</Text>
              {['tabs', 'meets', 'conversations', 'groups', 'profile', 'meetingDetail'].map((key) => (
                <TouchableOpacity
                  key={key}
                  style={styles.routeItem}
                  onPress={() => handleNavigate(bypassRoutes[key as keyof typeof bypassRoutes])}
                >
                  <Text style={styles.routeLabel}>
                    {routeLabels[key as keyof typeof routeLabels]}
                  </Text>
                  <PixelIcon type="arrow" size={16} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.toolsButton}
                onPress={() => {
                  setIsVisible(false);
                  setTimeout(() => showMessagingTools(), 200);
                }}
              >
                <PixelIcon type="chat" size={16} />
                <Text style={styles.toolsButtonText}>MESSAGING TOOLS</Text>
              </TouchableOpacity>
              
              <Text style={styles.footerText}>
BYPASS MODE ENABLED FOR TESTING ONLY
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  bypassButton: {
    backgroundColor: colors.error,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.glow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  bypassButtonText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  closeButton: {
    padding: 4,
  },
  currentRoute: {
    padding: 16,
    backgroundColor: '#F2F2F7',
    margin: 16,
    borderRadius: 12,
  },
  currentRouteLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  currentRouteValue: {
    fontSize: 16,
    color: '#1C1C1E',
    fontWeight: '600',
    marginTop: 2,
  },
  currentRoutePath: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  routesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 4,
  },
  routeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  routeLabel: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    alignItems: 'center',
  },
  toolsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  toolsButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
});