'use client';

import { Application, Interview, Reminder } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { Badge } from './Badge';
import { Timeline } from './Timeline';
import { NotesList } from './NotesList';
import { formatDate, formatTime, getRelativeTime } from '@/lib/date-utils';

interface ApplicationDetailProps {
  application: Application;
  interviews?: Interview[];
  reminders?: Reminder[];
  onEdit?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
}

export default function ApplicationDetail({
  application,
  interviews = [],
  reminders = [],
  onEdit,
  onDelete,
  onClose,
}: ApplicationDetailProps) {
  // Filter related interviews and reminders
  const relatedInterviews = interviews.filter(i => i.applicationId === application.id);
  const relatedReminders = reminders.filter(r => r.applicationId === application.id);

  // Build timeline events
  const timelineEvents = [
    {
      id: 'applied',
      title: 'Application Submitted',
      description: `Applied for ${application.position} at ${application.company}`,
      date: application.appliedDate,
      type: 'application' as const,
    },
    ...relatedInterviews.map(interview => ({
      id: interview.id,
      title: `${interview.type} Interview`,
      description: `${interview.status === 'scheduled' ? 'Scheduled' : 'Completed'} at ${formatTime(interview.date)}`,
      date: interview.date,
      type: 'interview' as const,
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {application.position}
            </h1>
            <StatusBadge status={application.status} />
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400">{application.company}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Applied {getRelativeTime(application.appliedDate)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Details */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                <p className="text-gray-800 dark:text-white font-medium">
                  {application.location || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Salary</p>
                <p className="text-gray-800 dark:text-white font-medium">
                  {application.salary || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Applied Date</p>
                <p className="text-gray-800 dark:text-white font-medium">
                  {formatDate(application.appliedDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Job Type</p>
                <p className="text-gray-800 dark:text-white font-medium">
                  {application.type || 'Not specified'}
                </p>
              </div>
            </div>

            {application.url && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <a
                  href={application.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                >
                  View Job Posting
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Timeline</h2>
            <Timeline events={timelineEvents} />
          </div>

          {/* Notes */}
          {application.notes && application.notes.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Notes</h2>
              <NotesList notes={application.notes} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Interviews */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              Interviews ({relatedInterviews.length})
            </h2>
            {relatedInterviews.length > 0 ? (
              <div className="space-y-3">
                {relatedInterviews.map(interview => (
                  <div
                    key={interview.id}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={interview.status === 'scheduled' ? 'primary' : 'success'}>
                        {interview.type}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(interview.date)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {formatTime(interview.date)}
                    </p>
                    {interview.location && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {interview.location}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No interviews scheduled</p>
            )}
          </div>

          {/* Reminders */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              Reminders ({relatedReminders.length})
            </h2>
            {relatedReminders.length > 0 ? (
              <div className="space-y-3">
                {relatedReminders.map(reminder => (
                  <div
                    key={reminder.id}
                    className={`p-3 rounded-lg border ${
                      reminder.completed
                        ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50'
                        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {reminder.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDate(reminder.dueDate)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No reminders set</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
