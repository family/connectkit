'use client'

import type { User } from '@openfort/openfort-js'
import { useCallback, useRef, useState } from 'react'
import { useOpenfortRouting } from '../../../components/Openfort/useOpenfort.js'
import { AuthenticationError, NotAuthenticatedError } from '../../../errors/auth.js'
import { type OpenfortError, toError } from '../../../errors/base.js'
import { InvalidEmailError, MissingParameterError } from '../../../errors/validation.js'
import { useAuthTransitions } from '../../../openfort/authTransitionContext.js'
import { useOpenfortCore } from '../../../openfort/useOpenfort.js'
import { authTransitionSupersededResult, startLocalAuthTransition } from '../../../shared/utils/authTransitionQueue.js'
import type { OpenfortHookOptions } from '../../../types.js'
import { logger } from '../../../utils/logger.js'
import { isValidEmail } from '../../../utils/validation.js'
import { useLatest } from '../../useLatest.js'
import { NO_HOOK_OPTIONS, onError, onSuccess } from '../hookConsistency.js'
import type { EthereumUserWallet, SolanaUserWallet } from '../walletTypes.js'
import { buildCallbackUrl } from './requestEmailVerification.js'
import { type BaseFlowState, mapStatus } from './status.js'
import { type CreateWalletPostAuthOptions, useConnectToWalletPostAuth } from './useConnectToWalletPostAuth.js'

type EmailAuthResult = {
  error?: OpenfortError
  user?: User
  wallet?: EthereumUserWallet | SolanaUserWallet
  requiresEmailVerification?: boolean
}

type SignInEmailOptions = {
  email: string
  password: string
  emailVerificationRedirectTo?: string
} & OpenfortHookOptions<EmailAuthResult> &
  CreateWalletPostAuthOptions

type SignUpEmailOptions = {
  email: string
  password: string
  name?: string
  emailVerificationRedirectTo?: string
} & OpenfortHookOptions<EmailAuthResult> &
  CreateWalletPostAuthOptions

type RequestResetPasswordOptions = {
  email: string
  emailVerificationRedirectTo?: string
} & OpenfortHookOptions<EmailAuthResult>

type ResetPasswordOptions = {
  email: string
  password: string
  state: string
} & OpenfortHookOptions<EmailAuthResult>

type LinkEmailOptions = {
  email: string
  emailVerificationRedirectTo?: string
} & OpenfortHookOptions<EmailAuthResult>

type VerifyEmailOptions = {
  email: string
  state: string
} & OpenfortHookOptions<EmailVerificationResult>

export type EmailVerificationResult = {
  email?: string
  error?: OpenfortError
}

type UseEmailHookOptions = {
  emailVerificationRedirectTo?: string
} & OpenfortHookOptions<EmailAuthResult | EmailVerificationResult> &
  CreateWalletPostAuthOptions

/**
 * Hook for email-based authentication operations
 *
 * This hook manages email authentication flows including sign-in, sign-up, password reset,
 * email verification, and email linking. It handles both password and passwordless authentication
 * and automatically manages wallet connection after successful authentication.
 *
 * @param hookOptions - Optional configuration with callback functions and authentication options
 * @returns Current authentication state with email auth actions
 *
 * @example
 * ```tsx
 * import { useEmailAuth } from '@openfort/react'
 *
 * function EmailSignIn() {
 *   const { signInEmail, isLoading, error } = useEmailAuth()
 *   const signIn = async () => {
 *     const result = await signInEmail({ email: 'user@example.com', password: 'securePassword123' })
 *     if (result.error) return
 *     console.log(result.user)
 *   }
 *   return <button onClick={signIn} disabled={isLoading}>{error ? error.shortMessage : 'Sign in'}</button>
 * }
 * ```
 */

export const useEmailAuth = (hookOptions: UseEmailHookOptions = NO_HOOK_OPTIONS) => {
  const hookOptionsRef = useLatest(hookOptions)
  const client = useOpenfortCore((s) => s.client)
  const { captureAuthSession, startAuthenticatedMutation, startAuthTransition } = useAuthTransitions()
  const updateUser = useOpenfortCore((s) => s.updateUser)
  const { open: isOpen } = useOpenfortRouting()
  const [requiresEmailVerification, setRequiresEmailVerification] = useState(false)
  const [status, setStatus] = useState<BaseFlowState>({
    status: 'idle',
  })
  const authInvocationRef = useRef(0)
  const reset = useCallback(() => {
    setStatus({
      status: 'idle',
    })
    setRequiresEmailVerification(false)
  }, [])

  const { tryUseWallet } = useConnectToWalletPostAuth()

  const signInEmail = useCallback(
    async (options: SignInEmailOptions): Promise<EmailAuthResult> => {
      let settleStale: (() => boolean) | undefined
      try {
        setStatus({
          status: 'loading',
        })
        setRequiresEmailVerification(false)

        if (!options.email || !options.password) {
          const error = new MissingParameterError({ params: ['email', 'password'] })
          setStatus({
            status: 'error',
            error,
          })
          return onError<EmailAuthResult>({
            hookOptions: hookOptionsRef.current,
            options,
            error,
          })
        }

        if (!isValidEmail(options.email)) {
          const error = new InvalidEmailError()
          setStatus({
            status: 'error',
            error,
          })
          return onError<EmailAuthResult>({
            hookOptions: hookOptionsRef.current,
            options,
            error,
          })
        }

        const transition = startLocalAuthTransition(
          startAuthTransition,
          authInvocationRef,
          () =>
            client.auth.logInWithEmailPassword({
              email: options.email,
              password: options.password,
            }),
          () => setStatus({ status: 'idle' })
        )
        settleStale = transition.settleStale
        const result = await transition.result
        if (settleStale()) return authTransitionSupersededResult()

        if ('action' in result) {
          setStatus({
            status: 'awaiting-input',
          })

          await client.auth.requestEmailVerification({
            email: options.email,
            redirectUrl: buildCallbackUrl({
              email: options.email,
              callbackUrl: options.emailVerificationRedirectTo ?? hookOptionsRef.current.emailVerificationRedirectTo,
              provider: 'email',
              isOpen,
            }),
          })
          if (settleStale()) return authTransitionSupersededResult()

          setRequiresEmailVerification(true)
          return onSuccess<EmailAuthResult>({
            data: { requiresEmailVerification: true },
            hookOptions: hookOptionsRef.current,
            options,
          })
        } else {
          // The login response omits user metadata; /me returns it.
          const user = (await updateUser()) || undefined
          if (settleStale()) return authTransitionSupersededResult()

          const { wallet } = await tryUseWallet({
            logoutOnError: options.logoutOnError ?? hookOptionsRef.current.logoutOnError,
            recoverWalletAutomatically:
              options.recoverWalletAutomatically ?? hookOptionsRef.current.recoverWalletAutomatically,
          })
          if (settleStale()) return authTransitionSupersededResult()

          setStatus({
            status: 'success',
          })
          return onSuccess<EmailAuthResult>({
            data: { user, wallet },
            hookOptions: hookOptionsRef.current,
            options,
          })
        }
      } catch (e) {
        if (settleStale?.()) return authTransitionSupersededResult()
        const error = new AuthenticationError('Failed to login with email and password.', { cause: toError(e) })

        setStatus({
          status: 'error',
          error,
        })

        return onError({
          hookOptions: hookOptionsRef.current,
          options,
          error,
        })
      }
    },
    [client, startAuthTransition, updateUser, isOpen, tryUseWallet]
  )

  const requestResetPassword = useCallback(
    async (options: RequestResetPasswordOptions): Promise<EmailAuthResult> => {
      try {
        if (!isValidEmail(options.email)) {
          const error = new InvalidEmailError()
          setStatus({
            status: 'error',
            error,
          })
          return onError<EmailAuthResult>({
            hookOptions: hookOptionsRef.current,
            options,
            error,
          })
        }

        setStatus({
          status: 'loading',
        })
        setRequiresEmailVerification(false)

        await client.auth.requestResetPassword({
          email: options.email,
          redirectUrl: buildCallbackUrl({
            email: options.email,
            callbackUrl: options.emailVerificationRedirectTo ?? hookOptionsRef.current.emailVerificationRedirectTo,
            provider: 'password',
            isOpen,
            uiParam: 'openfortForgotPasswordUI',
          }),
        })

        setStatus({
          status: 'success',
        })

        setRequiresEmailVerification(true)
        return onSuccess<EmailAuthResult>({
          data: { requiresEmailVerification: true },
          hookOptions: hookOptionsRef.current,
          options,
        })
      } catch (e) {
        const error = new AuthenticationError('Failed to reset password.', { cause: toError(e) })
        setStatus({
          status: 'error',
          error,
        })

        return onError({
          hookOptions: hookOptionsRef.current,
          options,
          error,
        })
      }
    },
    [client, isOpen]
  )

  const resetPassword = useCallback(
    async (options: ResetPasswordOptions): Promise<EmailAuthResult> => {
      try {
        if (!isValidEmail(options.email)) {
          const error = new InvalidEmailError()
          setStatus({
            status: 'error',
            error,
          })
          return onError<EmailAuthResult>({
            hookOptions: hookOptionsRef.current,
            options,
            error,
          })
        }

        setStatus({
          status: 'loading',
        })
        setRequiresEmailVerification(false)

        await client.auth.resetPassword({
          password: options.password,
          token: options.state,
        })

        setStatus({
          status: 'success',
        })

        setRequiresEmailVerification(true)
        return onSuccess<EmailAuthResult>({
          data: { requiresEmailVerification: true },
          hookOptions: hookOptionsRef.current,
          options,
        })
      } catch (e) {
        const error = new AuthenticationError('Failed to reset password.', { cause: toError(e) })
        setStatus({
          status: 'error',
          error,
        })

        return onError({
          hookOptions: hookOptionsRef.current,
          options,
          error,
        })
      }
    },
    [client]
  )

  const signUpEmail = useCallback(
    async (options: SignUpEmailOptions): Promise<EmailAuthResult> => {
      let settleStale: (() => boolean) | undefined
      try {
        if (!options.email || !options.password) {
          const error = new MissingParameterError({ params: ['email', 'password'] })
          setStatus({
            status: 'error',
            error,
          })
          return onError<EmailAuthResult>({
            hookOptions: hookOptionsRef.current,
            options,
            error,
          })
        }

        if (!isValidEmail(options.email)) {
          const error = new InvalidEmailError()
          setStatus({
            status: 'error',
            error,
          })
          return onError<EmailAuthResult>({
            hookOptions: hookOptionsRef.current,
            options,
            error,
          })
        }

        setStatus({
          status: 'loading',
        })
        setRequiresEmailVerification(false)

        const transition = startLocalAuthTransition(
          startAuthTransition,
          authInvocationRef,
          () =>
            client.auth.signUpWithEmailPassword({
              email: options.email,
              password: options.password,
              callbackURL: buildCallbackUrl({
                email: options.email,
                callbackUrl: options.emailVerificationRedirectTo ?? hookOptionsRef.current.emailVerificationRedirectTo,
                provider: 'email',
                isOpen,
              }),
              ...(options.name && { name: options.name }),
            }),
          () => setStatus({ status: 'idle' })
        )
        settleStale = transition.settleStale
        const result = await transition.result
        if (settleStale()) return authTransitionSupersededResult()

        // API returns token when auth succeeds immediately; otherwise requires email verification
        if ('token' in result && result.token != null) {
          const user = result.user
          await updateUser(user)
          if (settleStale()) return authTransitionSupersededResult()

          const { wallet } = await tryUseWallet({
            logoutOnError: options.logoutOnError ?? hookOptionsRef.current.logoutOnError,
            recoverWalletAutomatically:
              options.recoverWalletAutomatically ?? hookOptionsRef.current.recoverWalletAutomatically,
          })
          if (settleStale()) return authTransitionSupersededResult()

          setStatus({
            status: 'success',
          })
          return onSuccess<EmailAuthResult>({
            data: { user, wallet },
            hookOptions: hookOptionsRef.current,
            options,
          })
        } else {
          setStatus({
            status: 'awaiting-input',
          })

          setRequiresEmailVerification(true)
          return onSuccess<EmailAuthResult>({
            data: { requiresEmailVerification: true },
            hookOptions: hookOptionsRef.current,
            options,
          })
        }
      } catch (e) {
        if (settleStale?.()) return authTransitionSupersededResult()
        const error = new AuthenticationError('Failed to login with email and password.', { cause: toError(e) })
        setStatus({
          status: 'error',
          error,
        })

        return onError({
          hookOptions: hookOptionsRef.current,
          options,
          error,
        })
      }
    },
    [client, startAuthTransition, updateUser, isOpen, tryUseWallet]
  )

  const linkEmail = useCallback(
    async (options: LinkEmailOptions): Promise<EmailAuthResult> => {
      const session = captureAuthSession()
      let mutationIsCurrent: (() => boolean) | undefined
      const isCurrent = () => session.isCurrent() && (mutationIsCurrent?.() ?? true)
      try {
        if (!isValidEmail(options.email)) {
          const error = new InvalidEmailError()
          setStatus({
            status: 'error',
            error,
          })
          return onError<EmailAuthResult>({
            hookOptions: hookOptionsRef.current,
            options,
            error,
          })
        }

        const transition = startAuthenticatedMutation(async () => {
          await client.validateAndRefreshToken()
          if (!session.isCurrent()) return false
          const authToken = await client.getAccessToken()
          if (!session.isCurrent()) return false
          if (!authToken) {
            logger.log('No token found')
            throw new NotAuthenticatedError('No token found.')
          }

          await client.auth.addEmail({
            email: options.email,
            callbackURL: buildCallbackUrl({
              callbackUrl: options.emailVerificationRedirectTo ?? hookOptionsRef.current.emailVerificationRedirectTo,
              email: options.email,
              provider: 'email',
              isOpen,
            }),
          })
          return true
        })
        mutationIsCurrent = transition.isCurrent
        const linked = await transition.result
        if (!isCurrent()) return authTransitionSupersededResult()
        if (!linked) return authTransitionSupersededResult()
        logger.log('Email linked successfully')

        return onSuccess<EmailAuthResult>({
          data: {},
          hookOptions: hookOptionsRef.current,
          options,
        })
      } catch (e) {
        if (!isCurrent()) return authTransitionSupersededResult()
        const error =
          e instanceof NotAuthenticatedError
            ? e
            : new AuthenticationError('Failed to link email.', { cause: toError(e) })

        setStatus({
          status: 'error',
          error,
        })

        return onError({
          hookOptions: hookOptionsRef.current,
          options,
          error,
        })
      }
    },
    [captureAuthSession, client, isOpen, startAuthenticatedMutation]
  )

  const verifyEmail = useCallback(
    async (options: VerifyEmailOptions): Promise<EmailVerificationResult> => {
      setStatus({
        status: 'loading',
      })

      try {
        if (!isValidEmail(options.email)) {
          const error = new InvalidEmailError()
          setStatus({
            status: 'error',
            error,
          })
          return onError<EmailAuthResult>({
            hookOptions: hookOptionsRef.current,
            options,
            error,
          })
        }

        await client.auth.verifyEmail({
          token: options.state,
        })
        setStatus({
          status: 'success',
        })

        return onSuccess({
          hookOptions: hookOptionsRef.current,
          options,
          data: {
            email: options.email,
          },
        })
      } catch (e) {
        const error = new AuthenticationError('Failed to verify email.', { cause: toError(e) })

        setStatus({
          status: 'error',
          error,
        })

        logger.error('Error verifying email', e)

        return onError({
          hookOptions: hookOptionsRef.current,
          options,
          error,
        })
      }
    },
    [client]
  )

  return {
    signInEmail,
    signUpEmail,
    verifyEmail,
    linkEmail,
    requestResetPassword,
    resetPassword,
    reset,
    ...mapStatus(status),
    requiresEmailVerification,
    isAwaitingInput: status.status === 'awaiting-input',
  }
}
