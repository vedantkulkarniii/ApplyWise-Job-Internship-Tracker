'use client';

import { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { KEYBOARD_SHORTCUTS } from '@/lib/keyboard-shortcuts';

interface ShortcutGroup {
  title: string;
  shortcuts: Array<{
    keys: string;
    description: string;
  }>;
}

export default function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Check if Ctrl+/ or Cmd+/ is pressed
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const shortcutGroups: ShortcutGroup[] = [
    {
      title: 'Navigation',
      shortcuts: [
        { keys: 'Ctrl+H', description: 'Go to Dashboard' },
        { keys: 'Ctrl+A', description: 'Go to Applications' },
        { keys: 'Ctrl+I', description: 'Go to Interviews' },
        { keys: 'Ctrl+R', description: 'Go to Reminders' },
        { keys: 'Ctrl+S', description: 'Go to Settings' },
      ],
    },
    {
      title: 'Actions',
      shortcuts: [
        { keys: 'Ctrl+N', description: 'New Application' },
        { keys: 'Ctrl+K', description: 'Quick Search' },
        { keys: 'Ctrl+E', description: 'Export Data' },
        { keys: 'Esc', description: 'Close Modal/Dialog' },
      ],
    },
    {
      title: 'Help',
      shortcuts: [
        { keys: 'Ctrl+/', description: 'Toggle Keyboard Shortcuts' },
        { keys: 'Ctrl+?', description: 'Open Help' },
      ],
    },
  ];

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 z-40"
        aria-label="Keyboard shortcuts help"
        title="Keyboard shortcuts (Ctrl+/)"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Keyboard Shortcuts Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Keyboard Shortcuts"
      >
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-400">
            Use these keyboard shortcuts to navigate and perform actions quickly.
          </p>

          {shortcutGroups.map((group, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                      {shortcut.description}
                    </span>
                    <kbd className="px-3 py-1 text-sm font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm">
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <strong>Tip:</strong> Press <kbd className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">Ctrl+/</kbd> anytime to toggle this help dialog.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Got it!
          </button>
        </div>
      </Modal>
    </>
  );
}
