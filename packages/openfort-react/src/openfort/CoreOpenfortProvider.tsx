import { type EmbeddedAccount, EmbeddedState, type Openfort, type User } from '@openfort/openfort-js'
import { type QueryObserverResult, type RefetchOptions, useQuery, useQueryClient } from '@tanstack/react-query'
import type React from 'react'
import { createElement, type PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAccount, useChainId, useConfig, useDisconnect } from 'wagmi'
import { useOpenfort } from '../components/Openfort/useOpenfort'
import type { WalletFlowStatus } from '../hooks/openfort/useWallets'
import { useConnect } from '../hooks/useConnect'
import { useConnectCallback, type useConnectCallbackProps } from '../hooks/useConnectCallback'
import type { UserAccount } from '../openfortCustomTypes'
import { logger } from '../utils/logger'
import { handleOAuthConfigError } from '../utils/oauthErrorHandler'
import { Context } from './context'
import { createOpenfortClient, setDefaultClient } from './core'

export type ContextValue = {
  signUpGuest: () => Promise<void>
  embeddedState: EmbeddedState

  isLoading: boolean
  needsRecovery: boolean
  user: User | null
  updateUser: (user?: User) => Promise<User | null>
  linkedAccounts: UserAccount[]

  embeddedAccounts?: EmbeddedAccount[]
  isLoadingAccounts: boolean

  logout: () => void

  updateEmbeddedAccounts: (options?: RefetchOptions) => Promise<QueryObserverResult<EmbeddedAccount[], Error>>

  walletStatus: WalletFlowStatus
  setWalletStatus: (status: WalletFlowStatus) => void

  client: Openfort
}

const ConnectCallback = ({ onConnect, onDisconnect }: useConnectCallbackProps) => {
  useConnectCallback({
    onConnect,
    onDisconnect,
  })

  return null
}

type CoreOpenfortProviderProps = PropsWithChildren<
  {
    openfortConfig: ConstructorParameters<typeof Openfort>[0]
  } & useConnectCallbackProps
>

export const CoreOpenfortProvider: React.FC<CoreOpenfortProviderProps> = ({
  children,
  onConnect,
  onDisconnect,
  openfortConfig,
}) => {
  const { connectors, connect, reset } = useConnect()
  const { address } = useAccount()
  const [user, setUser] = useState<User | null>(null)
  const [linkedAccounts, setLinkedAccounts] = useState<UserAccount[]>([])
  const [walletStatus, setWalletStatus] = useState<WalletFlowStatus>({ status: 'idle' })

  const { disconnectAsync } = useDisconnect()
  const { walletConfig } = useOpenfort()
  const wagmiConfig = useConfig()
  const chainId = useChainId()

  // ---- Openfort instance ----
  const openfort = useMemo(() => {
    logger.log('Creating Openfort instance.', openfortConfig)

    if (!openfortConfig.baseConfiguration.publishableKey)
      throw Error('CoreOpenfortProvider requires a publishableKey to be set in the baseConfiguration.')

    if (
      openfortConfig.shieldConfiguration &&
      !openfortConfig.shieldConfiguration?.passkeyRpId &&
      typeof window !== 'undefined'
    ) {
      openfortConfig.shieldConfiguration = {
        passkeyRpId: window.location.hostname,
        passkeyRpName: document.title || 'Openfort app',
        ...openfortConfig.shieldConfiguration,
      }
    }

    const newClient = createOpenfortClient(openfortConfig)

    setDefaultClient(newClient)
    return newClient
  }, [])

  // ---- Embedded state ----
  const [embeddedState, setEmbeddedState] = useState<EmbeddedState>(EmbeddedState.NONE)
  const pollingRef = useRef<NodeJS.Timeout | null>(null)
  const previousEmbeddedState = useRef<EmbeddedState>(EmbeddedState.NONE)

  const pollEmbeddedState = useCallback(async () => {
    if (!openfort) return

    try {
      const state = await openfort.embeddedWallet.getEmbeddedState()
      setEmbeddedState(state)
    } catch (error) {
      logger.error('Error checking embedded state with Openfort:', error)
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [openfort])

  // Only log embedded state when it changes
  useEffect(() => {
    if (previousEmbeddedState.current !== embeddedState) {
      logger.log('Embedded state changed:', EmbeddedState[embeddedState])
      previousEmbeddedState.current = embeddedState
    }
  }, [embeddedState])

  const startPollingEmbeddedState = useCallback(() => {
    if (pollingRef.current) return
    pollingRef.current = setInterval(pollEmbeddedState, 300)
  }, [pollEmbeddedState])

  const stopPollingEmbeddedState = useCallback(() => {
    clearInterval(pollingRef.current || undefined)
    pollingRef.current = null
  }, [])

  useEffect(() => {
    if (!openfort) return

    startPollingEmbeddedState()

    return () => {
      stopPollingEmbeddedState()
    }
  }, [openfort])

  const updateUser = useCallback(
    async (user?: User, logoutOnError: boolean = false) => {
      if (!openfort) return null
      logger.log('Updating user', { user, logoutOnError })

      if (user) {
        setUser(user)
        return user
      }

      try {
        const user = await openfort.user.get()
        logger.log('Getting user')
        setLinkedAccounts(user.linkedAccounts)
        setUser(user)
        return user
      } catch (err: any) {
        logger.log('Error getting user', err)
        if (!logoutOnError) return null

        if (err?.response?.status === 404) {
          logger.log('User not found, logging out')
          logout()
        } else if (err?.response?.status === 401) {
          logger.log('User not authenticated, logging out')
          logout()
        }
        return null
      }
    },
    [openfort]
  )

  // Embedded accounts list. Will reset on logout.
  const {
    data: embeddedAccounts,
    refetch: fetchEmbeddedAccounts,
    isPending: isLoadingAccounts,
  } = useQuery({
    queryKey: ['openfortEmbeddedAccountsList'],
    queryFn: async () => {
      try {
        return await openfort.embeddedWallet.list({
          limit: 100,
        })
      } catch (error: any) {
        handleOAuthConfigError(error)
        throw error
      }
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  })

  // Update ethereum provider when chainId changes
  useEffect(() => {
    if (!openfort || !walletConfig) return

    const resolvePolicy = () => {
      const { ethereumProviderPolicyId } = walletConfig

      if (!ethereumProviderPolicyId) return undefined

      if (typeof ethereumProviderPolicyId === 'string') {
        return { policy: ethereumProviderPolicyId }
      }

      const policy = ethereumProviderPolicyId[chainId]
      if (!policy) {
        logger.log(`No policy found for chainId ${chainId}.`)
        return undefined
      }

      return { policy }
    }

    const rpcUrls = wagmiConfig.chains.reduce(
      (acc, chain) => {
        const rpcUrl = wagmiConfig.getClient({ chainId: chain.id }).transport.url
        if (rpcUrl) {
          acc[chain.id] = rpcUrl
        }
        return acc
      },
      {} as Record<number, string>
    )

    logger.log('Getting ethereum provider', { chainId, rpcUrls })

    openfort.embeddedWallet.getEthereumProvider({
      ...resolvePolicy(),
      chains: rpcUrls,
    })

    // Refresh embedded accounts to reflect any changes in the selected chain
    fetchEmbeddedAccounts()
  }, [openfort, walletConfig, chainId])

  const [isConnectedWithEmbeddedSigner, setIsConnectedWithEmbeddedSigner] = useState(false)

  useEffect(() => {
    if (!openfort) return
    // Poll embedded signer state

    switch (embeddedState) {
      case EmbeddedState.NONE:
      case EmbeddedState.CREATING_ACCOUNT:
        break
      case EmbeddedState.UNAUTHENTICATED:
        setUser(null)
        break

      case EmbeddedState.EMBEDDED_SIGNER_NOT_CONFIGURED:
        if (!user) updateUser(undefined, true)

        setIsConnectedWithEmbeddedSigner(false)
        fetchEmbeddedAccounts()

        break
      case EmbeddedState.READY:
        ;(async () => {
          for (let i = 0; i < 5; i++) {
            logger.log('Trying to update user...', i)
            try {
              const user = await updateUser(undefined, true)
              if (user) break
            } catch (err) {
              logger.error('Error updating user, retrying...', err)
            }
            await new Promise((resolve) => setTimeout(resolve, 250))
          }
        })()
        break
      default:
        throw new Error(`Unknown embedded state: ${embeddedState}`)
    }
  }, [embeddedState, openfort])

  useEffect(() => {
    // Connect to wagmi with Embedded signer
    if (address || !user) return
    if (isConnectedWithEmbeddedSigner) return

    if (embeddedState !== EmbeddedState.READY) return
    const connector = connectors.find((connector) => connector.name === 'Openfort')
    if (!connector) return

    logger.log('Connecting to wagmi with Openfort')
    setIsConnectedWithEmbeddedSigner(true)
    connect({ connector })
  }, [connectors, embeddedState, address, user])

  // ---- Auth functions ----

  const queryClient = useQueryClient()
  const logout = useCallback(async () => {
    if (!openfort) return

    setUser(null)
    setWalletStatus({ status: 'idle' })
    logger.log('Logging out...')
    await openfort.auth.logout()
    await disconnectAsync()
    queryClient.resetQueries({ queryKey: ['openfortEmbeddedAccountsList'] })
    reset()
    startPollingEmbeddedState()
  }, [openfort])

  const signUpGuest = useCallback(async () => {
    if (!openfort) return

    try {
      logger.log('Signing up as guest...')
      const res = await openfort.auth.signUpGuest()
      logger.log('Signed up as guest:', res)
    } catch (error) {
      logger.error('Error logging in as guest:', error)
    }
  }, [openfort])

  // ---- Return values ----

  const isLoading = useCallback(() => {
    switch (embeddedState) {
      case EmbeddedState.NONE:
      case EmbeddedState.CREATING_ACCOUNT:
        return true

      case EmbeddedState.UNAUTHENTICATED:
        if (user) return true // If user i<s set in unauthenticated state, it means that the embedded state is not up to date, so we should wait
        return false

      case EmbeddedState.EMBEDDED_SIGNER_NOT_CONFIGURED:
        if (!user) return true

        // If automatic recovery is enabled, we should wait for the embedded signer to be ready
        return false
      case EmbeddedState.READY:
        // We should wait for the user to be set
        if (!address || !user) return true
        else return false

      default:
        return true
    }
  }, [embeddedState, address, user])

  const needsRecovery = embeddedState === EmbeddedState.EMBEDDED_SIGNER_NOT_CONFIGURED && !address

  const value: ContextValue = {
    signUpGuest,
    embeddedState,
    logout,

    isLoading: isLoading(),
    needsRecovery,
    user,
    linkedAccounts,
    updateUser,
    updateEmbeddedAccounts: fetchEmbeddedAccounts,

    embeddedAccounts,
    isLoadingAccounts,

    walletStatus,
    setWalletStatus,

    client: openfort,
  }

  return createElement(
    Context.Provider,
    { value },
    <>
      <ConnectCallback onConnect={onConnect} onDisconnect={onDisconnect} />
      {children}
    </>
  )
}
