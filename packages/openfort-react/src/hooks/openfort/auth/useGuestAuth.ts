import { useCallback, useState } from 'react'
import { type AuthPlayerResponse as OpenfortUser } from '@openfort/openfort-js'
import { OpenfortHookOptions, OpenfortError, OpenfortErrorType } from '../../../types'
import { BaseFlowState, mapStatus } from './status'
import { useOpenfortCore } from '../../../openfort/useOpenfort'
import { onError, onSuccess } from '../hookConsistency'
import { CreateWalletPostAuthOptions, useConnectToWalletPostAuth } from './useConnectToWalletPostAuth'
import { UserWallet } from '../useWallets'

export type GuestHookResult = {
  error?: OpenfortError
  user?: OpenfortUser
  wallet?: UserWallet
}

export type GuestHookOptions = OpenfortHookOptions<GuestHookResult> & CreateWalletPostAuthOptions

/**
 * Hook for guest authentication operations
 *
 * This hook manages guest user authentication, allowing users to create temporary
 * accounts without providing email or other credentials. Guest authentication provides
 * a quick way for users to get started with the application before committing to
 * full registration. After authentication, it automatically handles wallet connection.
 *
 * @param hookOptions - Optional configuration with callback functions and authentication options
 * @returns Current guest authentication state and actions
 *
 * @example
 * ```tsx
 * const guestAuth = useGuestAuth({
 *   onSignUpGuestSuccess: (result) => console.log('Guest user created:', result.user),
 *   onSignUpGuestError: (error) => console.error('Guest signup failed:', error),
 *   recoverWalletAutomatically: true,
 *   logoutOnError: false,
 * });
 *
 * // Sign up as guest user
 * const handleGuestSignup = async () => {
 *   try {
 *     const result = await guestAuth.signUpGuest();
 *     if (result.user) {
 *       console.log('Guest user created:', result.user.id);
 *       console.log('User wallet:', result.wallet);
 *     }
 *   } catch (error) {
 *     console.error('Guest signup failed:', error);
 *   }
 * };
 *
 * // Check authentication state
 * if (guestAuth.isLoading) {
 *   console.log('Creating guest account...');
 * } else if (guestAuth.isError) {
 *   console.error('Guest auth error:', guestAuth.error);
 * } else if (guestAuth.isSuccess) {
 *   console.log('Guest authentication successful');
 * }
 *
 * // Example usage in component
 * return (
 *   <div>
 *     <button
 *       onClick={handleGuestSignup}
 *       disabled={guestAuth.isLoading}
 *     >
 *       {guestAuth.isLoading ? 'Creating Guest Account...' : 'Continue as Guest'}
 *     </button>
 *
 *     {guestAuth.isError && (
 *       <p>Error: {guestAuth.error?.message}</p>
 *     )}
 *   </div>
 * );
 * ```
 */
export const useGuestAuth = (hookOptions: GuestHookOptions = {}) => {
  const { client, updateUser } = useOpenfortCore()
  const [status, setStatus] = useState<BaseFlowState>({
    status: 'idle',
  })
  const { tryUseWallet } = useConnectToWalletPostAuth()

  const signUpGuest = useCallback(
    async (options: GuestHookOptions = {}): Promise<GuestHookResult> => {
      try {
        setStatus({
          status: 'loading',
        })

        const result = await client.auth.signUpGuest()

        const user = result.player
        await updateUser(user)

        const { wallet } = await tryUseWallet({
          logoutOnError: options.logoutOnError ?? hookOptions.logoutOnError,
          recoverWalletAutomatically: options.recoverWalletAutomatically ?? hookOptions.recoverWalletAutomatically,
        })

        setStatus({
          status: 'success',
        })

        return onSuccess({
          hookOptions,
          options,
          data: { user, wallet },
        })
      } catch (error) {
        const openfortError = new OpenfortError('Failed to signup guest', OpenfortErrorType.AUTHENTICATION_ERROR, {
          error,
        })

        setStatus({
          status: 'error',
          error: openfortError,
        })

        return onError({
          hookOptions,
          options,
          error: openfortError,
        })
      }
    },
    [client, setStatus, updateUser, hookOptions]
  )

  return {
    signUpGuest,
    ...mapStatus(status),
  }
}
