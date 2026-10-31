'use client';

import { useState } from 'react';
import { Tabs } from './Tabs';
import { Card } from './Card';

interface FAQItem {
  question: string;
  answer: string;
}

interface GuideSection {
  title: string;
  content: string;
  steps?: string[];
}

export default function HelpCenter() {
  const [activeTab, setActiveTab] = useState('getting-started');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const tabs = [
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'features', label: 'Features' },
    { id: 'faq', label: 'FAQ' },
    { id: 'tips', label: 'Tips & Tricks' },
  ];

  const gettingStartedGuide: GuideSection[] = [
    {
      title: 'Welcome to ApplyWise',
      content: 'ApplyWise is your comprehensive job and internship application tracker. Organize applications, schedule interviews, set reminders, and analyze your job search progress all in one place.',
    },
    {
      title: 'Adding Your First Application',
      content: 'Start tracking your applications in just a few steps:',
      steps: [
        'Navigate to the Applications page',
        'Click the "Add Application" button',
        'Fill in company name, position, and application date',
        'Add optional details like salary, location, and notes',
        'Save and track your application status',
      ],
    },
    {
      title: 'Managing Interview Schedule',
      content: 'Keep track of all your interviews:',
      steps: [
        'Go to the Interviews page',
        'Click "Schedule Interview"',
        'Link it to an existing application',
        'Set date, time, and interview type',
        'Get reminded before the interview',
      ],
    },
  ];

  const featuresGuide: GuideSection[] = [
    {
      title: 'Dashboard Analytics',
      content: 'Your dashboard provides real-time insights into your job search. View application success rates, interview counts, and status breakdowns at a glance.',
    },
    {
      title: 'Smart Reminders',
      content: 'Never miss a follow-up. Set custom reminders for applications, interviews, or any job search task. Reminders automatically notify you on the due date.',
    },
    {
      title: 'Advanced Search & Filters',
      content: 'Quickly find applications using the search bar. Filter by status, date range, company, or position. Sort by date, company name, or status.',
    },
    {
      title: 'Data Export & Import',
      content: 'Export your data to JSON or CSV format for backup or analysis. Import data from previous exports to restore or migrate your information.',
    },
    {
      title: 'Timeline View',
      content: 'Visualize your application journey with timeline views. See all events, interviews, and status changes in chronological order.',
    },
    {
      title: 'Calendar View',
      content: 'View all your interviews in a monthly calendar format. See upcoming interviews at a glance and plan your schedule effectively.',
    },
  ];

  const faqItems: FAQItem[] = [
    {
      question: 'How is my data stored?',
      answer: 'All your data is stored locally in your browser using localStorage. No data is sent to external servers, ensuring complete privacy and security.',
    },
    {
      question: 'Can I access my data on multiple devices?',
      answer: 'Since data is stored locally in your browser, it\'s device-specific. Use the export feature to transfer data between devices by exporting from one device and importing on another.',
    },
    {
      question: 'What happens if I clear my browser data?',
      answer: 'Clearing browser data will delete all your tracked applications. Always export your data regularly as a backup to prevent data loss.',
    },
    {
      question: 'How do I change an application status?',
      answer: 'Click on any application card and use the status dropdown to update it. You can change between Applied, Interview, Offer, Accepted, and Rejected statuses.',
    },
    {
      question: 'Can I add custom fields to applications?',
      answer: 'Currently, the app supports standard fields. You can use the Notes section to add any additional information specific to your needs.',
    },
    {
      question: 'How do keyboard shortcuts work?',
      answer: 'Press Ctrl+/ (or Cmd+/ on Mac) to view all available keyboard shortcuts. Use shortcuts for quick navigation and actions throughout the app.',
    },
    {
      question: 'Can I bulk delete applications?',
      answer: 'Yes! Use the bulk actions feature on the Applications page. Select multiple applications using checkboxes and choose the delete option.',
    },
    {
      question: 'How do I generate reports?',
      answer: 'Visit the Reports page to view detailed analytics including success rates, application trends over time, interview statistics, and status distributions.',
    },
  ];

  const tipsAndTricks = [
    {
      title: 'Use Quick Actions',
      content: 'Access the quick actions menu from the dashboard to rapidly add applications, schedule interviews, or set reminders without navigating through pages.',
    },
    {
      title: 'Leverage Notes',
      content: 'Add detailed notes to applications including recruiter contacts, interview feedback, salary negotiations, and company research. Rich notes help you prepare better.',
    },
    {
      title: 'Set Reminder Patterns',
      content: 'Create reminder templates for common tasks like "Follow up in 2 weeks" or "Prepare for interview" to streamline your workflow.',
    },
    {
      title: 'Track Response Time',
      content: 'Use the timeline view to analyze how quickly companies respond. This helps you identify patterns and manage expectations.',
    },
    {
      title: 'Export Regularly',
      content: 'Set a weekly reminder to export your data. This creates backups and allows you to track your progress over time.',
    },
    {
      title: 'Use Filters Efficiently',
      content: 'Combine search with filters to quickly find specific applications. For example, search "Software" and filter by "Interview" status.',
    },
    {
      title: 'Color-Coded Status',
      content: 'Quickly identify application statuses by color: Blue (Applied), Yellow (Interview), Green (Offer/Accepted), Red (Rejected).',
    },
    {
      title: 'Mobile Responsive',
      content: 'Access ApplyWise on any device. The mobile menu provides easy navigation on phones and tablets.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Help Center
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Everything you need to know about using ApplyWise effectively
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6">
        {/* Getting Started */}
        {activeTab === 'getting-started' && (
          <div className="space-y-6">
            {gettingStartedGuide.map((section, index) => (
              <Card key={index}>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  {section.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {section.content}
                </p>
                {section.steps && (
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    {section.steps.map((step, idx) => (
                      <li key={idx} className="pl-2">{step}</li>
                    ))}
                  </ol>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Features */}
        {activeTab === 'features' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuresGuide.map((feature, index) => (
              <Card key={index}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {feature.content}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* FAQ */}
        {activeTab === 'faq' && (
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="font-medium text-gray-800 dark:text-white">
                    {item.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedFAQ === index ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-4 text-gray-600 dark:text-gray-400">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tips & Tricks */}
        {activeTab === 'tips' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tipsAndTricks.map((tip, index) => (
              <Card key={index}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      {tip.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {tip.content}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Support Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          Need More Help?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Can't find what you're looking for? Check out our documentation or keyboard shortcuts guide.
        </p>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            View Documentation
          </button>
          <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Keyboard Shortcuts (Ctrl+/)
          </button>
        </div>
      </div>
    </div>
  );
}
