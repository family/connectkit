import type { OAuthProvider, AuthPlayerResponse as OpenfortUser } from '@openfort/openfort-js'
import { useCallback, useState } from 'react'
import { useOpenfortCore } from '../../../openfort/useOpenfort'
import { OpenfortError, OpenfortErrorType, type OpenfortHookOptions } from '../../../types'
import { onError, onSuccess } from '../hookConsistency'
import type { UserWallet } from '../useWallets'
import { buildCallbackUrl } from './requestEmailVerification'
import { type BaseFlowState, mapStatus } from './status'
import { type CreateWalletPostAuthOptions, useConnectToWalletPostAuth } from './useConnectToWalletPostAuth'

// TODO: Open auth in a new tab and use polling to check for completion
export type InitializeOAuthOptions = {
  provider: OAuthProvider
  redirectTo?: string
} & OpenfortHookOptions<InitOAuthReturnType>

export type InitOAuthReturnType = {
  error?: OpenfortError
}

export type StoreCredentialsResult = {
  // type: "storeCredentials";
  user?: OpenfortUser
  wallet?: UserWallet
  error?: OpenfortError
}
export type StoreCredentialsOptions = {
  player: string
  accessToken: string
  refreshToken: string
} & OpenfortHookOptions<StoreCredentialsResult> &
  CreateWalletPostAuthOptions

export type AuthHookOptions = {
  redirectTo?: string
} & OpenfortHookOptions<StoreCredentialsResult | InitOAuthReturnType> &
  CreateWalletPostAuthOptions

/**
 * Hook for OAuth-based authentication operations
 *
 * This hook manages OAuth authentication flows including provider initialization,
 * credential storage, and wallet connection after successful OAuth authentication.
 * It supports multiple OAuth providers and handles the complete authentication lifecycle
 * from provider selection to wallet setup.
 *
 * @param hookOptions - Optional configuration with callback functions and authentication options
 * @returns Current OAuth authentication state and actions
 *
 * @example
 * ```tsx
 * const oauth = useOAuth({
 *   onInitializeOAuthSuccess: (result) => console.log('OAuth initialized'),
 *   onInitializeOAuthError: (error) => console.error('OAuth init failed:', error),
 *   onStoreCredentialsSuccess: (result) => console.log('Authenticated:', result.user),
 *   redirectTo: 'https://yourapp.com/auth/callback',
 *   recoverWalletAutomatically: true,
 * });
 *
 * // Initialize OAuth with a provider
 * const handleGoogleAuth = async () => {
 *   await oauth.initOAuth({
 *     provider: OAuthProvider.GOOGLE,
 *     redirectTo: 'https://yourapp.com/auth/callback',
 *   });
 * };
 *
 * const handleDiscordAuth = async () => {
 *   await oauth.initOAuth({
 *     provider: OAuthProvider.DISCORD,
 *   });
 * };
 *
 * // Store OAuth credentials (typically called from callback handler)
 * const handleStoreCredentials = async () => {
 *   await oauth.storeCredentials({
 *     player: 'player-id-from-callback',
 *     accessToken: 'access-token-from-callback',
 *     refreshToken: 'refresh-token-from-callback',
 *   });
 * };
 *
 * // Link OAuth provider to existing authenticated account
 * const handleLinkOAuth = async () => {
 *   await oauth.linkOauth({
 *     provider: OAuthProvider.GOOGLE,
 *     redirectTo: 'https://yourapp.com/auth/callback',
 *   });
 * };
 *
 * // Check authentication state
 * if (oauth.isLoading) {
 *   console.log('Processing OAuth authentication...');
 * } else if (oauth.isError) {
 *   console.error('OAuth error:', oauth.error);
 * } else if (oauth.isSuccess) {
 *   console.log('OAuth authentication successful');
 * }
 *
 * // Example usage in component with multiple providers
 * return (
 *   <div>
 *     <button onClick={handleGoogleAuth} disabled={oauth.isLoading}>
 *       Sign in with Google
 *     </button>
 *     <button onClick={handleDiscordAuth} disabled={oauth.isLoading}>
 *       Sign in with Discord
 *     </button>
 *   </div>
 * );
 * ```
 */
export const useOAuth = (hookOptions: AuthHookOptions = {}) => {
  const { client, updateUser } = useOpenfortCore()
  const [status, setStatus] = useState<BaseFlowState>({
    status: 'idle',
  })

  const { tryUseWallet } = useConnectToWalletPostAuth()

  const storeCredentials = useCallback(
    async ({
      player,
      accessToken,
      refreshToken,
      ...options
    }: StoreCredentialsOptions): Promise<StoreCredentialsResult> => {
      setStatus({
        status: 'loading',
      })

      try {
        await client.auth.storeCredentials({
          player,
          accessToken,
          refreshToken,
        })
        setStatus({
          status: 'success',
        })

        const user = (await updateUser()) || undefined

        const { wallet } = await tryUseWallet({
          logoutOnError: options.logoutOnError ?? hookOptions.logoutOnError,
          recoverWalletAutomatically: options.recoverWalletAutomatically ?? hookOptions.recoverWalletAutomatically,
        })

        return onSuccess({
          data: { user, wallet, type: 'storeCredentials' },
          hookOptions,
          options,
        })
      } catch (e) {
        const error = new OpenfortError('Failed to store credentials', OpenfortErrorType.AUTHENTICATION_ERROR, {
          error: e,
        })

        setStatus({
          status: 'error',
          error,
        })

        return onError({
          hookOptions,
          options,
          error,
        })
      }
    },
    [client, hookOptions, tryUseWallet, updateUser]
  )

  const initOAuth = useCallback(
    async (options: InitializeOAuthOptions): Promise<InitOAuthReturnType> => {
      const authProvider = options.provider

      try {
        setStatus({
          status: 'loading',
        })

        await client.auth.initOAuth({
          provider: authProvider,
          options: {
            redirectTo: buildCallbackUrl({
              provider: authProvider,
              callbackUrl: hookOptions?.redirectTo ?? options?.redirectTo,
            }),
          },
        })

        return onSuccess<InitOAuthReturnType>({
          data: {},
          hookOptions,
          options,
        })
      } catch (e) {
        const error = new OpenfortError('Failed to login with OAuth', OpenfortErrorType.AUTHENTICATION_ERROR, {
          error: e,
        })

        setStatus({
          status: 'error',
          error,
        })

        return onError({
          hookOptions,
          options,
          error,
        })
      }
    },
    [client, hookOptions]
  )

  const linkOauth = useCallback(
    async (options: InitializeOAuthOptions): Promise<InitOAuthReturnType> => {
      const authProvider = options.provider

      try {
        setStatus({
          status: 'loading',
        })

        const authToken = await client.getAccessToken()

        if (!authToken) {
          throw new OpenfortError('No auth token found', OpenfortErrorType.AUTHENTICATION_ERROR)
        }

        await client.auth.initLinkOAuth({
          authToken,
          provider: authProvider,
          options: {
            redirectTo: buildCallbackUrl({
              provider: authProvider,
              callbackUrl: options?.redirectTo ?? hookOptions?.redirectTo,
            }),
          },
        })

        return onSuccess<InitOAuthReturnType>({
          data: {},
          hookOptions,
          options,
        })
      } catch (e) {
        const error = new OpenfortError('Failed to link OAuth', OpenfortErrorType.AUTHENTICATION_ERROR, { error: e })

        setStatus({
          status: 'error',
          error,
        })

        return onError({
          hookOptions,
          options,
          error,
        })
      }
    },
    [client, hookOptions]
  )

  return {
    initOAuth,
    linkOauth,
    storeCredentials,
    ...mapStatus(status),
  }
}
