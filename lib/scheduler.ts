import { Interview } from './types';

/**
 * Interview scheduler with conflict detection and smart scheduling
 */

export interface TimeSlot {
  start: Date;
  end: Date;
}

export interface ScheduleConflict {
  interview1: Interview;
  interview2: Interview;
  overlapMinutes: number;
}

/**
 * Check if two time slots overlap
 */
export function hasTimeConflict(slot1: TimeSlot, slot2: TimeSlot): boolean {
  return slot1.start < slot2.end && slot2.start < slot1.end;
}

/**
 * Calculate overlap duration in minutes
 */
export function calculateOverlap(slot1: TimeSlot, slot2: TimeSlot): number {
  if (!hasTimeConflict(slot1, slot2)) return 0;

  const overlapStart = Math.max(slot1.start.getTime(), slot2.start.getTime());
  const overlapEnd = Math.min(slot1.end.getTime(), slot2.end.getTime());
  
  return (overlapEnd - overlapStart) / (1000 * 60);
}

/**
 * Find scheduling conflicts among interviews
 */
export function findScheduleConflicts(interviews: Interview[]): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = [];
  const scheduled = interviews.filter(i => i.status === 'scheduled');

  for (let i = 0; i < scheduled.length; i++) {
    for (let j = i + 1; j < scheduled.length; j++) {
      const int1 = scheduled[i];
      const int2 = scheduled[j];

      // Assume 1-hour duration if not specified
      const duration1 = int1.duration || 60;
      const duration2 = int2.duration || 60;

      const slot1: TimeSlot = {
        start: new Date(int1.date),
        end: new Date(new Date(int1.date).getTime() + duration1 * 60 * 1000),
      };

      const slot2: TimeSlot = {
        start: new Date(int2.date),
        end: new Date(new Date(int2.date).getTime() + duration2 * 60 * 1000),
      };

      const overlap = calculateOverlap(slot1, slot2);
      if (overlap > 0) {
        conflicts.push({
          interview1: int1,
          interview2: int2,
          overlapMinutes: overlap,
        });
      }
    }
  }

  return conflicts;
}

/**
 * Check if a new interview conflicts with existing ones
 */
export function checkNewInterviewConflict(
  newInterview: { date: string; duration?: number },
  existingInterviews: Interview[]
): { hasConflict: boolean; conflicts: Interview[] } {
  const duration = newInterview.duration || 60;
  const newSlot: TimeSlot = {
    start: new Date(newInterview.date),
    end: new Date(new Date(newInterview.date).getTime() + duration * 60 * 1000),
  };

  const conflicts: Interview[] = [];
  const scheduled = existingInterviews.filter(i => i.status === 'scheduled');

  for (const interview of scheduled) {
    const intDuration = interview.duration || 60;
    const slot: TimeSlot = {
      start: new Date(interview.date),
      end: new Date(new Date(interview.date).getTime() + intDuration * 60 * 1000),
    };

    if (hasTimeConflict(newSlot, slot)) {
      conflicts.push(interview);
    }
  }

  return {
    hasConflict: conflicts.length > 0,
    conflicts,
  };
}

/**
 * Suggest available time slots for scheduling
 */
export function suggestAvailableSlots(
  targetDate: Date,
  existingInterviews: Interview[],
  duration: number = 60,
  workingHours: { start: number; end: number } = { start: 9, end: 17 }
): Date[] {
  const availableSlots: Date[] = [];
  const scheduled = existingInterviews.filter(
    i => i.status === 'scheduled' && 
    new Date(i.date).toDateString() === targetDate.toDateString()
  );

  // Generate potential slots every 30 minutes
  const startHour = workingHours.start;
  const endHour = workingHours.end;

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute of [0, 30]) {
      const slotStart = new Date(targetDate);
      slotStart.setHours(hour, minute, 0, 0);
      
      const slotEnd = new Date(slotStart.getTime() + duration * 60 * 1000);

      // Skip if slot ends after working hours
      if (slotEnd.getHours() >= endHour) continue;

      // Check for conflicts
      const newSlot: TimeSlot = { start: slotStart, end: slotEnd };
      let hasConflict = false;

      for (const interview of scheduled) {
        const intDuration = interview.duration || 60;
        const existingSlot: TimeSlot = {
          start: new Date(interview.date),
          end: new Date(new Date(interview.date).getTime() + intDuration * 60 * 1000),
        };

        if (hasTimeConflict(newSlot, existingSlot)) {
          hasConflict = true;
          break;
        }
      }

      if (!hasConflict) {
        availableSlots.push(slotStart);
      }
    }
  }

  return availableSlots;
}

/**
 * Calculate interview density for a date range
 */
export function calculateInterviewDensity(
  interviews: Interview[],
  startDate: Date,
  endDate: Date
): { date: string; count: number }[] {
  const densityMap = new Map<string, number>();

  interviews
    .filter(i => i.status === 'scheduled')
    .forEach(interview => {
      const date = new Date(interview.date);
      if (date >= startDate && date <= endDate) {
        const dateStr = date.toISOString().split('T')[0];
        densityMap.set(dateStr, (densityMap.get(dateStr) || 0) + 1);
      }
    });

  const result: { date: string; count: number }[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0];
    result.push({
      date: dateStr,
      count: densityMap.get(dateStr) || 0,
    });
    current.setDate(current.getDate() + 1);
  }

  return result;
}

/**
 * Get optimal interview scheduling recommendations
 */
export function getSchedulingRecommendations(
  interviews: Interview[]
): string[] {
  const recommendations: string[] = [];
  const conflicts = findScheduleConflicts(interviews);
  
  if (conflicts.length > 0) {
    recommendations.push(
      `⚠️ You have ${conflicts.length} scheduling conflict${conflicts.length > 1 ? 's' : ''}. Please reschedule to avoid overlaps.`
    );
  }

  // Check for interviews on the same day
  const interviewsByDate = new Map<string, Interview[]>();
  interviews
    .filter(i => i.status === 'scheduled')
    .forEach(interview => {
      const dateStr = new Date(interview.date).toDateString();
      if (!interviewsByDate.has(dateStr)) {
        interviewsByDate.set(dateStr, []);
      }
      interviewsByDate.get(dateStr)!.push(interview);
    });

  interviewsByDate.forEach((dayInterviews, date) => {
    if (dayInterviews.length > 2) {
      recommendations.push(
        `📅 You have ${dayInterviews.length} interviews on ${date}. Consider spacing them out for better preparation time.`
      );
    }
  });

  // Check for adequate preparation time
  const sortedInterviews = [...interviews]
    .filter(i => i.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  for (let i = 1; i < sortedInterviews.length; i++) {
    const prev = sortedInterviews[i - 1];
    const curr = sortedInterviews[i];
    const hoursBetween = 
      (new Date(curr.date).getTime() - new Date(prev.date).getTime()) / (1000 * 60 * 60);

    if (hoursBetween < 2 && hoursBetween > 0) {
      recommendations.push(
        `⏰ Only ${Math.round(hoursBetween * 60)} minutes between ${prev.company} and ${curr.company} interviews. Consider adding buffer time.`
      );
    }
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ Your interview schedule looks well-organized with no conflicts!');
  }

  return recommendations;
}

/**
 * Format time slot for display
 */
export function formatTimeSlot(date: Date, duration: number = 60): string {
  const start = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  
  const end = new Date(date.getTime() + duration * 60 * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return `${start} - ${end}`;
}

/**
 * Add buffer time to an interview (e.g., 15 min before/after)
 */
export function addBufferTime(
  interview: Interview,
  bufferMinutes: number = 15
): TimeSlot {
  const duration = interview.duration || 60;
  const start = new Date(new Date(interview.date).getTime() - bufferMinutes * 60 * 1000);
  const end = new Date(
    new Date(interview.date).getTime() + (duration + bufferMinutes) * 60 * 1000
  );

  return { start, end };
}
