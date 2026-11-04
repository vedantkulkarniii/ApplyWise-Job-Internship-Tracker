'use client';

import { Application } from '@/lib/types';
import { Card } from './Card';

interface ApplicationInsightsProps {
  applications: Application[];
}

export default function ApplicationInsights({ applications }: ApplicationInsightsProps) {
  // Calculate insights
  const total = applications.length;
  const applied = applications.filter(a => a.status === 'applied').length;
  const interviewing = applications.filter(a => a.status === 'interview').length;
  const offers = applications.filter(a => a.status === 'offer' || a.status === 'accepted').length;
  const rejected = applications.filter(a => a.status === 'rejected').length;

  // Response rate (applications that moved beyond 'applied')
  const responseRate = total > 0
    ? ((total - applied) / total) * 100
    : 0;

  // Offer rate
  const offerRate = total > 0 ? (offers / total) * 100 : 0;

  // Average time to response
  const responseTimes = applications
    .filter(a => a.status !== 'applied' && a.updatedAt)
    .map(a => {
      const applied = new Date(a.appliedDate);
      const updated = new Date(a.updatedAt);
      return (updated.getTime() - applied.getTime()) / (1000 * 60 * 60 * 24);
    });
  
  const avgResponseTime = responseTimes.length > 0
    ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
    : 0;

  // Applications by location
  const locations = applications.reduce((acc, app) => {
    const loc = app.location || 'Not specified';
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topLocations = Object.entries(locations)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Applications by type
  const types = applications.reduce((acc, app) => {
    const type = app.type || 'Not specified';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Stale applications (applied > 30 days ago with no update)
  const staleApps = applications.filter(a => {
    const days = (Date.now() - new Date(a.appliedDate).getTime()) / (1000 * 60 * 60 * 24);
    return a.status === 'applied' && days > 30;
  });

  // Recent activity (last 7 days)
  const recentApps = applications.filter(a => {
    const days = (Date.now() - new Date(a.appliedDate).getTime()) / (1000 * 60 * 60 * 24);
    return days <= 7;
  });

  // Success factors
  const companiesWithOffers = new Set(
    applications.filter(a => a.status === 'offer' || a.status === 'accepted').map(a => a.company)
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Application Insights
      </h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Response Rate</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {Math.round(responseRate)}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {total - applied} of {total} apps
          </p>
        </Card>
        
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Offer Rate</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
            {Math.round(offerRate)}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {offers} offers received
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {Math.round(avgResponseTime)}d
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            days to hear back
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Pipeline</p>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-1">
            {applied + interviewing}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            in progress
          </p>
        </Card>
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            📊 Activity Summary
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Recent (Last 7 days)</span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {recentApps.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Stale (30+ days)</span>
              <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {staleApps.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Companies with Offers</span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                {companiesWithOffers.size}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            📍 Top Locations
          </h3>
          <div className="space-y-2">
            {topLocations.length > 0 ? (
              topLocations.map(([location, count]) => (
                <div key={location} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{location}</span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">
                    {count} apps
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No location data</p>
            )}
          </div>
        </Card>
      </div>

      {/* Application Types */}
      <Card>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          🎯 By Application Type
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(types).map(([type, count]) => (
            <div key={type} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{count}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 capitalize">{type}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Actionable Insights */}
      <Card>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          💡 Actionable Insights
        </h3>
        <div className="space-y-3">
          {staleApps.length > 0 && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-300 font-medium mb-1">
                {staleApps.length} stale applications detected
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                Follow up on applications from over 30 days ago or mark them as rejected to keep your pipeline clean.
              </p>
            </div>
          )}

          {responseRate < 20 && total > 10 && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-300 font-medium mb-1">
                Low response rate ({Math.round(responseRate)}%)
              </p>
              <p className="text-sm text-red-700 dark:text-red-400">
                Consider improving your resume, tailoring applications more specifically, or targeting roles that better match your experience.
              </p>
            </div>
          )}

          {responseRate > 40 && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-800 dark:text-green-300 font-medium mb-1">
                Strong response rate ({Math.round(responseRate)}%)!
              </p>
              <p className="text-sm text-green-700 dark:text-green-400">
                Your applications are resonating with employers. Keep targeting similar roles and companies.
              </p>
            </div>
          )}

          {recentApps.length === 0 && total > 0 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-blue-800 dark:text-blue-300 font-medium mb-1">
                No recent activity in the last 7 days
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Maintain momentum by applying to 3-5 quality positions per week to keep your pipeline active.
              </p>
            </div>
          )}

          {offerRate > 10 && total > 5 && (
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <p className="text-purple-800 dark:text-purple-300 font-medium mb-1">
                Excellent offer rate ({Math.round(offerRate)}%)!
              </p>
              <p className="text-sm text-purple-700 dark:text-purple-400">
                You're converting applications to offers at a high rate. Your targeting and interview skills are strong!
              </p>
            </div>
          )}

          {rejected > total * 0.5 && total > 5 && (
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <p className="text-orange-800 dark:text-orange-300 font-medium mb-1">
                High rejection rate
              </p>
              <p className="text-sm text-orange-700 dark:text-orange-400">
                Don't get discouraged - job searching is a numbers game. Consider seeking feedback, practicing interviews, and refining your approach.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
