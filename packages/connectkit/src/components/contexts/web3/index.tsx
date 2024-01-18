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
import { useContext } from '../../ConnectKit';

type Web3Context = {
  connect: {
    getUri: (id?: string) => string;
  };
  dapp: {
    chains: Chain[];
  };
  account?: {
    chain: Chain & {
      unsupported?: boolean;
    };
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
  children,
}: {
  children: React.ReactNode;
}) => {
  const context = useContext();

  const { uri: walletConnectUri } = useWalletConnectUri({
    enabled: context.open,
  });
  const { uri: coinbaseWalletUri } = useCoinbaseWalletUri({
    enabled: context.open,
  });

  const { address: currentAddress, chain } = useAccount();
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
          chain: Boolean(chain && !chains.some((x) => x.id !== chain?.id)),
          address: currentAddress,
        }
      : undefined,
  } as Web3Context;

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = () => React.useContext(Web3Context);
