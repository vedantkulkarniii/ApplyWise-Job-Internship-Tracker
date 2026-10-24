import { z } from 'zod';
import { ApplicationStatus, JobType } from './types';

// Application validation schema
export const applicationSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(100, 'Company name too long'),
  jobRole: z.string().min(1, 'Job role is required').max(100, 'Job role too long'),
  jobType: z.enum(['Full-time', 'Internship', 'Part-time', 'Contract'] as const),
  location: z.string().min(1, 'Location is required').max(100, 'Location too long'),
  applicationDate: z.string().min(1, 'Application date is required'),
  status: z.enum([
    'Wishlist',
    'Applied',
    'Online Assessment',
    'Interview',
    'Offer',
    'Accepted',
    'Rejected',
    'Withdrawn',
  ] as const),
  jobUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  salary: z.string().max(50, 'Salary info too long').optional(),
  notes: z.string().max(1000, 'Notes too long').optional(),
  deadline: z.string().optional(),
  followUpDate: z.string().optional(),
});

// Interview validation schema
export const interviewSchema = z.object({
  applicationId: z.string().min(1, 'Application is required'),
  type: z.string().min(1, 'Interview type is required').max(50, 'Type too long'),
  date: z.string().min(1, 'Date and time is required'),
  interviewer: z.string().max(100, 'Interviewer name too long').optional(),
  notes: z.string().max(1000, 'Notes too long').optional(),
  outcome: z.string().max(50, 'Outcome too long').optional(),
});

// Validation helper functions
export function validateApplication(data: unknown) {
  return applicationSchema.safeParse(data);
}

export function validateInterview(data: unknown) {
  return interviewSchema.safeParse(data);
}

// Field-specific validators
export function isValidUrl(url: string): boolean {
  if (!url) return true; // Empty is valid (optional field)
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidDate(dateString: string): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

export function isFutureDate(dateString: string): boolean {
  if (!isValidDate(dateString)) return false;
  return new Date(dateString) > new Date();
}

export function isPastDate(dateString: string): boolean {
  if (!isValidDate(dateString)) return false;
  return new Date(dateString) < new Date();
}

// Format error messages for display
export function formatValidationErrors(errors: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {};
  errors.errors.forEach((error) => {
    const path = error.path.join('.');
    formatted[path] = error.message;
  });
  return formatted;
}
