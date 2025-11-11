import { useCallback, useState } from 'react'
import type { Hex } from 'viem'
import { erc7715Actions, type GrantPermissionsParameters, type GrantPermissionsReturnType } from 'viem/experimental'
import { useChainId, useWalletClient } from 'wagmi'
import { OpenfortError, OpenfortErrorType, type OpenfortHookOptions } from '../../types'
import { useChains } from '../useChains'
import { type BaseFlowState, mapStatus } from './auth/status'
import { onError, onSuccess } from './hookConsistency'

type GrantPermissionsRequest = {
  request: GrantPermissionsParameters
  sessionKey: Hex
}

type GrantPermissionsResult = {
  address: `0x${string}`
  privateKey: `0x${string}`
} & GrantPermissionsReturnType

type GrantPermissionsHookResult = {
  error?: OpenfortError
} & Partial<GrantPermissionsResult>

type GrantPermissionsHookOptions = OpenfortHookOptions<GrantPermissionsHookResult>

/**
 * Hook for granting permissions to session keys (EIP-7715)
 *
 * This hook manages the creation and authorization of session keys, allowing users to
 * delegate permissions to specific accounts for a limited time. This enables use cases
 * like session-based authentication and gasless transactions within defined scopes.
 * The hook leverages EIP-7715 for permission granting.
 *
 * @param hookOptions - Optional configuration with callback functions
 * @returns Current grant permissions state and actions
 *
 * @example
 * ```tsx
 * import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
 * import { useGrantPermissions } from '@openfort/openfort-react';
 *
 * const { grantPermissions, isLoading, isError, error } = useGrantPermissions({
 *   onSuccess: (result) => console.log('Permissions granted:', result),
 *   onError: (error) => console.error('Permission grant failed:', error),
 * });
 *
 * // Grant permissions to a session key
 * const handleGrantPermissions = async () => {
 *   try {
 *     // Generate a new session key
 *     const sessionKey = generatePrivateKey();
 *     const accountSession = privateKeyToAccount(sessionKey).address;
 *
 *     const result = await grantPermissions({
 *       sessionKey,
 *       request: {
 *         signer: {
 *           type: 'account',
 *           data: {
 *             id: accountSession,
 *           },
 *         },
 *         expiry: 60 * 60 * 24, // 24 hours
 *         permissions: [
 *           {
 *             type: 'contract-call',
 *             data: {
 *               address: '0x2522f4fc9af2e1954a3d13f7a5b2683a00a4543a',
 *             },
 *           },
 *         ],
 *       },
 *     });
 *
 *     if (result.address) {
 *       console.log('Session created with address:', result.address);
 *       console.log('Session private key:', result.privateKey);
 *     }
 *   } catch (error) {
 *     console.error('Failed to grant permissions:', error);
 *   }
 * };
 *
 * // Check permission grant state
 * if (isLoading) {
 *   console.log('Granting permissions...');
 * } else if (isError) {
 *   console.error('Permission grant error:', error);
 * }
 *
 * // Example usage in component
 * return (
 *   <div>
 *     <button
 *       onClick={handleGrantPermissions}
 *       disabled={isLoading}
 *     >
 *       {isLoading ? 'Granting Permissions...' : 'Create Session'}
 *     </button>
 *
 *     {isError && (
 *       <p>Error: {error?.message}</p>
 *     )}
 *   </div>
 * );
 * ```
 */
export const useGrantPermissions = (hookOptions: GrantPermissionsHookOptions = {}) => {
  const chains = useChains()
  const chainId = useChainId()
  const [status, setStatus] = useState<BaseFlowState>({
    status: 'idle',
  })
  const { data: walletClient } = useWalletClient()
  const [data, setData] = useState<GrantPermissionsResult | null>(null)
  const grantPermissions = useCallback(
    async (
      { request, sessionKey }: GrantPermissionsRequest,
      options: GrantPermissionsHookOptions = {}
    ): Promise<GrantPermissionsHookResult> => {
      try {
        if (!walletClient) {
          throw new OpenfortError('Wallet client not available', OpenfortErrorType.WALLET_ERROR)
        }

        setStatus({
          status: 'loading',
        })

        // Get the current chain configuration
        const chain = chains.find((c) => c.id === chainId)
        if (!chain) {
          throw new OpenfortError('No chain configured', OpenfortErrorType.CONFIGURATION_ERROR)
        }

        // Get the account address
        const [account] = await walletClient.getAddresses()

        // Grant permissions
        const grantPermissionsResult = await walletClient.extend(erc7715Actions()).grantPermissions(request)

        const data: GrantPermissionsResult = {
          address: account,
          privateKey: sessionKey,
          ...grantPermissionsResult,
        }

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
        const openfortError = new OpenfortError('Failed to grant permissions', OpenfortErrorType.WALLET_ERROR, {
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
    grantPermissions,
    data,
    reset: () => {
      setStatus({ status: 'idle' })
      setData(null)
    },
    ...mapStatus(status),
  }
}
