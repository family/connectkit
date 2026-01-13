import type { User } from '@openfort/openfort-js'
import { useCallback, useState } from 'react'
import { useOpenfortCore } from '../../../openfort/useOpenfort'
import { OpenfortError, type OpenfortHookOptions, OpenfortReactErrorType } from '../../../types'
import { onError, onSuccess } from '../hookConsistency'
import type { UserWallet } from '../useWallets'
import { type BaseFlowState, mapStatus } from './status'
import { type CreateWalletPostAuthOptions, useConnectToWalletPostAuth } from './useConnectToWalletPostAuth'

type PhoneAuthResult = {
  error?: OpenfortError
  user?: User
  wallet?: UserWallet
}

type LoginWithPhoneOtpOptions = {
  phoneNumber: string
  otp: string
} & OpenfortHookOptions<PhoneAuthResult> &
  CreateWalletPostAuthOptions

type RequestPhoneOtpOptions = {
  phoneNumber: string
} & OpenfortHookOptions<PhoneAuthResult> &
  CreateWalletPostAuthOptions

type UsePhoneHookOptions = OpenfortHookOptions<PhoneAuthResult> & CreateWalletPostAuthOptions

export const usePhoneOtpAuth = (hookOptions: UsePhoneHookOptions = {}) => {
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

  const logInWithPhoneOtp = useCallback(
    async (options: LoginWithPhoneOtpOptions): Promise<PhoneAuthResult> => {
      try {
        setStatus({
          status: 'loading',
        })

        if (!options.phoneNumber || !options.otp) {
          const error = new OpenfortError('Phone and OTP are required', OpenfortReactErrorType.VALIDATION_ERROR)
          setStatus({
            status: 'error',
            error,
          })
          return onError<PhoneAuthResult>({
            hookOptions,
            options,
            error,
          })
        }

        const result = await client.auth.logInWithPhoneOtp({
          phoneNumber: options.phoneNumber,
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

        return onSuccess<PhoneAuthResult>({
          data: { user, wallet },
          hookOptions,
          options,
        })
      } catch (e) {
        const error = new OpenfortError('Failed to login with phone OTP', OpenfortReactErrorType.AUTHENTICATION_ERROR, {
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

  const requestPhoneOtp = useCallback(
    async (options: RequestPhoneOtpOptions): Promise<PhoneAuthResult> => {
      try {
        setStatus({
          status: 'requesting',
        })

        if (!options.phoneNumber) {
          const error = new OpenfortError('Phone number is required', OpenfortReactErrorType.VALIDATION_ERROR)
          setStatus({
            status: 'error',
            error,
          })
          return onError<PhoneAuthResult>({
            hookOptions,
            options,
            error,
          })
        }

        await client.auth.requestPhoneOtp({
          phoneNumber: options.phoneNumber,
        })

        setStatus({
          status: 'idle',
        })
        return onSuccess<PhoneAuthResult>({
          data: {},
          hookOptions,
          options,
        })
      } catch (e) {
        const error = new OpenfortError('Failed to request phone OTP', OpenfortReactErrorType.AUTHENTICATION_ERROR, {
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

  const linkPhoneOtp = useCallback(
    async (options: LoginWithPhoneOtpOptions): Promise<PhoneAuthResult> => {
      try {
        setStatus({
          status: 'loading',
        })

        if (!options.phoneNumber || !options.otp) {
          const error = new OpenfortError('Phone and OTP are required', OpenfortReactErrorType.VALIDATION_ERROR)
          setStatus({
            status: 'error',
            error,
          })
          return onError<PhoneAuthResult>({
            hookOptions,
            options,
            error,
          })
        }

        const result = await client.auth.linkPhoneOtp({
          phoneNumber: options.phoneNumber,
          otp: options.otp,
        })

        setStatus({
          status: 'success',
        })
        const user = result.user

        await updateUser()

        return onSuccess<PhoneAuthResult>({
          data: { user },
          hookOptions,
          options,
        })
      } catch (e) {
        const error = new OpenfortError('Failed to link phone OTP', OpenfortReactErrorType.AUTHENTICATION_ERROR, {
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
    logInWithPhoneOtp,
    requestPhoneOtp,
    linkPhoneOtp,

    reset,
    isRequesting: status.status === 'requesting',
    ...mapStatus(status),
    isAwaitingInput: status.status === 'awaiting-input',
  }
}
