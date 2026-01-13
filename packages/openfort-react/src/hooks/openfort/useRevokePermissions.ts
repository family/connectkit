import type { RevokePermissionsRequestParams, SessionResponse } from '@openfort/openfort-js'
import { useCallback, useState } from 'react'
import type { Hex } from 'viem'
import { useChainId, useWalletClient } from 'wagmi'
import { OpenfortError, type OpenfortHookOptions, OpenfortReactErrorType } from '../../types'
import { logger } from '../../utils/logger'
import { useChains } from '../useChains'
import { type BaseFlowState, mapStatus } from './auth/status'
import { onError, onSuccess } from './hookConsistency'

type RevokePermissionsRequest = {
  sessionKey: Hex
}

type RevokePermissionsResult = SessionResponse

type RevokePermissionsHookResult = {
  error?: OpenfortError
} & Partial<RevokePermissionsResult>

type RevokePermissionsHookOptions = OpenfortHookOptions<RevokePermissionsHookResult>

/**
 * Hook for revoking permissions to session keys (EIP-7715)
 *
 * This hook manages the creation and authorization of session keys, allowing users to
 * delegate permissions to specific accounts for a limited time. This enables use cases
 * like session-based authentication and gasless transactions within defined scopes.
 * The hook leverages EIP-7715 for permission revocation.
 *
 * @param hookOptions - Optional configuration with callback functions
 * @returns Current revoke permissions state and actions
 *
 * @example
 * ```tsx
 * import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
 * import { useRevokePermissions } from '@openfort/openfort-react';
 *
 * const { revokePermissions, isLoading, isError, error } = useRevokePermissions({
 *   onSuccess: (result) => console.log('Permissions revoked:', result),
 *   onError: (error) => console.error('Permission revoke failed:', error),
 * });
 *
 * // Revoke Permissions to a session key
 * const handleRevokePermissions = async () => {
 *   try {
 *     const sessionKey = '0x...'; // The session key to revoke permissions for
 *
 *     const result = await revokePermissions({
 *       sessionKey,
 *     });
 *
 *     console.log('Revoke result:', result);
 *   } catch (error) {
 *     console.error('Error revoking permissions:', error);
 *   }
 * };
 * ```
 */
export const useRevokePermissions = (hookOptions: RevokePermissionsHookOptions = {}) => {
  const chains = useChains()
  const chainId = useChainId()
  const [status, setStatus] = useState<BaseFlowState>({
    status: 'idle',
  })
  const { data: walletClient } = useWalletClient()
  const [data, setData] = useState<RevokePermissionsResult | null>(null)
  const revokePermissions = useCallback(
    async (
      { sessionKey }: RevokePermissionsRequest,
      options: RevokePermissionsHookOptions = {}
    ): Promise<RevokePermissionsHookResult> => {
      try {
        if (!walletClient) {
          throw new OpenfortError('Wallet client not available', OpenfortReactErrorType.WALLET_ERROR)
        }

        logger.log('Revoking permissions for session key:', sessionKey)
        setStatus({
          status: 'loading',
        })

        // Get the current chain configuration
        const chain = chains.find((c) => c.id === chainId)
        if (!chain) {
          throw new OpenfortError('No chain configured', OpenfortReactErrorType.CONFIGURATION_ERROR)
        }

        // Get the account address
        const revokePermissionsResult = await walletClient.request<{
          Method: 'wallet_revokePermissions'
          Parameters: [RevokePermissionsRequestParams]
          ReturnType: SessionResponse
        }>({
          method: 'wallet_revokePermissions',

          params: [
            {
              permissionContext: sessionKey,
            },
          ],
        })

        logger.log('Revoke permissions result:', revokePermissionsResult)

        const data: RevokePermissionsResult = revokePermissionsResult

        setData(data)
        setStatus({
          status: 'success',
        })

        return onSuccess({
          hookOptions,
          options,
          data,
        })
      } catch (error) {
        const openfortError = new OpenfortError('Failed to revoke permissions', OpenfortReactErrorType.WALLET_ERROR, {
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
    [chains, chainId, setStatus, hookOptions]
  )

  return {
    revokePermissions,
    data,
    reset: () => {
      setStatus({ status: 'idle' })
      setData(null)
    },
    ...mapStatus(status),
  }
}
