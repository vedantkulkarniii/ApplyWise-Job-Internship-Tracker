import { Application, Interview } from './types';

export interface SuccessMetrics {
  applicationToInterviewRate: number;
  interviewToOfferRate: number;
  offerAcceptanceRate: number;
  overallSuccessRate: number;
  averageResponseTime: number; // days
  totalApplications: number;
  totalInterviews: number;
  totalOffers: number;
  acceptedOffers: number;
  rejections: number;
}

export interface TimelineMetrics {
  period: string;
  applications: number;
  interviews: number;
  offers: number;
}

export interface CompanyMetrics {
  company: string;
  applications: number;
  interviews: number;
  offers: number;
  successRate: number;
}

/**
 * Calculate comprehensive success metrics from applications
 */
export function calculateSuccessMetrics(
  applications: Application[],
  interviews: Interview[]
): SuccessMetrics {
  const total = applications.length;
  const interviewCount = applications.filter(a => 
    a.status === 'interview' || a.status === 'offer' || a.status === 'accepted'
  ).length;
  const offerCount = applications.filter(a => 
    a.status === 'offer' || a.status === 'accepted'
  ).length;
  const acceptedCount = applications.filter(a => a.status === 'accepted').length;
  const rejectedCount = applications.filter(a => a.status === 'rejected').length;

  // Calculate rates
  const applicationToInterviewRate = total > 0 ? (interviewCount / total) * 100 : 0;
  const interviewToOfferRate = interviewCount > 0 ? (offerCount / interviewCount) * 100 : 0;
  const offerAcceptanceRate = offerCount > 0 ? (acceptedCount / offerCount) * 100 : 0;
  const overallSuccessRate = total > 0 ? (acceptedCount / total) * 100 : 0;

  // Calculate average response time
  const responseTimes = applications
    .filter(a => a.updatedAt && a.createdAt && a.status !== 'applied')
    .map(a => {
      const created = new Date(a.createdAt).getTime();
      const updated = new Date(a.updatedAt).getTime();
      return (updated - created) / (1000 * 60 * 60 * 24); // Convert to days
    });

  const averageResponseTime = responseTimes.length > 0
    ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
    : 0;

  return {
    applicationToInterviewRate: Math.round(applicationToInterviewRate * 10) / 10,
    interviewToOfferRate: Math.round(interviewToOfferRate * 10) / 10,
    offerAcceptanceRate: Math.round(offerAcceptanceRate * 10) / 10,
    overallSuccessRate: Math.round(overallSuccessRate * 10) / 10,
    averageResponseTime: Math.round(averageResponseTime * 10) / 10,
    totalApplications: total,
    totalInterviews: interviews.length,
    totalOffers: offerCount,
    acceptedOffers: acceptedCount,
    rejections: rejectedCount,
  };
}

/**
 * Generate timeline metrics grouped by month
 */
export function generateTimelineMetrics(
  applications: Application[],
  interviews: Interview[],
  months: number = 6
): TimelineMetrics[] {
  const now = new Date();
  const metrics: TimelineMetrics[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const period = date.toLocaleDateString('default', { month: 'short', year: 'numeric' });

    const monthApplications = applications.filter(a => {
      const appDate = new Date(a.appliedDate);
      return appDate >= date && appDate < nextMonth;
    });

    const monthInterviews = interviews.filter(i => {
      const intDate = new Date(i.date);
      return intDate >= date && intDate < nextMonth;
    });

    const monthOffers = monthApplications.filter(a => 
      a.status === 'offer' || a.status === 'accepted'
    );

    metrics.push({
      period,
      applications: monthApplications.length,
      interviews: monthInterviews.length,
      offers: monthOffers.length,
    });
  }

  return metrics;
}

/**
 * Generate metrics grouped by company
 */
export function generateCompanyMetrics(
  applications: Application[],
  interviews: Interview[]
): CompanyMetrics[] {
  const companies = new Map<string, CompanyMetrics>();

  applications.forEach(app => {
    if (!companies.has(app.company)) {
      companies.set(app.company, {
        company: app.company,
        applications: 0,
        interviews: 0,
        offers: 0,
        successRate: 0,
      });
    }

    const metric = companies.get(app.company)!;
    metric.applications++;

    if (app.status === 'interview' || app.status === 'offer' || app.status === 'accepted') {
      metric.interviews++;
    }

    if (app.status === 'offer' || app.status === 'accepted') {
      metric.offers++;
    }
  });

  // Calculate success rates
  const metricsArray = Array.from(companies.values()).map(metric => ({
    ...metric,
    successRate: metric.applications > 0
      ? Math.round((metric.offers / metric.applications) * 1000) / 10
      : 0,
  }));

  // Sort by success rate descending
  return metricsArray.sort((a, b) => b.successRate - a.successRate);
}

/**
 * Get insights and recommendations based on metrics
 */
export function generateInsights(metrics: SuccessMetrics): string[] {
  const insights: string[] = [];

  // Application to interview insights
  if (metrics.applicationToInterviewRate < 10) {
    insights.push('📝 Your application-to-interview rate is below average. Consider tailoring your resume and cover letters more specifically to each position.');
  } else if (metrics.applicationToInterviewRate > 30) {
    insights.push('🎯 Excellent! Your application-to-interview rate is well above average. Keep up the targeted approach.');
  }

  // Interview to offer insights
  if (metrics.interviewToOfferRate < 20) {
    insights.push('💼 Focus on interview preparation. Practice common questions and research companies thoroughly before interviews.');
  } else if (metrics.interviewToOfferRate > 50) {
    insights.push('⭐ Outstanding interview performance! You\'re converting interviews to offers at a high rate.');
  }

  // Response time insights
  if (metrics.averageResponseTime > 14) {
    insights.push('⏰ Companies are taking an average of 2+ weeks to respond. This is normal - be patient and continue applying.');
  } else if (metrics.averageResponseTime < 7) {
    insights.push('⚡ Quick responses! Companies are getting back to you faster than average.');
  }

  // Volume insights
  if (metrics.totalApplications < 10) {
    insights.push('📈 Consider increasing your application volume. Most successful job seekers apply to 20-50+ positions.');
  } else if (metrics.totalApplications > 50) {
    insights.push('💪 Great volume! You\'re actively pursuing opportunities. Make sure to maintain quality in your applications.');
  }

  // Overall success
  if (metrics.overallSuccessRate > 5) {
    insights.push('🎉 Your overall success rate is excellent! You\'re on the right track.');
  }

  return insights;
}

/**
 * Calculate job search health score (0-100)
 */
export function calculateHealthScore(metrics: SuccessMetrics): number {
  let score = 0;

  // Application volume (up to 20 points)
  score += Math.min(metrics.totalApplications, 20);

  // Application to interview rate (up to 30 points)
  score += Math.min((metrics.applicationToInterviewRate / 30) * 30, 30);

  // Interview to offer rate (up to 30 points)
  score += Math.min((metrics.interviewToOfferRate / 50) * 30, 30);

  // Active applications (up to 20 points)
  const activeRate = metrics.totalApplications > 0
    ? ((metrics.totalApplications - metrics.rejections) / metrics.totalApplications) * 100
    : 0;
  score += Math.min((activeRate / 100) * 20, 20);

  return Math.round(Math.min(score, 100));
}
