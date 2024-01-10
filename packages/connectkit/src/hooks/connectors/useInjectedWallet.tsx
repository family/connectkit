import { useInjectedConnector } from '../useConnectors';
import useLegacyWallets from '../../wallets/useLegacyWallets';
import Logos from '../../assets/logos';
import { Connector } from 'wagmi';
import { useWallets } from '../useWallets';
import { LegacyWalletProps } from '../../wallets/wallet';

export const getInjectedNames = (connector: Connector) => {
  if (!connector) return [];

  let names = connector.name.split(/[(),]+/);
  names.shift(); // remove "Injected" from array
  names = names
    .map((x) => x.trim())
    .filter((x) => x !== '')
    .filter((x) => x !== 'Injected');
  return names;
};

export const useInjectedWallet = () => {
  const wallets = useWallets();
  const injectedWallets = useLegacyWallets();
  const connector = useInjectedConnector();

  const shouldShow = () => {
    if (!(typeof window !== 'undefined' && window?.ethereum)) return false;

    const names = getInjectedNames(connector);
    if (
      names.length === 1 &&
      (names[0] === 'MetaMask' || names[0] === 'Coinbase Wallet')
    ) {
      return false;
    }
    if (
      names.length === 2 &&
      names.includes('MetaMask') &&
      names.includes('Coinbase Wallet')
    ) {
      return false;
    }
    return true;
  };

  const getWallet = () => {
    const installedLegacyWallets = injectedWallets.filter(
      (wallet) => wallet.installed
    );

    if (installedLegacyWallets.length > 0) {
      const installedWallets = wallets.filter(
        (wallet) => wallet.id !== installedLegacyWallets[0].id
      );

      const filteredWallets = installedLegacyWallets.filter(
        (wallet) => !installedWallets.find((w) => w.name === wallet.name)
      );

      if (filteredWallets.length > 0) return filteredWallets[0];
    }
    return {
      id: 'injected',
      name: getInjectedNames(connector)?.[0] ?? 'Browser Wallet',
      shortName:
        getInjectedNames(connector)?.[0]?.replace(' Wallet', '') ?? 'Browser',
      icon: <Logos.Injected />,
    };
  };

  const wallet: LegacyWalletProps = getWallet();
  return {
    wallet,
    enabled: shouldShow() && wallet !== null,
  };
};
