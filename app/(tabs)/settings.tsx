/**
 * Settings Screen with Theme Selection
 */
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
import { useTheme, THEME_NAMES, GameTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useProfileTranslation } from '@/hooks/useTranslation';
import { PixelIcon } from '@/components/icons/PixelIcon';

export default function SettingsScreen() {
  const { currentTheme, availableThemes, setTheme, colors } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const { t } = useProfileTranslation();

  const handleThemeChange = (theme: GameTheme) => {
    setTheme(theme);
    Alert.alert(
      'Thème changé',
      `Thème "${THEME_NAMES[theme]}" activé`,
      [{ text: 'OK' }]
    );
  };

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

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <PixelIcon type="plus" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>PARAMÈTRES</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Theme Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>THÈMES GAMER</Text>
          {availableThemes.map((theme) => (
            <TouchableOpacity
              key={theme.key}
              style={[
                styles.themeItem,
                currentTheme === theme.key && styles.activeThemeItem,
              ]}
              onPress={() => handleThemeChange(theme.key)}
            >
              <View style={styles.themePreview}>
                <View style={[styles.colorPreview, { backgroundColor: theme.colors.primary }]} />
                <View style={[styles.colorPreview, { backgroundColor: theme.colors.accent }]} />
                <View style={[styles.colorPreview, { backgroundColor: theme.colors.secondary }]} />
              </View>
              <Text style={styles.themeName}>{theme.name}</Text>
              {currentTheme === theme.key && (
                <PixelIcon type="heart" size={20} active />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Language Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LANGUE</Text>
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              Alert.alert(
                'Choisir la langue',
                'Sélectionnez votre langue préférée',
                [
                  {
                    text: 'Français',
                    onPress: () => handleLanguageChange('fr'),
                  },
                  {
                    text: 'English',
                    onPress: () => handleLanguageChange('en'),
                  },
                  {
                    text: 'Annuler',
                    style: 'cancel',
                  },
                ]
              );
            }}
          >
            <View style={styles.itemLeft}>
              <PixelIcon type="chat" size={24} />
              <Text style={styles.itemTitle}>Langue</Text>
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemValue}>
                {language === 'fr' ? 'Français' : 'English'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À PROPOS</Text>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutText}>GAMER MEETS v1.0.0</Text>
            <Text style={styles.aboutSubtext}>Application de rencontre gaming</Text>
          </View>
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.glow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  themeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '40',
  },
  activeThemeItem: {
    backgroundColor: colors.primary + '20',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  themePreview: {
    flexDirection: 'row',
    marginRight: 12,
  },
  colorPreview: {
    width: 12,
    height: 12,
    marginRight: 4,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  themeName: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  itemValue: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
    fontFamily: 'monospace',
  },
  aboutItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  aboutText: {
    fontSize: 16,
    color: colors.text,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  aboutSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
});