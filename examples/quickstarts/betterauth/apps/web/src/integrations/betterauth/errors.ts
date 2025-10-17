/**
 * Better Auth error codes mapped to user-friendly messages
 * @see https://www.better-auth.com/docs
 */
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  // Email/Password errors
  invalid_credentials: 'Invalid email or password.',
  email_not_verified: 'Please verify your email address before signing in.',
  user_not_found: 'No account found with this email.',
  user_already_exists: 'An account with this email already exists.',
  weak_password: 'Password is too weak. Please use a stronger password (at least 8 characters).',
  email_exists: 'An account with this email already exists.',
  invalid_email: 'Invalid email address.',
  user_banned: 'This account has been banned.',

  // OAuth errors
  oauth_provider_not_supported: 'This sign-in method is not supported.',
  provider_email_needs_verification: 'Please verify your email with the provider.',

  // Network errors
  network_error: 'Network error. Please check your connection and try again.',
  timeout: 'Request timed out. Please try again.',

  // Rate limiting
  over_email_send_rate_limit: 'Too many emails sent. Please try again later.',
  over_request_rate_limit: 'Too many requests. Please try again later.',

  // Token errors
  invalid_token: 'Invalid or expired token.',
  expired_token: 'Session expired. Please sign in again.',
  refresh_token_not_found: 'Session expired. Please sign in again.',

  // Other common errors
  signup_disabled: 'Sign up is currently disabled.',
  email_provider_disabled: 'Email sign-in is currently disabled.',
  validation_failed: 'Validation failed. Please check your input.',
}

/**
 * Converts a Better Auth error to a user-friendly error message
 * @param error - The error object from Better Auth
 * @returns A user-friendly error message
 */
export function getBetterAuthErrorMessage(error: unknown): string {
  // Handle Error objects with a message property
  if (error && typeof error === 'object' && 'message' in error) {
    const errorMessage = (error as { message: string }).message
    const message = AUTH_ERROR_MESSAGES[errorMessage]
    if (message) {
      return message
    }
    return errorMessage || 'An error occurred during authentication.'
  }

  // Handle generic Error objects
  if (error instanceof Error) {
    return error.message
  }

  // Fallback for unknown error types
  return 'An unexpected error occurred. Please try again.'
}

/**
 * Checks if an error is a network error
 * @param error - The error to check
 * @returns True if the error is network-related
 */
export function isNetworkError(error: unknown): boolean {
  if (!(error && typeof error === 'object' && 'message' in error)) {
    return false
  }

  const errorMessage = (error as { message: string }).message
  return errorMessage === 'network_error' || errorMessage.includes('network')
}

/**
 * Checks if an error is due to rate limiting
 * @param error - The error to check
 * @returns True if the error is due to rate limiting
 */
export function isRateLimitError(error: unknown): boolean {
  if (!(error && typeof error === 'object' && 'message' in error)) {
    return false
  }

  const errorMessage = (error as { message: string }).message
  return errorMessage.includes('rate_limit')
}

/**
 * Developer solutions for common Better Auth errors
 */
const DEVELOPER_SOLUTIONS: Record<string, string[]> = {
  email_provider_disabled: [
    '1. Check your Better Auth configuration',
    '2. Enable email provider in your auth setup',
    '3. Configure email settings if needed',
    '4. Restart your development server',
  ],
  oauth_provider_not_supported: [
    '1. Check your Better Auth configuration',
    '2. Enable the OAuth provider you want to use (Google, GitHub, etc.)',
    '3. Configure the provider with client ID and secret',
    '4. Add redirect URLs',
    '5. Restart your server and try again',
  ],
  network_error: [
    '1. Check your internet connection',
    '2. Verify Better Auth server is running',
    '3. Check for CORS issues in browser console',
    '4. Ensure your Better Auth URL is correct',
  ],
  invalid_token: [
    '1. Check your .env file for correct VITE_BETTERAUTH_URL value',
    '2. Verify the auth server is running',
    '3. Ensure the URL matches your Better Auth configuration',
    '4. Restart your development server after updating .env',
  ],
  over_request_rate_limit: [
    '1. Wait a few minutes before trying again',
    '2. Check if you have rate limiting configured',
    '3. Consider implementing client-side rate limiting',
    '4. Review your authentication flow for unnecessary requests',
  ],
}

/**
 * Logs a Better Auth error with actionable developer guidance
 * @param error - The error to log
 * @param context - Additional context about where the error occurred
 */
export function logBetterAuthError(error: unknown, context?: string): void {
  const _errorPrefix = context ? `🔷 Better Auth Error (${context})` : '🔷 Better Auth Error'

  // Log the error message
  if (error && typeof error === 'object' && 'message' in error) {
    const errorMessage = (error as { message: string }).message
    console.error(`%cError: ${errorMessage}`, 'color: #ff6b6b; font-weight: bold;')

    // Log user-friendly message
    const _userMessage = AUTH_ERROR_MESSAGES[errorMessage] || errorMessage

    // Log developer solutions if available
    const solutions = DEVELOPER_SOLUTIONS[errorMessage]
    if (solutions) {
      for (const _solution of solutions) {
      }
    }
  } else {
    console.error('%cError:', 'color: #ff6b6b; font-weight: bold;', error)
  }
  console.log(error)
}
