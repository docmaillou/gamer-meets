import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { PixelIcon } from '@/components/icons/PixelIcon';
import { Button } from '@/components/ui/Button';
import { useMeetingTranslation } from '@/hooks/useTranslation';

export default function MeetingDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { t } = useMeetingTranslation();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const meetId = params.id as string;

  // Mock meeting data
  const mockMeeting = {
    id: meetId,
    title: 'Partie Valorant Ranked',
    description: 'Recherche équipe compétitive pour grind ranked. Niveau minimum Gold requis.',
    game: 'Valorant',
    time: '19:00',
    date: 'Aujourd\'hui',
    type: 'online',
    host: 'Gamer 1234',
    participants: ['Gamer 1234', 'Gamer 5678', 'Gamer 9012'],
    maxParticipants: 5,
  };

  const isParticipant = true; // Mock - user is already a participant

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <PixelIcon type="arrow" size={24} active />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('details')}</Text>
        <TouchableOpacity style={styles.shareButton}>
          <PixelIcon type="heart" size={24} active />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.meetingHeader}>
          <Text style={styles.meetingTitle}>{mockMeeting.title}</Text>
          <View style={styles.typeTag}>
            <Text style={styles.typeText}>
              {mockMeeting.type === 'online' ? t('type.online') : t('type.inPerson')}
            </Text>
          </View>
        </View>

        <Text style={styles.gameTitle}>{mockMeeting.game}</Text>

        <View style={styles.section}>
          <View style={styles.infoRow}>
            <PixelIcon type="plus" size={20} />
            <Text style={styles.infoText}>
              {mockMeeting.date} à {mockMeeting.time}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <PixelIcon type="plus" size={20} />
            <Text style={styles.infoText}>
              {mockMeeting.participants.length}/{mockMeeting.maxParticipants} participants
            </Text>
          </View>
          <View style={styles.infoRow}>
            <PixelIcon type="profile" size={20} />
            <Text style={styles.infoText}>{t('hostedBy', { host: mockMeeting.host })}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('description')}</Text>
          <Text style={styles.description}>{mockMeeting.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('participants')}</Text>
          {mockMeeting.participants.map((participant, index) => (
            <View key={index} style={styles.participantItem}>
              <View style={styles.participantAvatar}>
                <Text style={styles.participantAvatarText}>
                  {participant.slice(-1)}
                </Text>
              </View>
              <Text style={styles.participantName}>{participant}</Text>
              {participant === mockMeeting.host && (
                <View style={styles.hostBadge}>
                  <Text style={styles.hostBadgeText}>{t('host')}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {isParticipant ? (
          <Button
            title={t('buttons.leave')}
            onPress={() => {}}
            variant="outline"
          />
        ) : (
          <Button
            title={t('buttons.join')}
            onPress={() => {}}
          />
        )}
      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: 'monospace',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  shareButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  meetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  meetingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primary,
    borderRadius: 8,
    marginLeft: 16,
    borderWidth: 2,
    borderColor: colors.border,
  },
  typeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.background,
    fontFamily: 'monospace',
    textTransform: 'uppercase',
  },
  gameTitle: {
    fontSize: 18,
    color: colors.accent,
    marginBottom: 24,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  section: {
    marginBottom: 32,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    fontFamily: 'monospace',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    fontFamily: 'monospace',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    fontFamily: 'monospace',
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  participantAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.background,
    fontFamily: 'monospace',
    textTransform: 'uppercase',
  },
  participantName: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
    fontFamily: 'monospace',
  },
  hostBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.accent,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
  },
  hostBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.background,
    fontFamily: 'monospace',
    textTransform: 'uppercase',
  },
  footer: {
    padding: 24,
    borderTopWidth: 2,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});