/**
 * Password utility helpers for strength calculation and validation.
 *
 * Provides functions for password strength calculation, passphrase generation, and password validation.
 */

import calculateEntropy from 'fast-password-entropy'

// ============================================================================
// Constants and Regular Expressions
// ============================================================================

/**
 * Regular expression to match lowercase letters.
 */
const LOWERCASE_REGEX = /[a-z]/

/**
 * Regular expression to match uppercase letters.
 */
const UPPERCASE_REGEX = /[A-Z]/

/**
 * Regular expression to match digits.
 */
const DIGIT_REGEX = /[0-9]/

/**
 * Special characters allowed in passwords.
 */
const SPECIAL_CHARACTERS = '!@#$%^&()\\-*+.'

/**
 * All valid password characters.
 */
const VALID_PASSWORD_CHARACTERS = `a-zA-Z0-9${SPECIAL_CHARACTERS}`

/**
 * Escape regex metacharacters for safe use inside a character class.
 */
function escapeForCharClass(str) {
  return str.replace(/[-\\^]/g, '\\$&')
  // escapes -, \, and ^ (the only risky chars in [])
}

/**
 * Regular expression to match special characters.
 */
const SPECIAL_CHARACTER_REGEX = new RegExp(`[${escapeForCharClass(SPECIAL_CHARACTERS)}]`)

/**
 * Regular expression to match valid password characters.
 */
const VALID_CHARACTER_REGEX = new RegExp(`[${VALID_PASSWORD_CHARACTERS}]`)

/**
 * Maximum entropy score for normalization.
 */
const MAX_ENTROPY_SCORE = 95

/**
 * Minimum password length for security.
 */
const MIN_PASSWORD_LENGTH = 8

/**
 * Weight for diversity score in overall strength calculation.
 */
const DIVERSITY_WEIGHT = 0.3
const ENTROPY_WEIGHT = 0.7

export const MEDIUM_SCORE_THRESHOLD = 0.5
export const STRONG_SCORE_THRESHOLD = 0.75
export const VERY_STRONG_SCORE_THRESHOLD = 0.9

// ============================================================================
// Types
// ============================================================================

/**
 * Password strength levels.
 */
export type PasswordStrengthLabel = 'Weak' | 'Medium' | 'Strong' | 'Very Strong'

/**
 * Password summary information.
 */
export interface PasswordSummary {
  value: number
  label: PasswordStrengthLabel
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Gets a list of invalid characters in the provided text.
 *
 * Replaces spaces with `SPACE` for visibility.
 *
 * @param text - The text to check for invalid characters.
 * @returns Array of unique invalid characters.
 *
 * @example
 * ```ts
 * const invalid = getInvalidCharacters('Pa$$ word');
 * // invalid === ['$', 'SPACE']
 * ```
 */
export function getInvalidCharacters(text: string = ''): string[] {
  const invalidChars = text
    .split('')
    .filter((char) => !VALID_CHARACTER_REGEX.test(char))
    .map((char) => char.replace(' ', 'SPACE'))

  return [...new Set(invalidChars)]
}

/**
 * Converts a numeric password strength score to a human-readable label.
 *
 * @param score - The strength score (0-1).
 * @returns The corresponding strength label.
 *
 * @example
 * ```ts
 * const label = getPasswordStrengthLabel(0.8);
 * // label === 'Strong'
 * ```
 */
export function getPasswordStrengthLabel(score: number): PasswordStrengthLabel {
  if (score > VERY_STRONG_SCORE_THRESHOLD) {
    return 'Very Strong'
  } else if (score > STRONG_SCORE_THRESHOLD) {
    return 'Strong'
  } else if (score > MEDIUM_SCORE_THRESHOLD) {
    return 'Medium'
  } else {
    return 'Weak'
  }
}

/**
 * Calculates the diversity score of a password based on character types used.
 *
 * Considers lowercase, uppercase, digits, and special characters.
 *
 * @param password - The password to analyse.
 * @returns A score between 0 and 1 representing character diversity.
 *
 * @example
 * ```ts
 * const diversity = calculatePasswordDiversityScore('Password123!');
 * ```
 */
export function calculatePasswordDiversityScore(password: string): number {
  // Passwords shorter than minimum length get a score of 0
  if (password.length < MIN_PASSWORD_LENGTH) {
    return 0
  }

  let characterTypesUsed = 0

  if (LOWERCASE_REGEX.test(password)) {
    characterTypesUsed += 1
  }

  if (UPPERCASE_REGEX.test(password)) {
    characterTypesUsed += 1
  }

  if (DIGIT_REGEX.test(password)) {
    characterTypesUsed += 1
  }

  if (SPECIAL_CHARACTER_REGEX.test(password)) {
    characterTypesUsed += 1
  }

  return Math.max(0, Math.min(1, characterTypesUsed / 4))
}

/**
 * Calculates the overall password strength combining diversity and entropy.
 *
 * @param password - The password to analyse.
 * @returns A strength score between 0 and 1.
 *
 * @example
 * ```ts
 * const strength = getPasswordStrength('Password123!');
 * ```
 */
export function getPasswordStrength(password: string = ''): number {
  const diversityScore = calculatePasswordDiversityScore(password)
  const entropyScore = calculateEntropy(password) / MAX_ENTROPY_SCORE

  return Math.min(diversityScore * DIVERSITY_WEIGHT + entropyScore * ENTROPY_WEIGHT, 1)
}

/**
 * Gets a comprehensive summary of password strength.
 *
 * @param password - The password to analyse.
 * @returns An object containing the strength value and label.
 *
 * @example
 * ```ts
 * const summary = getPasswordSummary('Password123!');
 * // summary === { value: 0.74, label: 'Strong' }
 * ```
 */
export function getPasswordSummary(password: string = ''): PasswordSummary {
  const strengthValue = getPasswordStrength(password)

  return {
    value: strengthValue,
    label: getPasswordStrengthLabel(strengthValue),
  }
}
