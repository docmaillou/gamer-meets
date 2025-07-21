import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { 
  getMessaging, 
  getToken, 
  onMessage, 
  isSupported as isMessagingSupported 
} from 'firebase/messaging';
import { app } from './firebase';

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: boolean;
  badge?: number;
}

export interface PushNotificationToken {
  token: string;
  type: 'expo' | 'fcm';
}

class MessagingService {
  private messaging: any = null;
  private expoPushToken: string | null = null;
  private fcmToken: string | null = null;

  constructor() {
    this.initializeNotifications();
    this.initializeFirebaseMessaging();
  }

  /**
   * Initialize Expo notifications
   */
  private async initializeNotifications() {
    try {
      // Set notification handler
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Notification permissions not granted');
        return;
      }

      // Get Expo push token
      if (Platform.OS !== 'web') {
        this.expoPushToken = (await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        })).data;
        console.log('Expo Push Token:', this.expoPushToken);
      }

      console.log('Expo notifications initialized successfully');
    } catch (error) {
      console.error('Error initializing Expo notifications:', error);
    }
  }

  /**
   * Initialize Firebase Cloud Messaging
   */
  private async initializeFirebaseMessaging() {
    try {
      // Check if FCM is supported (mainly for web)
      if (Platform.OS === 'web') {
        const supported = await isMessagingSupported();
        if (!supported) {
          console.log('Firebase messaging not supported on this browser');
          return;
        }
      }

      this.messaging = getMessaging(app);

      // Get FCM token
      if (Platform.OS === 'web') {
        // For web, we need a VAPID key (you'll need to generate this in Firebase Console)
        // For now, we'll skip this for web
        console.log('FCM on web requires VAPID key configuration');
      } else {
        // For mobile, get the FCM token
        this.fcmToken = await getToken(this.messaging);
        console.log('FCM Token:', this.fcmToken);
      }

      // Listen for foreground messages
      if (this.messaging) {
        onMessage(this.messaging, (payload) => {
          console.log('Foreground message received:', payload);
          this.handleForegroundMessage(payload);
        });
      }

      console.log('Firebase messaging initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase messaging:', error);
    }
  }

  /**
   * Handle foreground messages
   */
  private async handleForegroundMessage(payload: any) {
    try {
      const { notification, data } = payload;
      
      if (notification) {
        await this.showLocalNotification({
          title: notification.title || 'New Message',
          body: notification.body || '',
          data: data || {},
          sound: true,
        });
      }
    } catch (error) {
      console.error('Error handling foreground message:', error);
    }
  }

  /**
   * Show a local notification
   */
  async showLocalNotification(notificationData: NotificationData): Promise<string> {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationData.title,
          body: notificationData.body,
          data: notificationData.data || {},
          sound: notificationData.sound !== false,
          badge: notificationData.badge,
        },
        trigger: null, // Show immediately
      });

      console.log('Local notification scheduled:', identifier);
      return identifier;
    } catch (error) {
      console.error('Error showing local notification:', error);
      throw error;
    }
  }

  /**
   * Send a push notification using Expo Push API
   */
  async sendExpoPushNotification(
    to: string | string[],
    notificationData: NotificationData
  ): Promise<void> {
    try {
      const message = {
        to: Array.isArray(to) ? to : [to],
        sound: notificationData.sound !== false ? 'default' : undefined,
        title: notificationData.title,
        body: notificationData.body,
        data: notificationData.data || {},
        badge: notificationData.badge,
      };

      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();
      console.log('Expo push notification sent:', result);
    } catch (error) {
      console.error('Error sending Expo push notification:', error);
      throw error;
    }
  }

  /**
   * Get the current push tokens
   */
  getPushTokens(): { expo: string | null; fcm: string | null } {
    return {
      expo: this.expoPushToken,
      fcm: this.fcmToken,
    };
  }

  /**
   * Subscribe to notification events
   */
  addNotificationReceivedListener(listener: (notification: Notifications.Notification) => void) {
    return Notifications.addNotificationReceivedListener(listener);
  }

  addNotificationResponseReceivedListener(
    listener: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  /**
   * Remove notification listeners
   */
  removeNotificationSubscription(subscription: Notifications.Subscription) {
    Notifications.removeNotificationSubscription(subscription);
  }

  /**
   * Clear all notifications
   */
  async clearAllNotifications(): Promise<void> {
    try {
      await Notifications.dismissAllNotificationsAsync();
      console.log('All notifications cleared');
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }

  /**
   * Get notification permissions status
   */
  async getPermissionsStatus(): Promise<Notifications.NotificationPermissionsStatus> {
    return await Notifications.getPermissionsAsync();
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<Notifications.NotificationPermissionsStatus> {
    return await Notifications.requestPermissionsAsync();
  }

  /**
   * Test notification functionality
   */
  async testNotification(): Promise<void> {
    try {
      await this.showLocalNotification({
        title: '🧪 Test Notification',
        body: 'This is a test notification from Gamer Meets!',
        data: { test: true },
        sound: true,
      });
      console.log('Test notification sent successfully');
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  }
}

// Export singleton instance
const messagingService = new MessagingService();
export default messagingService;