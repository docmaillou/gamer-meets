import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { useOnboardingTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/context/ThemeContext';

type GamerType = 'casual' | 'competitive' | 'creator';

export default function GamerTypeScreen() {
  const [selectedType, setSelectedType] = useState<GamerType | null>(null);
  const router = useRouter();
  const { t } = useOnboardingTranslation();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const gamerTypes: { key: GamerType; title: string; description: string }[] = [
    {
      key: 'casual',
      title: t('gamerType.casual.title'),
      description: t('gamerType.casual.description'),
    },
    {
      key: 'competitive',
      title: t('gamerType.competitive.title'),
      description: t('gamerType.competitive.description'),
    },
    {
      key: 'creator',
      title: t('gamerType.creator.title'),
      description: t('gamerType.creator.description'),
    },
  ];

  const handleNext = () => {
    console.log('Next button clicked in gamer-type screen');
    console.log('Selected gamer type:', selectedType);
    
    if (selectedType) {
      console.log('Navigating to favorite-games screen');
      // Store selection in AsyncStorage or context
      router.push('/(onboarding)/favorite-games');
    } else {
      console.log('No gamer type selected');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.progress}>{t('progress', { current: 1, total: 5 })}</Text>
          <Text style={styles.title}>{t('gamerType.title')}</Text>
          <Text style={styles.subtitle}>{t('gamerType.subtitle')}</Text>
        </View>

        <View style={styles.options}>
          {gamerTypes.map((type) => (
            <TouchableOpacity
              key={type.key}
              style={[
                styles.option,
                selectedType === type.key && styles.selectedOption,
              ]}
              onPress={() => setSelectedType(type.key)}
            >
              <Text
                style={[
                  styles.optionTitle,
                  selectedType === type.key && styles.selectedOptionTitle,
                ]}
              >
                {type.title}
              </Text>
              <Text
                style={[
                  styles.optionDescription,
                  selectedType === type.key && styles.selectedOptionDescription,
                ]}
              >
                {type.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Button
            title={t('buttons.next', { ns: 'common' })}
            onPress={handleNext}
            disabled={!selectedType}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  progress: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    fontFamily: 'monospace',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
    fontFamily: 'monospace',
  },
  options: {
    flex: 1,
  },
  option: {
    padding: 20,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: colors.surface,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  selectedOptionTitle: {
    color: colors.primary,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    fontFamily: 'monospace',
  },
  selectedOptionDescription: {
    color: colors.primary,
  },
  footer: {
    paddingBottom: 40,
  },
});