'use client';

import { useEffect, useState } from 'react';
import { store } from '@/lib/store';
import { Application, Interview } from '@/lib/types';
import Sidebar from '@/components/Sidebar';
import { AlertCircle, Calendar, Clock } from 'lucide-react';

export default function RemindersPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);

  useEffect(() => {
    setApplications(store.getAllApplications());
    setInterviews(store.getAllInterviews());
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingInterviews = interviews
    .filter(interview => {
      const interviewDate = new Date(interview.date);
      return interviewDate >= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 10);

  const upcomingDeadlines = applications
    .filter(app => {
      if (!app.deadline) return false;
      const deadlineDate = new Date(app.deadline);
      return deadlineDate >= today;
    })
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 10);

  const followUps = applications
    .filter(app => {
      if (!app.followUpDate) return false;
      const followUpDate = new Date(app.followUpDate);
      return followUpDate >= today;
    })
    .sort((a, b) => new Date(a.followUpDate!).getTime() - new Date(b.followUpDate!).getTime())
    .slice(0, 10);

  const overdueDeadlines = applications
    .filter(app => {
      if (!app.deadline) return false;
      const deadlineDate = new Date(app.deadline);
      return deadlineDate < today && app.status === 'Wishlist';
    })
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());

  const getApplicationName = (appId: string) => {
    const app = applications.find(a => a.id === appId);
    return app ? `${app.companyName} - ${app.jobRole}` : 'Unknown';
  };

  const getDaysUntil = (dateString: string) => {
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    return `In ${diffDays} days`;
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Reminders & Deadlines</h1>

          {/* Overdue Items */}
          {overdueDeadlines.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="text-red-600 mr-2" size={24} />
                <h2 className="text-xl font-semibold text-red-900">Overdue Deadlines</h2>
              </div>
              <div className="space-y-3">
                {overdueDeadlines.map((app) => (
                  <div key={app.id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{app.companyName}</h3>
                      <p className="text-sm text-gray-600">{app.jobRole}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-red-600 font-medium">{getDaysUntil(app.deadline!)}</span>
                      <p className="text-sm text-gray-500">{new Date(app.deadline!).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Interviews */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Calendar className="text-primary-600 mr-2" size={24} />
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Interviews</h2>
              </div>
              {upcomingInterviews.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No upcoming interviews</p>
              ) : (
                <div className="space-y-3">
                  {upcomingInterviews.map((interview) => (
                    <div key={interview.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {getApplicationName(interview.applicationId)}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">{interview.type}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock size={14} className="mr-1" />
                            {new Date(interview.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          getDaysUntil(interview.date) === 'Today' 
                            ? 'bg-red-100 text-red-700' 
                            : getDaysUntil(interview.date) === 'Tomorrow'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {getDaysUntil(interview.date)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="text-orange-600 mr-2" size={24} />
                <h2 className="text-xl font-semibold text-gray-900">Application Deadlines</h2>
              </div>
              {upcomingDeadlines.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No upcoming deadlines</p>
              ) : (
                <div className="space-y-3">
                  {upcomingDeadlines.map((app) => (
                    <div key={app.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{app.companyName}</h3>
                          <p className="text-sm text-gray-600 mb-1">{app.jobRole}</p>
                          <p className="text-xs text-gray-500">
                            Deadline: {new Date(app.deadline!).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          getDaysUntil(app.deadline!) === 'Today' 
                            ? 'bg-red-100 text-red-700' 
                            : getDaysUntil(app.deadline!) === 'Tomorrow'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {getDaysUntil(app.deadline!)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Follow-ups */}
            <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
              <div className="flex items-center mb-4">
                <Clock className="text-purple-600 mr-2" size={24} />
                <h2 className="text-xl font-semibold text-gray-900">Follow-ups Needed</h2>
              </div>
              {followUps.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No follow-ups scheduled</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {followUps.map((app) => (
                    <div key={app.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{app.companyName}</h3>
                          <p className="text-sm text-gray-600 mb-1">{app.jobRole}</p>
                          <p className="text-xs text-gray-500">
                            Status: <span className="font-medium">{app.status}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Follow-up: {new Date(app.followUpDate!).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          getDaysUntil(app.followUpDate!) === 'Today' 
                            ? 'bg-red-100 text-red-700' 
                            : getDaysUntil(app.followUpDate!) === 'Tomorrow'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {getDaysUntil(app.followUpDate!)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
