'use client';

import { useState } from 'react';
import { Card } from './Card';
import { Badge } from './Badge';

interface Contact {
  id: string;
  name: string;
  company: string;
  position: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  relationship: 'recruiter' | 'hiring_manager' | 'employee' | 'mentor' | 'other';
  lastContact: string;
  notes: string;
  tags: string[];
  followUpDate?: string;
}

interface NetworkingTrackerProps {
  contacts?: Contact[];
  onAddContact?: (contact: Contact) => void;
  onUpdateContact?: (contact: Contact) => void;
  onDeleteContact?: (id: string) => void;
}

const defaultContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    company: 'TechCorp',
    position: 'Senior Recruiter',
    email: 'sarah.j@techcorp.com',
    linkedin: 'linkedin.com/in/sarahjohnson',
    relationship: 'recruiter',
    lastContact: '2026-10-28',
    notes: 'Connected via LinkedIn. Very responsive and helpful.',
    tags: ['Active', 'Responsive'],
    followUpDate: '2026-11-10',
  },
  {
    id: '2',
    name: 'Michael Chen',
    company: 'DataTech Inc',
    position: 'Engineering Manager',
    email: 'm.chen@datatech.com',
    relationship: 'hiring_manager',
    lastContact: '2026-11-01',
    notes: 'Interviewed with his team. Great conversation about ML projects.',
    tags: ['Interview', 'Technical'],
  },
];

export default function NetworkingTracker({
  contacts = defaultContacts,
  onAddContact,
  onUpdateContact,
  onDeleteContact,
}: NetworkingTrackerProps) {
  const [filter, setFilter] = useState<'all' | Contact['relationship']>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getRelationshipColor = (relationship: Contact['relationship']) => {
    switch (relationship) {
      case 'recruiter': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'hiring_manager': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'employee': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'mentor': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'other': return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }
  };

  const getRelationshipIcon = (relationship: Contact['relationship']) => {
    switch (relationship) {
      case 'recruiter': return '👔';
      case 'hiring_manager': return '💼';
      case 'employee': return '👤';
      case 'mentor': return '🎓';
      case 'other': return '🤝';
    }
  };

  const getDaysSinceContact = (lastContact: string) => {
    const now = new Date();
    const last = new Date(lastContact);
    const diff = now.getTime() - last.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const needsFollowUp = (contact: Contact) => {
    if (!contact.followUpDate) return false;
    return new Date(contact.followUpDate) <= new Date();
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesFilter = filter === 'all' || contact.relationship === filter;
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.position.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Networking Tracker
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your professional connections and follow-ups
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Contact
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts, companies, or positions..."
            className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All ({contacts.length})
          </button>
          {['recruiter', 'hiring_manager', 'employee', 'mentor', 'other'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type as Contact['relationship'])}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {getRelationshipIcon(type as Contact['relationship'])} {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {contacts.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Contacts</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
              {contacts.filter(needsFollowUp).length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Need Follow-up</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {contacts.filter(c => getDaysSinceContact(c.lastContact) <= 7).length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active This Week</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {new Set(contacts.map(c => c.company)).size}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Companies</p>
          </div>
        </Card>
      </div>

      {/* Contacts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredContacts.map(contact => {
          const daysSince = getDaysSinceContact(contact.lastContact);
          const needsAction = needsFollowUp(contact);

          return (
            <Card key={contact.id}>
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white">
                        {contact.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {contact.position}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {contact.company}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRelationshipColor(contact.relationship)}`}>
                    {getRelationshipIcon(contact.relationship)} {contact.relationship.replace('_', ' ')}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 text-sm">
                  {contact.email && (
                    <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {contact.email}
                    </a>
                  )}
                  {contact.linkedin && (
                    <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      LinkedIn
                    </a>
                  )}
                </div>

                {/* Last Contact & Follow-up */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{daysSince} days ago</span>
                  </div>
                  {needsAction && (
                    <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Follow-up due
                    </span>
                  )}
                </div>

                {/* Tags */}
                {contact.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {contact.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Notes */}
                {contact.notes && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                    {contact.notes}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Contact
                  </button>
                  <button className="px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm">
                    Edit
                  </button>
                  <button className="px-3 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors text-sm">
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Tips */}
      <Card>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
          🤝 Networking Tips
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <li>• Follow up within 24-48 hours after meeting someone</li>
          <li>• Send personalized messages referencing your conversation</li>
          <li>• Add value in your follow-ups (share articles, make introductions)</li>
          <li>• Stay in touch every 2-3 months with meaningful contacts</li>
          <li>• Keep detailed notes about your conversations</li>
        </ul>
      </Card>
    </div>
  );
}
