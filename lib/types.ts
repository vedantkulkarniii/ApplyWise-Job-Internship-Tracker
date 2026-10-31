export type ApplicationStatus = 
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'accepted';

export type JobType = 'full-time' | 'part-time' | 'internship' | 'contract';

export type InterviewType = 'phone' | 'video' | 'onsite' | 'technical' | 'behavioral' | 'final';
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled';

export type ReminderPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Application {
  id: string;
  company: string;
  position: string;
  jobType: JobType;
  location: string;
  appliedDate: string;
  status: ApplicationStatus;
  jobUrl?: string;
  salary?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Interview {
  id: string;
  company: string;
  position: string;
  type: InterviewType;
  date: string;
  time: string;
  duration: number;
  location?: string;
  interviewer?: string;
  notes?: string;
  status: InterviewStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: ReminderPriority;
  relatedTo?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
