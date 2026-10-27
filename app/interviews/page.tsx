'use client';

import { useEffect, useState } from 'react';
import { store } from '@/lib/store';
import { Interview } from '@/lib/types';
import Sidebar from '@/components/Sidebar';
import Modal from '@/components/Modal';
import InterviewForm from '@/components/InterviewForm';
import EmptyState from '@/components/EmptyState';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import { Plus, Calendar, Clock, Video, Users, Edit2, Trash2 } from 'lucide-react';
import ConfirmDialog from '@/components/ConfirmDialog';
import { exportInterviews } from '@/lib/export';

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setInterviews(store.getAllInterviews());
  };

  const handleFormSubmit = (data: Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingInterview) {
      store.updateInterview(editingInterview.id, data);
    } else {
      store.addInterview({
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Interview);
    }
    loadData();
    setShowModal(false);
    setEditingInterview(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      store.deleteInterview(deleteId);
      loadData();
      setDeleteId(null);
    }
  };

  const handleEdit = (interview: Interview) => {
    setEditingInterview(interview);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingInterview(null);
    setShowModal(true);
  };

  const upcomingInterviews = interviews
    .filter(interview => new Date(`${interview.date}T${interview.time}`) >= new Date())
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  const pastInterviews = interviews
    .filter(interview => new Date(`${interview.date}T${interview.time}`) < new Date())
    .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Interviews</h1>
              <p className="text-gray-600 mt-1">{upcomingInterviews.length} upcoming interviews</p>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              <span>Schedule Interview</span>
            </button>
          </div>

          {/* Upcoming Interviews */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="mr-2 text-blue-600" size={24} />
              Upcoming Interviews
            </h2>
            {upcomingInterviews.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No upcoming interviews"
                description="Schedule your first interview to keep track of your interview process"
                actionLabel="Schedule Interview"
                onAction={handleAddNew}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingInterviews.map((interview) => (
                  <Card key={interview.id} className="hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {interview.company}
                        </h3>
                        <p className="text-sm text-gray-600">{interview.position}</p>
                      </div>
                      <Badge variant="primary" size="sm">{interview.type}</Badge>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={16} className="mr-2" />
                        {new Date(interview.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock size={16} className="mr-2" />
                        {interview.time} ({interview.duration} min)
                      </div>
                      {interview.interviewer && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Users size={16} className="mr-2" />
                          {interview.interviewer}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleEdit(interview)}
                        className="flex-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Edit2 size={14} className="inline mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(interview.id)}
                        className="flex-1 text-sm text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 size={14} className="inline mr-1" />
                        Delete
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Past Interviews */}
          {pastInterviews.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Past Interviews ({pastInterviews.length})
              </h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {pastInterviews.map((interview) => (
                    <div key={interview.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {interview.company} - {interview.position}
                            </h3>
                            <Badge variant={interview.status === 'completed' ? 'success' : 'default'} size="sm">
                              {interview.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{interview.type}</p>
                          <div className="flex items-center text-sm text-gray-500 gap-4">
                            <span>{new Date(interview.date).toLocaleDateString()}</span>
                            <span>{interview.time}</span>
                            {interview.interviewer && <span>• {interview.interviewer}</span>}
                          </div>
                          {interview.notes && (
                            <p className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded">
                              {interview.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleEdit(interview)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteId(interview.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Interview Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingInterview(null);
        }}
        title={editingInterview ? 'Edit Interview' : 'Schedule Interview'}
        size="lg"
      >
        <InterviewForm
          interview={editingInterview || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowModal(false);
            setEditingInterview(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Interview"
        message="Are you sure you want to delete this interview? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
