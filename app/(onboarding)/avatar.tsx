import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '@/components/ui/Button';
import { useOnboardingTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/context/ThemeContext';

export default function AvatarScreen() {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useOnboardingTranslation();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera roll permission is needed');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera permission is needed');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleFinish = async () => {
    console.log('Finish button clicked in avatar screen');
    console.log('Avatar URI:', avatarUri);
    
    setLoading(true);
    
    try {
      console.log('Completing onboarding and navigating to main app');
      // Save onboarding data and navigate to main app
      // This would include uploading the avatar if selected
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error finishing onboarding:', error);
      Alert.alert('Error', 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.progress}>{t('progress', { current: 5, total: 5 })}</Text>
          <Text style={styles.title}>{t('avatar.title')}</Text>
          <Text style={styles.subtitle}>{t('avatar.subtitle')}</Text>
        </View>

        <View style={styles.avatarContainer}>
          <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>+</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.actions}>
            <Button
              title={t('avatar.selectPhoto')}
              onPress={pickImage}
              variant="outline"
              style={styles.actionButton}
            />
            <Button
              title={t('avatar.takePhoto')}
              onPress={takePhoto}
              variant="outline"
              style={styles.actionButton}
            />
            {avatarUri && (
              <TouchableOpacity onPress={() => setAvatarUri(null)}>
                <Text style={styles.removeText}>{t('avatar.removePhoto')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title={t('completion.startExploring')}
            onPress={handleFinish}
            loading={loading}
            style={styles.finishButton}
          />
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>{t('avatar.skip')}</Text>
          </TouchableOpacity>
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
  avatarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrapper: {
    marginBottom: 40,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  avatarPlaceholderText: {
    fontSize: 40,
    color: colors.primary,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  actions: {
    gap: 16,
    alignItems: 'center',
  },
  actionButton: {
    minWidth: 200,
  },
  removeText: {
    fontSize: 16,
    color: colors.error,
    marginTop: 8,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  footer: {
    paddingBottom: 40,
  },
  finishButton: {
    marginBottom: 16,
  },
  skipButton: {
    alignItems: 'center',
  },
  skipText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});