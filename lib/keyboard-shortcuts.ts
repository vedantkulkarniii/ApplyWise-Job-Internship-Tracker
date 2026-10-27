export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  description: string;
  action: () => void;
}

export class KeyboardShortcutManager {
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private isEnabled = true;

  constructor() {
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  // Register a keyboard shortcut
  register(shortcut: KeyboardShortcut): () => void {
    const key = this.getShortcutKey(shortcut);
    this.shortcuts.set(key, shortcut);

    // Return unregister function
    return () => this.unregister(shortcut);
  }

  // Unregister a keyboard shortcut
  unregister(shortcut: KeyboardShortcut): void {
    const key = this.getShortcutKey(shortcut);
    this.shortcuts.delete(key);
  }

  // Enable keyboard shortcuts
  enable(): void {
    if (!this.isEnabled) {
      this.isEnabled = true;
      if (typeof window !== 'undefined') {
        window.addEventListener('keydown', this.handleKeyPress);
      }
    }
  }

  // Disable keyboard shortcuts
  disable(): void {
    if (this.isEnabled) {
      this.isEnabled = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', this.handleKeyPress);
      }
    }
  }

  // Get all registered shortcuts
  getAll(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }

  // Clear all shortcuts
  clear(): void {
    this.shortcuts.clear();
  }

  // Handle key press event
  private handleKeyPress(event: KeyboardEvent): void {
    if (!this.isEnabled) return;

    // Don't trigger shortcuts when typing in input fields
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    const key = this.getKeyFromEvent(event);
    const shortcut = this.shortcuts.get(key);

    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }

  // Generate shortcut key from event
  private getKeyFromEvent(event: KeyboardEvent): string {
    const parts: string[] = [];

    if (event.ctrlKey || event.metaKey) parts.push('ctrl');
    if (event.altKey) parts.push('alt');
    if (event.shiftKey) parts.push('shift');
    parts.push(event.key.toLowerCase());

    return parts.join('+');
  }

  // Generate shortcut key from shortcut object
  private getShortcutKey(shortcut: KeyboardShortcut): string {
    const parts: string[] = [];

    if (shortcut.ctrl) parts.push('ctrl');
    if (shortcut.alt) parts.push('alt');
    if (shortcut.shift) parts.push('shift');
    parts.push(shortcut.key.toLowerCase());

    return parts.join('+');
  }

  // Get human-readable shortcut string
  static getShortcutString(shortcut: KeyboardShortcut): string {
    const parts: string[] = [];
    const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform);

    if (shortcut.ctrl) parts.push(isMac ? '⌘' : 'Ctrl');
    if (shortcut.alt) parts.push(isMac ? '⌥' : 'Alt');
    if (shortcut.shift) parts.push(isMac ? '⇧' : 'Shift');
    parts.push(shortcut.key.toUpperCase());

    return parts.join(' + ');
  }
}

// Global instance
export const keyboardShortcuts = new KeyboardShortcutManager();

// Common shortcuts
export const DEFAULT_SHORTCUTS = {
  NEW_APPLICATION: { key: 'n', ctrl: true, description: 'New Application' },
  NEW_INTERVIEW: { key: 'i', ctrl: true, description: 'New Interview' },
  NEW_REMINDER: { key: 'r', ctrl: true, description: 'New Reminder' },
  SEARCH: { key: 'k', ctrl: true, description: 'Search' },
  DASHBOARD: { key: 'd', ctrl: true, alt: true, description: 'Go to Dashboard' },
  APPLICATIONS: { key: 'a', ctrl: true, alt: true, description: 'Go to Applications' },
  INTERVIEWS: { key: 'i', ctrl: true, alt: true, description: 'Go to Interviews' },
  REMINDERS: { key: 'r', ctrl: true, alt: true, description: 'Go to Reminders' },
};
