'use client';

import { useState } from 'react';
import { Card } from './Card';
import { ProgressBar } from './ProgressBar';

interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'applications' | 'interviews' | 'offers' | 'networking' | 'skills' | 'custom';
  target: number;
  current: number;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

export default function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Submit 50 Applications',
      description: 'Apply to 50 quality positions this month',
      type: 'applications',
      target: 50,
      current: 32,
      deadline: '2024-12-31',
      priority: 'high',
      completed: false,
    },
    {
      id: '2',
      title: 'Complete 5 Interviews',
      description: 'Successfully complete 5 technical interviews',
      type: 'interviews',
      target: 5,
      current: 3,
      deadline: '2024-12-31',
      priority: 'medium',
      completed: false,
    },
  ]);

  const [showAddGoal, setShowAddGoal] = useState(false);

  const addGoal = (goal: Omit<Goal, 'id' | 'completed' | 'current'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      current: 0,
      completed: false,
    };
    setGoals([...goals, newGoal]);
    setShowAddGoal(false);
  };

  const updateProgress = (id: string, increment: number) => {
    setGoals(goals.map(g => {
      if (g.id === id) {
        const newCurrent = Math.min(g.current + increment, g.target);
        return {
          ...g,
          current: newCurrent,
          completed: newCurrent >= g.target,
        };
      }
      return g;
    }));
  };

  const deleteGoal = (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      setGoals(goals.filter(g => g.id !== id));
    }
  };

  const getDaysRemaining = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getGoalIcon = (type: Goal['type']) => {
    const icons = {
      applications: '📝',
      interviews: '💼',
      offers: '🎁',
      networking: '🤝',
      skills: '📚',
      custom: '🎯',
    };
    return icons[type];
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    const colors = {
      low: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
      medium: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300',
      high: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300',
    };
    return colors[priority];
  };

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);
  const overallProgress = goals.length > 0
    ? (goals.filter(g => g.completed).length / goals.length) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Goal Tracker</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Set and track your job search goals
          </p>
        </div>
        <button
          onClick={() => setShowAddGoal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Goal
        </button>
      </div>

      {/* Overall Progress */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Overall Progress
        </h2>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {completedGoals.length} of {goals.length} goals completed
          </span>
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            {Math.round(overallProgress)}%
          </span>
        </div>
        <ProgressBar progress={overallProgress} />
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Goals</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{activeGoals.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{completedGoals.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">High Priority</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">
            {goals.filter(g => g.priority === 'high' && !g.completed).length}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Due Soon</p>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-1">
            {goals.filter(g => !g.completed && getDaysRemaining(g.deadline) <= 7).length}
          </p>
        </Card>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Active Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeGoals.map(goal => {
              const progress = (goal.current / goal.target) * 100;
              const daysRemaining = getDaysRemaining(goal.deadline);
              const isOverdue = daysRemaining < 0;
              const isDueSoon = daysRemaining <= 7 && daysRemaining >= 0;

              return (
                <Card key={goal.id}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{getGoalIcon(goal.type)}</span>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">{goal.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{goal.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Priority Badge */}
                  <div className="mb-3">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getPriorityColor(goal.priority)}`}>
                      {goal.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Progress: {goal.current} / {goal.target}
                      </span>
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <ProgressBar progress={progress} />
                  </div>

                  {/* Deadline */}
                  <div className={`text-sm mb-3 ${isOverdue ? 'text-red-600 dark:text-red-400' : isDueSoon ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {isOverdue ? `Overdue by ${Math.abs(daysRemaining)} days` :
                     isDueSoon ? `${daysRemaining} days remaining` :
                     `Due ${new Date(goal.deadline).toLocaleDateString()}`}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateProgress(goal.id, 1)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      +1 Progress
                    </button>
                    <button
                      onClick={() => updateProgress(goal.id, -1)}
                      className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                    >
                      -1
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span>🎉</span> Completed Goals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedGoals.map(goal => (
              <Card key={goal.id}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getGoalIcon(goal.type)}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 dark:text-white">{goal.title}</h3>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      ✓ {goal.target} / {goal.target} completed
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {goals.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              No goals set yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Set goals to track your job search progress and stay motivated
            </p>
            <button
              onClick={() => setShowAddGoal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Goal
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
