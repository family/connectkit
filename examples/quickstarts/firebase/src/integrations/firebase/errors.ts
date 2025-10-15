import { FirebaseError } from "firebase/app";

/**
 * Firebase Auth error codes mapped to user-friendly messages
 * @see https://firebase.google.com/docs/reference/js/auth#autherrorcodes
 */
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  // Operation errors
  'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support or enable it in Firebase Console.',
  'auth/operation-not-supported-in-this-environment': 'This operation is not supported in this environment.',

  // Popup errors
  'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
  'auth/popup-blocked': 'Sign-in popup was blocked by your browser. Please allow popups and try again.',
  'auth/cancelled-popup-request': 'Sign-in was cancelled. Please try again.',

  // Email/Password errors
  'auth/invalid-email': 'Invalid email address.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password is too weak. Please use a stronger password (at least 6 characters).',
  'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
  'auth/account-exists-with-different-credential': 'An account already exists with the same email but different sign-in credentials.',

  // Network errors
  'auth/network-request-failed': 'Network error. Please check your connection and try again.',
  'auth/timeout': 'Request timed out. Please try again.',

  // Rate limiting
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',

  // Token errors
  'auth/invalid-api-key': 'Invalid API key. Please check your Firebase configuration.',
  'auth/app-deleted': 'Firebase app was deleted.',
  'auth/expired-action-code': 'This action code has expired.',
  'auth/invalid-action-code': 'Invalid action code.',

  // Other common errors
  'auth/unauthorized-domain': 'This domain is not authorized for OAuth operations.',
  'auth/missing-email': 'Email address is required.',
  'auth/internal-error': 'An internal error occurred. Please try again.',
};

/**
 * Converts a Firebase error to a user-friendly error message
 * @param error - The error object from Firebase
 * @returns A user-friendly error message
 */
export function getFirebaseErrorMessage(error: unknown): string {
  // Check if it's a Firebase error
  if (error instanceof FirebaseError) {
    const message = AUTH_ERROR_MESSAGES[error.code];
    if (message) {
      return message;
    }

    // If we don't have a specific message, return the Firebase error message
    return error.message || 'An error occurred during authentication.';
  }

  // Handle generic Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Fallback for unknown error types
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Checks if an error is a Firebase operation-not-allowed error
 * @param error - The error to check
 * @returns True if the error is an operation-not-allowed error
 */
export function isOperationNotAllowedError(error: unknown): boolean {
  return error instanceof FirebaseError && error.code === 'auth/operation-not-allowed';
}

/**
 * Checks if an error is a network-related Firebase error
 * @param error - The error to check
 * @returns True if the error is network-related
 */
export function isNetworkError(error: unknown): boolean {
  if (!(error instanceof FirebaseError)) {
    return false;
  }

  const networkErrorCodes = [
    'auth/network-request-failed',
    'auth/timeout',
  ];

  return networkErrorCodes.includes(error.code);
}

/**
 * Checks if an error is due to user cancellation (e.g., closing a popup)
 * @param error - The error to check
 * @returns True if the error is due to user cancellation
 */
export function isUserCancellationError(error: unknown): boolean {
  if (!(error instanceof FirebaseError)) {
    return false;
  }

  const cancellationErrorCodes = [
    'auth/popup-closed-by-user',
    'auth/cancelled-popup-request',
  ];

  return cancellationErrorCodes.includes(error.code);
}

/**
 * Developer solutions for common Firebase errors
 */
const DEVELOPER_SOLUTIONS: Record<string, string[]> = {
  'auth/operation-not-allowed': [
    '1. Go to Firebase Console: https://console.firebase.google.com/',
    '2. Select your project',
    '3. Navigate to Authentication > Sign-in method',
    '4. Enable the authentication provider you\'re trying to use (Google, Email/Password, etc.)',
    '5. For Google Sign-in: Add a support email and save',
    '6. Refresh your application and try again',
  ],
  'auth/popup-blocked': [
    '1. Allow popups in your browser for this domain',
    '2. Check browser extensions that might block popups',
    '3. Consider using signInWithRedirect() instead of signInWithPopup()',
  ],
  'auth/unauthorized-domain': [
    '1. Go to Firebase Console > Authentication > Settings',
    '2. Add your domain to \"Authorized domains\"',
    '3. For local development, ensure \"localhost\" is added',
    '4. Save changes and try again',
  ],
  'auth/invalid-api-key': [
    '1. Check your .env file for correct VITE_apiKey value',
    '2. Verify API key in Firebase Console > Project Settings',
    '3. Ensure the API key matches your Firebase project',
    '4. Restart your development server after updating .env',
  ],
  'auth/network-request-failed': [
    '1. Check your internet connection',
    '2. Verify Firebase service status: https://status.firebase.google.com/',
    '3. Check for CORS issues in browser console',
    '4. Ensure your API key and project configuration are correct',
  ],
};

/**
 * Logs a Firebase error with actionable developer guidance
 * @param error - The error to log
 * @param context - Additional context about where the error occurred
 */
export function logFirebaseError(error: unknown, context?: string): void {
  if (!(error instanceof FirebaseError)) {
    console.error(context ? `${context}:` : 'Error:', error);
    return;
  }

  const errorPrefix = context ? `🔥 Firebase Auth Error (${context})` : '🔥 Firebase Auth Error';

  console.group(`%c${errorPrefix}`, 'color: #ff6b6b; font-weight: bold; font-size: 14px;');

  // Log the error code and message
  console.error(`%cError Code: ${error.code}`, 'color: #ff6b6b; font-weight: bold;');
  console.error(`%cError Message: ${error.message}`, 'color: #ff6b6b;');

  // Log user-friendly message
  const userMessage = AUTH_ERROR_MESSAGES[error.code] || error.message;
  console.info(`%cUser Message: ${userMessage}`, 'color: #ffd93d; font-style: italic;');

  // Log developer solutions if available
  const solutions = DEVELOPER_SOLUTIONS[error.code];
  if (solutions) {
    console.group('%c💡 How to Fix This:', 'color: #6bcf7f; font-weight: bold;');
    solutions.forEach((solution) => {
      console.info(`%c${solution}`, 'color: #6bcf7f;');
    });
    console.groupEnd();
  }

  // Log full error object for debugging
  console.group('%c📋 Full Error Details:', 'color: #a29bfe;');
  console.log(error);
  console.groupEnd();

  console.groupEnd();
}
