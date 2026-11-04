'use client';

import { useState } from 'react';
import { Card } from './Card';
import { Badge } from './Badge';

interface Resume {
  id: string;
  name: string;
  version: string;
  file?: File;
  url?: string;
  type: 'general' | 'software' | 'data' | 'product' | 'design' | 'custom';
  lastModified: string;
  usedCount: number;
  tags: string[];
}

interface ResumeManagerProps {
  resumes?: Resume[];
  onUpload?: (resume: Resume) => void;
  onDelete?: (id: string) => void;
  onSelect?: (resume: Resume) => void;
}

const defaultResumes: Resume[] = [
  {
    id: '1',
    name: 'Software Engineer Resume',
    version: 'v2.3',
    type: 'software',
    lastModified: '2026-11-01',
    usedCount: 15,
    tags: ['JavaScript', 'React', 'Node.js'],
    url: '/resumes/software-resume.pdf',
  },
  {
    id: '2',
    name: 'Data Science Resume',
    version: 'v1.0',
    type: 'data',
    lastModified: '2026-10-25',
    usedCount: 8,
    tags: ['Python', 'ML', 'TensorFlow'],
    url: '/resumes/data-resume.pdf',
  },
];

export default function ResumeManager({
  resumes = defaultResumes,
  onUpload,
  onDelete,
  onSelect,
}: ResumeManagerProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);

  const getTypeColor = (type: Resume['type']) => {
    switch (type) {
      case 'software': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'data': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'product': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'design': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      case 'general': return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
      case 'custom': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
    }
  };

  const getTypeIcon = (type: Resume['type']) => {
    switch (type) {
      case 'software': return '💻';
      case 'data': return '📊';
      case 'product': return '📱';
      case 'design': return '🎨';
      case 'general': return '📄';
      case 'custom': return '⭐';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Resume Manager
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Organize and track different versions of your resume
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload Resume
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {resumes.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Resumes</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {resumes.reduce((sum, r) => sum + r.usedCount, 0)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Uses</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {resumes.filter(r => r.type === 'software').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Software</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {resumes.filter(r => {
                const daysSince = Math.floor(
                  (Date.now() - new Date(r.lastModified).getTime()) / (1000 * 60 * 60 * 24)
                );
                return daysSince <= 7;
              }).length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Updated This Week</p>
          </div>
        </Card>
      </div>

      {/* Resume List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {resumes.map(resume => (
          <Card key={resume.id}>
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{getTypeIcon(resume.type)}</div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white">
                      {resume.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {resume.version} • Last modified {new Date(resume.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(resume.type)}`}>
                  {resume.type}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {resume.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Used {resume.usedCount} times</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => onSelect?.(resume)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </button>
                <button className="px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                <button className="px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete?.(resume.id)}
                  className="px-3 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Best Practices */}
      <Card>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
          📋 Resume Best Practices
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Do's:</h4>
            <ul className="space-y-1">
              <li>✅ Tailor your resume for each position</li>
              <li>✅ Use action verbs and quantify achievements</li>
              <li>✅ Keep it concise (1-2 pages max)</li>
              <li>✅ Update regularly with new skills and projects</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Don'ts:</h4>
            <ul className="space-y-1">
              <li>❌ Use the same resume for every application</li>
              <li>❌ Include irrelevant work experience</li>
              <li>❌ Use fancy fonts or excessive formatting</li>
              <li>❌ Forget to proofread for errors</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
