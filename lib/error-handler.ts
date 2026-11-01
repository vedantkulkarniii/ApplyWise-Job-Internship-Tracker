/**
 * Centralized error handling utilities for ApplyWise
 */

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'fatal';

export interface AppError {
  code: string;
  message: string;
  severity: ErrorSeverity;
  timestamp: Date;
  context?: Record<string, any>;
  stack?: string;
}

export class ApplicationError extends Error {
  code: string;
  severity: ErrorSeverity;
  context?: Record<string, any>;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    severity: ErrorSeverity = 'error',
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApplicationError';
    this.code = code;
    this.severity = severity;
    this.context = context;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApplicationError);
    }
  }

  toJSON(): AppError {
    return {
      code: this.code,
      message: this.message,
      severity: this.severity,
      timestamp: new Date(),
      context: this.context,
      stack: this.stack,
    };
  }
}

/**
 * Error codes for common scenarios
 */
export const ErrorCodes = {
  // Storage errors
  STORAGE_FULL: 'STORAGE_FULL',
  STORAGE_UNAVAILABLE: 'STORAGE_UNAVAILABLE',
  STORAGE_QUOTA_EXCEEDED: 'STORAGE_QUOTA_EXCEEDED',

  // Data errors
  INVALID_DATA: 'INVALID_DATA',
  DATA_NOT_FOUND: 'DATA_NOT_FOUND',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  VALIDATION_FAILED: 'VALIDATION_FAILED',

  // Operation errors
  OPERATION_FAILED: 'OPERATION_FAILED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',

  // Import/Export errors
  IMPORT_FAILED: 'IMPORT_FAILED',
  EXPORT_FAILED: 'EXPORT_FAILED',
  INVALID_FILE_FORMAT: 'INVALID_FILE_FORMAT',

  // Permission errors
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  
  // Unknown
  UNKNOWN: 'UNKNOWN_ERROR',
} as const;

/**
 * Error logger
 */
class ErrorLogger {
  private errors: AppError[] = [];
  private maxErrors: number = 100;
  private listeners: Array<(error: AppError) => void> = [];

  log(error: AppError): void {
    this.errors.push(error);

    // Keep only last N errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Notify listeners
    this.listeners.forEach(listener => listener(error));

    // Console output based on severity
    switch (error.severity) {
      case 'fatal':
      case 'error':
        console.error(`[${error.severity.toUpperCase()}] ${error.code}:`, error.message, error.context);
        break;
      case 'warning':
        console.warn(`[WARNING] ${error.code}:`, error.message, error.context);
        break;
      case 'info':
        console.info(`[INFO] ${error.code}:`, error.message, error.context);
        break;
    }
  }

  getErrors(severity?: ErrorSeverity): AppError[] {
    if (severity) {
      return this.errors.filter(e => e.severity === severity);
    }
    return [...this.errors];
  }

  clear(): void {
    this.errors = [];
  }

  subscribe(listener: (error: AppError) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}

export const errorLogger = new ErrorLogger();

/**
 * Handle errors with consistent logging and user feedback
 */
export function handleError(
  error: Error | ApplicationError,
  context?: Record<string, any>
): AppError {
  let appError: AppError;

  if (error instanceof ApplicationError) {
    appError = error.toJSON();
  } else {
    appError = {
      code: ErrorCodes.UNKNOWN,
      message: error.message || 'An unknown error occurred',
      severity: 'error',
      timestamp: new Date(),
      context,
      stack: error.stack,
    };
  }

  errorLogger.log(appError);
  return appError;
}

/**
 * Async error wrapper for safe promise handling
 */
export async function safeAsync<T>(
  promise: Promise<T>,
  errorCode: string = ErrorCodes.OPERATION_FAILED
): Promise<[T | null, AppError | null]> {
  try {
    const result = await promise;
    return [result, null];
  } catch (error) {
    const appError = handleError(
      error instanceof Error ? error : new Error(String(error)),
      { errorCode }
    );
    return [null, appError];
  }
}

/**
 * Sync error wrapper
 */
export function safeTry<T>(
  fn: () => T,
  errorCode: string = ErrorCodes.OPERATION_FAILED
): [T | null, AppError | null] {
  try {
    const result = fn();
    return [result, null];
  } catch (error) {
    const appError = handleError(
      error instanceof Error ? error : new Error(String(error)),
      { errorCode }
    );
    return [null, appError];
  }
}

/**
 * Storage error handlers
 */
export function handleStorageError(error: Error): AppError {
  if (error.name === 'QuotaExceededError') {
    return handleError(
      new ApplicationError(
        'Storage quota exceeded. Please export and clear old data.',
        ErrorCodes.STORAGE_QUOTA_EXCEEDED,
        'error'
      )
    );
  }

  return handleError(
    new ApplicationError(
      'Storage operation failed. Please check your browser settings.',
      ErrorCodes.STORAGE_UNAVAILABLE,
      'error'
    )
  );
}

/**
 * Validation error handler
 */
export function createValidationError(
  field: string,
  message: string
): ApplicationError {
  return new ApplicationError(
    message,
    ErrorCodes.VALIDATION_FAILED,
    'warning',
    { field }
  );
}

/**
 * User-friendly error messages
 */
export function getUserMessage(error: AppError): string {
  const messages: Record<string, string> = {
    [ErrorCodes.STORAGE_FULL]: 'Your browser storage is full. Please export and delete old data.',
    [ErrorCodes.STORAGE_UNAVAILABLE]: 'Unable to access browser storage. Please check your browser settings.',
    [ErrorCodes.STORAGE_QUOTA_EXCEEDED]: 'Storage limit reached. Export your data and clear old entries.',
    [ErrorCodes.INVALID_DATA]: 'The data format is invalid. Please check your input.',
    [ErrorCodes.DATA_NOT_FOUND]: 'The requested data was not found.',
    [ErrorCodes.DUPLICATE_ENTRY]: 'This entry already exists.',
    [ErrorCodes.VALIDATION_FAILED]: 'Please check your input and try again.',
    [ErrorCodes.OPERATION_FAILED]: 'The operation failed. Please try again.',
    [ErrorCodes.NETWORK_ERROR]: 'Network error. Please check your connection.',
    [ErrorCodes.TIMEOUT]: 'The operation timed out. Please try again.',
    [ErrorCodes.IMPORT_FAILED]: 'Failed to import data. Please check the file format.',
    [ErrorCodes.EXPORT_FAILED]: 'Failed to export data. Please try again.',
    [ErrorCodes.INVALID_FILE_FORMAT]: 'Invalid file format. Please select a valid file.',
    [ErrorCodes.PERMISSION_DENIED]: 'Permission denied. You don\'t have access to this resource.',
    [ErrorCodes.UNKNOWN]: 'An unexpected error occurred. Please try again.',
  };

  return messages[error.code] || error.message;
}

/**
 * Retry logic with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
  } = options;

  let lastError: Error;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * backoffFactor, maxDelay);
      }
    }
  }

  throw new ApplicationError(
    `Operation failed after ${maxRetries} retries: ${lastError!.message}`,
    ErrorCodes.OPERATION_FAILED,
    'error',
    { maxRetries, lastError: lastError!.message }
  );
}

/**
 * Circuit breaker pattern for failing operations
 */
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime: number | null = null;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000 // 1 minute
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime! > this.timeout) {
        this.state = 'half-open';
      } else {
        throw new ApplicationError(
          'Circuit breaker is open. Service temporarily unavailable.',
          ErrorCodes.OPERATION_FAILED,
          'error'
        );
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }

  reset(): void {
    this.failures = 0;
    this.lastFailureTime = null;
    this.state = 'closed';
  }
}

/**
 * Global error handler setup
 */
export function setupGlobalErrorHandling(): void {
  if (typeof window === 'undefined') return;

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    handleError(
      new ApplicationError(
        event.reason?.message || 'Unhandled promise rejection',
        ErrorCodes.UNKNOWN,
        'error'
      )
    );
  });

  // Global errors
  window.addEventListener('error', (event) => {
    handleError(
      new ApplicationError(
        event.message || 'Global error',
        ErrorCodes.UNKNOWN,
        'error',
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        }
      )
    );
  });
}
