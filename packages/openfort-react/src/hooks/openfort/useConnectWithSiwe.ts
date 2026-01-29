import { OpenfortError } from '@openfort/openfort-js'
import { switchChain } from '@wagmi/core'
import { AxiosError } from 'axios'
import { useCallback } from 'react'
import { useAccount, useChainId, useConfig, usePublicClient, useSignMessage } from 'wagmi'
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
  const { signMessageAsync } = useSignMessage()

  const connectWithSiwe = useCallback(
    async ({
      onError,
      onConnect,
      connectorType: propsConnectorType,
      walletClientType: propsWalletClientType,
      link = !!user,
    }: {
      connectorType?: string
      walletClientType?: string
      onError?: (error: string, openfortError?: OpenfortError) => void
      onConnect?: () => void
      link?: boolean
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

        let nonce: string
        if (link) {
          const resp = await client.auth.initLinkSiwe({ address })
          nonce = resp.nonce
        } else {
          const resp = await client.auth.initSiwe({ address })
          nonce = resp.nonce
        }

        const SIWEMessage = createSIWEMessage(address, nonce, chainId)

        const signature = await signMessageAsync({ message: SIWEMessage })

        if (link) {
          logger.log('Linking wallet to user')
          await client.auth.linkWithSiwe({
            signature,
            message: SIWEMessage,
            connectorType,
            walletClientType,
            address,
            chainId,
          })
        } else {
          logger.log('Authenticating with SIWE')
          await client.auth.loginWithSiwe({
            signature,
            message: SIWEMessage,
            connectorType,
            walletClientType,
            address,
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

        onError(message, err instanceof OpenfortError ? err : undefined)
      }
    },
    [client, user, updateUser, address, chainId, config, connector, accountChainId, publicClient]
  )

  return connectWithSiwe
}
