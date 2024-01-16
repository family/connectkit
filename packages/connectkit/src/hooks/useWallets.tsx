import { Connector } from 'wagmi';

import { useConnectors } from './useConnectors';
import { walletConfigs, WalletConfigProps } from '../constants/walletConfigs';

type WalletProps = {
  id: string;
  connector: Connector;
  isInstalled?: boolean;
} & WalletConfigProps;

export const useWallet = (id: string, name?: string): WalletProps | null => {
  const wallets = useWallets();
  const wallet = wallets.find(
    (c) => c.id === id && (id === 'injected' ? c.name === name : true)
  );
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

    if (walletId) {
      const wallet = walletConfigs[walletId];
      return {
        id: walletId,
        connector,
        ...wallet,
      };
    }

    // use MIDP wallet
    return {
      id: connector.id,
      rdns: connector.id,
      name: connector.name,
      icon: <img src={connector.icon} alt={connector.name} />,
      connector,
      isInstalled: true,
    };
  });

  return (
    wallets
      // find and remove duplicates by id and favor ones with isInstalled
      .filter(
        (wallet, index, self) =>
          index ===
          self.findIndex(
            (w) => w.id === wallet.id && w.isInstalled === wallet.isInstalled
          )
      )
      // order by isInstalled and then by rdns
      .sort((a, b) => {
        if (a.isInstalled && !b.isInstalled) return -1;
        if (!a.isInstalled && b.isInstalled) return 1;
        if (a.rdns && b.rdns) return a.rdns.localeCompare(b.rdns);
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
