import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { useOnboardingTranslation } from '@/hooks/useTranslation';
import { useTheme } from '@/context/ThemeContext';
import { POPULAR_GAMES } from '@/utils/constants';

export default function FavoriteGamesScreen() {
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const router = useRouter();
  const { t } = useOnboardingTranslation();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const toggleGame = (game: string) => {
    if (selectedGames.includes(game)) {
      setSelectedGames(selectedGames.filter(g => g !== game));
    } else if (selectedGames.length < 10) {
      setSelectedGames([...selectedGames, game]);
    }
  };

  const handleNext = () => {
    if (selectedGames.length > 0) {
      router.push('/(onboarding)/meet-preference');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.progress}>{t('progress', { current: 2, total: 5 })}</Text>
          <Text style={styles.title}>{t('favoriteGames.title')}</Text>
          <Text style={styles.subtitle}>{t('favoriteGames.subtitle')}</Text>
        </View>

        <ScrollView style={styles.gamesList} showsVerticalScrollIndicator={false}>
          <View style={styles.gamesGrid}>
            {POPULAR_GAMES.map((game) => (
              <TouchableOpacity
                key={game}
                style={[
                  styles.gameChip,
                  selectedGames.includes(game) && styles.selectedGameChip,
                ]}
                onPress={() => toggleGame(game)}
              >
                <Text
                  style={[
                    styles.gameText,
                    selectedGames.includes(game) && styles.selectedGameText,
                  ]}
                >
                  {game}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.selectedCount}>
            {t('favoriteGames.selectedCount', { count: selectedGames.length })}
          </Text>
          <Button
            title={t('buttons.next', { ns: 'common' })}
            onPress={handleNext}
            disabled={selectedGames.length === 0}
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
  gamesList: {
    flex: 1,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gameChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  selectedGameChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  gameText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  selectedGameText: {
    color: colors.background,
  },
  footer: {
    paddingBottom: 40,
  },
  selectedCount: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
});