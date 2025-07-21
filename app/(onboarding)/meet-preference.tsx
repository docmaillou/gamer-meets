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

type MeetType = 'online' | 'inPerson' | 'mixed';

export default function MeetPreferenceScreen() {
  const [selectedType, setSelectedType] = useState<MeetType | null>(null);
  const router = useRouter();
  const { t } = useOnboardingTranslation();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const meetTypes = [
    {
      key: 'online' as MeetType,
      title: t('meetPreference.online.title'),
      description: t('meetPreference.online.description'),
    },
    {
      key: 'inPerson' as MeetType,
      title: t('meetPreference.inPerson.title'),
      description: t('meetPreference.inPerson.description'),
    },
    {
      key: 'mixed' as MeetType,
      title: t('meetPreference.mixed.title'),
      description: t('meetPreference.mixed.description'),
    },
  ];

  const handleNext = () => {
    if (selectedType) {
      router.push('/(onboarding)/bio');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.progress}>{t('progress', { current: 3, total: 5 })}</Text>
          <Text style={styles.title}>{t('meetPreference.title')}</Text>
          <Text style={styles.subtitle}>{t('meetPreference.subtitle')}</Text>
        </View>

        <View style={styles.options}>
          {meetTypes.map((type) => (
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