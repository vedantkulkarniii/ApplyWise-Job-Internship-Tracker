'use client';

import { useEffect, useState } from 'react';
import { store } from '@/lib/store';
import { Reminder } from '@/lib/types';
import Sidebar from '@/components/Sidebar';
import Modal from '@/components/Modal';
import ReminderForm from '@/components/ReminderForm';
import EmptyState from '@/components/EmptyState';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import ConfirmDialog from '@/components/ConfirmDialog';
import { AlertCircle, Calendar, Clock, Plus, CheckCircle, Edit2, Trash2, Bell } from 'lucide-react';

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setReminders(store.getAllReminders());
  };

  const handleFormSubmit = (data: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingReminder) {
      store.updateReminder(editingReminder.id, data);
    } else {
      store.addReminder({
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Reminder);
    }
    loadData();
    setShowModal(false);
    setEditingReminder(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      store.deleteReminder(deleteId);
      loadData();
      setDeleteId(null);
    }
  };

  const handleToggleComplete = (reminder: Reminder) => {
    store.updateReminder(reminder.id, { completed: !reminder.completed });
    loadData();
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingReminder(null);
    setShowModal(true);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeReminders = reminders.filter(r => !r.completed);
  const completedReminders = reminders.filter(r => r.completed);

  const urgentReminders = activeReminders.filter(r => {
    const dueDate = new Date(r.dueDate);
    return dueDate <= today || r.priority === 'urgent';
  });

  const upcomingReminders = activeReminders.filter(r => {
    const dueDate = new Date(r.dueDate);
    return dueDate > today && r.priority !== 'urgent';
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const getDaysUntil = (dateString: string) => {
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    return `In ${diffDays} days`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
              <p className="text-gray-600 mt-1">
                {activeReminders.length} active reminder{activeReminders.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              <span>Add Reminder</span>
            </button>
          </div>

          {/* Urgent Reminders */}
          {urgentReminders.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="text-red-600 mr-2" size={24} />
                <h2 className="text-xl font-semibold text-red-900">Urgent & Overdue</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {urgentReminders.map((reminder) => (
                  <Card key={reminder.id} className="bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{reminder.title}</h3>
                          <Badge variant={getPriorityColor(reminder.priority)} size="sm">
                            {reminder.priority}
                          </Badge>
                        </div>
                        {reminder.description && (
                          <p className="text-sm text-gray-600 mb-2">{reminder.description}</p>
                        )}
                        {reminder.relatedTo && (
                          <p className="text-xs text-gray-500">Related: {reminder.relatedTo}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="text-sm text-red-600 font-medium">
                        {getDaysUntil(reminder.dueDate)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleComplete(reminder)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Mark as complete"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(reminder)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteId(reminder.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Reminders */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Bell className="mr-2 text-blue-600" size={24} />
              Upcoming Reminders
            </h2>
            {upcomingReminders.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No upcoming reminders"
                description="Create reminders to stay on top of your job applications"
                actionLabel="Add Reminder"
                onAction={handleAddNew}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingReminders.map((reminder) => (
                  <Card key={reminder.id} className="hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{reminder.title}</h3>
                          <Badge variant={getPriorityColor(reminder.priority)} size="sm">
                            {reminder.priority}
                          </Badge>
                        </div>
                        {reminder.description && (
                          <p className="text-sm text-gray-600 mb-2">{reminder.description}</p>
                        )}
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                          <Calendar size={14} className="mr-1" />
                          {new Date(reminder.dueDate).toLocaleDateString()}
                        </div>
                        {reminder.relatedTo && (
                          <p className="text-xs text-gray-500 mt-1">Related: {reminder.relatedTo}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="text-sm text-gray-600 font-medium">
                        {getDaysUntil(reminder.dueDate)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleComplete(reminder)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Mark as complete"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(reminder)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteId(reminder.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Completed Reminders */}
          {completedReminders.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="mr-2 text-green-600" size={24} />
                Completed ({completedReminders.length})
              </h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {completedReminders.map((reminder) => (
                    <div key={reminder.id} className="p-4 hover:bg-gray-50 transition-colors opacity-60">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900 line-through">{reminder.title}</h3>
                            <Badge variant="success" size="sm">Completed</Badge>
                          </div>
                          {reminder.description && (
                            <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleToggleComplete(reminder)}
                            className="text-gray-600 hover:text-gray-800 transition-colors"
                            title="Mark as incomplete"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteId(reminder.id)}
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

      {/* Add/Edit Reminder Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingReminder(null);
        }}
        title={editingReminder ? 'Edit Reminder' : 'Create Reminder'}
        size="lg"
      >
        <ReminderForm
          reminder={editingReminder || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowModal(false);
            setEditingReminder(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Reminder"
        message="Are you sure you want to delete this reminder? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
