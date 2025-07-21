import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { useOnboardingTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/context/ThemeContext';

export default function BioScreen() {
  const [bio, setBio] = useState('');
  const router = useRouter();
  const { t } = useOnboardingTranslation();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const handleNext = () => {
    if (bio.length >= 10) {
      router.push('/(onboarding)/avatar');
    }
  };

  const maxLength = 500;
  const minLength = 10;
  const isValid = bio.length >= minLength;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.progress}>{t('progress', { current: 4, total: 5 })}</Text>
          <Text style={styles.title}>{t('bio.title')}</Text>
          <Text style={styles.subtitle}>{t('bio.subtitle')}</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={bio}
            onChangeText={setBio}
            placeholder={t('bio.placeholder')}
            multiline
            maxLength={maxLength}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>
            {t('bio.currentLength', { current: bio.length, max: maxLength })}
          </Text>
          {bio.length > 0 && bio.length < minLength && (
            <Text style={styles.minLengthHint}>
              {t('bio.minLength', { min: minLength })}
            </Text>
          )}
        </View>

        <View style={styles.footer}>
          <Button
            title={t('buttons.next', { ns: 'common' })}
            onPress={handleNext}
            disabled={!isValid}
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
    marginBottom: 24,
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
  inputContainer: {
    flex: 1,
  },
  textInput: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    height: 120,
    backgroundColor: colors.surface,
    color: colors.text,
    fontFamily: 'monospace',
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'right',
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  minLengthHint: {
    fontSize: 14,
    color: colors.error,
    marginTop: 4,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  footer: {
    paddingBottom: 40,
  },
});