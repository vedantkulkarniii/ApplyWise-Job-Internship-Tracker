import { Application } from './types';

export interface ApplicationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultValues: Partial<Application>;
}

/**
 * Pre-defined templates for common job application types
 */
export const applicationTemplates: ApplicationTemplate[] = [
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    description: 'Full-time software engineering position',
    category: 'Engineering',
    defaultValues: {
      type: 'full-time',
      position: 'Software Engineer',
      status: 'applied',
    },
  },
  {
    id: 'frontend-developer',
    name: 'Frontend Developer',
    description: 'Frontend development role',
    category: 'Engineering',
    defaultValues: {
      type: 'full-time',
      position: 'Frontend Developer',
      status: 'applied',
    },
  },
  {
    id: 'backend-developer',
    name: 'Backend Developer',
    description: 'Backend development role',
    category: 'Engineering',
    defaultValues: {
      type: 'full-time',
      position: 'Backend Developer',
      status: 'applied',
    },
  },
  {
    id: 'fullstack-developer',
    name: 'Full Stack Developer',
    description: 'Full stack development role',
    category: 'Engineering',
    defaultValues: {
      type: 'full-time',
      position: 'Full Stack Developer',
      status: 'applied',
    },
  },
  {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    description: 'DevOps and infrastructure role',
    category: 'Engineering',
    defaultValues: {
      type: 'full-time',
      position: 'DevOps Engineer',
      status: 'applied',
    },
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    description: 'Data science and analytics role',
    category: 'Data',
    defaultValues: {
      type: 'full-time',
      position: 'Data Scientist',
      status: 'applied',
    },
  },
  {
    id: 'machine-learning-engineer',
    name: 'ML Engineer',
    description: 'Machine learning engineering role',
    category: 'Data',
    defaultValues: {
      type: 'full-time',
      position: 'Machine Learning Engineer',
      status: 'applied',
    },
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    description: 'Product management role',
    category: 'Product',
    defaultValues: {
      type: 'full-time',
      position: 'Product Manager',
      status: 'applied',
    },
  },
  {
    id: 'ux-designer',
    name: 'UX Designer',
    description: 'User experience design role',
    category: 'Design',
    defaultValues: {
      type: 'full-time',
      position: 'UX Designer',
      status: 'applied',
    },
  },
  {
    id: 'ui-designer',
    name: 'UI Designer',
    description: 'User interface design role',
    category: 'Design',
    defaultValues: {
      type: 'full-time',
      position: 'UI Designer',
      status: 'applied',
    },
  },
  {
    id: 'software-intern',
    name: 'Software Engineering Intern',
    description: 'Software engineering internship',
    category: 'Internship',
    defaultValues: {
      type: 'internship',
      position: 'Software Engineering Intern',
      status: 'applied',
    },
  },
  {
    id: 'data-intern',
    name: 'Data Science Intern',
    description: 'Data science internship',
    category: 'Internship',
    defaultValues: {
      type: 'internship',
      position: 'Data Science Intern',
      status: 'applied',
    },
  },
  {
    id: 'product-intern',
    name: 'Product Management Intern',
    description: 'Product management internship',
    category: 'Internship',
    defaultValues: {
      type: 'internship',
      position: 'Product Management Intern',
      status: 'applied',
    },
  },
  {
    id: 'design-intern',
    name: 'Design Intern',
    description: 'Design internship',
    category: 'Internship',
    defaultValues: {
      type: 'internship',
      position: 'Design Intern',
      status: 'applied',
    },
  },
];

/**
 * Get all available templates
 */
export function getTemplates(): ApplicationTemplate[] {
  return applicationTemplates;
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): ApplicationTemplate[] {
  return applicationTemplates.filter(t => t.category === category);
}

/**
 * Get all unique categories
 */
export function getCategories(): string[] {
  const categories = new Set(applicationTemplates.map(t => t.category));
  return Array.from(categories).sort();
}

/**
 * Get a specific template by ID
 */
export function getTemplateById(id: string): ApplicationTemplate | undefined {
  return applicationTemplates.find(t => t.id === id);
}

/**
 * Create a new application from a template
 */
export function createFromTemplate(
  templateId: string,
  additionalData: Partial<Application>
): Partial<Application> | null {
  const template = getTemplateById(templateId);
  if (!template) return null;

  return {
    ...template.defaultValues,
    ...additionalData,
    appliedDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Search templates by keyword
 */
export function searchTemplates(keyword: string): ApplicationTemplate[] {
  const lowerKeyword = keyword.toLowerCase();
  return applicationTemplates.filter(
    t =>
      t.name.toLowerCase().includes(lowerKeyword) ||
      t.description.toLowerCase().includes(lowerKeyword) ||
      t.category.toLowerCase().includes(lowerKeyword)
  );
}

/**
 * Custom template storage (localStorage)
 */
const CUSTOM_TEMPLATES_KEY = 'applywise_custom_templates';

export function saveCustomTemplate(template: ApplicationTemplate): void {
  const customTemplates = getCustomTemplates();
  const existingIndex = customTemplates.findIndex(t => t.id === template.id);

  if (existingIndex >= 0) {
    customTemplates[existingIndex] = template;
  } else {
    customTemplates.push(template);
  }

  localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(customTemplates));
}

export function getCustomTemplates(): ApplicationTemplate[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function deleteCustomTemplate(templateId: string): void {
  const customTemplates = getCustomTemplates();
  const filtered = customTemplates.filter(t => t.id !== templateId);
  localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(filtered));
}

/**
 * Get all templates (built-in + custom)
 */
export function getAllTemplates(): ApplicationTemplate[] {
  return [...applicationTemplates, ...getCustomTemplates()];
}
