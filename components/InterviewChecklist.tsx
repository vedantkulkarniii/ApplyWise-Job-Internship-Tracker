'use client';

import { useState } from 'react';
import { Card } from './Card';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'preparation' | 'day-before' | 'day-of' | 'follow-up';
  completed: boolean;
}

interface InterviewChecklistProps {
  interviewId?: string;
  onSave?: (items: ChecklistItem[]) => void;
}

const defaultChecklist: ChecklistItem[] = [
  // Preparation (1-2 weeks before)
  {
    id: 'research-company',
    title: 'Research the company',
    description: 'Learn about company culture, values, recent news, and products',
    category: 'preparation',
    completed: false,
  },
  {
    id: 'study-jd',
    title: 'Study the job description',
    description: 'Understand required skills and prepare examples matching each requirement',
    category: 'preparation',
    completed: false,
  },
  {
    id: 'practice-questions',
    title: 'Practice common interview questions',
    description: 'Prepare STAR method responses for behavioral questions',
    category: 'preparation',
    completed: false,
  },
  {
    id: 'technical-prep',
    title: 'Technical preparation',
    description: 'Review relevant technologies, coding problems, or case studies',
    category: 'preparation',
    completed: false,
  },
  {
    id: 'prepare-questions',
    title: 'Prepare questions to ask',
    description: 'Have 5-10 thoughtful questions about role, team, and company',
    category: 'preparation',
    completed: false,
  },
  
  // Day Before
  {
    id: 'confirm-details',
    title: 'Confirm interview details',
    description: 'Verify time, location/link, interviewer names, and format',
    category: 'day-before',
    completed: false,
  },
  {
    id: 'plan-outfit',
    title: 'Plan your outfit',
    description: 'Choose professional attire and ensure it\'s clean and ready',
    category: 'day-before',
    completed: false,
  },
  {
    id: 'test-tech',
    title: 'Test technology',
    description: 'For virtual interviews: test camera, microphone, and internet',
    category: 'day-before',
    completed: false,
  },
  {
    id: 'review-notes',
    title: 'Review your notes',
    description: 'Go over company research, your resume, and prepared responses',
    category: 'day-before',
    completed: false,
  },
  {
    id: 'get-sleep',
    title: 'Get good sleep',
    description: 'Aim for 7-8 hours of quality rest',
    category: 'day-before',
    completed: false,
  },
  
  // Day Of
  {
    id: 'arrive-early',
    title: 'Arrive early/Log in early',
    description: 'Be ready 10-15 minutes before scheduled time',
    category: 'day-of',
    completed: false,
  },
  {
    id: 'bring-materials',
    title: 'Bring necessary materials',
    description: 'Resume copies, portfolio, notepad, pen, and water',
    category: 'day-of',
    completed: false,
  },
  {
    id: 'positive-mindset',
    title: 'Get in a positive mindset',
    description: 'Take deep breaths, visualize success, stay confident',
    category: 'day-of',
    completed: false,
  },
  
  // Follow-up
  {
    id: 'thank-you-note',
    title: 'Send thank-you email',
    description: 'Send within 24 hours to each interviewer',
    category: 'follow-up',
    completed: false,
  },
  {
    id: 'self-reflection',
    title: 'Reflect on interview',
    description: 'Note what went well and areas for improvement',
    category: 'follow-up',
    completed: false,
  },
  {
    id: 'follow-up-timeline',
    title: 'Set follow-up reminder',
    description: 'If no response in 1-2 weeks, send a polite follow-up',
    category: 'follow-up',
    completed: false,
  },
];

const categoryLabels = {
  preparation: { title: '📚 Preparation (1-2 weeks)', color: 'blue' },
  'day-before': { title: '📅 Day Before', color: 'purple' },
  'day-of': { title: '🎯 Day Of Interview', color: 'green' },
  'follow-up': { title: '✉️ Follow-up', color: 'orange' },
};

export default function InterviewChecklist({ interviewId, onSave }: InterviewChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>(defaultChecklist);

  const toggleItem = (id: string) => {
    const updated = items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setItems(updated);
    onSave?.(updated);
  };

  const getProgress = (category: ChecklistItem['category']) => {
    const categoryItems = items.filter(item => item.category === category);
    const completed = categoryItems.filter(item => item.completed).length;
    return { completed, total: categoryItems.length, percentage: (completed / categoryItems.length) * 100 };
  };

  const overallProgress = () => {
    const completed = items.filter(item => item.completed).length;
    return { completed, total: items.length, percentage: (completed / items.length) * 100 };
  };

  const progress = overallProgress();

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Interview Preparation Checklist
          </h2>
          <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            {progress.completed}/{progress.total}
          </span>
        </div>
        
        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {progress.percentage === 100
            ? '🎉 All set! You\'re fully prepared for your interview!'
            : `${Math.round(progress.percentage)}% complete - Keep going!`}
        </p>
      </Card>

      {/* Checklist by Category */}
      {Object.entries(categoryLabels).map(([category, { title, color }]) => {
        const categoryProgress = getProgress(category as ChecklistItem['category']);
        const categoryItems = items.filter(item => item.category === category);

        return (
          <Card key={category}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                {title}
              </h3>
              <span className={`text-sm font-medium text-${color}-600 dark:text-${color}-400`}>
                {categoryProgress.completed}/{categoryProgress.total}
              </span>
            </div>

            {/* Category Progress Bar */}
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
              <div
                className={`absolute left-0 top-0 h-full bg-${color}-500 transition-all duration-500`}
                style={{ width: `${categoryProgress.percentage}%` }}
              />
            </div>

            {/* Checklist Items */}
            <div className="space-y-3">
              {categoryItems.map(item => (
                <label
                  key={item.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                    item.completed
                      ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleItem(item.id)}
                    className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p
                      className={`font-medium transition-all ${
                        item.completed
                          ? 'text-gray-500 dark:text-gray-400 line-through'
                          : 'text-gray-800 dark:text-white'
                      }`}
                    >
                      {item.title}
                    </p>
                    <p
                      className={`text-sm mt-1 ${
                        item.completed
                          ? 'text-gray-400 dark:text-gray-500'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                  {item.completed && (
                    <svg
                      className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </label>
              ))}
            </div>
          </Card>
        );
      })}

      {/* Tips Section */}
      <Card>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
          💡 Pro Tips
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Start preparation at least 1-2 weeks before the interview</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Practice your responses out loud, not just in your head</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Research your interviewers on LinkedIn to find common ground</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Prepare specific examples that demonstrate your skills and achievements</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Always follow up with a thank-you note within 24 hours</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
