import { useInjectedConnector } from '../useConnectors';
import useLegacyWallets from '../../wallets/useLegacyWallets';
import Logos from '../../assets/logos';
import { Connector } from 'wagmi';
import { useWallets } from '../useWallets';

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
    const installedWalletNames = wallets.map((wallet) => wallet.name);
    const installedWallets = injectedWallets.filter(
      (wallet: any) =>
        wallet.installed && !installedWalletNames.includes(wallet.name)
    );
    if (installedWallets.length > 0) {
      return installedWallets[0];
    } else {
      return {
        id: 'injected',
        name: getInjectedNames(connector)?.[0] ?? 'Browser Wallet',
        shortName:
          getInjectedNames(connector)?.[0]?.replace(' Wallet', '') ?? 'Browser',
        icon: <Logos.Injected />,
      };
    }
  };

  const wallet = getWallet();
  return {
    wallet,
    enabled: shouldShow() && wallet !== null,
  };
};
