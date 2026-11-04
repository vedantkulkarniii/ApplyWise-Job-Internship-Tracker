/**
 * Browser notification system for ApplyWise
 */

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
  silent?: boolean;
}

export type NotificationPermission = 'default' | 'granted' | 'denied';

class NotificationManager {
  private static instance: NotificationManager;
  private permission: NotificationPermission = 'default';

  private constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  /**
   * Check if notifications are supported
   */
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  /**
   * Get current permission status
   */
  getPermission(): NotificationPermission {
    return this.permission;
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return 'denied';
    }
  }

  /**
   * Show a notification
   */
  async show(options: NotificationOptions): Promise<Notification | null> {
    if (!this.isSupported()) {
      console.warn('Notifications not supported');
      return null;
    }

    if (this.permission !== 'granted') {
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission denied');
        return null;
      }
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/icon-192.png',
        badge: options.badge,
        tag: options.tag,
        data: options.data,
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
      });

      return notification;
    } catch (error) {
      console.error('Failed to show notification:', error);
      return null;
    }
  }

  /**
   * Schedule a notification for later
   */
  scheduleNotification(options: NotificationOptions, delay: number): number {
    return window.setTimeout(() => {
      this.show(options);
    }, delay);
  }

  /**
   * Cancel a scheduled notification
   */
  cancelScheduledNotification(timeoutId: number): void {
    clearTimeout(timeoutId);
  }
}

export const notificationManager = NotificationManager.getInstance();

/**
 * Notification templates for common scenarios
 */
export const NotificationTemplates = {
  interviewReminder: (company: string, position: string, timeUntil: string) => ({
    title: `Interview Reminder: ${company}`,
    body: `Your interview for ${position} is ${timeUntil}. Good luck!`,
    tag: 'interview-reminder',
    requireInteraction: true,
  }),

  applicationDeadline: (company: string, position: string) => ({
    title: `Application Deadline: ${company}`,
    body: `Don't forget to apply for ${position} before the deadline!`,
    tag: 'deadline-reminder',
    requireInteraction: true,
  }),

  followUp: (company: string) => ({
    title: `Follow-up Reminder: ${company}`,
    body: `It's time to follow up on your application with ${company}.`,
    tag: 'follow-up-reminder',
  }),

  interviewCompleted: (company: string) => ({
    title: 'Interview Completed!',
    body: `Great job on your interview with ${company}! Don't forget to send a thank-you note.`,
    tag: 'interview-complete',
  }),

  offerReceived: (company: string, position: string) => ({
    title: '🎉 Offer Received!',
    body: `Congratulations! You received an offer for ${position} at ${company}!`,
    tag: 'offer-received',
    requireInteraction: true,
  }),

  dailySummary: (count: number) => ({
    title: 'Daily Job Search Summary',
    body: `You have ${count} active application${count !== 1 ? 's' : ''} to follow up on.`,
    tag: 'daily-summary',
  }),
};

/**
 * Schedule reminder based on interview date
 */
export function scheduleInterviewReminder(
  interviewDate: Date,
  company: string,
  position: string
): number[] {
  const now = Date.now();
  const interviewTime = interviewDate.getTime();
  const timeoutIds: number[] = [];

  // 24 hours before
  const oneDayBefore = interviewTime - 24 * 60 * 60 * 1000;
  if (oneDayBefore > now) {
    const id = notificationManager.scheduleNotification(
      NotificationTemplates.interviewReminder(company, position, 'in 24 hours'),
      oneDayBefore - now
    );
    timeoutIds.push(id);
  }

  // 1 hour before
  const oneHourBefore = interviewTime - 60 * 60 * 1000;
  if (oneHourBefore > now) {
    const id = notificationManager.scheduleNotification(
      NotificationTemplates.interviewReminder(company, position, 'in 1 hour'),
      oneHourBefore - now
    );
    timeoutIds.push(id);
  }

  // 15 minutes before
  const fifteenMinBefore = interviewTime - 15 * 60 * 1000;
  if (fifteenMinBefore > now) {
    const id = notificationManager.scheduleNotification(
      NotificationTemplates.interviewReminder(company, position, 'in 15 minutes'),
      fifteenMinBefore - now
    );
    timeoutIds.push(id);
  }

  return timeoutIds;
}

/**
 * Schedule follow-up reminder
 */
export function scheduleFollowUpReminder(
  applicationDate: Date,
  company: string,
  daysUntilFollowUp: number = 7
): number {
  const now = Date.now();
  const followUpTime = applicationDate.getTime() + daysUntilFollowUp * 24 * 60 * 60 * 1000;

  if (followUpTime > now) {
    return notificationManager.scheduleNotification(
      NotificationTemplates.followUp(company),
      followUpTime - now
    );
  }

  return 0;
}

/**
 * Send daily summary notification
 */
export function sendDailySummary(activeApplicationsCount: number): void {
  notificationManager.show(NotificationTemplates.dailySummary(activeApplicationsCount));
}

/**
 * Check and request notification permission on app load
 */
export async function initializeNotifications(): Promise<boolean> {
  if (!notificationManager.isSupported()) {
    return false;
  }

  const permission = notificationManager.getPermission();
  
  if (permission === 'default') {
    const newPermission = await notificationManager.requestPermission();
    return newPermission === 'granted';
  }

  return permission === 'granted';
}

/**
 * Store notification preferences
 */
export interface NotificationPreferences {
  enabled: boolean;
  interviewReminders: boolean;
  followUpReminders: boolean;
  dailySummary: boolean;
  deadlineReminders: boolean;
  sound: boolean;
}

const PREFS_KEY = 'applywise_notification_prefs';

export function getNotificationPreferences(): NotificationPreferences {
  if (typeof window === 'undefined') {
    return {
      enabled: true,
      interviewReminders: true,
      followUpReminders: true,
      dailySummary: true,
      deadlineReminders: true,
      sound: true,
    };
  }

  const stored = localStorage.getItem(PREFS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }

  return {
    enabled: true,
    interviewReminders: true,
    followUpReminders: true,
    dailySummary: true,
    deadlineReminders: true,
    sound: true,
  };
}

export function saveNotificationPreferences(prefs: NotificationPreferences): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}
