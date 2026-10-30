'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import Tabs, { Tab } from '@/components/Tabs';
import { User, Bell, Database, Shield, Palette, Download, Upload, Trash2 } from 'lucide-react';
import { exportAllData, importFromJSON } from '@/lib/export';
import { store } from '@/lib/store';
import { toast } from '@/components/ToastContainer';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const handleExportData = () => {
    const applications = store.getAllApplications();
    const interviews = store.getAllInterviews();
    const reminders = store.getAllReminders();
    exportAllData(applications, interviews, reminders);
    toast.success('Data exported successfully!');
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await importFromJSON(file);
      
      // Import applications
      if (data.applications) {
        data.applications.forEach((app: any) => store.addApplication(app));
      }
      
      // Import interviews
      if (data.interviews) {
        data.interviews.forEach((interview: any) => store.addInterview(interview));
      }
      
      // Import reminders
      if (data.reminders) {
        data.reminders.forEach((reminder: any) => store.addReminder(reminder));
      }
      
      toast.success('Data imported successfully!');
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error('Failed to import data. Please check the file format.');
    }
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
      localStorage.clear();
      toast.success('All data cleared successfully!');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const tabs: Tab[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="h-4 w-4" />,
      content: <ProfileSettings />,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="h-4 w-4" />,
      content: <NotificationSettings />,
    },
    {
      id: 'data',
      label: 'Data & Privacy',
      icon: <Database className="h-4 w-4" />,
      content: (
        <DataSettings
          onExport={handleExportData}
          onImport={handleImportData}
          onClearAll={handleClearAllData}
        />
      ),
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: <Palette className="h-4 w-4" />,
      content: <AppearanceSettings />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
          </div>

          <Tabs tabs={tabs} defaultTab={activeTab} onChange={setActiveTab} />
        </div>
      </main>
    </div>
  );
}

function ProfileSettings() {
  const [profile, setProfile] = useState({
    name: localStorage.getItem('userProfile_name') || '',
    email: localStorage.getItem('userProfile_email') || '',
    phone: localStorage.getItem('userProfile_phone') || '',
    location: localStorage.getItem('userProfile_location') || '',
  });

  const handleSave = () => {
    localStorage.setItem('userProfile_name', profile.name);
    localStorage.setItem('userProfile_email', profile.email);
    localStorage.setItem('userProfile_phone', profile.phone);
    localStorage.setItem('userProfile_location', profile.location);
    toast.success('Profile saved successfully!');
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="New York, NY"
          />
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </Card>
  );
}

function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    emailReminders: localStorage.getItem('notify_email') === 'true',
    interviewAlerts: localStorage.getItem('notify_interviews') === 'true',
    deadlineAlerts: localStorage.getItem('notify_deadlines') === 'true',
    weeklyDigest: localStorage.getItem('notify_digest') === 'true',
  });

  const handleToggle = (key: keyof typeof notifications) => {
    const newValue = !notifications[key];
    setNotifications({ ...notifications, [key]: newValue });
    localStorage.setItem(`notify_${key}`, String(newValue));
    toast.success('Notification preferences updated!');
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
      <div className="space-y-4">
        {Object.entries(notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
            <div>
              <p className="font-medium text-gray-900">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              </p>
              <p className="text-sm text-gray-600">
                Get notified about {key.toLowerCase().replace(/([A-Z])/g, ' $1')}
              </p>
            </div>
            <button
              onClick={() => handleToggle(key as keyof typeof notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                value ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function DataSettings({
  onExport,
  onImport,
  onClearAll,
}: {
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearAll: () => void;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
        <div className="space-y-4">
          <div className="flex items-start justify-between py-3 border-b border-gray-200">
            <div className="flex-1">
              <p className="font-medium text-gray-900">Export Data</p>
              <p className="text-sm text-gray-600">Download all your data as JSON</p>
            </div>
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
          <div className="flex items-start justify-between py-3 border-b border-gray-200">
            <div className="flex-1">
              <p className="font-medium text-gray-900">Import Data</p>
              <p className="text-sm text-gray-600">Restore data from a backup file</p>
            </div>
            <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
              <Upload className="h-4 w-4" />
              Import
              <input type="file" accept=".json" onChange={onImport} className="hidden" />
            </label>
          </div>
          <div className="flex items-start justify-between py-3">
            <div className="flex-1">
              <p className="font-medium text-red-600">Clear All Data</p>
              <p className="text-sm text-gray-600">Permanently delete all your data</p>
            </div>
            <button
              onClick={onClearAll}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function AppearanceSettings() {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-4">Dark mode and theme customization coming soon!</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border-2 border-blue-600 rounded-lg cursor-pointer">
              <div className="h-20 bg-white rounded mb-2"></div>
              <p className="text-sm font-medium text-center">Light</p>
            </div>
            <div className="p-4 border-2 border-gray-300 rounded-lg cursor-not-allowed opacity-50">
              <div className="h-20 bg-gray-900 rounded mb-2"></div>
              <p className="text-sm font-medium text-center">Dark (Soon)</p>
            </div>
            <div className="p-4 border-2 border-gray-300 rounded-lg cursor-not-allowed opacity-50">
              <div className="h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded mb-2"></div>
              <p className="text-sm font-medium text-center">Auto (Soon)</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
