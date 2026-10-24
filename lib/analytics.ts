import { Application, Interview } from './types';

export interface DashboardStats {
  total: number;
  applied: number;
  interviews: number;
  offers: number;
  rejected: number;
  wishlist: number;
  accepted: number;
}

export interface ConversionRates {
  applicationToInterview: number;
  interviewToOffer: number;
  overallSuccess: number;
}

export function calculateDashboardStats(applications: Application[]): DashboardStats {
  return {
    total: applications.length,
    applied: applications.filter(app => app.status === 'Applied').length,
    interviews: applications.filter(
      app => app.status === 'Interview' || app.status === 'Online Assessment'
    ).length,
    offers: applications.filter(
      app => app.status === 'Offer' || app.status === 'Accepted'
    ).length,
    rejected: applications.filter(app => app.status === 'Rejected').length,
    wishlist: applications.filter(app => app.status === 'Wishlist').length,
    accepted: applications.filter(app => app.status === 'Accepted').length,
  };
}

export function calculateConversionRates(applications: Application[]): ConversionRates {
  const applied = applications.filter(
    app => !['Wishlist', 'Withdrawn'].includes(app.status)
  ).length;

  const interviewed = applications.filter(
    app => ['Interview', 'Online Assessment', 'Offer', 'Accepted'].includes(app.status)
  ).length;

  const offers = applications.filter(
    app => app.status === 'Offer' || app.status === 'Accepted'
  ).length;

  return {
    applicationToInterview: applied > 0 ? (interviewed / applied) * 100 : 0,
    interviewToOffer: interviewed > 0 ? (offers / interviewed) * 100 : 0,
    overallSuccess: applied > 0 ? (offers / applied) * 100 : 0,
  };
}

export function getApplicationTrend(applications: Application[]): { month: string; count: number }[] {
  const monthCounts: Record<string, number> = {};

  applications.forEach(app => {
    const date = new Date(app.applicationDate);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
  });

  return Object.entries(monthCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      count,
    }));
}

export function getUpcomingInterviews(
  interviews: Interview[],
  applications: Application[],
  limit = 5
): Array<Interview & { companyName: string; jobRole: string }> {
  const now = new Date();
  
  return interviews
    .filter(interview => new Date(interview.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, limit)
    .map(interview => {
      const app = applications.find(a => a.id === interview.applicationId);
      return {
        ...interview,
        companyName: app?.companyName || 'Unknown',
        jobRole: app?.jobRole || 'Unknown',
      };
    });
}

export function getUpcomingDeadlines(applications: Application[], days = 7) {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + days);

  return applications
    .filter(app => {
      if (!app.deadline) return false;
      const deadline = new Date(app.deadline);
      return deadline >= now && deadline <= futureDate;
    })
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());
}
