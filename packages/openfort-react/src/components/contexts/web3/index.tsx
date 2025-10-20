/**
 * Provides reusable Web3 state and helpers to descendant components.
 *
 * @example
 * ```tsx
 * <Web3ContextProvider>
 *   <WalletSelector />
 * </Web3ContextProvider>
 * ```
 */

import { createContext, useContext } from 'react'

import type { Address, Chain } from 'viem'
import { useAccount } from 'wagmi'
import { useWalletConnectUri } from '../../../hooks/connectors/useWalletConnectUri'
import { useChainIsSupported } from '../../../hooks/useChainIsSupported'
import { useChains } from '../../../hooks/useChains'

type Web3Context = {
  connect: {
    getUri: (id?: string) => string
  }
  dapp: {
    chains: Chain[]
  }
  account?: {
    chain: Chain
    chainIsSupported: boolean
    address: Address
  }
}

const Web3Context = createContext({
  connect: {
    getUri: () => '',
  },
  dapp: {
    chains: [],
  },
  account: undefined,
} as Web3Context)

export const Web3ContextProvider = ({ enabled, children }: { enabled?: boolean; children: React.ReactNode }) => {
  const { uri: walletConnectUri } = useWalletConnectUri({
    enabled,
  })

  const { address: currentAddress, chain } = useAccount()
  const chainIsSupported = useChainIsSupported(chain?.id)
  const chains = useChains()

  const value = {
    connect: {
      getUri: (id?: string) => {
        return walletConnectUri
      },
    },
    dapp: {
      chains,
    },
    account: currentAddress
      ? {
          chain,
          chainIsSupported,
          address: currentAddress,
        }
      : undefined,
  } as Web3Context

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

/**
 * React hook to access the {@link Web3Context} values.
 *
 * @returns Shared Web3 utilities exposed by the provider.
 *
 * @example
 * ```ts
 * const { account } = useWeb3();
 * ```
 */
export const useWeb3 = () => useContext(Web3Context)
