/**
 * Application status workflow and automation
 */

import { Application } from './types';

export type WorkflowStage =
  | 'applied'
  | 'screening'
  | 'phone-interview'
  | 'technical-interview'
  | 'onsite-interview'
  | 'final-interview'
  | 'offer'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export interface WorkflowAction {
  id: string;
  label: string;
  description: string;
  fromStages: WorkflowStage[];
  toStage: WorkflowStage;
  icon: string;
  suggestedTasks?: string[];
}

/**
 * Predefined workflow actions
 */
export const workflowActions: WorkflowAction[] = [
  {
    id: 'move-to-screening',
    label: 'Move to Screening',
    description: 'Application is being reviewed',
    fromStages: ['applied'],
    toStage: 'screening',
    icon: '👀',
    suggestedTasks: ['Prepare for recruiter call', 'Review job description'],
  },
  {
    id: 'schedule-phone',
    label: 'Schedule Phone Interview',
    description: 'Phone interview scheduled',
    fromStages: ['applied', 'screening'],
    toStage: 'phone-interview',
    icon: '📞',
    suggestedTasks: [
      'Research company',
      'Prepare STAR examples',
      'List questions to ask',
    ],
  },
  {
    id: 'schedule-technical',
    label: 'Schedule Technical',
    description: 'Technical interview scheduled',
    fromStages: ['phone-interview'],
    toStage: 'technical-interview',
    icon: '💻',
    suggestedTasks: [
      'Practice coding problems',
      'Review system design',
      'Study relevant technologies',
    ],
  },
  {
    id: 'schedule-onsite',
    label: 'Schedule Onsite',
    description: 'Onsite interview scheduled',
    fromStages: ['phone-interview', 'technical-interview'],
    toStage: 'onsite-interview',
    icon: '🏢',
    suggestedTasks: [
      'Plan travel arrangements',
      'Prepare questions for team',
      'Review company culture',
    ],
  },
  {
    id: 'schedule-final',
    label: 'Final Interview',
    description: 'Final round scheduled',
    fromStages: ['technical-interview', 'onsite-interview'],
    toStage: 'final-interview',
    icon: '🎯',
    suggestedTasks: [
      'Prepare negotiation strategy',
      'List compensation expectations',
      'Research market rates',
    ],
  },
  {
    id: 'receive-offer',
    label: 'Receive Offer',
    description: 'Offer received',
    fromStages: ['final-interview', 'onsite-interview', 'technical-interview'],
    toStage: 'offer',
    icon: '🎉',
    suggestedTasks: [
      'Review offer details',
      'Compare with other offers',
      'Negotiate if needed',
    ],
  },
  {
    id: 'accept-offer',
    label: 'Accept Offer',
    description: 'Offer accepted',
    fromStages: ['offer'],
    toStage: 'accepted',
    icon: '✅',
    suggestedTasks: [
      'Send acceptance email',
      'Set start date',
      'Begin onboarding',
    ],
  },
  {
    id: 'reject-application',
    label: 'Rejected',
    description: 'Application rejected',
    fromStages: ['applied', 'screening', 'phone-interview', 'technical-interview', 'onsite-interview', 'final-interview', 'offer'],
    toStage: 'rejected',
    icon: '❌',
  },
  {
    id: 'withdraw-application',
    label: 'Withdraw',
    description: 'Withdraw application',
    fromStages: ['applied', 'screening', 'phone-interview', 'technical-interview', 'onsite-interview', 'final-interview', 'offer'],
    toStage: 'withdrawn',
    icon: '🚫',
  },
];

/**
 * Get available actions for a given stage
 */
export function getAvailableActions(currentStage: WorkflowStage): WorkflowAction[] {
  return workflowActions.filter(action =>
    action.fromStages.includes(currentStage)
  );
}

/**
 * Get workflow progress percentage
 */
export function getWorkflowProgress(stage: WorkflowStage): number {
  const progressMap: Record<WorkflowStage, number> = {
    applied: 10,
    screening: 20,
    'phone-interview': 35,
    'technical-interview': 50,
    'onsite-interview': 65,
    'final-interview': 80,
    offer: 90,
    accepted: 100,
    rejected: 0,
    withdrawn: 0,
  };

  return progressMap[stage] || 0;
}

/**
 * Get stage color
 */
export function getStageColor(stage: WorkflowStage): string {
  const colorMap: Record<WorkflowStage, string> = {
    applied: 'blue',
    screening: 'indigo',
    'phone-interview': 'purple',
    'technical-interview': 'pink',
    'onsite-interview': 'orange',
    'final-interview': 'yellow',
    offer: 'green',
    accepted: 'green',
    rejected: 'red',
    withdrawn: 'gray',
  };

  return colorMap[stage] || 'gray';
}

/**
 * Get stage label
 */
export function getStageLabel(stage: WorkflowStage): string {
  const labelMap: Record<WorkflowStage, string> = {
    applied: 'Applied',
    screening: 'Screening',
    'phone-interview': 'Phone Interview',
    'technical-interview': 'Technical Interview',
    'onsite-interview': 'Onsite Interview',
    'final-interview': 'Final Interview',
    offer: 'Offer Received',
    accepted: 'Offer Accepted',
    rejected: 'Rejected',
    withdrawn: 'Withdrawn',
  };

  return labelMap[stage] || stage;
}

/**
 * Workflow timeline
 */
export interface TimelineEvent {
  stage: WorkflowStage;
  date: Date;
  notes?: string;
}

export function calculateAverageTimeInStage(
  timeline: TimelineEvent[],
  stage: WorkflowStage
): number {
  const stageEntries = timeline.filter(e => e.stage === stage);
  if (stageEntries.length === 0) return 0;

  const times: number[] = [];
  for (let i = 0; i < timeline.length - 1; i++) {
    if (timeline[i].stage === stage) {
      const duration = timeline[i + 1].date.getTime() - timeline[i].date.getTime();
      times.push(duration / (1000 * 60 * 60 * 24)); // Convert to days
    }
  }

  if (times.length === 0) return 0;
  return times.reduce((sum, time) => sum + time, 0) / times.length;
}

/**
 * Get recommended next steps
 */
export function getRecommendedNextSteps(stage: WorkflowStage): string[] {
  const recommendations: Record<WorkflowStage, string[]> = {
    applied: [
      'Follow up after 1-2 weeks if no response',
      'Research the company and role',
      'Connect with employees on LinkedIn',
    ],
    screening: [
      'Prepare elevator pitch',
      'Be ready for recruiter call',
      'Have questions ready about role and company',
    ],
    'phone-interview': [
      'Research interviewer on LinkedIn',
      'Prepare behavioral examples',
      'Practice common phone interview questions',
    ],
    'technical-interview': [
      'Practice coding on whiteboard/screen share',
      'Review data structures and algorithms',
      'Prepare system design if applicable',
    ],
    'onsite-interview': [
      'Plan arrival time (15 min early)',
      'Bring multiple resume copies',
      'Prepare questions for each interviewer',
    ],
    'final-interview': [
      'Prepare for executive/leadership questions',
      'Have salary expectations ready',
      'Think about team fit and culture',
    ],
    offer: [
      'Review offer details thoroughly',
      'Research market compensation',
      'Consider total compensation (equity, benefits)',
      'Negotiate if appropriate',
    ],
    accepted: [
      'Complete background check promptly',
      'Set up start date logistics',
      'Begin learning about the team',
    ],
    rejected: [
      'Request feedback if possible',
      'Reflect on interview performance',
      'Update application strategy',
    ],
    withdrawn: [
      'Send professional withdrawal email',
      'Maintain positive relationship',
      'Update application tracking',
    ],
  };

  return recommendations[stage] || [];
}

/**
 * Auto-suggest reminders based on stage
 */
export function getStageReminders(
  stage: WorkflowStage,
  date: Date
): Array<{ title: string; dueDate: Date; priority: 'high' | 'medium' | 'low' }> {
  const reminders: Array<{ title: string; daysOffset: number; priority: 'high' | 'medium' | 'low' }> = [];

  switch (stage) {
    case 'applied':
      reminders.push(
        { title: 'Follow up on application', daysOffset: 14, priority: 'medium' },
        { title: 'Check application status', daysOffset: 7, priority: 'low' }
      );
      break;
    case 'phone-interview':
      reminders.push(
        { title: 'Prepare for phone interview', daysOffset: -2, priority: 'high' },
        { title: 'Research company', daysOffset: -3, priority: 'medium' }
      );
      break;
    case 'technical-interview':
      reminders.push(
        { title: 'Practice coding problems', daysOffset: -5, priority: 'high' },
        { title: 'Review system design', daysOffset: -3, priority: 'high' }
      );
      break;
    case 'onsite-interview':
      reminders.push(
        { title: 'Plan travel to interview', daysOffset: -7, priority: 'high' },
        { title: 'Prepare questions for team', daysOffset: -3, priority: 'medium' }
      );
      break;
    case 'offer':
      reminders.push(
        { title: 'Review offer deadline', daysOffset: 3, priority: 'high' },
        { title: 'Research compensation market rates', daysOffset: 1, priority: 'medium' }
      );
      break;
  }

  return reminders.map(r => {
    const dueDate = new Date(date);
    dueDate.setDate(dueDate.getDate() + r.daysOffset);
    return { title: r.title, dueDate, priority: r.priority };
  });
}

/**
 * Workflow analytics
 */
export function analyzeWorkflow(applications: Application[]): {
  averageTimeToOffer: number;
  conversionRates: Record<string, number>;
  commonDropOffPoints: Array<{ stage: WorkflowStage; count: number }>;
} {
  const accepted = applications.filter(a => a.status === 'accepted');
  
  // Average time to offer
  const times = accepted
    .map(a => {
      const applied = new Date(a.appliedDate);
      const updated = new Date(a.updatedAt);
      return (updated.getTime() - applied.getTime()) / (1000 * 60 * 60 * 24);
    });
  const averageTimeToOffer = times.length > 0
    ? times.reduce((sum, t) => sum + t, 0) / times.length
    : 0;

  // Conversion rates
  const total = applications.length;
  const conversionRates = {
    appliedToScreening: applications.filter(a => ['screening', 'phone-interview', 'technical-interview', 'onsite-interview', 'final-interview', 'offer', 'accepted'].includes(a.status)).length / total * 100,
    screeningToInterview: applications.filter(a => ['phone-interview', 'technical-interview', 'onsite-interview', 'final-interview', 'offer', 'accepted'].includes(a.status)).length / total * 100,
    interviewToOffer: applications.filter(a => ['offer', 'accepted'].includes(a.status)).length / total * 100,
    offerToAccepted: applications.filter(a => a.status === 'accepted').length / applications.filter(a => ['offer', 'accepted'].includes(a.status)).length * 100 || 0,
  };

  // Common drop-off points
  const rejected = applications.filter(a => a.status === 'rejected');
  const dropOffCounts = rejected.reduce((acc, app) => {
    const stage = app.status as WorkflowStage;
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const commonDropOffPoints = Object.entries(dropOffCounts)
    .map(([stage, count]) => ({ stage: stage as WorkflowStage, count }))
    .sort((a, b) => b.count - a.count);

  return {
    averageTimeToOffer: Math.round(averageTimeToOffer),
    conversionRates,
    commonDropOffPoints,
  };
}
