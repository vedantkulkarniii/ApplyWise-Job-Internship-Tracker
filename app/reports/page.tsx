'use client';

import { useEffect, useState } from 'react';
import { store } from '@/lib/store';
import { Application, Interview } from '@/lib/types';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import SimpleBarChart from '@/components/SimpleBarChart';
import StatsCard from '@/components/StatsCard';
import { BarChart3, TrendingUp, Clock, Target, Calendar, Award } from 'lucide-react';
import { calculateSuccessRate, getAverageResponseTime } from '@/lib/analytics';

export default function ReportsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);

  useEffect(() => {
    setApplications(store.getAllApplications());
    setInterviews(store.getAllInterviews());
  }, []);

  // Calculate statistics
  const totalApplications = applications.length;
  const successRate = calculateSuccessRate(applications);
  const avgResponseTime = getAverageResponseTime(applications);
  
  const activeApplications = applications.filter(a => 
    ['applied', 'screening', 'interview'].includes(a.status)
  ).length;

  const totalInterviews = interviews.length;
  const completedInterviews = interviews.filter(i => i.status === 'completed').length;

  // Status distribution
  const statusData = [
    { label: 'Applied', value: applications.filter(a => a.status === 'applied').length, color: '#3B82F6' },
    { label: 'Screening', value: applications.filter(a => a.status === 'screening').length, color: '#8B5CF6' },
    { label: 'Interview', value: applications.filter(a => a.status === 'interview').length, color: '#F59E0B' },
    { label: 'Offer', value: applications.filter(a => a.status === 'offer').length, color: '#10B981' },
    { label: 'Rejected', value: applications.filter(a => a.status === 'rejected').length, color: '#EF4444' },
    { label: 'Accepted', value: applications.filter(a => a.status === 'accepted').length, color: '#059669' },
  ];

  // Job type distribution
  const jobTypeData = [
    { label: 'Full-time', value: applications.filter(a => a.jobType === 'full-time').length, color: '#3B82F6' },
    { label: 'Part-time', value: applications.filter(a => a.jobType === 'part-time').length, color: '#8B5CF6' },
    { label: 'Internship', value: applications.filter(a => a.jobType === 'internship').length, color: '#10B981' },
    { label: 'Contract', value: applications.filter(a => a.jobType === 'contract').length, color: '#F59E0B' },
  ];

  // Monthly applications
  const getMonthlyData = () => {
    const months: { [key: string]: number } = {};
    applications.forEach(app => {
      const date = new Date(app.appliedDate);
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      months[monthYear] = (months[monthYear] || 0) + 1;
    });
    
    return Object.entries(months)
      .slice(-6)
      .map(([label, value]) => ({ label, value, color: '#3B82F6' }));
  };

  const monthlyData = getMonthlyData();

  // Top companies
  const getTopCompanies = () => {
    const companies: { [key: string]: number } = {};
    applications.forEach(app => {
      companies[app.company] = (companies[app.company] || 0) + 1;
    });
    
    return Object.entries(companies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([company, count]) => ({ company, count }));
  };

  const topCompanies = getTopCompanies();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">Insights into your job search progress</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Applications"
              value={totalApplications}
              icon={BarChart3}
              color="blue"
              subtitle="All time"
            />
            <StatsCard
              title="Success Rate"
              value={`${successRate}%`}
              icon={Target}
              color="green"
              subtitle="Offer conversion"
            />
            <StatsCard
              title="Active Pipeline"
              value={activeApplications}
              icon={TrendingUp}
              color="purple"
              subtitle="In progress"
            />
            <StatsCard
              title="Interviews"
              value={`${completedInterviews}/${totalInterviews}`}
              icon={Calendar}
              color="yellow"
              subtitle="Completed"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SimpleBarChart
              data={statusData}
              title="Application Status Distribution"
              height={300}
            />
            <SimpleBarChart
              data={jobTypeData}
              title="Job Type Distribution"
              height={300}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trend */}
            <SimpleBarChart
              data={monthlyData}
              title="Applications Over Time (Last 6 Months)"
              height={300}
            />

            {/* Top Companies */}
            <Card title="Top Companies Applied">
              {topCompanies.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No data available yet
                </div>
              ) : (
                <div className="space-y-4">
                  {topCompanies.map(({ company, count }, index) => (
                    <div key={company} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white
                          ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-500'}
                        `}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{company}</p>
                          <p className="text-sm text-gray-500">{count} application{count > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(count / topCompanies[0].count) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Additional Insights */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Avg Response Time</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{avgResponseTime} days</p>
              <p className="text-sm text-gray-600 mt-1">Time from apply to response</p>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Interview Rate</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {totalApplications > 0 ? Math.round((totalInterviews / totalApplications) * 100) : 0}%
              </p>
              <p className="text-sm text-gray-600 mt-1">Applications leading to interviews</p>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">This Month</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {applications.filter(a => {
                  const date = new Date(a.appliedDate);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Applications submitted</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
