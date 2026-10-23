'use client';

import { useEffect, useState } from 'react';
import { store } from '@/lib/store';
import { Interview, Application } from '@/lib/types';
import Sidebar from '@/components/Sidebar';
import { Plus, Calendar, Clock } from 'lucide-react';

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setInterviews(store.getAllInterviews());
    setApplications(store.getAllApplications());
  };

  const getApplicationName = (appId: string) => {
    const app = applications.find(a => a.id === appId);
    return app ? `${app.companyName} - ${app.jobRole}` : 'Unknown';
  };

  const upcomingInterviews = interviews
    .filter(interview => new Date(interview.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastInterviews = interviews
    .filter(interview => new Date(interview.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Interviews</h1>
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Interview</span>
            </button>
          </div>

          {/* Upcoming Interviews */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="mr-2" size={24} />
              Upcoming Interviews ({upcomingInterviews.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingInterviews.length === 0 ? (
                <div className="col-span-full bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500">No upcoming interviews scheduled.</p>
                </div>
              ) : (
                upcomingInterviews.map((interview) => (
                  <div key={interview.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {getApplicationName(interview.applicationId)}
                        </h3>
                        <p className="text-sm text-primary-600 font-medium">{interview.type}</p>
                      </div>
                      <Calendar className="text-gray-400" size={20} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={16} className="mr-2" />
                        {new Date(interview.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock size={16} className="mr-2" />
                        {new Date(interview.date).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit'
                        })}
                      </div>
                      {interview.interviewer && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Interviewer:</span> {interview.interviewer}
                        </p>
                      )}
                      {interview.notes && (
                        <p className="text-sm text-gray-600 mt-2 pt-2 border-t">
                          {interview.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Past Interviews */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Past Interviews ({pastInterviews.length})
            </h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {pastInterviews.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No past interviews.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {pastInterviews.map((interview) => (
                    <div key={interview.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {getApplicationName(interview.applicationId)}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">{interview.type}</p>
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <span>{new Date(interview.date).toLocaleDateString()}</span>
                            {interview.interviewer && <span>Interviewer: {interview.interviewer}</span>}
                          </div>
                          {interview.notes && (
                            <p className="text-sm text-gray-600 mt-2">{interview.notes}</p>
                          )}
                        </div>
                        {interview.outcome && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            interview.outcome.toLowerCase().includes('pass') || interview.outcome.toLowerCase().includes('success')
                              ? 'bg-green-100 text-green-700'
                              : interview.outcome.toLowerCase().includes('fail') || interview.outcome.toLowerCase().includes('reject')
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {interview.outcome}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add Interview Modal */}
      {showModal && (
        <InterviewModal
          applications={applications}
          onClose={() => setShowModal(false)}
          onSave={() => {
            loadData();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

function InterviewModal({ 
  applications,
  onClose, 
  onSave 
}: { 
  applications: Application[];
  onClose: () => void; 
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    applicationId: '',
    type: '',
    date: '',
    interviewer: '',
    notes: '',
    outcome: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    store.addInterview({
      ...formData,
      id: Date.now().toString(),
    } as Interview);
    
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add Interview</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Application *</label>
            <select
              required
              value={formData.applicationId}
              onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select an application</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.companyName} - {app.jobRole}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interview Type *</label>
              <input
                type="text"
                required
                placeholder="e.g., Technical, HR, Final Round"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time *</label>
              <input
                type="datetime-local"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer</label>
              <input
                type="text"
                value={formData.interviewer}
                onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
              <input
                type="text"
                placeholder="e.g., Passed, Pending"
                value={formData.outcome}
                onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Preparation notes, topics discussed, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Add Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
