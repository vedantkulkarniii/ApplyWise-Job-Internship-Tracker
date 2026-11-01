'use client';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface AdvancedChartProps {
  data: DataPoint[];
  type: 'line' | 'area' | 'bar';
  title?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
}

export default function AdvancedChart({
  data,
  type,
  title,
  height = 300,
  showGrid = true,
  showLegend = true,
}: AdvancedChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const chartWidth = 100;
  const points = data.length;
  const stepX = chartWidth / (points - 1 || 1);

  // Generate path for line/area chart
  const generatePath = () => {
    if (data.length === 0) return '';
    
    const pathPoints = data.map((d, i) => {
      const x = i * stepX;
      const y = 100 - (d.value / maxValue) * 100;
      return `${x},${y}`;
    });

    return `M ${pathPoints.join(' L ')}`;
  };

  // Generate area path
  const generateAreaPath = () => {
    if (data.length === 0) return '';
    
    const linePath = generatePath();
    const lastX = (data.length - 1) * stepX;
    return `${linePath} L ${lastX},100 L 0,100 Z`;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-800 p-6">
      {title && (
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          {title}
        </h3>
      )}

      <div className="relative" style={{ height: `${height}px` }}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Grid lines */}
          {showGrid && (
            <g className="opacity-20">
              {[0, 25, 50, 75, 100].map(y => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-gray-400 dark:text-gray-600"
                />
              ))}
            </g>
          )}

          {/* Render based on chart type */}
          {type === 'area' && (
            <path
              d={generateAreaPath()}
              fill="url(#gradient)"
              className="transition-all duration-300"
            />
          )}

          {type === 'line' && (
            <path
              d={generatePath()}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
          )}

          {type === 'bar' && (
            <g>
              {data.map((d, i) => {
                const barWidth = (chartWidth / points) * 0.6;
                const x = i * stepX - barWidth / 2;
                const barHeight = (d.value / maxValue) * 100;
                const y = 100 - barHeight;

                return (
                  <rect
                    key={i}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={d.color || 'url(#barGradient)'}
                    className="transition-all duration-300 hover:opacity-80"
                    rx="1"
                  />
                );
              })}
            </g>
          )}

          {/* Data points for line/area charts */}
          {(type === 'line' || type === 'area') && (
            <g>
              {data.map((d, i) => {
                const x = i * stepX;
                const y = 100 - (d.value / maxValue) * 100;

                return (
                  <g key={i}>
                    <circle
                      cx={x}
                      cy={y}
                      r="2"
                      fill="#3B82F6"
                      className="transition-all duration-300 hover:r-3"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="6"
                      fill="transparent"
                      className="cursor-pointer hover:fill-blue-500 hover:fill-opacity-20"
                    >
                      <title>{`${d.label}: ${d.value}`}</title>
                    </circle>
                  </g>
                );
              })}
            </g>
          )}

          {/* Gradients */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 -ml-8">
          <span>{maxValue}</span>
          <span>{Math.floor(maxValue * 0.75)}</span>
          <span>{Math.floor(maxValue * 0.5)}</span>
          <span>{Math.floor(maxValue * 0.25)}</span>
          <span>0</span>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-4 text-xs text-gray-500 dark:text-gray-400">
        {data.map((d, i) => (
          <span key={i} className="text-center" style={{ width: `${100 / points}%` }}>
            {d.label}
          </span>
        ))}
      </div>

      {/* Legend */}
      {showLegend && data.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: d.color || '#3B82F6' }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {d.label}: <strong>{d.value}</strong>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
