'use client'

import type { User } from '@openfort/openfort-js'
import { useCallback, useRef, useState } from 'react'
import { AuthenticationError } from '../../../errors/auth.js'
import { type OpenfortError, toError } from '../../../errors/base.js'
import { InvalidEmailError, MissingParameterError } from '../../../errors/validation.js'
import { useAuthTransitions } from '../../../openfort/authTransitionContext.js'
import { useOpenfortCore } from '../../../openfort/useOpenfort.js'
import { authTransitionSupersededResult, startLocalAuthTransition } from '../../../shared/utils/authTransitionQueue.js'
import type { OpenfortHookOptions } from '../../../types.js'
import { isValidEmail } from '../../../utils/validation.js'
import { useLatest } from '../../useLatest.js'
import { NO_HOOK_OPTIONS, onError, onSuccess } from '../hookConsistency.js'
import type { EthereumUserWallet, SolanaUserWallet } from '../walletTypes.js'
import { type BaseFlowState, mapStatus } from './status.js'
import { type CreateWalletPostAuthOptions, useConnectToWalletPostAuth } from './useConnectToWalletPostAuth.js'

type EmailOtpAuthResult = {
  error?: OpenfortError
  user?: User
  wallet?: EthereumUserWallet | SolanaUserWallet
}

type LoginWithEmailOtpOptions = {
  email: string
  otp: string
} & OpenfortHookOptions<EmailOtpAuthResult> &
  CreateWalletPostAuthOptions

type RequestEmailOtpOptions = {
  email: string
} & OpenfortHookOptions<EmailOtpAuthResult> &
  CreateWalletPostAuthOptions

type VerifyEmailOtpOptions = {
  email: string
  otp: string
} & OpenfortHookOptions<EmailOtpAuthResult>

type UseEmailOtpHookOptions = OpenfortHookOptions<EmailOtpAuthResult> & CreateWalletPostAuthOptions

export const useEmailOtpAuth = (hookOptions: UseEmailOtpHookOptions = NO_HOOK_OPTIONS) => {
  const hookOptionsRef = useLatest(hookOptions)
  const client = useOpenfortCore((s) => s.client)
  const { startAuthTransition } = useAuthTransitions()
  const updateUser = useOpenfortCore((s) => s.updateUser)
  const [status, setStatus] = useState<BaseFlowState | { status: 'requesting' }>({
    status: 'idle',
  })
  const authInvocationRef = useRef(0)
  const reset = useCallback(() => {
    setStatus({
      status: 'idle',
    })
  }, [])

  const { tryUseWallet } = useConnectToWalletPostAuth()

  const signInEmailOtp = useCallback(
    async (options: LoginWithEmailOtpOptions): Promise<EmailOtpAuthResult> => {
      let settleStale: (() => boolean) | undefined
      try {
        setStatus({
          status: 'loading',
        })

        if (!options.email || !options.otp) {
          const error = new MissingParameterError({ params: ['email', 'otp'] })
          setStatus({
            status: 'error',
            error,
          })
          return onError<EmailOtpAuthResult>({
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
          return onError<EmailOtpAuthResult>({
            hookOptions: hookOptionsRef.current,
            options,
            error,
          })
        }

        const transition = startLocalAuthTransition(
          startAuthTransition,
          authInvocationRef,
          () =>
            client.auth.logInWithEmailOtp({
              email: options.email,
              otp: options.otp,
            }),
          () => setStatus({ status: 'idle' })
        )
        settleStale = transition.settleStale
        await transition.result
        if (settleStale()) return authTransitionSupersededResult()

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
        return onSuccess<EmailOtpAuthResult>({
          data: { user, wallet },
          hookOptions: hookOptionsRef.current,
          options,
        })
      } catch (e) {
        if (settleStale?.()) return authTransitionSupersededResult()
        const error = new AuthenticationError('Failed to login with email OTP.', { cause: toError(e) })

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
    [client, startAuthTransition, updateUser, tryUseWallet]
  )

  const requestEmailOtp = useCallback(
    async (options: RequestEmailOtpOptions): Promise<EmailOtpAuthResult> => {
      try {
        setStatus({
          status: 'requesting',
        })

        if (!options.email) {
          const error = new MissingParameterError({ params: ['email'] })
          setStatus({
            status: 'error',
            error,
          })
          return onError<EmailOtpAuthResult>({
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
          return onError<EmailOtpAuthResult>({
            hookOptions: hookOptionsRef.current,
            options,
            error,
          })
        }

        await client.auth.requestEmailOtp({
          email: options.email,
        })

        setStatus({
          status: 'success',
        })
        return onSuccess<EmailOtpAuthResult>({
          data: {},
          hookOptions: hookOptionsRef.current,
          options,
        })
      } catch (e) {
        const error = new AuthenticationError('Failed to request email OTP.', { cause: toError(e) })

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

  const verifyEmailOtp = useCallback(
    async (options: VerifyEmailOtpOptions): Promise<EmailOtpAuthResult> => {
      try {
        setStatus({
          status: 'loading',
        })

        if (!options.email || !options.otp) {
          const error = new MissingParameterError({ params: ['email', 'otp'] })
          setStatus({
            status: 'error',
            error,
          })
          return onError<EmailOtpAuthResult>({
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
          return onError<EmailOtpAuthResult>({
            hookOptions: hookOptionsRef.current,
            options,
            error,
          })
        }

        // Verifies ownership of the address without creating a session — for
        // callers that are already authenticated (e.g. wallet-pay capture).
        await client.auth.verifyEmailOtp({
          email: options.email,
          otp: options.otp,
        })

        await updateUser()

        setStatus({
          status: 'success',
        })
        return onSuccess<EmailOtpAuthResult>({
          data: {},
          hookOptions: hookOptionsRef.current,
          options,
        })
      } catch (e) {
        const error = new AuthenticationError('Failed to verify email OTP.', { cause: toError(e) })

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
    [client, updateUser]
  )

  return {
    signInEmailOtp,
    requestEmailOtp,
    verifyEmailOtp,

    reset,
    isRequesting: status.status === 'requesting',
    ...mapStatus(status),
    isAwaitingInput: status.status === 'awaiting-input',
  }
}
