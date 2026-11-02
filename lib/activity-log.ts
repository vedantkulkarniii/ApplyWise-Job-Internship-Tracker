/**
 * Activity logging system for tracking user actions
 */

export type ActivityType =
  | 'application_created'
  | 'application_updated'
  | 'application_deleted'
  | 'interview_scheduled'
  | 'interview_completed'
  | 'interview_cancelled'
  | 'reminder_created'
  | 'reminder_completed'
  | 'note_added'
  | 'status_changed'
  | 'data_exported'
  | 'data_imported'
  | 'settings_updated'
  | 'contact_added'
  | 'contact_updated';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  entityId?: string;
  entityType?: 'application' | 'interview' | 'reminder' | 'contact';
  metadata?: Record<string, any>;
}

const STORAGE_KEY = 'applywise_activity_log';
const MAX_ACTIVITIES = 1000; // Keep last 1000 activities

/**
 * Activity log manager
 */
class ActivityLogManager {
  private activities: Activity[] = [];
  private listeners: Array<(activity: Activity) => void> = [];

  constructor() {
    this.load();
  }

  /**
   * Load activities from storage
   */
  private load(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.activities = parsed.map((a: any) => ({
          ...a,
          timestamp: new Date(a.timestamp),
        }));
      }
    } catch (error) {
      console.error('Failed to load activity log:', error);
    }
  }

  /**
   * Save activities to storage
   */
  private save(): void {
    if (typeof window === 'undefined') return;

    try {
      // Keep only the most recent activities
      const toSave = this.activities.slice(-MAX_ACTIVITIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (error) {
      console.error('Failed to save activity log:', error);
    }
  }

  /**
   * Log a new activity
   */
  log(
    type: ActivityType,
    title: string,
    description: string,
    options?: {
      entityId?: string;
      entityType?: Activity['entityType'];
      metadata?: Record<string, any>;
    }
  ): Activity {
    const activity: Activity = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      description,
      timestamp: new Date(),
      ...options,
    };

    this.activities.push(activity);
    this.save();

    // Notify listeners
    this.listeners.forEach(listener => listener(activity));

    return activity;
  }

  /**
   * Get all activities
   */
  getAll(): Activity[] {
    return [...this.activities].reverse(); // Most recent first
  }

  /**
   * Get activities by type
   */
  getByType(type: ActivityType): Activity[] {
    return this.activities.filter(a => a.type === type).reverse();
  }

  /**
   * Get activities for a specific entity
   */
  getByEntity(entityId: string, entityType?: Activity['entityType']): Activity[] {
    return this.activities
      .filter(a => {
        if (entityType) {
          return a.entityId === entityId && a.entityType === entityType;
        }
        return a.entityId === entityId;
      })
      .reverse();
  }

  /**
   * Get activities within a date range
   */
  getByDateRange(startDate: Date, endDate: Date): Activity[] {
    return this.activities
      .filter(a => a.timestamp >= startDate && a.timestamp <= endDate)
      .reverse();
  }

  /**
   * Get today's activities
   */
  getToday(): Activity[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.getByDateRange(today, tomorrow);
  }

  /**
   * Get this week's activities
   */
  getThisWeek(): Activity[] {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    return this.getByDateRange(weekStart, now);
  }

  /**
   * Get this month's activities
   */
  getThisMonth(): Activity[] {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return this.getByDateRange(monthStart, now);
  }

  /**
   * Search activities
   */
  search(query: string): Activity[] {
    const lowerQuery = query.toLowerCase();
    return this.activities
      .filter(
        a =>
          a.title.toLowerCase().includes(lowerQuery) ||
          a.description.toLowerCase().includes(lowerQuery)
      )
      .reverse();
  }

  /**
   * Clear all activities
   */
  clear(): void {
    this.activities = [];
    this.save();
  }

  /**
   * Delete activities older than specified days
   */
  deleteOlderThan(days: number): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    this.activities = this.activities.filter(a => a.timestamp >= cutoffDate);
    this.save();
  }

  /**
   * Subscribe to activity updates
   */
  subscribe(listener: (activity: Activity) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Get activity statistics
   */
  getStats(): {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    byType: Record<ActivityType, number>;
  } {
    const byType = this.activities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {} as Record<ActivityType, number>);

    return {
      total: this.activities.length,
      today: this.getToday().length,
      thisWeek: this.getThisWeek().length,
      thisMonth: this.getThisMonth().length,
      byType,
    };
  }
}

// Export singleton instance
export const activityLog = new ActivityLogManager();

/**
 * Helper functions for common activity types
 */

export function logApplicationCreated(
  applicationId: string,
  company: string,
  position: string
): void {
  activityLog.log(
    'application_created',
    'Application Created',
    `Created application for ${position} at ${company}`,
    {
      entityId: applicationId,
      entityType: 'application',
      metadata: { company, position },
    }
  );
}

export function logApplicationUpdated(
  applicationId: string,
  company: string,
  changes: string[]
): void {
  activityLog.log(
    'application_updated',
    'Application Updated',
    `Updated ${company} application: ${changes.join(', ')}`,
    {
      entityId: applicationId,
      entityType: 'application',
      metadata: { company, changes },
    }
  );
}

export function logStatusChanged(
  applicationId: string,
  company: string,
  oldStatus: string,
  newStatus: string
): void {
  activityLog.log(
    'status_changed',
    'Status Changed',
    `${company} status changed from ${oldStatus} to ${newStatus}`,
    {
      entityId: applicationId,
      entityType: 'application',
      metadata: { company, oldStatus, newStatus },
    }
  );
}

export function logInterviewScheduled(
  interviewId: string,
  company: string,
  date: string
): void {
  activityLog.log(
    'interview_scheduled',
    'Interview Scheduled',
    `Scheduled interview with ${company} on ${new Date(date).toLocaleDateString()}`,
    {
      entityId: interviewId,
      entityType: 'interview',
      metadata: { company, date },
    }
  );
}

export function logInterviewCompleted(
  interviewId: string,
  company: string
): void {
  activityLog.log(
    'interview_completed',
    'Interview Completed',
    `Completed interview with ${company}`,
    {
      entityId: interviewId,
      entityType: 'interview',
      metadata: { company },
    }
  );
}

export function logReminderCreated(
  reminderId: string,
  title: string,
  dueDate: string
): void {
  activityLog.log(
    'reminder_created',
    'Reminder Created',
    `Created reminder: ${title}`,
    {
      entityId: reminderId,
      entityType: 'reminder',
      metadata: { title, dueDate },
    }
  );
}

export function logReminderCompleted(reminderId: string, title: string): void {
  activityLog.log(
    'reminder_completed',
    'Reminder Completed',
    `Completed reminder: ${title}`,
    {
      entityId: reminderId,
      entityType: 'reminder',
      metadata: { title },
    }
  );
}

export function logDataExported(format: string, count: number): void {
  activityLog.log(
    'data_exported',
    'Data Exported',
    `Exported ${count} applications to ${format.toUpperCase()}`,
    {
      metadata: { format, count },
    }
  );
}

export function logDataImported(format: string, count: number): void {
  activityLog.log(
    'data_imported',
    'Data Imported',
    `Imported ${count} applications from ${format.toUpperCase()}`,
    {
      metadata: { format, count },
    }
  );
}

export function logContactAdded(contactId: string, name: string, company: string): void {
  activityLog.log(
    'contact_added',
    'Contact Added',
    `Added ${name} from ${company} to contacts`,
    {
      entityId: contactId,
      entityType: 'contact',
      metadata: { name, company },
    }
  );
}
