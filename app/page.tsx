'use client';

import { useEffect, useState } from 'react';
import { store } from '@/lib/store';
import { Application, Interview, Reminder } from '@/lib/types';
import { Briefcase, CheckCircle, XCircle, Clock, TrendingUp, Download, Calendar, Bell, Target } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import StatsCard from '@/components/StatsCard';
import SimpleBarChart from '@/components/SimpleBarChart';
import Card from '@/components/Card';
import { loadSampleData } from '@/lib/sample-data';
import { calculateSuccessRate, getApplicationTrend } from '@/lib/analytics';

export default function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const handleLoadSampleData = () => {
    loadSampleData();
    setApplications(store.getAllApplications());
    setInterviews(store.getAllInterviews());
    setReminders(store.getAllReminders());
    window.location.reload();
  };

  useEffect(() => {
    setApplications(store.getAllApplications());
    setInterviews(store.getAllInterviews());
    setReminders(store.getAllReminders());
  }, []);

  const stats = {
    total: applications.length,
    applied: applications.filter(app => app.status === 'applied').length,
    interviews: applications.filter(app => app.status === 'interview').length,
    offers: applications.filter(app => app.status === 'offer' || app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  const upcomingInterviews = interviews.filter(i => i.status === 'scheduled').length;
  const activeReminders = reminders.filter(r => !r.completed).length;
  const successRate = calculateSuccessRate(applications);

  const statusChartData = [
    { label: 'Applied', value: stats.applied, color: '#3B82F6' },
    { label: 'Interview', value: stats.interviews, color: '#F59E0B' },
    { label: 'Offers', value: stats.offers, color: '#10B981' },
    { label: 'Rejected', value: stats.rejected, color: '#EF4444' },
  ];

  const recentApplications = applications
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, 5);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's your job search overview</p>
            </div>
            {applications.length === 0 && (
              <button
                onClick={handleLoadSampleData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                <Download size={20} />
                <span>Load Sample Data</span>
              </button>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Applications"
              value={stats.total}
              icon={Briefcase}
              color="blue"
              subtitle="All time"
            />
            <StatsCard
              title="Active Interviews"
              value={upcomingInterviews}
              icon={Calendar}
              color="yellow"
              subtitle="Scheduled"
            />
            <StatsCard
              title="Offers Received"
              value={stats.offers}
              icon={CheckCircle}
              color="green"
              subtitle={`${successRate}% success rate`}
            />
            <StatsCard
              title="Pending Reminders"
              value={activeReminders}
              icon={Bell}
              color="purple"
              subtitle="Action needed"
            />
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.applied}</p>
                  <p className="text-xs text-gray-500 mt-1">Applications submitted</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Interview Stage</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.interviews}</p>
                  <p className="text-xs text-gray-500 mt-1">Active conversations</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                  <p className="text-xs text-gray-500 mt-1">Learn and improve</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Status Distribution Chart */}
            <SimpleBarChart
              data={statusChartData}
              title="Application Status Distribution"
              height={250}
            />

            {/* Recent Applications */}
            <Card title="Recent Applications">
              {recentApplications.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No applications yet</p>
                  <p className="text-sm text-gray-400 mt-1">Start tracking your job applications!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentApplications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{app.company}</p>
                        <p className="text-sm text-gray-600">{app.position}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{new Date(app.appliedDate).toLocaleDateString()}</p>
                        <span className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${
                          app.status === 'offer' || app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          app.status === 'interview' ? 'bg-yellow-100 text-yellow-700' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
