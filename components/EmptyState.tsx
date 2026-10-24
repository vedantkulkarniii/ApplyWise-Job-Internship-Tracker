import { Briefcase, Calendar, Bell, FileText } from 'lucide-react';

interface EmptyStateProps {
  type: 'applications' | 'interviews' | 'reminders' | 'search';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  type,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const icons = {
    applications: <Briefcase size={48} className="text-gray-300" />,
    interviews: <Calendar size={48} className="text-gray-300" />,
    reminders: <Bell size={48} className="text-gray-300" />,
    search: <FileText size={48} className="text-gray-300" />,
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-4">{icons[type]}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
