import type { User } from '@openfort/openfort-js'
import { useCallback, useState } from 'react'
import { useOpenfortCore } from '../../../openfort/useOpenfort'
import { OpenfortError, type OpenfortHookOptions, OpenfortReactErrorType } from '../../../types'
import { isValidEmail } from '../../../utils/validation'
import { onError, onSuccess } from '../hookConsistency'
import type { UserWallet } from '../useWallets'
import { type BaseFlowState, mapStatus } from './status'
import { type CreateWalletPostAuthOptions, useConnectToWalletPostAuth } from './useConnectToWalletPostAuth'

type EmailOtpAuthResult = {
  error?: OpenfortError
  user?: User
  wallet?: UserWallet
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

type UseEmailOtpHookOptions = OpenfortHookOptions<EmailOtpAuthResult> & CreateWalletPostAuthOptions

export const useEmailOtpAuth = (hookOptions: UseEmailOtpHookOptions = {}) => {
  const { client, updateUser } = useOpenfortCore()
  const [status, setStatus] = useState<BaseFlowState | { status: 'requesting' }>({
    status: 'idle',
  })
  const reset = useCallback(() => {
    setStatus({
      status: 'idle',
    })
  }, [])

  const { tryUseWallet } = useConnectToWalletPostAuth()

  const signInEmailOtp = useCallback(
    async (options: LoginWithEmailOtpOptions): Promise<EmailOtpAuthResult> => {
      try {
        setStatus({
          status: 'loading',
        })

        if (!options.email || !options.otp) {
          const error = new OpenfortError('Email and OTP are required', OpenfortReactErrorType.VALIDATION_ERROR)
          setStatus({
            status: 'error',
            error,
          })
          return onError<EmailOtpAuthResult>({
            hookOptions,
            options,
            error,
          })
        }

        if (!isValidEmail(options.email)) {
          const error = new OpenfortError('Invalid email', OpenfortReactErrorType.VALIDATION_ERROR)
          setStatus({
            status: 'error',
            error,
          })
          return onError<EmailOtpAuthResult>({
            hookOptions,
            options,
            error,
          })
        }

        const result = await client.auth.logInWithEmailOtp({
          email: options.email,
          otp: options.otp,
        })

        const { wallet } = await tryUseWallet({
          logoutOnError: options.logoutOnError ?? hookOptions.logoutOnError,
          recoverWalletAutomatically: options.recoverWalletAutomatically ?? hookOptions.recoverWalletAutomatically,
        })

        setStatus({
          status: 'success',
        })
        const user = result.user

        await updateUser()

        return onSuccess<EmailOtpAuthResult>({
          data: { user, wallet },
          hookOptions,
          options,
        })
      } catch (e) {
        const error = new OpenfortError('Failed to login with email OTP', OpenfortReactErrorType.AUTHENTICATION_ERROR, {
          error: e,
        })

        setStatus({
          status: 'error',
          error: error,
        })

        return onError({
          hookOptions,
          options,
          error: error,
        })
      }
    },
    [client, setStatus, updateUser, hookOptions]
  )

  const requestEmailOtp = useCallback(
    async (options: RequestEmailOtpOptions): Promise<EmailOtpAuthResult> => {
      try {
        setStatus({
          status: 'requesting',
        })

        if (!options.email) {
          const error = new OpenfortError('Email is required', OpenfortReactErrorType.VALIDATION_ERROR)
          setStatus({
            status: 'error',
            error,
          })
          return onError<EmailOtpAuthResult>({
            hookOptions,
            options,
            error,
          })
        }

        if (!isValidEmail(options.email)) {
          const error = new OpenfortError('Invalid email', OpenfortReactErrorType.VALIDATION_ERROR)
          setStatus({
            status: 'error',
            error,
          })
          return onError<EmailOtpAuthResult>({
            hookOptions,
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
          hookOptions,
          options,
        })
      } catch (e) {
        const error = new OpenfortError('Failed to request email OTP', OpenfortReactErrorType.AUTHENTICATION_ERROR, {
          error: e,
        })

        setStatus({
          status: 'error',
          error: error,
        })

        return onError({
          hookOptions,
          options,
          error: error,
        })
      }
    },
    [client, setStatus, updateUser, hookOptions]
  )

  return {
    signInEmailOtp,
    requestEmailOtp,

    reset,
    isRequesting: status.status === 'requesting',
    ...mapStatus(status),
    isAwaitingInput: status.status === 'awaiting-input',
  }
}
