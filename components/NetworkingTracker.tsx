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
  linkedIn?: string;
  relationship: 'recruiter' | 'referral' | 'hiring-manager' | 'colleague' | 'other';
  lastContact: string;
  notes: string;
  tags: string[];
}

interface Interaction {
  id: string;
  contactId: string;
  date: string;
  type: 'email' | 'call' | 'meeting' | 'linkedin' | 'other';
  notes: string;
  followUp?: string;
}

export default function NetworkingTracker() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const addContact = (contact: Omit<Contact, 'id'>) => {
    const newContact: Contact = {
      ...contact,
      id: Date.now().toString(),
    };
    setContacts([...contacts, newContact]);
    setShowAddContact(false);
  };

  const addInteraction = (interaction: Omit<Interaction, 'id'>) => {
    const newInteraction: Interaction = {
      ...interaction,
      id: Date.now().toString(),
    };
    setInteractions([...interactions, newInteraction]);
  };

  const getContactInteractions = (contactId: string) => {
    return interactions.filter(i => i.contactId === contactId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getDaysSinceContact = (lastContact: string) => {
    const days = Math.floor((Date.now() - new Date(lastContact).getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getContactsByRelationship = (relationship: Contact['relationship']) => {
    return contacts.filter(c => c.relationship === relationship);
  };

  const relationshipColors = {
    recruiter: 'blue',
    referral: 'green',
    'hiring-manager': 'purple',
    colleague: 'yellow',
    other: 'gray',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Networking Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your professional connections and interactions
          </p>
        </div>
        <button
          onClick={() => setShowAddContact(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Contact
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Contacts', value: contacts.length, icon: '👥' },
          { label: 'Recruiters', value: getContactsByRelationship('recruiter').length, icon: '🎯' },
          { label: 'Referrals', value: getContactsByRelationship('referral').length, icon: '🤝' },
          { label: 'Hiring Managers', value: getContactsByRelationship('hiring-manager').length, icon: '💼' },
          { label: 'Interactions', value: interactions.length, icon: '💬' },
        ].map((stat, i) => (
          <Card key={i}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stat.value}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Contacts Need Follow-up */}
      {contacts.some(c => getDaysSinceContact(c.lastContact) > 14) && (
        <Card>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            ⚠️ Contacts Need Follow-up
          </h2>
          <div className="space-y-3">
            {contacts
              .filter(c => getDaysSinceContact(c.lastContact) > 14)
              .map(contact => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-white">{contact.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {contact.position} at {contact.company}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                      {getDaysSinceContact(contact.lastContact)} days ago
                    </p>
                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      Schedule follow-up
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {contacts.map(contact => {
          const contactInteractions = getContactInteractions(contact.id);
          const daysSince = getDaysSinceContact(contact.lastContact);

          return (
            <Card key={contact.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                      {contact.name}
                    </h3>
                    <Badge variant={relationshipColors[contact.relationship] as any}>
                      {contact.relationship.replace('-', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {contact.position} at {contact.company}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedContact(contact)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-3">
                {contact.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {contact.email}
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {contact.phone}
                  </div>
                )}
                {contact.linkedIn && (
                  <a
                    href={contact.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn Profile
                  </a>
                )}
              </div>

              {/* Tags */}
              {contact.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {contact.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Last Contact */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Last contact: {daysSince === 0 ? 'Today' : `${daysSince} days ago`}
                  </span>
                  <button className="text-blue-600 dark:text-blue-400 hover:underline">
                    Log interaction
                  </button>
                </div>
              </div>

              {/* Recent Interactions */}
              {contactInteractions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recent Interactions ({contactInteractions.length})
                  </p>
                  <div className="space-y-2">
                    {contactInteractions.slice(0, 2).map(interaction => (
                      <div key={interaction.id} className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">{interaction.type}</span> - {new Date(interaction.date).toLocaleDateString()}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes Preview */}
              {contact.notes && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {contact.notes}
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {contacts.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              No contacts yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start building your professional network by adding contacts
            </p>
            <button
              onClick={() => setShowAddContact(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Contact
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
