import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { PixelIcon } from '@/components/icons/PixelIcon';
import { useMeetsTranslation } from '@/hooks/useTranslation';
import { useAuthContext } from '@/context/AuthContext';
import { getUpcomingMeets, getUserMeets } from '@/services/firestore';
import type { Meet } from '@/types/meet';

export default function MeetsScreen() {
  const { t } = useMeetsTranslation();
  const { colors } = useTheme();
  const { userProfile } = useAuthContext();
  const styles = createStyles(colors);
  
  const [meets, setMeets] = useState<Meet[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'ongoing' | 'past'>('upcoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (userProfile?.phoneNumber) {
      // Subscribe to real-time meets data
      if (activeTab === 'upcoming') {
        unsubscribe = getUpcomingMeets((upcomingMeets) => {
          setMeets(upcomingMeets);
          setLoading(false);
        });
      } else {
        unsubscribe = getUserMeets(userProfile.phoneNumber, (userMeets) => {
          const now = new Date();
          const filteredMeets = userMeets.filter(meet => {
            if (activeTab === 'ongoing') {
              // For simplicity, consider ongoing meetings as those happening today
              const meetDate = new Date(meet.time);
              return meetDate.toDateString() === now.toDateString();
            } else if (activeTab === 'past') {
              return new Date(meet.time) < now;
            }
            return true;
          });
          setMeets(filteredMeets);
          setLoading(false);
        });
      }
    } else {
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userProfile?.phoneNumber, activeTab]);

  const formatMeetTime = (time: Date | string | any): string => {
    try {
      const meetDate = new Date(time);
      // Check if date is valid
      if (isNaN(meetDate.getTime())) {
        return 'Date invalide';
      }
      
      const now = new Date();
      const diffDays = Math.floor((meetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return meetDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      } else if (diffDays === 1) {
        return `Demain ${meetDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
      } else {
        return meetDate.toLocaleDateString('fr-FR', { 
          day: '2-digit', 
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      return 'Date invalide';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('title')}</Text>
        <TouchableOpacity style={styles.addButton}>
          <PixelIcon type="plus" size={24} active />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
              {t('tabs.upcoming')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'ongoing' && styles.activeTab]}
            onPress={() => setActiveTab('ongoing')}
          >
            <Text style={[styles.tabText, activeTab === 'ongoing' && styles.activeTabText]}>
              {t('tabs.ongoing')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'past' && styles.activeTab]}
            onPress={() => setActiveTab('past')}
          >
            <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
              {t('tabs.past')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.meetsList}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Chargement...</Text>
            </View>
          ) : meets.length > 0 ? (
            meets.map((meet, index) => (
              <TouchableOpacity key={meet.id || `meet-${index}`} style={styles.meetCard}>
                <View style={styles.meetHeader}>
                  <Text style={styles.meetTitle}>{meet.title}</Text>
                  <View style={[
                    styles.typeTag,
                    meet.type === 'online' ? styles.onlineTag : styles.inPersonTag
                  ]}>
                    <Text style={[
                      styles.typeText,
                      meet.type === 'online' ? styles.onlineText : styles.inPersonText
                    ]}>
                      {meet.type === 'online' ? 'En ligne' : 'En personne'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.meetGame}>{meet.game}</Text>
                <Text style={styles.meetDescription} numberOfLines={2}>
                  {meet.description}
                </Text>
                <View style={styles.meetFooter}>
                  <Text style={styles.meetTime}>{formatMeetTime(meet.time)}</Text>
                  <Text style={styles.meetParticipants}>
                    {(meet.participants?.length || 0)}/{meet.maxParticipants || '∞'} participants
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <PixelIcon type="heart" size={64} />
              <Text style={styles.emptyTitle}>Aucune rencontre</Text>
              <Text style={styles.emptySubtitle}>
                {activeTab === 'upcoming' 
                  ? 'Pas de rencontres prévues pour le moment'
                  : activeTab === 'ongoing'
                  ? 'Aucune rencontre en cours'
                  : 'Aucune rencontre passée'
                }
              </Text>
            </View>
          )}
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
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: 'monospace',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  content: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  activeTab: {
    backgroundColor: colors.primary,
    borderColor: colors.accent,
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary,
    fontFamily: 'monospace',
    textTransform: 'uppercase',
  },
  activeTabText: {
    color: colors.text,
  },
  meetsList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  meetCard: {
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.glow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  meetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  meetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    fontFamily: 'monospace',
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
    borderWidth: 1,
  },
  onlineTag: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  inPersonTag: {
    backgroundColor: colors.success + '20',
    borderColor: colors.success,
  },
  typeText: {
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    textTransform: 'uppercase',
  },
  onlineText: {
    color: colors.primary,
  },
  inPersonText: {
    color: colors.success,
  },
  meetGame: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  meetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meetTime: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.accent,
    fontFamily: 'monospace',
  },
  meetParticipants: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  meetDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'monospace',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'monospace',
  },
});