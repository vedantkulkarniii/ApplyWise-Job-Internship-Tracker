'use client';

import { CheckCircle, Clock, XCircle } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  type: 'success' | 'pending' | 'error' | 'info';
  icon?: React.ReactNode;
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export default function Timeline({ events, className = '' }: TimelineProps) {
  const getTypeStyles = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'success':
        return {
          dot: 'bg-green-500',
          line: 'bg-green-200',
          icon: <CheckCircle className="h-4 w-4 text-white" />,
        };
      case 'error':
        return {
          dot: 'bg-red-500',
          line: 'bg-red-200',
          icon: <XCircle className="h-4 w-4 text-white" />,
        };
      case 'pending':
        return {
          dot: 'bg-yellow-500',
          line: 'bg-yellow-200',
          icon: <Clock className="h-4 w-4 text-white" />,
        };
      case 'info':
      default:
        return {
          dot: 'bg-blue-500',
          line: 'bg-blue-200',
          icon: <div className="h-2 w-2 bg-white rounded-full" />,
        };
    }
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No timeline events to display
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {events.map((event, index) => {
        const styles = getTypeStyles(event.type);
        const isLast = index === events.length - 1;

        return (
          <div key={event.id} className="relative flex items-start gap-4">
            {/* Timeline dot and line */}
            <div className="flex flex-col items-center">
              <div className={`${styles.dot} h-8 w-8 rounded-full flex items-center justify-center z-10 shadow`}>
                {event.icon || styles.icon}
              </div>
              {!isLast && (
                <div className={`${styles.line} w-0.5 h-full mt-2 min-h-[40px]`} />
              )}
            </div>

            {/* Event content */}
            <div className="flex-1 pb-8">
              <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{event.title}</h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                {event.description && (
                  <p className="text-sm text-gray-600">{event.description}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
