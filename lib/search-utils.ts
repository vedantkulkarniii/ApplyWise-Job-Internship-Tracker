import { Application, Interview, Reminder } from './types';

// Fuzzy search function
export function fuzzyMatch(text: string, query: string): boolean {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  let queryIndex = 0;
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++;
    }
  }
  
  return queryIndex === queryLower.length;
}

// Search applications with multiple criteria
export function searchApplications(
  applications: Application[],
  query: string,
  statusFilters?: string[],
  jobTypeFilters?: string[]
): Application[] {
  const lowerQuery = query.toLowerCase();
  
  return applications.filter(app => {
    // Text search
    const matchesQuery = !query || 
      app.company.toLowerCase().includes(lowerQuery) ||
      app.position.toLowerCase().includes(lowerQuery) ||
      app.location?.toLowerCase().includes(lowerQuery) ||
      fuzzyMatch(app.company, query) ||
      fuzzyMatch(app.position, query);
    
    // Status filter
    const matchesStatus = !statusFilters || statusFilters.length === 0 || 
      statusFilters.includes(app.status);
    
    // Job type filter
    const matchesJobType = !jobTypeFilters || jobTypeFilters.length === 0 || 
      jobTypeFilters.includes(app.jobType);
    
    return matchesQuery && matchesStatus && matchesJobType;
  });
}

// Search interviews
export function searchInterviews(interviews: Interview[], query: string): Interview[] {
  const lowerQuery = query.toLowerCase();
  
  return interviews.filter(interview =>
    interview.company.toLowerCase().includes(lowerQuery) ||
    interview.position.toLowerCase().includes(lowerQuery) ||
    interview.type.toLowerCase().includes(lowerQuery) ||
    interview.interviewer?.toLowerCase().includes(lowerQuery)
  );
}

// Search reminders
export function searchReminders(reminders: Reminder[], query: string): Reminder[] {
  const lowerQuery = query.toLowerCase();
  
  return reminders.filter(reminder =>
    reminder.title.toLowerCase().includes(lowerQuery) ||
    reminder.description?.toLowerCase().includes(lowerQuery) ||
    reminder.relatedTo?.toLowerCase().includes(lowerQuery)
  );
}

// Get search suggestions
export function getSearchSuggestions(
  applications: Application[],
  query: string,
  limit = 5
): string[] {
  const suggestions = new Set<string>();
  const lowerQuery = query.toLowerCase();
  
  applications.forEach(app => {
    if (app.company.toLowerCase().includes(lowerQuery)) {
      suggestions.add(app.company);
    }
    if (app.position.toLowerCase().includes(lowerQuery)) {
      suggestions.add(app.position);
    }
    if (app.location?.toLowerCase().includes(lowerQuery)) {
      suggestions.add(app.location);
    }
  });
  
  return Array.from(suggestions).slice(0, limit);
}

// Highlight matched text
export function highlightMatch(text: string, query: string): string {
  if (!query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

// Save search history
const SEARCH_HISTORY_KEY = 'applywise_search_history';
const MAX_HISTORY_ITEMS = 10;

export function saveSearchQuery(query: string) {
  if (typeof window === 'undefined' || !query.trim()) return;
  
  const history = getSearchHistory();
  const updated = [query, ...history.filter(q => q !== query)].slice(0, MAX_HISTORY_ITEMS);
  
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
}

export function getSearchHistory(): string[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function clearSearchHistory() {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(SEARCH_HISTORY_KEY);
}

// Filter presets
export interface FilterPreset {
  id: string;
  name: string;
  filters: {
    status?: string[];
    jobType?: string[];
    dateRange?: { start: string; end: string };
  };
}

const FILTER_PRESETS_KEY = 'applywise_filter_presets';

export function saveFilterPreset(preset: FilterPreset) {
  if (typeof window === 'undefined') return;
  
  const presets = getFilterPresets();
  const updated = [...presets.filter(p => p.id !== preset.id), preset];
  
  localStorage.setItem(FILTER_PRESETS_KEY, JSON.stringify(updated));
}

export function getFilterPresets(): FilterPreset[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(FILTER_PRESETS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function deleteFilterPreset(id: string) {
  if (typeof window === 'undefined') return;
  
  const presets = getFilterPresets();
  const updated = presets.filter(p => p.id !== id);
  
  localStorage.setItem(FILTER_PRESETS_KEY, JSON.stringify(updated));
}
