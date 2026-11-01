'use client';

interface StatItem {
  label: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

interface StatsWidgetProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
}

export default function StatsWidget({ stats, columns = 4 }: StatsWidgetProps) {
  const getGridCols = () => {
    switch (columns) {
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
    }
  };

  const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return 'text-green-600 dark:text-green-400';
      case 'down': return 'text-red-600 dark:text-red-400';
      case 'neutral': return 'text-gray-600 dark:text-gray-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    }
    if (trend === 'down') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    );
  };

  return (
    <div className={`grid ${getGridCols()} gap-4`}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 p-6 transition-all hover:shadow-lg hover:-translate-y-1"
        >
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {stat.label}
            </p>
            {stat.icon && (
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                {stat.icon}
              </div>
            )}
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-800 dark:text-white">
                {stat.value}
              </p>
              {stat.change !== undefined && (
                <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${getTrendColor(stat.trend)}`}>
                  {getTrendIcon(stat.trend)}
                  <span>
                    {stat.change > 0 ? '+' : ''}{stat.change}%
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    vs last month
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
