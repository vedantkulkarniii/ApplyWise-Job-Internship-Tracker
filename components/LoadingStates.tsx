'use client';

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-900 rounded-full animate-ping"></div>
          <div className="absolute inset-0 border-4 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
          <div className="absolute inset-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
        </div>
        <h2 className="text-2xl font-bold gradient-text mb-2">ApplyWise</h2>
        <p className="text-gray-600 dark:text-gray-400 animate-pulse">Loading your dashboard...</p>
      </div>
    </div>
  );
}

export function SkeletonLine({ className = '' }: { className?: string }) {
  return (
    <div className={`shimmer h-4 bg-gray-200 dark:bg-gray-700 rounded ${className}`}></div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="shimmer h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="shimmer h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
      <div className="space-y-3">
        <SkeletonLine />
        <SkeletonLine className="w-4/5" />
        <SkeletonLine className="w-3/5" />
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="shimmer h-12 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"></div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="shimmer h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <SkeletonLine className="w-1/4" />
            <SkeletonLine className="w-1/3" />
          </div>
          <div className="shimmer h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6 animate-slide-in-up">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
          <SkeletonLine className="w-32 mb-6" />
          <div className="shimmer h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
          <SkeletonLine className="w-32 mb-6" />
          <div className="shimmer h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* Table */}
      <SkeletonTable />
    </div>
  );
}

export function InlineLoader({ size = 'md', color = 'blue' }: { size?: 'sm' | 'md' | 'lg'; color?: 'blue' | 'white' | 'gray' }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-3',
  };

  const colorClasses = {
    blue: 'border-blue-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-600 border-t-transparent',
  };

  return (
    <div className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}></div>
  );
}

export function DotsLoader({ color = 'blue' }: { color?: 'blue' | 'white' | 'gray' }) {
  const colorClasses = {
    blue: 'bg-blue-600',
    white: 'bg-white',
    gray: 'bg-gray-600',
  };

  return (
    <div className="flex space-x-2">
      <div className={`w-2 h-2 rounded-full ${colorClasses[color]} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
      <div className={`w-2 h-2 rounded-full ${colorClasses[color]} animate-bounce`} style={{ animationDelay: '150ms' }}></div>
      <div className={`w-2 h-2 rounded-full ${colorClasses[color]} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
    </div>
  );
}

export function PulseLoader() {
  return (
    <div className="flex justify-center items-center">
      <div className="relative">
        <div className="w-16 h-16 bg-blue-600 rounded-full opacity-75 animate-ping absolute"></div>
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
      </div>
    </div>
  );
}

export function ProgressBar({ progress, showLabel = true }: { progress: number; showLabel?: boolean }) {
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Loading...</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{progress}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        >
          <div className="h-full w-full shimmer"></div>
        </div>
      </div>
    </div>
  );
}

export function EmptyStateLoader({ message = 'No data available' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-32 h-32 mb-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full animate-pulse"></div>
        <svg
          className="absolute inset-4 text-gray-400 dark:text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{message}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
        {message === 'No data available' ? 'Get started by adding your first item' : message}
      </p>
    </div>
  );
}
