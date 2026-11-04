'use client';

import { useState } from 'react';
import { Card } from './Card';
import { ProgressBar } from './ProgressBar';

interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'applications' | 'interviews' | 'offers' | 'custom';
  target: number;
  current: number;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
}

interface GoalTrackerProps {
  goals?: Goal[];
  onAddGoal?: (goal: Goal) => void;
  onUpdateGoal?: (goal: Goal) => void;
  onDeleteGoal?: (goalId: string) => void;
}

const defaultGoals: Goal[] = [
  {
    id: '1',
    title: 'Apply to 50 Companies',
    description: 'Submit quality applications to 50 target companies',
    type: 'applications',
    target: 50,
    current: 23,
    deadline: '2026-12-31',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Land 10 Interviews',
    description: 'Secure 10 interviews from applications',
    type: 'interviews',
    target: 10,
    current: 5,
    deadline: '2026-12-31',
    priority: 'high',
  },
  {
    id: '3',
    title: 'Get 3 Job Offers',
    description: 'Receive at least 3 job offers',
    type: 'offers',
    target: 3,
    current: 1,
    deadline: '2026-12-31',
    priority: 'medium',
  },
];

export default function GoalTracker({
  goals = defaultGoals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
}: GoalTrackerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
    }
  };

  const getDaysRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const getStatusColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return 'text-green-600 dark:text-green-400';
    if (percentage >= 75) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getTypeIcon = (type: Goal['type']) => {
    switch (type) {
      case 'applications': return '📝';
      case 'interviews': return '🎤';
      case 'offers': return '🎯';
      case 'custom': return '⭐';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Goal Tracker
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your job search goals and stay motivated
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => {
          const progress = (goal.current / goal.target) * 100;
          const daysLeft = getDaysRemaining(goal.deadline);
          const isOverdue = daysLeft < 0;
          const isCompleted = goal.current >= goal.target;

          return (
            <Card key={goal.id}>
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getTypeIcon(goal.type)}</span>
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white">
                        {goal.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {goal.description}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                    {goal.priority}
                  </span>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-2xl font-bold ${getStatusColor(goal.current, goal.target)}`}>
                      {goal.current}/{goal.target}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <ProgressBar
                    progress={progress}
                    color={isCompleted ? 'green' : 'blue'}
                    height="h-3"
                  />
                </div>

                {/* Status */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className={`${isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                      {isOverdue
                        ? `${Math.abs(daysLeft)} days overdue`
                        : `${daysLeft} days left`}
                    </span>
                  </div>
                  {isCompleted && (
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Completed!
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setEditingGoal(goal)}
                    className="flex-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteGoal?.(goal.id)}
                    className="px-3 py-1.5 text-sm bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats */}
      <Card>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          Goal Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {goals.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Goals</p>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {goals.filter(g => g.current >= g.target).length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Completed</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {goals.filter(g => g.current < g.target && getDaysRemaining(g.deadline) >= 0).length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">In Progress</p>
          </div>
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
              {goals.filter(g => g.current < g.target && getDaysRemaining(g.deadline) < 0).length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Overdue</p>
          </div>
        </div>
      </Card>

      {/* Motivational Tips */}
      <Card>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
          💡 Goal Achievement Tips
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Set SMART goals: Specific, Measurable, Achievable, Relevant, Time-bound</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Break large goals into smaller milestones to track progress</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Review and adjust your goals weekly based on your progress</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Celebrate small wins to stay motivated throughout your journey</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
