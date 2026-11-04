'use client';

import { Application } from '@/lib/types';

interface StatusFlowVisualizerProps {
  applications: Application[];
}

interface FlowStage {
  status: Application['status'];
  label: string;
  count: number;
  color: string;
  icon: string;
}

export default function StatusFlowVisualizer({ applications }: StatusFlowVisualizerProps) {
  const stages: FlowStage[] = [
    {
      status: 'applied',
      label: 'Applied',
      count: applications.filter(a => a.status === 'applied').length,
      color: 'bg-blue-500',
      icon: '📝',
    },
    {
      status: 'interview',
      label: 'Interview',
      count: applications.filter(a => a.status === 'interview').length,
      color: 'bg-yellow-500',
      icon: '🎤',
    },
    {
      status: 'offer',
      label: 'Offer',
      count: applications.filter(a => a.status === 'offer').length,
      color: 'bg-purple-500',
      icon: '📋',
    },
    {
      status: 'accepted',
      label: 'Accepted',
      count: applications.filter(a => a.status === 'accepted').length,
      color: 'bg-green-500',
      icon: '✅',
    },
    {
      status: 'rejected',
      label: 'Rejected',
      count: applications.filter(a => a.status === 'rejected').length,
      color: 'bg-red-500',
      icon: '❌',
    },
  ];

  const total = applications.length;
  const calculateConversionRate = (fromStatus: Application['status'], toStatus: Application['status']) => {
    const fromCount = stages.find(s => s.status === fromStatus)?.count || 0;
    const toCount = stages.find(s => s.status === toStatus)?.count || 0;
    if (fromCount === 0) return 0;
    return Math.round((toCount / fromCount) * 100);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Application Flow
      </h2>

      {/* Flow Visualization */}
      <div className="space-y-8">
        {/* Main Flow (Applied → Interview → Offer → Accepted) */}
        <div className="flex items-center justify-between gap-4">
          {stages.slice(0, 4).map((stage, index) => {
            const percentage = total > 0 ? (stage.count / total) * 100 : 0;
            const nextStage = stages[index + 1];
            const conversionRate = nextStage
              ? calculateConversionRate(stage.status, nextStage.status)
              : 0;

            return (
              <div key={stage.status} className="flex-1">
                <div className="flex items-center gap-2">
                  {/* Stage Box */}
                  <div className="flex-1">
                    <div className={`${stage.color} rounded-lg p-4 text-white transition-all hover:scale-105`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{stage.icon}</span>
                        <span className="text-3xl font-bold">{stage.count}</span>
                      </div>
                      <p className="text-sm font-medium">{stage.label}</p>
                      <div className="mt-2 bg-white/20 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-white h-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs mt-1 opacity-90">
                        {percentage.toFixed(1)}% of total
                      </p>
                    </div>
                  </div>

                  {/* Arrow & Conversion Rate */}
                  {index < 3 && (
                    <div className="flex flex-col items-center px-2">
                      <svg
                        className="w-8 h-8 text-gray-400 dark:text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                      <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
                        {conversionRate}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rejected Branch */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700" style={{ left: 'calc(12.5% - 1px)' }} />
          <div className="flex items-center gap-4 pl-[25%]">
            <svg
              className="w-8 h-8 text-gray-400 dark:text-gray-600 -ml-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 13l-5 5m0 0l-5-5m5 5V6"
              />
            </svg>
            <div className="flex-1 max-w-xs">
              <div className={`${stages[4].color} rounded-lg p-4 text-white transition-all hover:scale-105`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{stages[4].icon}</span>
                  <span className="text-3xl font-bold">{stages[4].count}</span>
                </div>
                <p className="text-sm font-medium">{stages[4].label}</p>
                <p className="text-xs mt-2 opacity-90">
                  {total > 0 ? ((stages[4].count / total) * 100).toFixed(1) : 0}% of total
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conversion Metrics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
            Interview Rate
          </p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {calculateConversionRate('applied', 'interview')}%
          </p>
          <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
            Applied → Interview
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">
            Offer Rate
          </p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {calculateConversionRate('interview', 'offer')}%
          </p>
          <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">
            Interview → Offer
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-1">
            Success Rate
          </p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">
            {total > 0 ? ((stages[3].count / total) * 100).toFixed(1) : 0}%
          </p>
          <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">
            Overall Success
          </p>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-2">
          💡 Insights
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          {calculateConversionRate('applied', 'interview') < 10 && (
            <li>• Your interview rate is below 10%. Focus on improving your resume and cover letters.</li>
          )}
          {calculateConversionRate('interview', 'offer') < 20 && stages[1].count > 0 && (
            <li>• Interview to offer rate is below 20%. Practice your interview skills.</li>
          )}
          {calculateConversionRate('applied', 'interview') > 30 && (
            <li>✨ Excellent interview rate! Your applications are standing out.</li>
          )}
          {stages[3].count > 0 && (
            <li>🎉 Congratulations on {stages[3].count} accepted offer{stages[3].count > 1 ? 's' : ''}!</li>
          )}
          {stages[4].count > total * 0.7 && total > 5 && (
            <li>• High rejection rate. Consider targeting different companies or refining your approach.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
