export type ApplicationStatus = 
  | 'Wishlist'
  | 'Applied'
  | 'Online Assessment'
  | 'Interview'
  | 'Offer'
  | 'Accepted'
  | 'Rejected'
  | 'Withdrawn';

export type JobType = 'Full-time' | 'Internship' | 'Part-time' | 'Contract';

export interface Application {
  id: string;
  companyName: string;
  jobRole: string;
  jobType: JobType;
  location: string;
  applicationDate: string;
  status: ApplicationStatus;
  jobUrl?: string;
  salary?: string;
  notes?: string;
  deadline?: string;
  followUpDate?: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  type: string;
  date: string;
  interviewer?: string;
  notes?: string;
  outcome?: string;
}
