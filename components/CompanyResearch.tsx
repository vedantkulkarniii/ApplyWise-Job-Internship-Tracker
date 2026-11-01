'use client';

import { useState } from 'react';
import { Card } from './Card';

interface ResearchSection {
  id: string;
  title: string;
  content: string;
  icon: string;
}

interface CompanyResearchProps {
  companyName: string;
  onSave?: (research: ResearchSection[]) => void;
}

const defaultSections: ResearchSection[] = [
  {
    id: 'overview',
    title: 'Company Overview',
    content: '',
    icon: '🏢',
  },
  {
    id: 'mission',
    title: 'Mission & Values',
    content: '',
    icon: '🎯',
  },
  {
    id: 'products',
    title: 'Products & Services',
    content: '',
    icon: '📦',
  },
  {
    id: 'culture',
    title: 'Company Culture',
    content: '',
    icon: '🌟',
  },
  {
    id: 'news',
    title: 'Recent News & Updates',
    content: '',
    icon: '📰',
  },
  {
    id: 'competitors',
    title: 'Competitors',
    content: '',
    icon: '⚔️',
  },
  {
    id: 'financials',
    title: 'Financial Status',
    content: '',
    icon: '💰',
  },
  {
    id: 'tech-stack',
    title: 'Technology Stack',
    content: '',
    icon: '💻',
  },
  {
    id: 'team',
    title: 'Team & Leadership',
    content: '',
    icon: '👥',
  },
  {
    id: 'questions',
    title: 'Questions to Ask',
    content: '',
    icon: '❓',
  },
];

export default function CompanyResearch({ companyName, onSave }: CompanyResearchProps) {
  const [sections, setSections] = useState<ResearchSection[]>(defaultSections);
  const [activeSection, setActiveSection] = useState<string>('overview');

  const updateSection = (id: string, content: string) => {
    const updated = sections.map(s =>
      s.id === id ? { ...s, content } : s
    );
    setSections(updated);
    onSave?.(updated);
  };

  const activeData = sections.find(s => s.id === activeSection);
  const completedCount = sections.filter(s => s.content.trim().length > 0).length;
  const progress = (completedCount / sections.length) * 100;

  return (
    <div className="max-w-6xl mx-auto">
      <Card>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Research: {companyName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gather comprehensive information to prepare for your interview
          </p>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Research Progress</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {completedCount}/{sections.length} sections
              </span>
            </div>
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="space-y-1">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                    activeSection === section.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-xl">{section.icon}</span>
                  <span className="text-sm flex-1">{section.title}</span>
                  {section.content.trim().length > 0 && (
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {activeData && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{activeData.icon}</span>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {activeData.title}
                  </h2>
                </div>

                <textarea
                  value={activeData.content}
                  onChange={(e) => updateSection(activeData.id, e.target.value)}
                  placeholder={`Add your research notes about ${activeData.title.toLowerCase()}...`}
                  className="w-full h-96 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />

                {/* Tips for each section */}
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                    💡 Research Tips:
                  </p>
                  <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                    {activeData.id === 'overview' && (
                      <>
                        <li>• Check the company website's "About" page</li>
                        <li>• Look at their LinkedIn company page</li>
                        <li>• Review their Wikipedia entry if available</li>
                      </>
                    )}
                    {activeData.id === 'mission' && (
                      <>
                        <li>• Find the mission statement on their website</li>
                        <li>• Look for their core values and principles</li>
                        <li>• Understand their long-term vision</li>
                      </>
                    )}
                    {activeData.id === 'products' && (
                      <>
                        <li>• List their main products or services</li>
                        <li>• Understand their target customers</li>
                        <li>• Note any recent product launches</li>
                      </>
                    )}
                    {activeData.id === 'culture' && (
                      <>
                        <li>• Read employee reviews on Glassdoor</li>
                        <li>• Check their social media presence</li>
                        <li>• Look for blog posts about company culture</li>
                      </>
                    )}
                    {activeData.id === 'news' && (
                      <>
                        <li>• Google the company name + "news"</li>
                        <li>• Check their press release page</li>
                        <li>• Look for recent funding or acquisitions</li>
                      </>
                    )}
                    {activeData.id === 'competitors' && (
                      <>
                        <li>• Identify 3-5 main competitors</li>
                        <li>• Understand their competitive advantages</li>
                        <li>• Know their market position</li>
                      </>
                    )}
                    {activeData.id === 'financials' && (
                      <>
                        <li>• Check if they're public or private</li>
                        <li>• Look up recent funding rounds</li>
                        <li>• Understand their revenue model</li>
                      </>
                    )}
                    {activeData.id === 'tech-stack' && (
                      <>
                        <li>• Check job postings for tech requirements</li>
                        <li>• Look at their engineering blog</li>
                        <li>• Search on StackShare or similar sites</li>
                      </>
                    )}
                    {activeData.id === 'team' && (
                      <>
                        <li>• Research the hiring manager on LinkedIn</li>
                        <li>• Learn about key executives</li>
                        <li>• Understand team structure and size</li>
                      </>
                    )}
                    {activeData.id === 'questions' && (
                      <>
                        <li>• Prepare 5-10 thoughtful questions</li>
                        <li>• Ask about role responsibilities</li>
                        <li>• Inquire about team dynamics and growth</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Quick Research Links:
          </h3>
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(companyName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors"
            >
              🔍 Google
            </a>
            <a
              href={`https://www.linkedin.com/company/${encodeURIComponent(companyName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors"
            >
              💼 LinkedIn
            </a>
            <a
              href={`https://www.glassdoor.com/Search/results.htm?keyword=${encodeURIComponent(companyName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors"
            >
              ⭐ Glassdoor
            </a>
            <a
              href={`https://www.crunchbase.com/organization/${encodeURIComponent(companyName.toLowerCase().replace(/\s+/g, '-'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors"
            >
              📊 Crunchbase
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
