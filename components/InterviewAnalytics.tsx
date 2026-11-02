'use client';

import { Interview } from '@/lib/types';
import { Card } from './Card';
import { Badge } from './Badge';

interface InterviewAnalyticsProps {
  interviews: Interview[];
}

export default function InterviewAnalytics({ interviews }: InterviewAnalyticsProps) {
  // Calculate stats
  const total = interviews.length;
  const completed = interviews.filter(i => i.status === 'completed').length;
  const scheduled = interviews.filter(i => i.status === 'scheduled').length;
  const cancelled = interviews.filter(i => i.status === 'cancelled').length;

  // By type
  const technical = interviews.filter(i => i.type === 'technical').length;
  const behavioral = interviews.filter(i => i.type === 'behavioral').length;
  const phone = interviews.filter(i => i.type === 'phone').length;
  const onsite = interviews.filter(i => i.type === 'onsite').length;

  // Success rate (completed interviews)
  const successRate = total > 0 ? (completed / total) * 100 : 0;

  // Average interviews per company
  const companiesWithInterviews = new Set(interviews.map(i => i.company));
  const avgPerCompany = companiesWithInterviews.size > 0
    ? (total / companiesWithInterviews.size).toFixed(1)
    : 0;

  // Most active months
  const monthCounts = interviews.reduce((acc, interview) => {
    const month = new Date(interview.date).toLocaleDateString('default', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topMonths = Object.entries(monthCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Interview Analytics
      </h2>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Interviews</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{total}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{completed}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">{scheduled}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {Math.round(successRate)}%
          </p>
        </Card>
      </div>

      {/* Interview Types */}
      <Card>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          By Interview Type
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Technical', count: technical, color: 'blue', icon: '💻' },
            { label: 'Behavioral', count: behavioral, color: 'green', icon: '💬' },
            { label: 'Phone', count: phone, color: 'purple', icon: '📞' },
            { label: 'Onsite', count: onsite, color: 'orange', icon: '🏢' },
          ].map(type => {
            const percentage = total > 0 ? (type.count / total) * 100 : 0;
            return (
              <div key={type.label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{type.icon}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {type.label}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {type.count} ({Math.round(percentage)}%)
                  </span>
                </div>
                <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full bg-${type.color}-500 transition-all`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Company Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Key Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Companies with Interviews</span>
              <span className="text-lg font-bold text-gray-800 dark:text-white">
                {companiesWithInterviews.size}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Avg Interviews per Company</span>
              <span className="text-lg font-bold text-gray-800 dark:text-white">
                {avgPerCompany}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Cancellation Rate</span>
              <span className="text-lg font-bold text-gray-800 dark:text-white">
                {total > 0 ? Math.round((cancelled / total) * 100) : 0}%
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Most Active Months
          </h3>
          <div className="space-y-3">
            {topMonths.length > 0 ? (
              topMonths.map(([month, count], index) => (
                <div key={month} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      #{index + 1}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{month}</span>
                  </div>
                  <Badge variant="primary">{count} interviews</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No data available</p>
            )}
          </div>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          💡 Insights & Recommendations
        </h3>
        <div className="space-y-3">
          {total === 0 && (
            <p className="text-gray-600 dark:text-gray-400">
              No interviews yet. Keep applying and you'll start getting interview invitations!
            </p>
          )}
          
          {total > 0 && successRate < 30 && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-300">
                Your success rate is below average. Consider practicing more interview questions and researching companies thoroughly before interviews.
              </p>
            </div>
          )}

          {total > 0 && successRate >= 70 && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-800 dark:text-green-300">
                Excellent! Your interview success rate is strong. Keep up the great preparation and performance!
              </p>
            </div>
          )}

          {technical > behavioral * 2 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-blue-800 dark:text-blue-300">
                You're having mostly technical interviews. Make sure you're also prepared for behavioral questions using the STAR method.
              </p>
            </div>
          )}

          {cancelled > total * 0.2 && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-300">
                High cancellation rate detected. Try to minimize cancellations by being selective in your applications and ensuring schedule availability.
              </p>
            </div>
          )}

          {companiesWithInterviews.size > 0 && Number(avgPerCompany) < 2 && (
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <p className="text-purple-800 dark:text-purple-300">
                Most companies are conducting single interviews. This might indicate early-stage screenings or single-round processes.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
