// Application statuses
export const APPLICATION_STATUSES = [
  { value: 'applied', label: 'Applied', color: 'blue' },
  { value: 'screening', label: 'Screening', color: 'purple' },
  { value: 'interview', label: 'Interview', color: 'yellow' },
  { value: 'offer', label: 'Offer', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
  { value: 'accepted', label: 'Accepted', color: 'green' },
] as const;

// Job types
export const JOB_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'internship', label: 'Internship' },
  { value: 'contract', label: 'Contract' },
] as const;

// Interview types
export const INTERVIEW_TYPES = [
  { value: 'phone', label: 'Phone Screen' },
  { value: 'video', label: 'Video Call' },
  { value: 'onsite', label: 'On-site' },
  { value: 'technical', label: 'Technical' },
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'final', label: 'Final Round' },
] as const;

// Interview statuses
export const INTERVIEW_STATUSES = [
  { value: 'scheduled', label: 'Scheduled', color: 'blue' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' },
] as const;

// Reminder priorities
export const REMINDER_PRIORITIES = [
  { value: 'low', label: 'Low', color: 'gray' },
  { value: 'medium', label: 'Medium', color: 'blue' },
  { value: 'high', label: 'High', color: 'yellow' },
  { value: 'urgent', label: 'Urgent', color: 'red' },
] as const;

// Interview durations (in minutes)
export const INTERVIEW_DURATIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
] as const;

// Salary ranges (for filtering)
export const SALARY_RANGES = [
  { value: '0-50', label: 'Under $50k' },
  { value: '50-75', label: '$50k - $75k' },
  { value: '75-100', label: '$75k - $100k' },
  { value: '100-150', label: '$100k - $150k' },
  { value: '150-200', label: '$150k - $200k' },
  { value: '200+', label: '$200k+' },
] as const;

// Experience levels
export const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid-Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'principal', label: 'Principal' },
] as const;

// Work locations
export const WORK_LOCATIONS = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
] as const;

// App configuration
export const APP_CONFIG = {
  name: 'ApplyWise',
  description: 'Job & Internship Application Tracker',
  version: '1.0.0',
  author: 'ApplyWise Team',
  github: 'https://github.com/vedantkulkarniii/ApplyWise-Job-Internship-Tracker',
} as const;

// LocalStorage keys
export const STORAGE_KEYS = {
  APPLICATIONS: 'applywise_applications',
  INTERVIEWS: 'applywise_interviews',
  REMINDERS: 'applywise_reminders',
  USER_PROFILE: 'applywise_user_profile',
  SETTINGS: 'applywise_settings',
  THEME: 'applywise_theme',
} as const;

// Date formats
export const DATE_FORMATS = {
  SHORT: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  WITH_TIME: 'MMM dd, yyyy HH:mm',
  TIME_ONLY: 'HH:mm',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// File upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx'],
} as const;

// Color palette
export const COLORS = {
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4',
  gray: '#6B7280',
} as const;
