'use client';

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: BarChartData[];
  title?: string;
  height?: number;
}

export default function SimpleBarChart({ data, title, height = 300 }: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  const defaultColors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // yellow
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      <div className="flex items-end justify-between gap-4" style={{ height: `${height}px` }}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 100;
          const color = item.color || defaultColors[index % defaultColors.length];

          return (
            <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col justify-end items-center" style={{ height: '100%' }}>
                <div className="relative w-full group">
                  <div
                    className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80"
                    style={{
                      height: `${barHeight}%`,
                      backgroundColor: color,
                      minHeight: item.value > 0 ? '8px' : '0px',
                    }}
                  />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-gray-900 text-white text-sm rounded py-1 px-2 whitespace-nowrap">
                      {item.value}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 text-center font-medium mt-2">
                {item.label}
              </div>
              <div className="text-xs text-gray-500 font-semibold">
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
