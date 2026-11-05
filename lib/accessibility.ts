/**
 * Accessibility utilities and improvements for ApplyWise
 */

/**
 * Trap focus within a modal/dialog
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        lastFocusable?.focus();
        e.preventDefault();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        firstFocusable?.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);

  // Focus first element
  firstFocusable?.focus();

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Announce message to screen readers
 */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Generate unique ID for ARIA relationships
 */
export function generateAriaId(prefix: string = 'aria'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if an element is visible
 */
export function isElementVisible(element: HTMLElement): boolean {
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  );
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'area[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    isElementVisible
  );
}

/**
 * Manage focus restoration
 */
export class FocusManager {
  private previousFocus: HTMLElement | null = null;

  save(): void {
    this.previousFocus = document.activeElement as HTMLElement;
  }

  restore(): void {
    if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
      this.previousFocus.focus();
    }
    this.previousFocus = null;
  }
}

/**
 * Skip to main content functionality
 */
export function addSkipLink(): void {
  if (typeof window === 'undefined') return;

  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white';

  document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Keyboard navigation helpers
 */
export const KeyCodes = {
  TAB: 9,
  ENTER: 13,
  ESC: 27,
  SPACE: 32,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
} as const;

export function isNavigationKey(key: string): boolean {
  return ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key);
}

/**
 * ARIA label generator for common patterns
 */
export const AriaLabels = {
  closeButton: (itemName?: string) =>
    itemName ? `Close ${itemName}` : 'Close',

  deleteButton: (itemName: string) =>
    `Delete ${itemName}`,

  editButton: (itemName: string) =>
    `Edit ${itemName}`,

  sortButton: (column: string, direction?: 'ascending' | 'descending') =>
    direction
      ? `Sort by ${column}, currently ${direction}`
      : `Sort by ${column}`,

  pagination: (current: number, total: number) =>
    `Page ${current} of ${total}`,

  loadingState: (itemName?: string) =>
    itemName ? `Loading ${itemName}` : 'Loading',

  searchResult: (count: number) =>
    `${count} result${count !== 1 ? 's' : ''} found`,
};

/**
 * Color contrast checker
 */
export function meetsContrastRequirements(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA'
): boolean {
  // Simplified - in production, use a proper contrast calculation library
  // This is a placeholder that always returns true
  // Real implementation would calculate luminance and contrast ratio
  return true;
}

/**
 * Reduce motion preference
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * High contrast mode detection
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Add visual focus indicator
 */
export function enhanceFocusVisibility(): void {
  if (typeof document === 'undefined') return;

  const style = document.createElement('style');
  style.textContent = `
    :focus-visible {
      outline: 2px solid #3B82F6;
      outline-offset: 2px;
      border-radius: 4px;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Roving tabindex for menu/list navigation
 */
export class RovingTabIndex {
  private items: HTMLElement[];
  private currentIndex: number = 0;

  constructor(container: HTMLElement, itemSelector: string) {
    this.items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector));
    this.init();
  }

  private init(): void {
    this.items.forEach((item, index) => {
      item.setAttribute('tabindex', index === 0 ? '0' : '-1');
      item.addEventListener('keydown', this.handleKeydown.bind(this));
      item.addEventListener('focus', () => this.setCurrentIndex(index));
    });
  }

  private handleKeydown(e: KeyboardEvent): void {
    const { key } = e;
    let newIndex = this.currentIndex;

    switch (key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        newIndex = (this.currentIndex + 1) % this.items.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = this.items.length - 1;
        break;
      default:
        return;
    }

    this.moveFocus(newIndex);
  }

  private moveFocus(index: number): void {
    this.items[this.currentIndex].setAttribute('tabindex', '-1');
    this.items[index].setAttribute('tabindex', '0');
    this.items[index].focus();
    this.currentIndex = index;
  }

  private setCurrentIndex(index: number): void {
    this.currentIndex = index;
  }
}

/**
 * Form validation with ARIA
 */
export function setFieldError(
  field: HTMLInputElement | HTMLTextAreaElement,
  errorMessage: string
): void {
  const errorId = `${field.id}-error`;
  let errorElement = document.getElementById(errorId);

  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.id = errorId;
    errorElement.className = 'text-red-600 text-sm mt-1';
    errorElement.setAttribute('role', 'alert');
    field.parentElement?.appendChild(errorElement);
  }

  errorElement.textContent = errorMessage;
  field.setAttribute('aria-invalid', 'true');
  field.setAttribute('aria-describedby', errorId);
}

export function clearFieldError(field: HTMLInputElement | HTMLTextAreaElement): void {
  const errorId = `${field.id}-error`;
  const errorElement = document.getElementById(errorId);

  if (errorElement) {
    errorElement.remove();
  }

  field.removeAttribute('aria-invalid');
  field.removeAttribute('aria-describedby');
}

/**
 * Loading state announcement
 */
export function announceLoadingState(isLoading: boolean, itemName?: string): void {
  if (isLoading) {
    announce(AriaLabels.loadingState(itemName), 'polite');
  } else {
    announce('Loaded', 'polite');
  }
}

/**
 * Initialize all accessibility enhancements
 */
export function initializeAccessibility(): void {
  if (typeof window === 'undefined') return;

  addSkipLink();
  enhanceFocusVisibility();

  // Add escape key handler for modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const event = new CustomEvent('closeModal');
      document.dispatchEvent(event);
    }
  });
}
