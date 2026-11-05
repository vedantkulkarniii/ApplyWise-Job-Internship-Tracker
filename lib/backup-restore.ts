import { Application, Interview, Reminder } from './types';

/**
 * Data backup and restore system for ApplyWise
 */

export interface BackupData {
  version: string;
  timestamp: string;
  applications: Application[];
  interviews: Interview[];
  reminders: Reminder[];
  metadata: {
    totalApplications: number;
    totalInterviews: number;
    totalReminders: number;
    exportedBy: string;
  };
}

/**
 * Create a full backup of all data
 */
export function createBackup(
  applications: Application[],
  interviews: Interview[],
  reminders: Reminder[]
): BackupData {
  return {
    version: '1.0',
    timestamp: new Date().toISOString(),
    applications,
    interviews,
    reminders,
    metadata: {
      totalApplications: applications.length,
      totalInterviews: interviews.length,
      totalReminders: reminders.length,
      exportedBy: 'ApplyWise',
    },
  };
}

/**
 * Export backup to JSON file
 */
export function exportBackup(backup: BackupData): void {
  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `applywise-backup-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Import backup from JSON file
 */
export async function importBackup(file: File): Promise<BackupData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const backup = JSON.parse(text) as BackupData;

        // Validate backup structure
        if (!validateBackup(backup)) {
          reject(new Error('Invalid backup file format'));
          return;
        }

        resolve(backup);
      } catch (error) {
        reject(new Error('Failed to parse backup file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read backup file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Validate backup data structure
 */
function validateBackup(data: any): data is BackupData {
  return (
    data &&
    typeof data === 'object' &&
    'version' in data &&
    'timestamp' in data &&
    'applications' in data &&
    'interviews' in data &&
    'reminders' in data &&
    Array.isArray(data.applications) &&
    Array.isArray(data.interviews) &&
    Array.isArray(data.reminders)
  );
}

/**
 * Merge backup data with existing data
 */
export interface MergeOptions {
  strategy: 'replace' | 'merge' | 'skip-duplicates';
  conflictResolution?: 'keep-newer' | 'keep-existing' | 'keep-backup';
}

export function mergeBackupData(
  existing: {
    applications: Application[];
    interviews: Interview[];
    reminders: Reminder[];
  },
  backup: BackupData,
  options: MergeOptions = { strategy: 'merge' }
): {
  applications: Application[];
  interviews: Interview[];
  reminders: Reminder[];
} {
  if (options.strategy === 'replace') {
    return {
      applications: backup.applications,
      interviews: backup.interviews,
      reminders: backup.reminders,
    };
  }

  return {
    applications: mergeArrays(
      existing.applications,
      backup.applications,
      options
    ),
    interviews: mergeArrays(
      existing.interviews,
      backup.interviews,
      options
    ),
    reminders: mergeArrays(
      existing.reminders,
      backup.reminders,
      options
    ),
  };
}

function mergeArrays<T extends { id: string; updatedAt: string }>(
  existing: T[],
  incoming: T[],
  options: MergeOptions
): T[] {
  if (options.strategy === 'replace') {
    return incoming;
  }

  const merged = new Map<string, T>();

  // Add existing items
  existing.forEach(item => merged.set(item.id, item));

  // Process incoming items
  incoming.forEach(item => {
    const existingItem = merged.get(item.id);

    if (!existingItem) {
      // New item, add it
      if (options.strategy === 'merge') {
        merged.set(item.id, item);
      }
    } else {
      // Item exists, handle conflict
      const resolution = options.conflictResolution || 'keep-newer';

      if (resolution === 'keep-backup') {
        merged.set(item.id, item);
      } else if (resolution === 'keep-newer') {
        const existingDate = new Date(existingItem.updatedAt).getTime();
        const incomingDate = new Date(item.updatedAt).getTime();
        if (incomingDate > existingDate) {
          merged.set(item.id, item);
        }
      }
      // 'keep-existing' does nothing
    }
  });

  return Array.from(merged.values());
}

/**
 * Auto-backup functionality
 */
export class AutoBackupManager {
  private interval: number = 24 * 60 * 60 * 1000; // 24 hours
  private storageKey = 'applywise_last_backup';
  private backupCount = 5;

  shouldBackup(): boolean {
    const lastBackup = localStorage.getItem(this.storageKey);
    if (!lastBackup) return true;

    const lastBackupTime = new Date(lastBackup).getTime();
    const now = Date.now();

    return now - lastBackupTime > this.interval;
  }

  recordBackup(): void {
    localStorage.setItem(this.storageKey, new Date().toISOString());
  }

  getLastBackupTime(): Date | null {
    const lastBackup = localStorage.getItem(this.storageKey);
    return lastBackup ? new Date(lastBackup) : null;
  }

  async createAutoBackup(
    applications: Application[],
    interviews: Interview[],
    reminders: Reminder[]
  ): Promise<void> {
    const backup = createBackup(applications, interviews, reminders);
    const backups = this.getStoredBackups();

    // Add new backup
    backups.push(backup);

    // Keep only last N backups
    const trimmedBackups = backups.slice(-this.backupCount);

    // Store backups
    localStorage.setItem('applywise_auto_backups', JSON.stringify(trimmedBackups));
    this.recordBackup();
  }

  getStoredBackups(): BackupData[] {
    try {
      const stored = localStorage.getItem('applywise_auto_backups');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  restoreFromAutoBackup(index: number): BackupData | null {
    const backups = this.getStoredBackups();
    return backups[index] || null;
  }

  clearAutoBackups(): void {
    localStorage.removeItem('applywise_auto_backups');
    localStorage.removeItem(this.storageKey);
  }
}

/**
 * Export specific date range
 */
export function createPartialBackup(
  applications: Application[],
  interviews: Interview[],
  reminders: Reminder[],
  startDate: Date,
  endDate: Date
): BackupData {
  const filteredApplications = applications.filter(app => {
    const date = new Date(app.appliedDate);
    return date >= startDate && date <= endDate;
  });

  const appIds = new Set(filteredApplications.map(a => a.id));

  const filteredInterviews = interviews.filter(
    int => appIds.has(int.applicationId)
  );

  const filteredReminders = reminders.filter(
    rem => appIds.has(rem.applicationId)
  );

  return createBackup(filteredApplications, filteredInterviews, filteredReminders);
}

/**
 * Get backup statistics
 */
export function getBackupStats(backup: BackupData) {
  const statusCounts = backup.applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalRecords: backup.applications.length + backup.interviews.length + backup.reminders.length,
    applications: backup.applications.length,
    interviews: backup.interviews.length,
    reminders: backup.reminders.length,
    statusBreakdown: statusCounts,
    timestamp: backup.timestamp,
    version: backup.version,
  };
}

/**
 * Compress backup data (simplified)
 */
export function compressBackup(backup: BackupData): string {
  // In production, use a compression library like pako
  return JSON.stringify(backup);
}

/**
 * Decompress backup data
 */
export function decompressBackup(compressed: string): BackupData {
  return JSON.parse(compressed);
}

/**
 * Cloud backup integration (placeholder)
 */
export interface CloudBackupOptions {
  provider: 'google-drive' | 'dropbox' | 'onedrive';
  autoSync: boolean;
  syncInterval: number;
}

export class CloudBackupService {
  private options: CloudBackupOptions;

  constructor(options: CloudBackupOptions) {
    this.options = options;
  }

  async upload(backup: BackupData): Promise<{ success: boolean; url?: string }> {
    // Placeholder for cloud upload
    console.log('Cloud backup not implemented yet');
    return { success: false };
  }

  async download(url: string): Promise<BackupData | null> {
    // Placeholder for cloud download
    console.log('Cloud restore not implemented yet');
    return null;
  }

  async listBackups(): Promise<Array<{ name: string; date: string; size: number }>> {
    // Placeholder for listing cloud backups
    return [];
  }
}
