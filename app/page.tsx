'use client';

import { useEffect, useState } from 'react';
import { store } from '@/lib/store';
import { Application } from '@/lib/types';
import { Briefcase, CheckCircle, XCircle, Clock, TrendingUp, Download } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { loadSampleData } from '@/lib/sample-data';

export default function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([]);

  const handleLoadSampleData = () => {
    loadSampleData();
    setApplications(store.getAllApplications());
    window.location.reload();
  };

  useEffect(() => {
    setApplications(store.getAllApplications());
  }, []);

  const stats = {
    total: applications.length,
    applied: applications.filter(app => app.status === 'Applied').length,
    interviews: applications.filter(app => app.status === 'Interview' || app.status === 'Online Assessment').length,
    offers: applications.filter(app => app.status === 'Offer' || app.status === 'Accepted').length,
    rejected: applications.filter(app => app.status === 'Rejected').length,
  };

  const statusDistribution = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentApplications = applications
    .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime())
    .slice(0, 5);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            {applications.length === 0 && (
              <button
                onClick={handleLoadSampleData}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
              >
                <Download size={20} />
                <span>Load Sample Data</span>
              </button>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Briefcase className="text-primary-500" size={32} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Applied</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.applied}</p>
                </div>
                <TrendingUp className="text-blue-500" size={32} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Interviews</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.interviews}</p>
                </div>
                <Clock className="text-yellow-500" size={32} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Offers</p>
                  <p className="text-3xl font-bold text-green-600">{stats.offers}</p>
                </div>
                <CheckCircle className="text-green-500" size={32} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <XCircle className="text-red-500" size={32} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Status Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Status</h2>
              <div className="space-y-3">
                {Object.entries(statusDistribution).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-gray-700">{status}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: `${(count / stats.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-gray-900 font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Applications</h2>
              {recentApplications.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No applications yet. Add your first application!</p>
              ) : (
                <div className="space-y-3">
                  {recentApplications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{app.companyName}</p>
                        <p className="text-sm text-gray-600">{app.jobRole}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{new Date(app.applicationDate).toLocaleDateString()}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          app.status === 'Offer' ? 'bg-green-100 text-green-700' :
                          app.status === 'Interview' ? 'bg-yellow-100 text-yellow-700' :
                          app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {app.status}
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
