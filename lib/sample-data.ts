import { Application, Interview, ApplicationStatus, JobType } from './types';

export const sampleApplications: Application[] = [
  {
    id: '1',
    companyName: 'Google',
    jobRole: 'Software Engineering Intern',
    jobType: 'Internship',
    location: 'Mountain View, CA',
    applicationDate: '2026-10-01',
    status: 'Interview',
    jobUrl: 'https://careers.google.com',
    salary: '$8,000/month',
    notes: 'Referred by senior. Focus on algorithms and system design.',
    deadline: '2026-11-15',
    followUpDate: '2026-11-01',
  },
  {
    id: '2',
    companyName: 'Microsoft',
    jobRole: 'Software Engineer Intern',
    jobType: 'Internship',
    location: 'Redmond, WA',
    applicationDate: '2026-10-05',
    status: 'Online Assessment',
    jobUrl: 'https://careers.microsoft.com',
    salary: '$7,500/month',
    notes: 'Applied through university portal. OA received.',
    deadline: '2026-10-30',
  },
  {
    id: '3',
    companyName: 'Amazon',
    jobRole: 'SDE Intern',
    jobType: 'Internship',
    location: 'Seattle, WA',
    applicationDate: '2026-10-10',
    status: 'Applied',
    jobUrl: 'https://amazon.jobs',
    salary: '$8,500/month',
    notes: 'Applied for Summer 2027 internship.',
  },
  {
    id: '4',
    companyName: 'Meta',
    jobRole: 'Software Engineering Intern',
    jobType: 'Internship',
    location: 'Menlo Park, CA',
    applicationDate: '2026-09-20',
    status: 'Rejected',
    jobUrl: 'https://metacareers.com',
    salary: '$9,000/month',
    notes: 'Rejected after phone screen.',
  },
  {
    id: '5',
    companyName: 'Apple',
    jobRole: 'Software Engineering Intern',
    jobType: 'Internship',
    location: 'Cupertino, CA',
    applicationDate: '2026-10-15',
    status: 'Wishlist',
    jobUrl: 'https://jobs.apple.com',
    deadline: '2026-11-20',
    notes: 'Need to prepare resume and cover letter.',
  },
  {
    id: '6',
    companyName: 'Netflix',
    jobRole: 'Software Engineer Intern',
    jobType: 'Internship',
    location: 'Los Gatos, CA',
    applicationDate: '2026-10-08',
    status: 'Offer',
    jobUrl: 'https://jobs.netflix.com',
    salary: '$10,000/month',
    notes: 'Offer received! Need to respond by Nov 5.',
    deadline: '2026-11-05',
  },
  {
    id: '7',
    companyName: 'Stripe',
    jobRole: 'Software Engineering Intern',
    jobType: 'Internship',
    location: 'San Francisco, CA',
    applicationDate: '2026-10-12',
    status: 'Applied',
    jobUrl: 'https://stripe.com/jobs',
    salary: '$9,500/month',
  },
  {
    id: '8',
    companyName: 'Uber',
    jobRole: 'Backend Engineering Intern',
    jobType: 'Internship',
    location: 'San Francisco, CA',
    applicationDate: '2026-10-18',
    status: 'Interview',
    followUpDate: '2026-10-28',
    notes: 'Technical interview scheduled.',
  },
];

export const sampleInterviews: Interview[] = [
  {
    id: '1',
    applicationId: '1',
    type: 'Technical Phone Screen',
    date: '2026-10-25T10:00',
    interviewer: 'John Smith',
    notes: 'Discussed data structures and algorithms. Solved 2 coding problems.',
    outcome: 'Passed',
  },
  {
    id: '2',
    applicationId: '1',
    type: 'Virtual Onsite',
    date: '2026-11-01T14:00',
    interviewer: 'Sarah Johnson',
    notes: 'System design round. Design a URL shortener.',
  },
  {
    id: '3',
    applicationId: '6',
    type: 'HR Interview',
    date: '2026-10-20T09:00',
    interviewer: 'Mike Davis',
    notes: 'Discussed company culture and role expectations.',
    outcome: 'Passed',
  },
  {
    id: '4',
    applicationId: '6',
    type: 'Technical Interview',
    date: '2026-10-22T15:00',
    interviewer: 'Emily Chen',
    notes: 'Coding challenges on algorithms and problem solving.',
    outcome: 'Passed',
  },
  {
    id: '5',
    applicationId: '8',
    type: 'Technical Screen',
    date: '2026-10-28T11:00',
    interviewer: 'Alex Kumar',
    notes: 'Backend systems and API design discussion.',
  },
];

export function loadSampleData() {
  if (typeof window === 'undefined') return;
  
  // Only load if no data exists
  const existingApps = localStorage.getItem('applications');
  const existingInterviews = localStorage.getItem('interviews');
  
  if (!existingApps || JSON.parse(existingApps).length === 0) {
    localStorage.setItem('applications', JSON.stringify(sampleApplications));
  }
  
  if (!existingInterviews || JSON.parse(existingInterviews).length === 0) {
    localStorage.setItem('interviews', JSON.stringify(sampleInterviews));
  }
}

export function clearAllData() {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('applications');
  localStorage.removeItem('interviews');
}
