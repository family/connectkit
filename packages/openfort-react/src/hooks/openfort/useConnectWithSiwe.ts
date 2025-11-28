import { OpenfortError, type OpenfortErrorType } from '@openfort/openfort-js'
import { signMessage, switchChain } from '@wagmi/core'
import { AxiosError } from 'axios'
import { useCallback } from 'react'
import { useAccount, useChainId, useConfig, usePublicClient } from 'wagmi'
import { useOpenfortCore } from '../../openfort/useOpenfort'
import { createSIWEMessage } from '../../siwe/create-siwe-message'
import { logger } from '../../utils/logger'

// This hook assumes wagmi is already connected to a wallet
// It will use the connected wallet to sign the SIWE message and authenticate with Openfort
// If there is a user already, it will link the wallet to the user
export function useConnectWithSiwe() {
  const { client, user, updateUser } = useOpenfortCore()
  const { address, connector, chainId: accountChainId } = useAccount()
  const chainId = useChainId()
  const config = useConfig()
  const publicClient = usePublicClient()

  const connectWithSiwe = useCallback(
    async ({
      onError,
      onConnect,
      connectorType: propsConnectorType,
      walletClientType: propsWalletClientType,
    }: {
      connectorType?: string
      walletClientType?: string
      onError?: (error: string, openfortError?: OpenfortErrorType) => void
      onConnect?: () => void
    } = {}) => {
      const connectorType = propsConnectorType ?? connector?.type
      const walletClientType = propsWalletClientType ?? connector?.id

      if (!address || !connectorType || !walletClientType) {
        logger.log('No address found', { address, connectorType, walletClientType })
        onError?.('No address found')
        return
      }

      try {
        if (accountChainId !== chainId) {
          switchChain(config, {
            chainId,
          })
        }

        const { nonce } = await client.auth.initSIWE({ address })

        const SIWEMessage = createSIWEMessage(address, nonce, chainId)

        const signature = await signMessage(config, { message: SIWEMessage })

        // if has user, we link the wallet
        if (user) {
          logger.log('User found, trying to lint wallet to user')
          const authToken = await client.getAccessToken()
          if (!authToken) throw new Error('No access token found')

          logger.log('Linking wallet', { signature, message: SIWEMessage, connectorType, walletClientType, authToken })
          await client.auth.linkWallet({
            signature,
            message: SIWEMessage,
            connectorType,
            walletClientType,
            authToken,
          })
        } else {
          await client.auth.authenticateWithSIWE({
            signature,
            message: SIWEMessage,
            connectorType,
            walletClientType,
          })
        }

        await updateUser()

        onConnect?.()
      } catch (err) {
        logger.log('Failed to connect with SIWE', {
          error: err,
          status: err instanceof AxiosError ? err.request.status : 'unknown',
        })
        if (!onError) return

        let message = err instanceof Error ? err.message : err instanceof AxiosError ? err.message : String(err)

        if (message.includes('User rejected the request.')) {
          message = 'User rejected the request.'
        } else if (message.includes('Invalid signature')) {
          message = 'Invalid signature. Please try again.'
        } else if (message.includes('An error occurred when attempting to switch chain')) {
          message = `Failed to switch chain. Please switch your wallet to ${publicClient?.chain?.name ?? 'the correct network'} and try again.`
        } else {
          message = 'Failed to connect with SIWE.'
        }

        onError(message, err instanceof OpenfortError ? err.type : undefined)
      }
    },
    [client, user, updateUser, address, chainId, config, connector, accountChainId, publicClient]
  )

  return connectWithSiwe
}
