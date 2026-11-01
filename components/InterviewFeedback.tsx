'use client';

import { useState } from 'react';
import { Card } from './Card';
import { Badge } from './Badge';

interface FeedbackSection {
  category: string;
  rating: number;
  notes: string;
}

interface InterviewFeedbackProps {
  interviewId: string;
  companyName: string;
  position: string;
  interviewDate: string;
  onSave?: (feedback: InterviewFeedbackData) => void;
}

export interface InterviewFeedbackData {
  overallRating: number;
  sections: FeedbackSection[];
  strengths: string[];
  improvements: string[];
  outcome: 'positive' | 'neutral' | 'negative' | 'pending';
  followUpActions: string[];
  additionalNotes: string;
}

const feedbackCategories = [
  { id: 'technical', label: 'Technical Skills', icon: '💻' },
  { id: 'communication', label: 'Communication', icon: '💬' },
  { id: 'problem-solving', label: 'Problem Solving', icon: '🧩' },
  { id: 'cultural-fit', label: 'Cultural Fit', icon: '🤝' },
  { id: 'enthusiasm', label: 'Enthusiasm', icon: '⚡' },
];

export default function InterviewFeedback({
  interviewId,
  companyName,
  position,
  interviewDate,
  onSave,
}: InterviewFeedbackProps) {
  const [overallRating, setOverallRating] = useState(0);
  const [sections, setSections] = useState<FeedbackSection[]>(
    feedbackCategories.map(cat => ({
      category: cat.id,
      rating: 0,
      notes: '',
    }))
  );
  const [strengths, setStrengths] = useState<string[]>(['']);
  const [improvements, setImprovements] = useState<string[]>(['']);
  const [outcome, setOutcome] = useState<'positive' | 'neutral' | 'negative' | 'pending'>('pending');
  const [followUpActions, setFollowUpActions] = useState<string[]>(['']);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const updateSectionRating = (category: string, rating: number) => {
    setSections(prev =>
      prev.map(s => (s.category === category ? { ...s, rating } : s))
    );
  };

  const updateSectionNotes = (category: string, notes: string) => {
    setSections(prev =>
      prev.map(s => (s.category === category ? { ...s, notes } : s))
    );
  };

  const addStrength = () => setStrengths([...strengths, '']);
  const updateStrength = (index: number, value: string) => {
    const updated = [...strengths];
    updated[index] = value;
    setStrengths(updated);
  };
  const removeStrength = (index: number) => {
    setStrengths(strengths.filter((_, i) => i !== index));
  };

  const addImprovement = () => setImprovements([...improvements, '']);
  const updateImprovement = (index: number, value: string) => {
    const updated = [...improvements];
    updated[index] = value;
    setImprovements(updated);
  };
  const removeImprovement = (index: number) => {
    setImprovements(improvements.filter((_, i) => i !== index));
  };

  const addFollowUpAction = () => setFollowUpActions([...followUpActions, '']);
  const updateFollowUpAction = (index: number, value: string) => {
    const updated = [...followUpActions];
    updated[index] = value;
    setFollowUpActions(updated);
  };
  const removeFollowUpAction = (index: number) => {
    setFollowUpActions(followUpActions.filter((_, i) => i !== index));
  };

  const saveFeedback = () => {
    const data: InterviewFeedbackData = {
      overallRating,
      sections,
      strengths: strengths.filter(s => s.trim()),
      improvements: improvements.filter(i => i.trim()),
      outcome,
      followUpActions: followUpActions.filter(a => a.trim()),
      additionalNotes,
    };
    onSave?.(data);
  };

  const RatingStars = ({ rating, onChange }: { rating: number; onChange: (rating: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => onChange(star)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <svg
            className={`w-6 h-6 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300 dark:text-gray-600'
            }`}
            fill={star <= rating ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Interview Feedback
        </h1>
        <div className="text-gray-600 dark:text-gray-400">
          <p className="font-medium text-lg">{position} at {companyName}</p>
          <p className="text-sm">{new Date(interviewDate).toLocaleDateString()}</p>
        </div>
      </Card>

      {/* Overall Rating */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Overall Performance
        </h2>
        <div className="flex items-center gap-4">
          <RatingStars rating={overallRating} onChange={setOverallRating} />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {overallRating > 0 ? `${overallRating}/5` : 'Not rated'}
          </span>
        </div>
      </Card>

      {/* Category Ratings */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Performance by Category
        </h2>
        <div className="space-y-6">
          {feedbackCategories.map(cat => {
            const section = sections.find(s => s.category === cat.id);
            return (
              <div key={cat.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{cat.icon}</span>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {cat.label}
                    </h3>
                  </div>
                  <RatingStars
                    rating={section?.rating || 0}
                    onChange={(rating) => updateSectionRating(cat.id, rating)}
                  />
                </div>
                <textarea
                  value={section?.notes || ''}
                  onChange={(e) => updateSectionNotes(cat.id, e.target.value)}
                  placeholder="Add notes about this category..."
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={2}
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Strengths */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          💪 What Went Well
        </h2>
        <div className="space-y-3">
          {strengths.map((strength, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={strength}
                onChange={(e) => updateStrength(index, e.target.value)}
                placeholder="What did you do well?"
                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => removeStrength(index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button
            onClick={addStrength}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            + Add strength
          </button>
        </div>
      </Card>

      {/* Areas for Improvement */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          📈 Areas for Improvement
        </h2>
        <div className="space-y-3">
          {improvements.map((improvement, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={improvement}
                onChange={(e) => updateImprovement(index, e.target.value)}
                placeholder="What could be improved?"
                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => removeImprovement(index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button
            onClick={addImprovement}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            + Add improvement area
          </button>
        </div>
      </Card>

      {/* Outcome */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Expected Outcome
        </h2>
        <div className="flex gap-3">
          {[
            { value: 'positive', label: 'Positive', color: 'green' },
            { value: 'neutral', label: 'Neutral', color: 'yellow' },
            { value: 'negative', label: 'Negative', color: 'red' },
            { value: 'pending', label: 'Pending', color: 'gray' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setOutcome(option.value as any)}
              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                outcome === option.value
                  ? `border-${option.color}-500 bg-${option.color}-50 dark:bg-${option.color}-900/20 text-${option.color}-700 dark:text-${option.color}-300`
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Follow-up Actions */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          ✅ Follow-up Actions
        </h2>
        <div className="space-y-3">
          {followUpActions.map((action, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={action}
                onChange={(e) => updateFollowUpAction(index, e.target.value)}
                placeholder="What should you do next?"
                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => removeFollowUpAction(index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button
            onClick={addFollowUpAction}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            + Add action
          </button>
        </div>
      </Card>

      {/* Additional Notes */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Additional Notes
        </h2>
        <textarea
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          placeholder="Any other observations or thoughts about the interview..."
          className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          onClick={saveFeedback}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Save Feedback
        </button>
      </div>
    </div>
  );
}
