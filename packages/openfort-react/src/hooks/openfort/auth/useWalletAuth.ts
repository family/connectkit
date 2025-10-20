import { useCallback, useEffect, useState } from 'react'
import { type Connector, useDisconnect } from 'wagmi'
import { useOpenfort } from '../../../components/Openfort/useOpenfort'
import { useOpenfortCore } from '../../../openfort/useOpenfort'
import { OpenfortError, OpenfortErrorType, type OpenfortHookOptions } from '../../../types'
import { logger } from '../../../utils/logger'
import { useWallets } from '../../../wallets/useWallets'
import { useConnect } from '../../useConnect'
import { onError, onSuccess } from '../hookConsistency'
import { useConnectWithSiwe } from '../useConnectWithSiwe'
import { type BaseFlowState, mapStatus } from './status'

type ConnectWalletOptions = {
  connector: Connector | string
} // onConnect is handled by the hookOptions because useConnect needs to finish the connection process

export const useWalletAuth = (hookOptions: OpenfortHookOptions = {}) => {
  const { updateUser } = useOpenfortCore()
  const { log } = useOpenfort()
  const siwe = useConnectWithSiwe()
  const availableWallets = useWallets() // TODO: Use this to get the wallet client type
  const { disconnect } = useDisconnect()
  const [walletConnectingTo, setWalletConnectingTo] = useState<string | null>(null)
  const [shouldConnectWithSiwe, setShouldConnectWithSiwe] = useState(false)

  const [status, setStatus] = useState<BaseFlowState>({
    status: 'idle',
  })

  const handleError = useCallback(
    (error: OpenfortError) => {
      setWalletConnectingTo(null)
      setStatus({
        status: 'error',
        error,
      })
      return onError({
        error,
        options: hookOptions,
      })
    },
    [hookOptions]
  )

  const { connectAsync } = useConnect({
    mutation: {
      onError: (e) => {
        const error = new OpenfortError('Failed to connect with wallet', OpenfortErrorType.AUTHENTICATION_ERROR, {
          error: e,
        })
        handleError(error)
      },
      onSuccess: () => {
        setShouldConnectWithSiwe(true)
      },
    },
  })

  useEffect(() => {
    // Ensure it has been connected with a wallet before connecting with SIWE
    if (!shouldConnectWithSiwe) return

    setShouldConnectWithSiwe(false)

    siwe({
      onError: (e) => {
        log('Error connecting with SIWE', e)
        disconnect()
        const error = new OpenfortError('Failed to connect with siwe', OpenfortErrorType.AUTHENTICATION_ERROR, {
          error: e,
        })
        handleError(error)
      },
      onConnect: () => {
        log('Successfully connected with SIWE')
        setStatus({
          status: 'success',
        })
        updateUser()
        onSuccess({
          hookOptions,
          data: {},
        })
      },
    })
  }, [shouldConnectWithSiwe, siwe, updateUser, log])

  // const generateSiweMessage = useCallback(
  //   async (args) => {
  //     try {
  //       // setStatus({ status: 'generating-message' });

  //       // Get wallet address from the external wallet
  //       const walletAddress = typeof args.wallet === 'string' ? args.wallet : args.wallet.address;

  //       const result = await client.auth.initSIWE({
  //         address: walletAddress,
  //       });

  //       // Build the SIWE message
  //       const siweMessage = `${args.from.domain} wants you to sign in with your Ethereum account:\n${walletAddress}\n\nSign in to ${args.from.domain}\n\nURI: ${args.from.uri}\nVersion: 1\nChain ID: 1\nNonce: ${result.nonce}\nIssued At: ${new Date().toISOString()}`;

  //       setStatus({
  //         status: 'awaiting-input',
  //         type: 'siwe',
  //       });

  //       return siweMessage;
  //     } catch (error) {
  //       const errorObj = error instanceof Error ? error : new Error('Failed to generate SIWE message');
  //       setStatus({
  //         type: 'siwe',
  //         status: 'error',
  //         error: errorObj
  //       });
  //       throw errorObj;
  //     }
  //   },
  //   [client, setStatus]
  // );

  // const initSiwe = useCallback(
  //   async (opts: {
  //     signature: string;
  //     message?: string;
  //   }): Promise<OpenfortUser> => {
  //     try {
  //       setStatus({
  //         status: 'loading',
  //         type: 'siwe'
  //       });

  //       const message = opts.message || '';

  //       if (!message) {
  //         throw new Error('SIWE message is required. Call generateSiweMessage first.');
  //       }

  //       const result = await client.auth.authenticateWithSIWE({
  //         signature: opts.signature,
  //         message: message,
  //         walletClientType: 'unknown',
  //         connectorType: 'unknown'
  //       });

  //       setStatus({
  //         status: 'success',
  //         type: 'siwe',
  //       });
  //       const user = result.player;

  //       // Refresh user state in provider
  //       await updateUser(user);
  //       // callbacksRef.current?.onSuccess?.(user, false);

  //       return user;
  //     } catch (error) {
  //       const errorObj = error instanceof Error ? error : new Error('Failed to login with SIWE');
  //       setStatus({
  //         status: 'error',
  //         error: errorObj,
  //         type: 'siwe',
  //       });
  //       throw errorObj;
  //     }
  //   },
  //   [client, setStatus, updateUser]
  // );

  const connectWallet = useCallback(
    async (options: ConnectWalletOptions) => {
      setStatus({
        status: 'loading',
      })
      let connector: Connector | null = null

      if (typeof options.connector === 'string') {
        const wallet = availableWallets.find((c) => c.id === options.connector)
        if (wallet) {
          connector = wallet.connector
        }
      } else {
        connector = options.connector
      }

      if (!connector) {
        log('Connector not found', connector)
        return handleError(new OpenfortError('Connector not found', OpenfortErrorType.AUTHENTICATION_ERROR))
      }

      setWalletConnectingTo(connector.id)

      const hasDisconnected = new Promise<void>((resolve) => {
        disconnect(undefined, {
          onSuccess: () => {
            resolve()
          },
          onError: (e) => {
            logger.error('Error disconnecting', e)

            const error = new OpenfortError('Failed to disconnect', OpenfortErrorType.AUTHENTICATION_ERROR, {
              error: e,
            })
            handleError(error)

            resolve()
          },
        })
      })
      await hasDisconnected

      try {
        await connectAsync({
          connector,
        })
        log('Connected to wallet!!!', connector.id)
      } catch (error) {
        logger.error('Error connecting', error)
        handleError(new OpenfortError('Failed to connect', OpenfortErrorType.AUTHENTICATION_ERROR, { error }))
      }
    },
    [siwe, disconnect, updateUser, availableWallets, log, setStatus, hookOptions]
  )

  return {
    walletConnectingTo,
    connectWallet,
    linkWallet: connectWallet, // siwe() is in charge of linking the wallet if user is authenticated
    availableWallets,
    ...mapStatus(status),
    // generateSiweMessage,
    // initSiwe,
  }
}
