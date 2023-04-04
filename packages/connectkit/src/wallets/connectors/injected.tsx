import { WalletProps } from './../wallet';

import {
  isCoinbaseWallet,
  isInjectedConnector,
  isMetaMask,
  isMobile,
} from '../../utils';
import Logos from './../../assets/logos';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { mainnet } from 'wagmi';
import { defaultWallets } from '..';

/**
 * Some injected connectors pretend to be metamask, this helps avoid that issue.
 */
const findInjectedConnectorInfo = () => {
  const wallets = defaultWallets;
  const { name } = new InjectedConnector({
    options: {
      shimDisconnect: true,
      name: (detectedName) =>
        `Injected (${
          typeof detectedName === 'string'
            ? detectedName
            : detectedName.join(', ')
        })`,
    },
  });

  let walletList = name.split(/[(),]+/);
  walletList.shift(); // remove "Injected" from array
  walletList = walletList.map((x) => x.trim());

  const hasWalletLogo = walletList.filter((x) => {
    const a = wallets.map((wallet: any) => wallet.name).includes(x);
    if (a) return x;
    return null;
  });
  if (hasWalletLogo.length === 0) return null;

  const foundInjector = wallets.filter(
    (wallet: any) => wallet.installed && wallet.name === hasWalletLogo[0]
  )[0];

  return foundInjector;
};

export const injected = (): WalletProps => {
  const isInstalled = typeof window !== 'undefined' && Boolean(window.ethereum);
  const shouldUseWalletConnect = isMobile() && !isInstalled;
  /*
  const foundInjectedWallet = findInjectedConnectorInfo();
  if (foundInjectedWallet) return foundInjectedWallet;
*/
  return {
    id: 'injected',
    name: 'Browser Wallet',
    shortName: 'browser',
    scannable: false,
    installed: Boolean(!shouldUseWalletConnect ? isInstalled : false),
    logos: { default: <Logos.Injected /> },
  };
};
