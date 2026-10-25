import { Application, Interview, Reminder } from './types';

// Export data to CSV
export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Handle values with commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    ),
  ].join('\n');

  downloadFile(csvContent, filename, 'text/csv');
}

// Export data to JSON
export function exportToJSON(data: any[], filename: string) {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
}

// Export applications with formatted data
export function exportApplications(applications: Application[], format: 'csv' | 'json' = 'csv') {
  const exportData = applications.map(app => ({
    Company: app.company,
    Position: app.position,
    Location: app.location || 'N/A',
    'Job Type': app.jobType,
    Salary: app.salary || 'N/A',
    Status: app.status,
    'Applied Date': app.appliedDate,
    'Job URL': app.jobUrl || 'N/A',
    Notes: app.notes || 'N/A',
  }));

  const filename = `applications_${new Date().toISOString().split('T')[0]}`;
  
  if (format === 'csv') {
    exportToCSV(exportData, `${filename}.csv`);
  } else {
    exportToJSON(exportData, `${filename}.json`);
  }
}

// Export interviews with formatted data
export function exportInterviews(interviews: Interview[], format: 'csv' | 'json' = 'csv') {
  const exportData = interviews.map(interview => ({
    Company: interview.company,
    Position: interview.position,
    Type: interview.type,
    Date: interview.date,
    Time: interview.time,
    Duration: `${interview.duration} minutes`,
    Location: interview.location || 'N/A',
    Interviewer: interview.interviewer || 'N/A',
    Status: interview.status,
    Notes: interview.notes || 'N/A',
  }));

  const filename = `interviews_${new Date().toISOString().split('T')[0]}`;
  
  if (format === 'csv') {
    exportToCSV(exportData, `${filename}.csv`);
  } else {
    exportToJSON(exportData, `${filename}.json`);
  }
}

// Export reminders with formatted data
export function exportReminders(reminders: Reminder[], format: 'csv' | 'json' = 'csv') {
  const exportData = reminders.map(reminder => ({
    Title: reminder.title,
    Description: reminder.description || 'N/A',
    'Due Date': reminder.dueDate,
    Priority: reminder.priority,
    'Related To': reminder.relatedTo || 'N/A',
    Completed: reminder.completed ? 'Yes' : 'No',
  }));

  const filename = `reminders_${new Date().toISOString().split('T')[0]}`;
  
  if (format === 'csv') {
    exportToCSV(exportData, `${filename}.csv`);
  } else {
    exportToJSON(exportData, `${filename}.json`);
  }
}

// Export all data combined
export function exportAllData(
  applications: Application[],
  interviews: Interview[],
  reminders: Reminder[]
) {
  const allData = {
    applications,
    interviews,
    reminders,
    exportedAt: new Date().toISOString(),
  };

  const filename = `applywise_backup_${new Date().toISOString().split('T')[0]}.json`;
  downloadFile(JSON.stringify(allData, null, 2), filename, 'application/json');
}

// Helper function to trigger file download
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Import data from JSON file
export function importFromJSON(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
