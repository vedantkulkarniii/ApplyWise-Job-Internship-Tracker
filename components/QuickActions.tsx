'use client';

import { Plus, FileText, Calendar, Bell } from 'lucide-react';

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  color: string;
}

interface QuickActionsProps {
  onAddApplication: () => void;
  onAddInterview: () => void;
  onAddReminder: () => void;
  onViewDocuments?: () => void;
}

export default function QuickActions({
  onAddApplication,
  onAddInterview,
  onAddReminder,
  onViewDocuments,
}: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      icon: <Plus className="h-5 w-5" />,
      label: 'Add Application',
      description: 'Track a new job application',
      onClick: onAddApplication,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: 'Schedule Interview',
      description: 'Add an upcoming interview',
      onClick: onAddInterview,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      icon: <Bell className="h-5 w-5" />,
      label: 'Create Reminder',
      description: 'Set a reminder for follow-ups',
      onClick: onAddReminder,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  if (onViewDocuments) {
    actions.push({
      icon: <FileText className="h-5 w-5" />,
      label: 'View Documents',
      description: 'Access resumes and cover letters',
      onClick: onViewDocuments,
      color: 'bg-orange-500 hover:bg-orange-600',
    });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className={`${action.color} text-white p-4 rounded-lg transition-all hover:shadow-lg group`}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg group-hover:scale-110 transition-transform">
              {action.icon}
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold mb-1">{action.label}</div>
              <div className="text-xs opacity-90">{action.description}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
