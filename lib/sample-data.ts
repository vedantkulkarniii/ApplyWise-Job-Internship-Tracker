import { Application, Interview, Reminder } from './types';

export const sampleApplications: Application[] = [
  {
    id: '1',
    company: 'Google',
    position: 'Software Engineering Intern',
    jobType: 'internship',
    location: 'Mountain View, CA',
    appliedDate: '2024-01-15',
    status: 'interview',
    jobUrl: 'https://careers.google.com',
    salary: '$8,000/month',
    notes: 'Referred by senior. Focus on algorithms and system design.',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: '2',
    company: 'Microsoft',
    position: 'Software Engineer Intern',
    jobType: 'internship',
    location: 'Redmond, WA',
    appliedDate: '2024-01-18',
    status: 'screening',
    jobUrl: 'https://careers.microsoft.com',
    salary: '$7,500/month',
    notes: 'Applied through university portal. OA received.',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-22T11:00:00Z',
  },
  {
    id: '3',
    company: 'Amazon',
    position: 'SDE Intern',
    jobType: 'internship',
    location: 'Seattle, WA',
    appliedDate: '2024-01-20',
    status: 'applied',
    jobUrl: 'https://amazon.jobs',
    salary: '$8,500/month',
    notes: 'Applied for Summer 2024 internship.',
    createdAt: '2024-01-20T14:00:00Z',
    updatedAt: '2024-01-20T14:00:00Z',
  },
  {
    id: '4',
    company: 'Meta',
    position: 'Software Engineering Intern',
    jobType: 'internship',
    location: 'Menlo Park, CA',
    appliedDate: '2024-01-10',
    status: 'rejected',
    jobUrl: 'https://metacareers.com',
    salary: '$9,000/month',
    notes: 'Rejected after phone screen.',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-25T16:00:00Z',
  },
  {
    id: '5',
    company: 'Netflix',
    position: 'Software Engineer Intern',
    jobType: 'internship',
    location: 'Los Gatos, CA',
    appliedDate: '2024-01-12',
    status: 'offer',
    jobUrl: 'https://jobs.netflix.com',
    salary: '$10,000/month',
    notes: 'Offer received! Need to respond soon.',
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-28T10:00:00Z',
  },
  {
    id: '6',
    company: 'Stripe',
    position: 'Software Engineering Intern',
    jobType: 'internship',
    location: 'San Francisco, CA',
    appliedDate: '2024-01-22',
    status: 'applied',
    jobUrl: 'https://stripe.com/jobs',
    salary: '$9,500/month',
    createdAt: '2024-01-22T13:00:00Z',
    updatedAt: '2024-01-22T13:00:00Z',
  },
];

export const sampleInterviews: Interview[] = [
  {
    id: '1',
    company: 'Google',
    position: 'Software Engineering Intern',
    type: 'phone',
    date: '2024-02-05',
    time: '10:00',
    duration: 45,
    interviewer: 'John Smith',
    notes: 'Technical phone screen - data structures and algorithms',
    status: 'scheduled',
    createdAt: '2024-01-20T15:30:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: '2',
    company: 'Google',
    position: 'Software Engineering Intern',
    type: 'technical',
    date: '2024-02-10',
    time: '14:00',
    duration: 60,
    location: 'Google Meet',
    interviewer: 'Sarah Johnson',
    notes: 'System design round',
    status: 'scheduled',
    createdAt: '2024-01-20T15:35:00Z',
    updatedAt: '2024-01-20T15:35:00Z',
  },
  {
    id: '3',
    company: 'Netflix',
    position: 'Software Engineer Intern',
    type: 'behavioral',
    date: '2024-01-25',
    time: '09:00',
    duration: 30,
    interviewer: 'Mike Davis',
    notes: 'HR interview - discussed company culture',
    status: 'completed',
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-25T09:30:00Z',
  },
];

export const sampleReminders: Reminder[] = [
  {
    id: '1',
    title: 'Follow up with Google recruiter',
    description: 'Send thank you email after phone screen',
    dueDate: '2024-02-06',
    priority: 'high',
    relatedTo: 'Google - Software Engineering Intern',
    completed: false,
    createdAt: '2024-01-20T16:00:00Z',
    updatedAt: '2024-01-20T16:00:00Z',
  },
  {
    id: '2',
    title: 'Prepare for system design interview',
    description: 'Review distributed systems concepts',
    dueDate: '2024-02-09',
    priority: 'urgent',
    relatedTo: 'Google - Software Engineering Intern',
    completed: false,
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z',
  },
  {
    id: '3',
    title: 'Respond to Netflix offer',
    description: 'Review compensation package and respond',
    dueDate: '2024-02-05',
    priority: 'urgent',
    relatedTo: 'Netflix - Software Engineer Intern',
    completed: false,
    createdAt: '2024-01-28T11:00:00Z',
    updatedAt: '2024-01-28T11:00:00Z',
  },
];

export function loadSampleData() {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('applications', JSON.stringify(sampleApplications));
  localStorage.setItem('interviews', JSON.stringify(sampleInterviews));
  localStorage.setItem('reminders', JSON.stringify(sampleReminders));
}

export function clearAllData() {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('applications');
  localStorage.removeItem('interviews');
  localStorage.removeItem('reminders');
}
