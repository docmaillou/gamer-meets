import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthContext } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useProfileTranslation } from '@/hooks/useTranslation';
import { PixelIcon } from '@/components/icons/PixelIcon';

export default function ProfileScreen() {
  const { userProfile, signOut } = useAuthContext();
  const { language, changeLanguage } = useLanguage();
  const { colors } = useTheme();
  const { t } = useProfileTranslation();

  const handleLanguageChange = async (newLanguage: 'fr' | 'en') => {
    try {
      await changeLanguage(newLanguage);
      Alert.alert(
        t('success.languageChanged'),
        `Language changed to ${newLanguage === 'fr' ? 'Français' : 'English'}`
      );
    } catch (error) {
      console.error('Error changing language:', error);
      Alert.alert('Erreur', 'Impossible de changer la langue');
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      t('confirmations.logout.title'),
      t('confirmations.logout.message'),
      [
        {
          text: t('confirmations.logout.cancel'),
          style: 'cancel',
        },
        {
          text: t('confirmations.logout.confirm'),
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('title').toUpperCase()}</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => router.push('/(tabs)/settings')}
        >
          <PixelIcon type="settings" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <PixelIcon type="profile" size={48} active />
          </View>
          <Text style={styles.profileName}>
            GAMER {userProfile?.phoneNumber?.slice(-4) || '1234'}
          </Text>
          {userProfile?.bio && (
            <Text style={styles.profileBio}>{userProfile.bio}</Text>
          )}
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('sections.settings')}</Text>
          
          <TouchableOpacity
            style={styles.item}
            onPress={() => router.push('/(tabs)/settings')}
          >
            <View style={styles.itemLeft}>
              <PixelIcon type="settings" size={24} />
              <Text style={styles.itemTitle}>PARAMÈTRES</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <PixelIcon type="sword" size={24} />
            <Text style={styles.signOutText}>{t('settings.logout').toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>
            GAMER MEETS v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    shadowColor: colors.glow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  settingsButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.glow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  profileBio: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
    fontFamily: 'monospace',
  },
  section: {
    backgroundColor: colors.surface,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.glow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  signOutText: {
    fontSize: 16,
    color: colors.error,
    marginLeft: 12,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
});