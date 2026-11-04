'use client';

import { Application, Interview, Reminder } from '@/lib/types';

interface QuickStatsDashboardProps {
  applications: Application[];
  interviews: Interview[];
  reminders: Reminder[];
}

export default function QuickStatsDashboard({
  applications,
  interviews,
  reminders,
}: QuickStatsDashboardProps) {
  // Calculate stats
  const stats = {
    total: applications.length,
    active: applications.filter(a => a.status !== 'rejected').length,
    interviews: interviews.filter(i => i.status === 'scheduled').length,
    offers: applications.filter(a => a.status === 'offer' || a.status === 'accepted').length,
    pending: reminders.filter(r => !r.completed).length,
    thisWeek: applications.filter(a => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(a.appliedDate) >= weekAgo;
    }).length,
  };

  const quickStats = [
    {
      label: 'Total Applications',
      value: stats.total,
      icon: '📝',
      color: 'bg-blue-500',
      change: `+${stats.thisWeek} this week`,
    },
    {
      label: 'Active Pipeline',
      value: stats.active,
      icon: '🔄',
      color: 'bg-purple-500',
      change: `${Math.round((stats.active / stats.total) * 100) || 0}% active`,
    },
    {
      label: 'Interviews',
      value: stats.interviews,
      icon: '🎤',
      color: 'bg-yellow-500',
      change: interviews.length > 0 ? 'Scheduled' : 'None scheduled',
    },
    {
      label: 'Offers',
      value: stats.offers,
      icon: '🎯',
      color: 'bg-green-500',
      change: stats.offers > 0 ? 'Received!' : 'Pending',
    },
    {
      label: 'Reminders',
      value: stats.pending,
      icon: '🔔',
      color: 'bg-orange-500',
      change: `${stats.pending} pending`,
    },
    {
      label: 'Success Rate',
      value: `${Math.round((stats.offers / stats.total) * 100) || 0}%`,
      icon: '📈',
      color: 'bg-teal-500',
      change: 'Overall',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {quickStats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 p-4 hover:shadow-lg transition-all hover:-translate-y-1"
        >
          <div className="flex items-start justify-between mb-2">
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-xl`}>
              {stat.icon}
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
            {stat.value}
          </p>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            {stat.label}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {stat.change}
          </p>
        </div>
      ))}
    </div>
  );
}
