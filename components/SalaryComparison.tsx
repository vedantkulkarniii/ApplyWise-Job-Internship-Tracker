'use client';

import { useState } from 'react';
import { Card } from './Card';

interface SalaryData {
  company: string;
  position: string;
  offeredSalary?: number;
  marketMin: number;
  marketMax: number;
  marketMedian: number;
  location: string;
  benefits?: string[];
}

export default function SalaryComparison() {
  const [salary, setSalary] = useState('');
  const [position, setPosition] = useState('Software Engineer');
  const [location, setLocation] = useState('United States');
  const [experience, setExperience] = useState('3-5');

  // Sample market data (would normally come from an API)
  const marketData: Record<string, any> = {
    'Software Engineer': {
      'United States': { '0-2': [60000, 90000, 75000], '3-5': [90000, 140000, 115000], '5+': [120000, 180000, 150000] },
      'India': { '0-2': [400000, 800000, 600000], '3-5': [800000, 1500000, 1150000], '5+': [1500000, 2500000, 2000000] },
    },
    'Data Scientist': {
      'United States': { '0-2': [70000, 100000, 85000], '3-5': [100000, 150000, 125000], '5+': [130000, 200000, 165000] },
      'India': { '0-2': [500000, 900000, 700000], '3-5': [900000, 1800000, 1350000], '5+': [1800000, 3000000, 2400000] },
    },
  };

  const getData = () => {
    const data = marketData[position]?.[location]?.[experience];
    if (!data) return null;
    return {
      min: data[0],
      max: data[1],
      median: data[2],
    };
  };

  const data = getData();
  const numSalary = parseFloat(salary);
  const isValidSalary = !isNaN(numSalary) && numSalary > 0;

  const getPercentile = () => {
    if (!data || !isValidSalary) return 50;
    const { min, max, median } = data;
    if (numSalary <= min) return 10;
    if (numSalary >= max) return 90;
    if (numSalary <= median) {
      return 10 + ((numSalary - min) / (median - min)) * 40;
    }
    return 50 + ((numSalary - median) / (max - median)) * 40;
  };

  const getStatus = () => {
    if (!data || !isValidSalary) return { text: 'Enter salary', color: 'text-gray-500' };
    const percentile = getPercentile();
    if (percentile < 25) return { text: 'Below Market', color: 'text-red-600 dark:text-red-400' };
    if (percentile < 40) return { text: 'Fair', color: 'text-yellow-600 dark:text-yellow-400' };
    if (percentile < 60) return { text: 'Competitive', color: 'text-green-600 dark:text-green-400' };
    if (percentile < 75) return { text: 'Above Average', color: 'text-blue-600 dark:text-blue-400' };
    return { text: 'Excellent', color: 'text-purple-600 dark:text-purple-400' };
  };

  const formatCurrency = (amount: number) => {
    if (location === 'India') {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
    return `$${amount.toLocaleString('en-US')}`;
  };

  const percentile = getPercentile();
  const status = getStatus();

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          💰 Salary Comparison Tool
        </h2>

        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Position
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Software Engineer</option>
              <option>Data Scientist</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>United States</option>
              <option>India</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Experience
            </label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="0-2">0-2 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5+">5+ years</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Salary
            </label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder={location === 'India' ? '₹1,000,000' : '$100,000'}
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Results */}
        {data && (
          <>
            {/* Status Badge */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xl font-bold ${status.color} bg-gray-50 dark:bg-gray-800`}>
                <span>{status.text}</span>
                {isValidSalary && (
                  <span className="text-sm font-normal">({Math.round(percentile)}th percentile)</span>
                )}
              </div>
            </div>

            {/* Salary Range Visualization */}
            <div className="mb-8">
              <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                <span>Market Range</span>
                <span>{formatCurrency(data.min)} - {formatCurrency(data.max)}</span>
              </div>

              <div className="relative h-12 bg-gradient-to-r from-red-200 via-yellow-200 via-green-200 to-blue-200 dark:from-red-900/30 dark:via-yellow-900/30 dark:via-green-900/30 dark:to-blue-900/30 rounded-lg overflow-hidden">
                {/* Median marker */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-gray-800 dark:bg-gray-200"
                  style={{ left: '50%' }}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap text-gray-600 dark:text-gray-400">
                    Median: {formatCurrency(data.median)}
                  </div>
                </div>

                {/* Your salary marker */}
                {isValidSalary && (
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-purple-600 dark:bg-purple-400"
                    style={{
                      left: `${Math.max(0, Math.min(100, ((numSalary - data.min) / (data.max - data.min)) * 100))}%`,
                    }}
                  >
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold whitespace-nowrap text-purple-600 dark:text-purple-400">
                      You: {formatCurrency(numSalary)}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-8">
                <span>{formatCurrency(data.min)}</span>
                <span>{formatCurrency(data.max)}</span>
              </div>
            </div>

            {/* Comparison Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <Card>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Market Min</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(data.min)}
                  </p>
                  {isValidSalary && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {numSalary >= data.min ? '✅ Above' : '⚠️ Below'}
                    </p>
                  )}
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Market Median</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(data.median)}
                  </p>
                  {isValidSalary && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {numSalary >= data.median ? '✅ Above' : '⚠️ Below'}
                    </p>
                  )}
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Market Max</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(data.max)}
                  </p>
                  {isValidSalary && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {numSalary >= data.max ? '🌟 At Max' : `${Math.round(((data.max - numSalary) / data.max) * 100)}% below`}
                    </p>
                  )}
                </div>
              </Card>
            </div>

            {/* Insights */}
            {isValidSalary && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">💡 Insights</h3>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  {numSalary < data.min && (
                    <li>• Your salary is below the market minimum. Consider negotiating or looking for better opportunities.</li>
                  )}
                  {numSalary >= data.min && numSalary < data.median && (
                    <li>• Your salary is fair but below median. There's room for growth.</li>
                  )}
                  {numSalary >= data.median && numSalary < data.max * 0.9 && (
                    <li>• Your salary is competitive. You're in a good position!</li>
                  )}
                  {numSalary >= data.max * 0.9 && (
                    <li>• Excellent! Your salary is at the top of the market range.</li>
                  )}
                  <li>• Consider total compensation including benefits, equity, bonuses, and work-life balance.</li>
                  <li>• Market rates vary by company size, industry, and specific location within country.</li>
                </ul>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Negotiation Tips */}
      <Card>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
          🤝 Salary Negotiation Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Before Negotiating:</h4>
            <ul className="space-y-1">
              <li>✓ Research market rates thoroughly</li>
              <li>✓ Know your worth and value proposition</li>
              <li>✓ Consider total compensation package</li>
              <li>✓ Have a target range, not a single number</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">During Negotiation:</h4>
            <ul className="space-y-1">
              <li>✓ Be professional and confident</li>
              <li>✓ Let them make the first offer</li>
              <li>✓ Justify your ask with data and achievements</li>
              <li>✓ Be willing to negotiate other benefits</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
