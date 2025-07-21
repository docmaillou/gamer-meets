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
import { useChatTranslation, useGroupTranslation } from '@/hooks/useTranslation';
import { useAuthContext } from '@/context/AuthContext';
import { getUserConversations, getUserGroups } from '@/services/firestore';
import type { Conversation } from '@/types/conversation';
import type { Group } from '@/types/group';

type TabType = 'conversations' | 'groups';

export default function ConversationsScreen() {
  const { t: chatT } = useChatTranslation();
  const { t: groupT } = useGroupTranslation();
  const { colors } = useTheme();
  const { userProfile } = useAuthContext();
  
  const [activeTab, setActiveTab] = useState<TabType>('conversations');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [groupsLoading, setGroupsLoading] = useState(true);

  const userPhoneNumber = userProfile?.phoneNumber;

  useEffect(() => {
    let conversationsUnsubscribe: (() => void) | undefined;
    let groupsUnsubscribe: (() => void) | undefined;

    if (userPhoneNumber) {
      conversationsUnsubscribe = getUserConversations(userPhoneNumber, (userConversations) => {
        setConversations(userConversations);
        setConversationsLoading(false);
      });
      
      groupsUnsubscribe = getUserGroups(userPhoneNumber, (userGroups) => {
        setGroups(userGroups);
        setGroupsLoading(false);
      });
    } else {
      setConversationsLoading(false);
      setGroupsLoading(false);
    }

    return () => {
      if (conversationsUnsubscribe) {
        conversationsUnsubscribe();
      }
      if (groupsUnsubscribe) {
        groupsUnsubscribe();
      }
    };
  }, [userPhoneNumber]);

  const styles = createStyles(colors);

  const formatTime = (time: Date): string => {
    const messageDate = new Date(time);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return messageDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return t('time.yesterday');
    } else if (diffDays < 7) {
      return messageDate.toLocaleDateString('fr-FR', { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  const getOtherParticipant = (conversation: Conversation): string => {
    const otherPhone = conversation.participants.find(p => p !== userProfile?.phoneNumber);
    return otherPhone ? `GAMER ${otherPhone.slice(-4)}` : t('time.unknown');
  };

  const renderTabButton = (tab: TabType, title: string, icon: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <PixelIcon type={icon as any} size={24} active={activeTab === tab} />
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderConversations = () => {
    const loading = conversationsLoading;
    const t = chatT;
    
    return (
      <>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>{t('time.loading')}</Text>
          </View>
        ) : conversations.length > 0 ? (
          conversations.map((conversation) => (
            <TouchableOpacity key={conversation.id} style={styles.conversationItem}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {getOtherParticipant(conversation).charAt(0)}
                </Text>
              </View>
              <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                  <Text style={styles.conversationName}>{getOtherParticipant(conversation)}</Text>
                  <Text style={styles.conversationTime}>
                    {conversation.lastMessage ? formatTime(conversation.updatedAt) : ''}
                  </Text>
                </View>
                <View style={styles.conversationFooter}>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {conversation.lastMessage?.content || t('time.newConversation')}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <PixelIcon type="chat" size={64} />
            <Text style={styles.emptyTitle}>{t('empty.noConversations')}</Text>
            <Text style={styles.emptySubtitle}>{t('empty.startChatting')}</Text>
          </View>
        )}
      </>
    );
  };

  const renderGroups = () => {
    const loading = groupsLoading;
    const t = groupT;
    
    return (
      <>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>{t('loading')}</Text>
          </View>
        ) : groups.length > 0 ? (
          groups.map((group) => (
            <TouchableOpacity key={group.id} style={styles.groupCard}>
              <View style={styles.groupIcon}>
                <PixelIcon type="users" size={24} active />
              </View>
              <View style={styles.groupContent}>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupDescription} numberOfLines={2}>
                  {group.description}
                </Text>
                <View style={styles.groupFooter}>
                  <View style={styles.tags}>
                    {group.tags?.map((tag) => (
                      <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.memberCount}>
                    {t('memberCount', { count: group.members.length })}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <PixelIcon type="users" size={64} />
            <Text style={styles.emptyTitle}>{t('empty.noGroups')}</Text>
            <Text style={styles.emptySubtitle}>{t('empty.joinOrCreate')}</Text>
          </View>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tabBar}>
          {renderTabButton('conversations', chatT('title'), 'chat')}
          {renderTabButton('groups', groupT('title'), 'users')}
        </View>
        <TouchableOpacity style={styles.newButton}>
          <PixelIcon type="plus" size={24} active />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'conversations' ? renderConversations() : renderGroups()}
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  tabBar: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  activeTabButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: 'monospace',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  activeTabText: {
    color: colors.background,
  },
  newButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    alignSelf: 'flex-end',
  },
  content: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.background,
    fontFamily: 'monospace',
    textTransform: 'uppercase',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  conversationTime: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
    fontFamily: 'monospace',
  },
  unreadBadge: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderWidth: 2,
    borderColor: colors.border,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.background,
    fontFamily: 'monospace',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'monospace',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'monospace',
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
  // Group styles
  groupCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  groupContent: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  groupDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
  },
  tagText: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  memberCount: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
});