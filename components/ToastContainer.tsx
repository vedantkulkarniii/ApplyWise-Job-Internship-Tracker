'use client';

import { useEffect, useState } from 'react';
import Toast from './Toast';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

let toastQueue: ToastMessage[] = [];
let listeners: ((toasts: ToastMessage[]) => void)[] = [];

export const toast = {
  success: (message: string) => addToast(message, 'success'),
  error: (message: string) => addToast(message, 'error'),
  info: (message: string) => addToast(message, 'info'),
  warning: (message: string) => addToast(message, 'warning'),
};

function addToast(message: string, type: ToastMessage['type']) {
  const id = Math.random().toString(36).substring(7);
  const newToast: ToastMessage = { id, message, type };
  
  toastQueue = [...toastQueue, newToast];
  notifyListeners();
  
  // Auto remove after 5 seconds
  setTimeout(() => removeToast(id), 5000);
}

function removeToast(id: string) {
  toastQueue = toastQueue.filter(t => t.id !== id);
  notifyListeners();
}

function notifyListeners() {
  listeners.forEach(listener => listener(toastQueue));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter(l => l !== setToasts);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(({ id, message, type }) => (
        <Toast
          key={id}
          message={message}
          type={type}
          onClose={() => removeToast(id)}
        />
      ))}
    </div>
  );
}
