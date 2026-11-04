'use client';

import { useState } from 'react';
import { Application, Interview, Reminder } from '@/lib/types';
import { getRelativeTime } from '@/lib/date-utils';

interface Activity {
  id: string;
  type: 'application' | 'interview' | 'reminder' | 'status_change' | 'note';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
  relatedId?: string;
}

interface ActivityFeedProps {
  applications?: Application[];
  interviews?: Interview[];
  reminders?: Reminder[];
  limit?: number;
}

export default function ActivityFeed({
  applications = [],
  interviews = [],
  reminders = [],
  limit = 20,
}: ActivityFeedProps) {
  const [filter, setFilter] = useState<'all' | Activity['type']>('all');

  // Generate activities from data
  const generateActivities = (): Activity[] => {
    const activities: Activity[] = [];

    // Application activities
    applications.forEach(app => {
      activities.push({
        id: `app-${app.id}`,
        type: 'application',
        title: `Applied to ${app.company}`,
        description: `${app.position} • ${app.status}`,
        timestamp: app.appliedDate,
        icon: '📝',
        color: 'text-blue-600 dark:text-blue-400',
        relatedId: app.id,
      });

      if (app.updatedAt && app.updatedAt !== app.createdAt) {
        activities.push({
          id: `status-${app.id}`,
          type: 'status_change',
          title: `Status updated: ${app.company}`,
          description: `Changed to ${app.status}`,
          timestamp: app.updatedAt,
          icon: '🔄',
          color: 'text-purple-600 dark:text-purple-400',
          relatedId: app.id,
        });
      }
    });

    // Interview activities
    interviews.forEach(interview => {
      activities.push({
        id: `interview-${interview.id}`,
        type: 'interview',
        title: `Interview scheduled: ${interview.company}`,
        description: `${interview.type} interview • ${interview.status}`,
        timestamp: interview.createdAt,
        icon: '🎤',
        color: 'text-yellow-600 dark:text-yellow-400',
        relatedId: interview.id,
      });
    });

    // Reminder activities
    reminders.forEach(reminder => {
      activities.push({
        id: `reminder-${reminder.id}`,
        type: 'reminder',
        title: reminder.completed ? `Completed: ${reminder.title}` : `Reminder: ${reminder.title}`,
        description: reminder.description || 'No description',
        timestamp: reminder.completed ? reminder.updatedAt : reminder.createdAt,
        icon: reminder.completed ? '✅' : '🔔',
        color: reminder.completed
          ? 'text-green-600 dark:text-green-400'
          : 'text-orange-600 dark:text-orange-400',
        relatedId: reminder.id,
      });
    });

    // Sort by timestamp (newest first)
    return activities.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  const allActivities = generateActivities();
  const filteredActivities =
    filter === 'all' ? allActivities : allActivities.filter(a => a.type === filter);
  const displayedActivities = filteredActivities.slice(0, limit);

  const activityCounts = {
    all: allActivities.length,
    application: allActivities.filter(a => a.type === 'application').length,
    interview: allActivities.filter(a => a.type === 'interview').length,
    reminder: allActivities.filter(a => a.type === 'reminder').length,
    status_change: allActivities.filter(a => a.type === 'status_change').length,
    note: allActivities.filter(a => a.type === 'note').length,
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Activity Feed
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {displayedActivities.length} of {filteredActivities.length} activities
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All ({activityCounts.all})
        </button>
        <button
          onClick={() => setFilter('application')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'application'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          📝 Applications ({activityCounts.application})
        </button>
        <button
          onClick={() => setFilter('interview')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'interview'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          🎤 Interviews ({activityCounts.interview})
        </button>
        <button
          onClick={() => setFilter('reminder')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'reminder'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          🔔 Reminders ({activityCounts.reminder})
        </button>
        <button
          onClick={() => setFilter('status_change')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'status_change'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          🔄 Updates ({activityCounts.status_change})
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {displayedActivities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No activities to show
            </p>
          </div>
        ) : (
          displayedActivities.map((activity, index) => (
            <div
              key={activity.id}
              className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center text-2xl border-2 border-gray-200 dark:border-gray-700">
                  {activity.icon}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className={`font-semibold ${activity.color}`}>
                      {activity.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                    {getRelativeTime(activity.timestamp)}
                  </span>
                </div>
              </div>

              {/* Timeline connector */}
              {index < displayedActivities.length - 1 && (
                <div className="absolute left-10 w-0.5 h-full bg-gray-200 dark:bg-gray-700 top-16" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredActivities.length > limit && (
        <button className="w-full mt-6 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium">
          Load More Activities
        </button>
      )}

      {/* Stats Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {activityCounts.application}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Applications</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {activityCounts.interview}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Interviews</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {activityCounts.reminder}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Reminders</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {activityCounts.status_change}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Updates</p>
        </div>
      </div>
    </div>
  );
}
