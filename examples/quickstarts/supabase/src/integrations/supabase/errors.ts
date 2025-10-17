import { AuthError } from '@supabase/supabase-js'

/**
 * Supabase Auth error codes mapped to user-friendly messages
 * @see https://supabase.com/docs/reference/javascript/auth-error
 */
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  // Email/Password errors
  invalid_credentials: 'Invalid email or password.',
  email_not_confirmed: 'Please verify your email address before signing in.',
  user_not_found: 'No account found with this email.',
  user_already_exists: 'An account with this email already exists.',
  weak_password: 'Password is too weak. Please use a stronger password (at least 6 characters).',
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
 * Converts a Supabase error to a user-friendly error message
 * @param error - The error object from Supabase
 * @returns A user-friendly error message
 */
export function getSupabaseErrorMessage(error: unknown): string {
  // Check if it's a Supabase AuthError
  if (error instanceof AuthError) {
    const message = AUTH_ERROR_MESSAGES[error.message] || AUTH_ERROR_MESSAGES[error.status?.toString() || '']
    if (message) {
      return message
    }

    // If we don't have a specific message, return the Supabase error message
    return error.message || 'An error occurred during authentication.'
  }

  // Handle generic Error objects
  if (error instanceof Error) {
    return error.message
  }

  // Fallback for unknown error types
  return 'An unexpected error occurred. Please try again.'
}

/**
 * Checks if an error is a Supabase network error
 * @param error - The error to check
 * @returns True if the error is network-related
 */
export function isNetworkError(error: unknown): boolean {
  if (!(error instanceof AuthError)) {
    return false
  }

  return error.message === 'network_error' || error.status === 0
}

/**
 * Checks if an error is due to rate limiting
 * @param error - The error to check
 * @returns True if the error is due to rate limiting
 */
export function isRateLimitError(error: unknown): boolean {
  if (!(error instanceof AuthError)) {
    return false
  }

  return error.message.includes('rate_limit') || error.status === 429
}

/**
 * Developer solutions for common Supabase errors
 */
const DEVELOPER_SOLUTIONS: Record<string, string[]> = {
  email_provider_disabled: [
    '1. Go to Supabase Dashboard: https://app.supabase.com/',
    '2. Select your project',
    '3. Navigate to Authentication > Providers',
    '4. Enable Email provider',
    '5. Configure email settings if needed',
    '6. Save changes and try again',
  ],
  oauth_provider_not_supported: [
    '1. Go to Supabase Dashboard > Authentication > Providers',
    '2. Enable the OAuth provider you want to use (Google, GitHub, etc.)',
    '3. Configure the provider with client ID and secret',
    '4. Add redirect URLs',
    '5. Save changes and try again',
  ],
  network_error: [
    '1. Check your internet connection',
    '2. Verify Supabase service status: https://status.supabase.com/',
    '3. Check for CORS issues in browser console',
    '4. Ensure your Supabase URL and anon key are correct',
  ],
  invalid_token: [
    '1. Check your .env file for correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values',
    '2. Verify credentials in Supabase Dashboard > Settings > API',
    '3. Ensure the keys match your Supabase project',
    '4. Restart your development server after updating .env',
  ],
  over_request_rate_limit: [
    '1. Wait a few minutes before trying again',
    '2. Check if you have rate limiting configured in Supabase Dashboard',
    '3. Consider implementing client-side rate limiting',
    '4. Review your authentication flow for unnecessary requests',
  ],
}

/**
 * Logs a Supabase error with actionable developer guidance
 * @param error - The error to log
 * @param context - Additional context about where the error occurred
 */
export function logSupabaseError(error: unknown, context?: string): void {
  if (!(error instanceof AuthError)) {
    console.error(context ? `${context}:` : 'Error:', error)
    return
  }

  const _errorPrefix = context ? `🔷 Supabase Auth Error (${context})` : '🔷 Supabase Auth Error'

  // Log the error message and status
  console.error(`%cError: ${error.message}`, 'color: #ff6b6b; font-weight: bold;')
  if (error.status) {
    console.error(`%cStatus Code: ${error.status}`, 'color: #ff6b6b;')
  }

  // Log user-friendly message
  const _userMessage = AUTH_ERROR_MESSAGES[error.message] || error.message

  // Log developer solutions if available
  const solutions = DEVELOPER_SOLUTIONS[error.message]
  if (solutions) {
    solutions.forEach((_solution) => {})
  }
  console.log(error)
}
