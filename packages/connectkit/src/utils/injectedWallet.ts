/**
 * Some injected connectors pretend to be metamask, this helps avoid that issue.
 */

import { InjectedConnector } from 'wagmi/connectors/injected';
import { defaultWallets } from './../wallets';
import { isCoinbaseWallet } from './';

export const detectInjectedConnector = () => {
  const wallets = defaultWallets;
  let detectedNames: string[] = [];

  new InjectedConnector({
    options: {
      name: (detectedName) => {
        if (typeof detectedName === 'string') detectedNames = [detectedName];
        else detectedNames = detectedName;
        return ``;
      },
    },
  });

  const connector = wallets.find(
    (w: any) => detectedNames.includes(w.name) && w.installed
  );

  return connector;
};

// Only display if an injected connector is detected
export const shouldShowInjectedConnector = () => {
  if (typeof window === 'undefined') return false;
  const { ethereum } = window;
  if (!ethereum) return false;

  const needsInjectedWalletFallback = !isMetaMask() && !isCoinbaseWallet();

  return needsInjectedWalletFallback;
};

export const isMimickingMetaMask = () => {
  if (typeof window === 'undefined') return false;
  const { ethereum } = window;
  if (!ethereum) return false;

  const mimickers = [
    ethereum.isBraveWallet,
    ethereum.isPhantom,
    ethereum.isTokenary,
  ];

  const isMimickingMetaMask = mimickers.some((mimicker) => mimicker);
  return isMimickingMetaMask;
};

const isMetaMask = () => {
  if (typeof window === 'undefined') return false;
  const { ethereum } = window;
  if (!ethereum) return false;

  const isMetaMask = ethereum.isMetaMask;
  if (!isMetaMask) return false;
  if (isMimickingMetaMask()) return false;

  return true;
};
