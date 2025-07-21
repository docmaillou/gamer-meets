import messagingService from '@/services/messaging';
import { Alert, Platform } from 'react-native';

/**
 * Messaging tools for testing and debugging
 */
export class MessagingTools {
  /**
   * Show current push tokens
   */
  static showTokens(): void {
    const tokens = messagingService.getPushTokens();
    
    console.log('=== PUSH TOKENS ===');
    console.log('Expo Token:', tokens.expo);
    console.log('FCM Token:', tokens.fcm);
    
    Alert.alert(
      '📱 Push Tokens',
      `Expo Token: ${tokens.expo ? '✅ Available' : '❌ Not available'}\n\nFCM Token: ${tokens.fcm ? '✅ Available' : '❌ Not available'}`,
      [
        {
          text: 'Copy Expo Token',
          onPress: () => {
            if (tokens.expo) {
              console.log('Expo Token (copy this):', tokens.expo);
            }
          },
        },
        {
          text: 'Copy FCM Token',
          onPress: () => {
            if (tokens.fcm) {
              console.log('FCM Token (copy this):', tokens.fcm);
            }
          },
        },
        { text: 'OK', style: 'cancel' },
      ]
    );
  }

  /**
   * Test local notification
   */
  static async testLocalNotification(): Promise<void> {
    try {
      // Add a small delay to prevent React queue issues
      await new Promise(resolve => setTimeout(resolve, 100));
      await messagingService.testNotification();
      
      // Use setTimeout to prevent immediate state updates
      setTimeout(() => {
        Alert.alert('✅ Success', 'Test notification sent!');
      }, 50);
    } catch (error) {
      console.error('Test notification failed:', error);
      setTimeout(() => {
        Alert.alert('❌ Error', 'Failed to send test notification');
      }, 50);
    }
  }

  /**
   * Test Expo push notification (requires another device token)
   */
  static testExpoPushNotification(): void {
    // Use setTimeout to prevent React queue issues with prompts
    setTimeout(() => {
      if (Platform.OS === 'web') {
        // Web doesn't support Alert.prompt, use regular alert
        const token = prompt('Enter the Expo push token of the target device:');
        if (token) {
          this.sendTestPush(token);
        }
      } else {
        Alert.prompt(
          '📤 Test Expo Push',
          'Enter the Expo push token of the target device:',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Send',
              onPress: (token) => {
                if (token) {
                  this.sendTestPush(token);
                }
              },
            },
          ],
          'plain-text'
        );
      }
    }, 100);
  }

  /**
   * Send test push notification
   */
  static async sendTestPush(token: string): Promise<void> {
    try {
      await messagingService.sendExpoPushNotification(token, {
        title: '🧪 Test Push from Gamer Meets',
        body: 'This is a test push notification!',
        data: { test: true },
        sound: true,
      });
      setTimeout(() => {
        Alert.alert('✅ Success', 'Push notification sent!');
      }, 50);
    } catch (error) {
      console.error('Push notification failed:', error);
      setTimeout(() => {
        Alert.alert('❌ Error', 'Failed to send push notification');
      }, 50);
    }
  }

  /**
   * Check notification permissions
   */
  static async checkPermissions(): Promise<void> {
    try {
      const permissions = await messagingService.getPermissionsStatus();
      
      console.log('=== NOTIFICATION PERMISSIONS ===');
      console.log('Status:', permissions.status);
      console.log('Can ask again:', permissions.canAskAgain);
      console.log('Granted:', permissions.granted);
      
      Alert.alert(
        '🔔 Notification Permissions',
        `Status: ${permissions.status}\nGranted: ${permissions.granted}\nCan ask again: ${permissions.canAskAgain}`,
        [
          {
            text: 'Request Permissions',
            onPress: async () => {
              const newPermissions = await messagingService.requestPermissions();
              Alert.alert(
                'Permissions Updated',
                `New status: ${newPermissions.status}`
              );
            },
          },
          { text: 'OK', style: 'cancel' },
        ]
      );
    } catch (error) {
      console.error('Error checking permissions:', error);
      Alert.alert('❌ Error', 'Failed to check permissions');
    }
  }

  /**
   * Clear all notifications
   */
  static async clearNotifications(): Promise<void> {
    try {
      await messagingService.clearAllNotifications();
      Alert.alert('✅ Success', 'All notifications cleared!');
    } catch (error) {
      console.error('Error clearing notifications:', error);
      Alert.alert('❌ Error', 'Failed to clear notifications');
    }
  }

  /**
   * Show all messaging tools menu
   */
  static showToolsMenu(): void {
    Alert.alert(
      '🛠️ Messaging Tools',
      'Choose a messaging tool to test:',
      [
        {
          text: '📱 Show Tokens',
          onPress: () => this.showTokens(),
        },
        {
          text: '🧪 Test Local Notification',
          onPress: () => this.testLocalNotification(),
        },
        {
          text: '📤 Test Push Notification',
          onPress: () => this.testExpoPushNotification(),
        },
        {
          text: '🔔 Check Permissions',
          onPress: () => this.checkPermissions(),
        },
        {
          text: '🗑️ Clear Notifications',
          onPress: () => this.clearNotifications(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  }
}

/**
 * Quick access functions for global usage
 */
export const showMessagingTokens = () => MessagingTools.showTokens();
export const testNotification = () => MessagingTools.testLocalNotification();
export const testPushNotification = () => MessagingTools.testExpoPushNotification();
export const checkNotificationPermissions = () => MessagingTools.checkPermissions();
export const clearAllNotifications = () => MessagingTools.clearNotifications();
export const showMessagingTools = () => MessagingTools.showToolsMenu();

// Make tools available globally for console access
if (__DEV__) {
  (global as any).messagingTools = {
    showTokens: showMessagingTokens,
    testNotification,
    testPush: testPushNotification,
    checkPermissions: checkNotificationPermissions,
    clearNotifications: clearAllNotifications,
    showMenu: showMessagingTools,
  };
  
  console.log('🛠️ Messaging tools available globally:');
  console.log('- messagingTools.showTokens()');
  console.log('- messagingTools.testNotification()');
  console.log('- messagingTools.testPush()');
  console.log('- messagingTools.checkPermissions()');
  console.log('- messagingTools.clearNotifications()');
  console.log('- messagingTools.showMenu()');
}