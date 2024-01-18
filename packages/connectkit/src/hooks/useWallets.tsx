import { Connector } from 'wagmi';

import { useConnectors } from './useConnectors';
import { walletConfigs, WalletConfigProps } from '../constants/walletConfigs';

export type WalletProps = {
  id: string;
  connector: Connector;
  isInstalled?: boolean;
} & WalletConfigProps;

export const useWallet = (id: string): WalletProps | null => {
  const wallets = useWallets();
  const wallet = wallets.find((c) => c.id === id);
  if (!wallet) return null;
  return wallet;
};
export const useWallets = (): WalletProps[] => {
  const connectors = useConnectors();

  const wallets = connectors.map((connector): WalletProps => {
    // use overrides
    const walletId = Object.keys(walletConfigs).find(
      (id) => id === connector.id
    );

    const c = {
      id: connector.id,
      name: connector.type ?? connector.name,
      icon: (
        <img
          src={connector.icon}
          alt={connector.name}
          width={'100%'}
          height={'100%'}
        />
      ),
      connector,
      isInstalled: connector.type === 'injected',
    };

    if (walletId) {
      const wallet = walletConfigs[walletId];
      return {
        ...c,
        ...wallet,
      };
    }

    return c;
  });

  return (
    wallets
      // remove wallet with id coinbaseWalletSDK if wallet with id 'com.coinbase.wallet' exists
      .filter(
        (wallet, index, self) =>
          !(
            wallet.id === 'coinbaseWalletSDK' &&
            self.find((w) => w.id === 'com.coinbase.wallet')
          )
      )
      // remove wallet with id io.metamask if wallet with id 'metaMask' exists
      .filter(
        (wallet, index, self) =>
          !(
            wallet.id === 'metaMask' && self.find((w) => w.id === 'io.metamask')
          )
      )
      // order by isInstalled
      .sort((a, b) => {
        if (a.isInstalled && !b.isInstalled) return -1;
        if (!a.isInstalled && b.isInstalled) return 1;
        return 0;
      })
      // move walletConnect to the end
      .sort((a, b) => {
        if (a.id === 'walletConnect') return 1;
        if (b.id === 'walletConnect') return -1;
        return 0;
      })
  );
};
