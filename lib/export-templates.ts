import { Application, Interview, Reminder } from './types';

/**
 * Export templates for different data formats
 */

/**
 * Export to CSV format
 */
export function exportToCSV(applications: Application[]): string {
  const headers = [
    'Company',
    'Position',
    'Status',
    'Applied Date',
    'Location',
    'Salary',
    'Type',
    'URL',
    'Notes Count',
  ];

  const rows = applications.map(app => [
    app.company,
    app.position,
    app.status,
    app.appliedDate,
    app.location || '',
    app.salary || '',
    app.type || '',
    app.url || '',
    app.notes?.length || 0,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Export to Excel-compatible format (CSV with specific formatting)
 */
export function exportToExcel(applications: Application[]): string {
  // Add BOM for Excel UTF-8 recognition
  const BOM = '\uFEFF';
  return BOM + exportToCSV(applications);
}

/**
 * Export to Markdown format
 */
export function exportToMarkdown(applications: Application[]): string {
  let markdown = '# Job Applications\n\n';
  markdown += `_Generated on ${new Date().toLocaleDateString()}_\n\n`;
  markdown += `## Summary\n\n`;
  markdown += `- **Total Applications:** ${applications.length}\n`;
  markdown += `- **Status Breakdown:**\n`;

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(statusCounts).forEach(([status, count]) => {
    markdown += `  - ${status}: ${count}\n`;
  });

  markdown += '\n## Applications\n\n';

  applications.forEach((app, index) => {
    markdown += `### ${index + 1}. ${app.company} - ${app.position}\n\n`;
    markdown += `- **Status:** ${app.status}\n`;
    markdown += `- **Applied Date:** ${new Date(app.appliedDate).toLocaleDateString()}\n`;
    if (app.location) markdown += `- **Location:** ${app.location}\n`;
    if (app.salary) markdown += `- **Salary:** ${app.salary}\n`;
    if (app.type) markdown += `- **Type:** ${app.type}\n`;
    if (app.url) markdown += `- **URL:** ${app.url}\n`;
    
    if (app.notes && app.notes.length > 0) {
      markdown += `\n**Notes:**\n`;
      app.notes.forEach(note => {
        markdown += `- ${note.content}\n`;
      });
    }
    
    markdown += '\n---\n\n';
  });

  return markdown;
}

/**
 * Export to JSON format
 */
export function exportToJSON(
  applications: Application[],
  interviews: Interview[],
  reminders: Reminder[]
): string {
  const data = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    data: {
      applications,
      interviews,
      reminders,
    },
    metadata: {
      totalApplications: applications.length,
      totalInterviews: interviews.length,
      totalReminders: reminders.length,
    },
  };

  return JSON.stringify(data, null, 2);
}

/**
 * Export to HTML format
 */
export function exportToHTML(applications: Application[]): string {
  const statusColors: Record<Application['status'], string> = {
    applied: '#3B82F6',
    interview: '#F59E0B',
    offer: '#8B5CF6',
    accepted: '#10B981',
    rejected: '#EF4444',
  };

  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Job Applications - ApplyWise</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #1a1a1a; margin-bottom: 10px; }
    .meta { color: #666; margin-bottom: 30px; font-size: 14px; }
    .summary { background: #f9fafb; padding: 20px; border-radius: 6px; margin-bottom: 30px; }
    .summary h2 { color: #374151; margin-bottom: 15px; font-size: 18px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; }
    .stat { text-align: center; padding: 15px; background: white; border-radius: 6px; border: 1px solid #e5e7eb; }
    .stat-value { font-size: 32px; font-weight: bold; color: #3B82F6; }
    .stat-label { font-size: 14px; color: #6b7280; margin-top: 5px; }
    .applications { display: grid; gap: 20px; }
    .application-card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      transition: box-shadow 0.2s;
    }
    .application-card:hover { box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .app-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px; }
    .app-title { font-size: 20px; font-weight: 600; color: #1a1a1a; }
    .app-company { color: #6b7280; font-size: 16px; }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: white;
    }
    .app-details { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; font-size: 14px; color: #6b7280; }
    .detail-item { display: flex; align-items: center; gap: 5px; }
    .notes { margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb; }
    .notes-title { font-weight: 600; margin-bottom: 8px; font-size: 14px; }
    .note-item { background: #f9fafb; padding: 8px 12px; border-radius: 4px; margin-bottom: 6px; font-size: 13px; }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; }
      .application-card { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📋 Job Applications Report</h1>
    <p class="meta">Generated on ${new Date().toLocaleString()} • ApplyWise</p>
    
    <div class="summary">
      <h2>Summary</h2>
      <div class="stats">
        <div class="stat">
          <div class="stat-value">${applications.length}</div>
          <div class="stat-label">Total Applications</div>
        </div>
`;

  // Add status breakdown
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(statusCounts).forEach(([status, count]) => {
    html += `
        <div class="stat">
          <div class="stat-value" style="color: ${statusColors[status as Application['status']]}">${count}</div>
          <div class="stat-label">${status}</div>
        </div>`;
  });

  html += `
      </div>
    </div>

    <div class="applications">
`;

  // Add application cards
  applications.forEach(app => {
    html += `
      <div class="application-card">
        <div class="app-header">
          <div>
            <div class="app-title">${app.position}</div>
            <div class="app-company">${app.company}</div>
          </div>
          <span class="status-badge" style="background-color: ${statusColors[app.status]}">${app.status}</span>
        </div>
        <div class="app-details">
          <div class="detail-item">📅 Applied: ${new Date(app.appliedDate).toLocaleDateString()}</div>
          ${app.location ? `<div class="detail-item">📍 ${app.location}</div>` : ''}
          ${app.salary ? `<div class="detail-item">💰 ${app.salary}</div>` : ''}
          ${app.type ? `<div class="detail-item">💼 ${app.type}</div>` : ''}
        </div>
        ${app.url ? `<div style="margin-top: 10px;"><a href="${app.url}" style="color: #3B82F6; text-decoration: none;">🔗 View Job Posting</a></div>` : ''}
        ${app.notes && app.notes.length > 0 ? `
        <div class="notes">
          <div class="notes-title">📝 Notes</div>
          ${app.notes.map(note => `<div class="note-item">${note.content}</div>`).join('')}
        </div>
        ` : ''}
      </div>
`;
  });

  html += `
    </div>
  </div>
</body>
</html>
`;

  return html;
}

/**
 * Export to PDF-ready HTML (optimized for printing)
 */
export function exportToPDFHTML(applications: Application[]): string {
  const html = exportToHTML(applications);
  // Add print-specific styles
  return html.replace(
    '</head>',
    `<style>
      @page { margin: 1cm; }
      @media print {
        body { padding: 0; }
        .application-card { page-break-inside: avoid; margin-bottom: 15px; }
      }
    </style></head>`
  );
}

/**
 * Download file helper
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
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

/**
 * Export applications with format selection
 */
export function exportApplications(
  applications: Application[],
  interviews: Interview[],
  reminders: Reminder[],
  format: 'csv' | 'excel' | 'json' | 'markdown' | 'html' | 'pdf'
): void {
  const timestamp = new Date().toISOString().split('T')[0];
  
  switch (format) {
    case 'csv':
      downloadFile(
        exportToCSV(applications),
        `applications_${timestamp}.csv`,
        'text/csv'
      );
      break;
    case 'excel':
      downloadFile(
        exportToExcel(applications),
        `applications_${timestamp}.csv`,
        'text/csv'
      );
      break;
    case 'json':
      downloadFile(
        exportToJSON(applications, interviews, reminders),
        `applywise_backup_${timestamp}.json`,
        'application/json'
      );
      break;
    case 'markdown':
      downloadFile(
        exportToMarkdown(applications),
        `applications_${timestamp}.md`,
        'text/markdown'
      );
      break;
    case 'html':
    case 'pdf':
      downloadFile(
        exportToPDFHTML(applications),
        `applications_${timestamp}.html`,
        'text/html'
      );
      break;
  }
}
