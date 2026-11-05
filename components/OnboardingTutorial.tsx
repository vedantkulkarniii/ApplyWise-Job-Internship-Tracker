'use client';

import { useState } from 'react';
import { Modal } from './Modal';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  image?: string;
  icon: string;
  action?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: 'Welcome to ApplyWise! 👋',
    description: 'Your all-in-one job application tracker. Let\'s take a quick tour to get you started!',
    icon: '🎉',
  },
  {
    id: 2,
    title: 'Track Applications',
    description: 'Add and manage all your job applications in one place. Track status, deadlines, and important notes.',
    icon: '📝',
    action: 'Go to Applications',
  },
  {
    id: 3,
    title: 'Schedule Interviews',
    description: 'Never miss an interview! Schedule interviews, get reminders, and prepare with our checklist.',
    icon: '🎤',
    action: 'View Interviews',
  },
  {
    id: 4,
    title: 'Set Reminders',
    description: 'Create reminders for follow-ups, deadlines, and important tasks. Stay organized and on track.',
    icon: '🔔',
    action: 'Manage Reminders',
  },
  {
    id: 5,
    title: 'Analyze Progress',
    description: 'View detailed analytics and insights about your job search. Track success rates and identify improvements.',
    icon: '📊',
    action: 'View Dashboard',
  },
  {
    id: 6,
    title: 'Export Your Data',
    description: 'Export your data in multiple formats (CSV, JSON, PDF) for backup or analysis.',
    icon: '💾',
    action: 'Settings',
  },
  {
    id: 7,
    title: 'You\'re All Set! 🚀',
    description: 'Start adding your applications and let ApplyWise help you land your dream job!',
    icon: '✨',
    action: 'Get Started',
  },
];

interface OnboardingTutorialProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingTutorial({
  isOpen,
  onComplete,
  onSkip,
}: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const step = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const nextStep = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const skipTutorial = () => {
    onSkip();
  };

  return (
    <Modal isOpen={isOpen} onClose={skipTutorial} title="">
      <div className="relative">
        {/* Skip Button */}
        <button
          onClick={skipTutorial}
          className="absolute top-0 right-0 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Skip Tutorial
        </button>

        {/* Progress Indicator */}
        <div className="mb-8 mt-4">
          <div className="flex items-center justify-center gap-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-blue-600'
                    : index < currentStep
                    ? 'w-2 bg-blue-400'
                    : 'w-2 bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            Step {currentStep + 1} of {tutorialSteps.length}
          </p>
        </div>

        {/* Content */}
        <div className="text-center py-8">
          {/* Icon */}
          <div className="text-8xl mb-6 animate-bounce-slow">
            {step.icon}
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            {step.title}
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {step.description}
          </p>

          {/* Feature Highlights for specific steps */}
          {currentStep === 1 && (
            <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="font-semibold text-blue-700 dark:text-blue-300">Status Tracking</div>
                <div className="text-gray-600 dark:text-gray-400 text-xs mt-1">Applied, Interview, Offer</div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="font-semibold text-green-700 dark:text-green-300">Smart Notes</div>
                <div className="text-gray-600 dark:text-gray-400 text-xs mt-1">Add detailed notes</div>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="font-semibold text-purple-700 dark:text-purple-300">Quick Search</div>
                <div className="text-gray-600 dark:text-gray-400 text-xs mt-1">Find anything fast</div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
              <div className="flex items-center justify-around text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">📈</div>
                  <div className="text-sm font-medium mt-1">Success Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">🎯</div>
                  <div className="text-sm font-medium mt-1">Goal Tracking</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">📊</div>
                  <div className="text-sm font-medium mt-1">Visual Charts</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={prevStep}
            disabled={isFirstStep}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isFirstStep
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            ← Previous
          </button>

          <button
            onClick={nextStep}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            {isLastStep ? (
              <>
                Get Started
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </>
            ) : (
              <>
                Next
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 text-sm mb-2">
            💡 Pro Tip
          </h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            {currentStep === 0 && 'You can access this tutorial anytime from the help menu!'}
            {currentStep === 1 && 'Use templates to speed up adding applications!'}
            {currentStep === 2 && 'Set up interview reminders to never miss an opportunity!'}
            {currentStep === 3 && 'Bulk actions let you manage multiple items at once!'}
            {currentStep === 4 && 'Export your data regularly as a backup!'}
            {currentStep === 5 && 'Use keyboard shortcuts (Ctrl+/) for faster navigation!'}
            {currentStep === 6 && 'Customize your workflow in Settings!'}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </Modal>
  );
}
