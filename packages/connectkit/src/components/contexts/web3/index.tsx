/**
 * This provider is responsible for handling reusable web3 logic across the app.
 */

import React from 'react';

import { Address, Chain } from 'viem';
import { useAccount } from 'wagmi';

import { useChains } from '../../../hooks/useChains';
import { useWalletConnectUri } from '../../../hooks/connectors/useWalletConnectUri';
import { useCoinbaseWalletUri } from '../../../hooks/connectors/useCoinbaseWalletUri';
import { isCoinbaseWalletConnector } from '../../../utils';
import useIsMobile from '../../../hooks/useIsMobile';
import { useChainIsSupported } from '../../../hooks/useChainIsSupported';

type Web3Context = {
  connect: {
    getUri: (id?: string) => string;
  };
  dapp: {
    chains: Chain[];
  };
  account?: {
    chain: Chain;
    chainIsSupported: boolean;
    address: Address;
  };
};

const Web3Context = React.createContext({
  connect: {
    getUri: () => '',
  },
  dapp: {
    chains: [],
  },
  account: undefined,
} as Web3Context);

export const Web3ContextProvider = ({
  enabled,
  children,
}: {
  enabled?: boolean;
  children: React.ReactNode;
}) => {
  const isMobile = useIsMobile();

  const { uri: walletConnectUri } = useWalletConnectUri({
    enabled,
  });
  const { uri: coinbaseWalletUri } = useCoinbaseWalletUri({
    enabled: enabled && !isMobile,
  });

  const { address: currentAddress, chain } = useAccount();
  const chainIsSupported = useChainIsSupported(chain?.id);
  const chains = useChains();

  const value = {
    connect: {
      getUri: (id?: string) => {
        if (isCoinbaseWalletConnector(id)) return coinbaseWalletUri;
        return walletConnectUri;
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
  } as Web3Context;

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = () => React.useContext(Web3Context);
