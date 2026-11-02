'use client';

import { useState } from 'react';
import { Card } from './Card';

interface NotificationSettings {
  email: {
    enabled: boolean;
    interviewReminders: boolean;
    applicationUpdates: boolean;
    weeklyDigest: boolean;
    monthlyReport: boolean;
  };
  browser: {
    enabled: boolean;
    interviewReminders: boolean;
    reminderAlerts: boolean;
    statusChanges: boolean;
  };
  reminders: {
    interviewAdvanceTime: number; // hours before
    reminderAdvanceTime: number; // hours before
    followUpReminders: boolean;
    followUpDays: number; // days after no response
  };
  quiet: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

export default function NotificationPreferences() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      enabled: true,
      interviewReminders: true,
      applicationUpdates: true,
      weeklyDigest: true,
      monthlyReport: false,
    },
    browser: {
      enabled: true,
      interviewReminders: true,
      reminderAlerts: true,
      statusChanges: false,
    },
    reminders: {
      interviewAdvanceTime: 24,
      reminderAdvanceTime: 1,
      followUpReminders: true,
      followUpDays: 14,
    },
    quiet: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00',
    },
  });

  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>('default');

  const requestBrowserNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setBrowserPermission(permission);
      
      if (permission === 'granted') {
        updateSettings('browser', { ...settings.browser, enabled: true });
      }
    }
  };

  const updateSettings = <K extends keyof NotificationSettings>(
    category: K,
    newSettings: NotificationSettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: newSettings,
    }));
  };

  const saveSettings = () => {
    localStorage.setItem('notification_settings', JSON.stringify(settings));
    // Show success toast
    alert('Notification preferences saved!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Notification Preferences
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Customize how and when you receive notifications
        </p>
      </div>

      {/* Email Notifications */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              📧 Email Notifications
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Receive updates via email
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.email.enabled}
              onChange={(e) =>
                updateSettings('email', { ...settings.email, enabled: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {settings.email.enabled && (
          <div className="space-y-3 ml-4">
            <label className="flex items-center justify-between py-2">
              <span className="text-gray-700 dark:text-gray-300">Interview reminders</span>
              <input
                type="checkbox"
                checked={settings.email.interviewReminders}
                onChange={(e) =>
                  updateSettings('email', {
                    ...settings.email,
                    interviewReminders: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between py-2">
              <span className="text-gray-700 dark:text-gray-300">Application status updates</span>
              <input
                type="checkbox"
                checked={settings.email.applicationUpdates}
                onChange={(e) =>
                  updateSettings('email', {
                    ...settings.email,
                    applicationUpdates: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between py-2">
              <span className="text-gray-700 dark:text-gray-300">Weekly digest</span>
              <input
                type="checkbox"
                checked={settings.email.weeklyDigest}
                onChange={(e) =>
                  updateSettings('email', { ...settings.email, weeklyDigest: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between py-2">
              <span className="text-gray-700 dark:text-gray-300">Monthly analytics report</span>
              <input
                type="checkbox"
                checked={settings.email.monthlyReport}
                onChange={(e) =>
                  updateSettings('email', { ...settings.email, monthlyReport: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
        )}
      </Card>

      {/* Browser Notifications */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              🔔 Browser Notifications
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Get instant alerts in your browser
            </p>
          </div>
          {browserPermission === 'granted' ? (
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.browser.enabled}
                onChange={(e) =>
                  updateSettings('browser', { ...settings.browser, enabled: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          ) : (
            <button
              onClick={requestBrowserNotifications}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Enable Notifications
            </button>
          )}
        </div>

        {settings.browser.enabled && browserPermission === 'granted' && (
          <div className="space-y-3 ml-4">
            <label className="flex items-center justify-between py-2">
              <span className="text-gray-700 dark:text-gray-300">Interview reminders</span>
              <input
                type="checkbox"
                checked={settings.browser.interviewReminders}
                onChange={(e) =>
                  updateSettings('browser', {
                    ...settings.browser,
                    interviewReminders: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between py-2">
              <span className="text-gray-700 dark:text-gray-300">Reminder alerts</span>
              <input
                type="checkbox"
                checked={settings.browser.reminderAlerts}
                onChange={(e) =>
                  updateSettings('browser', {
                    ...settings.browser,
                    reminderAlerts: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between py-2">
              <span className="text-gray-700 dark:text-gray-300">Status changes</span>
              <input
                type="checkbox"
                checked={settings.browser.statusChanges}
                onChange={(e) =>
                  updateSettings('browser', {
                    ...settings.browser,
                    statusChanges: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
        )}
      </Card>

      {/* Reminder Settings */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          ⏰ Reminder Timing
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Interview reminder advance notice
            </label>
            <select
              value={settings.reminders.interviewAdvanceTime}
              onChange={(e) =>
                updateSettings('reminders', {
                  ...settings.reminders,
                  interviewAdvanceTime: Number(e.target.value),
                })
              }
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1}>1 hour before</option>
              <option value={2}>2 hours before</option>
              <option value={4}>4 hours before</option>
              <option value={24}>1 day before</option>
              <option value={48}>2 days before</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task reminder advance notice
            </label>
            <select
              value={settings.reminders.reminderAdvanceTime}
              onChange={(e) =>
                updateSettings('reminders', {
                  ...settings.reminders,
                  reminderAdvanceTime: Number(e.target.value),
                })
              }
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1}>1 hour before</option>
              <option value={2}>2 hours before</option>
              <option value={4}>4 hours before</option>
              <option value={24}>1 day before</option>
            </select>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <label className="flex items-center justify-between py-2">
              <div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Automatic follow-up reminders
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Get reminded to follow up if you haven't heard back
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.reminders.followUpReminders}
                onChange={(e) =>
                  updateSettings('reminders', {
                    ...settings.reminders,
                    followUpReminders: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>

            {settings.reminders.followUpReminders && (
              <div className="mt-3 ml-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Follow-up after
                </label>
                <select
                  value={settings.reminders.followUpDays}
                  onChange={(e) =>
                    updateSettings('reminders', {
                      ...settings.reminders,
                      followUpDays: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={7}>1 week</option>
                  <option value={14}>2 weeks</option>
                  <option value={21}>3 weeks</option>
                  <option value={30}>1 month</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              🌙 Quiet Hours
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Pause notifications during specific hours
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.quiet.enabled}
              onChange={(e) =>
                updateSettings('quiet', { ...settings.quiet, enabled: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {settings.quiet.enabled && (
          <div className="grid grid-cols-2 gap-4 ml-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start time
              </label>
              <input
                type="time"
                value={settings.quiet.startTime}
                onChange={(e) =>
                  updateSettings('quiet', { ...settings.quiet, startTime: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End time
              </label>
              <input
                type="time"
                value={settings.quiet.endTime}
                onChange={(e) =>
                  updateSettings('quiet', { ...settings.quiet, endTime: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
