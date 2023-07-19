import { detect } from 'detect-browser';
import React from 'react';
import supportedConnectors from '../constants/supportedConnectors';

declare global {
  interface Window {
    trustWallet: any;
    trustwallet: any;
  }
}

const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

const truncateEthAddress = (address?: string, separator: string = '••••') => {
  if (!address) return '';
  const match = address.match(truncateRegex);
  if (!match) return address;
  return `${match[1]}${separator}${match[2]}`;
};

const truncateENSAddress = (ensName: string, maxLength: number) => {
  if (ensName.length > maxLength) {
    return ensName.replace('.eth', '').slice(0, maxLength) + '...';
  } else {
    return ensName;
  }
};

const nFormatter = (num: number, digits: number = 2) => {
  if (num < 10000) return num.toFixed(2);
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'm' },
    { value: 1e9, symbol: 'g' },
    { value: 1e12, symbol: 't' },
    { value: 1e15, symbol: 'p' },
    { value: 1e18, symbol: 'e' },
  ];

  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
    : '0';
};

const detectBrowser = () => {
  const browser = detect();
  return browser?.name ?? '';
};
const detectOS = () => {
  const browser = detect();
  return browser?.os ?? '';
};

const isIOS = () => {
  const os = detectOS();
  return os.toLowerCase().includes('ios');
};
const isAndroid = () => {
  const os = detectOS();
  return os.toLowerCase().includes('android');
};

const isMobile = () => {
  return isAndroid() || isIOS();
};

const getWalletDownloadUri = (connectorId: string) => {
  let url: string =
    getMobileAppUri(connectorId) ?? getBrowserAppUri(connectorId);
  return url;
};
const getMobileAppUri = (connectorId: string) => {
  const c = supportedConnectors.filter((c) => c.id === connectorId)[0];
  if (isIOS()) {
    return c.appUrls?.ios ? c.appUrls.ios : '';
  } else if (isAndroid()) {
    return c.appUrls?.android ? c.appUrls.android : '';
  }
  return '';
};
const getBrowserAppUri = (connectorId: string) => {
  const c = supportedConnectors.filter((c) => c.id === connectorId)[0];
  const browser = detectBrowser();
  switch (browser) {
    case 'firefox':
      return c.appUrls?.firefox ? c.appUrls.firefox : '';
    case 'safari':
      return c.appUrls?.safari ? c.appUrls.safari : '';
    default:
      return c.extensions?.chrome ? c.extensions?.chrome : '';
  }
};

const isFamily = () => {
  if (typeof window === 'undefined') return false;

  const { ethereum } = window;
  if (!ethereum) return false;

  const isFamily = Boolean(ethereum.isFamily);
  if (isFamily) return true;
};

const isMetaMask = () => {
  if (typeof window === 'undefined') return false;

  const { ethereum } = window;
  if (!ethereum) return false;

  const isMetaMask = Boolean(ethereum.isMetaMask);
  if (!isMetaMask) return false;

  const isBrave = Boolean(
    ethereum.isBraveWallet //&& !ethereum._events && !ethereum._state
  );
  if (isBrave) return false;

  const isDawn = Boolean(ethereum.isDawn);
  if (isDawn) return false;

  const isTokenary = Boolean(ethereum.isTokenary);
  if (isTokenary) return false;

  const isFrame = Boolean(ethereum.isFrame);
  if (isFrame) return false;

  const isRabby = Boolean(ethereum.isRabby);
  if (isRabby) return false;

  const isTokenPocket = Boolean(ethereum.isTokenPocket);
  if (isTokenPocket) return false;

  if (isPhantom()) return false;

  if (isTrust()) return false;

  return true;
};

const isDawn = () => {
  if (typeof window === 'undefined') return false;

  const { ethereum } = window;
  if (!ethereum) return false;

  const isDawn = Boolean(ethereum.isDawn);
  if (isDawn) return true;
};

const isCoinbaseWallet = () => {
  if (typeof window === 'undefined') return false;
  const { ethereum } = window;

  return !!(
    ethereum?.isCoinbaseWallet ||
    (ethereum?.providers &&
      ethereum?.providers.find((provider) => provider.isCoinbaseWallet))
  );
};

const isFrame = () => {
  if (typeof window === 'undefined') return false;
  const { ethereum } = window;

  return !!(
    ethereum?.isFrame ||
    (ethereum?.providers &&
      ethereum?.providers.find((provider) => provider.isFrame))
  );
};

const isPhantom = () => {
  if (typeof window === 'undefined') return false;
  const { phantom } = window as any;
  const isPhantom = Boolean(phantom?.ethereum?.isPhantom);
  if (isPhantom) return true;
  return false;
};

const isRabby = () => {
  if (typeof window === 'undefined') return false;
  const { ethereum } = window;

  return !!(
    ethereum?.isRabby ||
    (ethereum?.providers &&
      ethereum?.providers.find((provider) => provider.isRabby))
  );
};
const isFrontier = () => {
  if (typeof window === 'undefined') return false;
  const { ethereum } = window as any;
  const isFrontier = Boolean(ethereum?.isFrontier);
  if (isFrontier) return true;
  return false;
};

const isTrust = () => {
  if (typeof window === 'undefined') return false;
  const { ethereum } = window;

  return !!(
    ethereum?.isTrust ||
    (ethereum?.providers &&
      ethereum?.providers.find((provider) => provider.isTrust)) ||
    window.trustWallet?.isTrust ||
    window.trustwallet?.isTrust
  );
};

const isTokenPocket = () => {
  if (typeof window === 'undefined') return false;
  const { ethereum } = window;

  return Boolean(ethereum?.isTokenPocket);
};

type ReactChildArray = ReturnType<typeof React.Children.toArray>;
function flattenChildren(children: React.ReactNode): ReactChildArray {
  const childrenArray = React.Children.toArray(children);
  return childrenArray.reduce((flatChildren: ReactChildArray, child) => {
    if ((child as React.ReactElement<any>).type === React.Fragment) {
      return flatChildren.concat(
        flattenChildren((child as React.ReactElement<any>).props.children)
      );
    }
    flatChildren.push(child);
    return flatChildren;
  }, []);
}

export const isWalletConnectConnector = (connectorId?: string) =>
  connectorId === 'walletConnect' || connectorId === 'walletConnectLegacy';

export const isMetaMaskConnector = (connectorId?: string) =>
  connectorId === 'metaMask';

export const isCoinbaseWalletConnector = (connectorId?: string) =>
  connectorId === 'coinbaseWallet';

export const isLedgerConnector = (connectorId?: string) =>
  connectorId === 'ledger';

export const isSafeConnector = (connectorId?: string) => connectorId === 'safe';

export const isInjectedConnector = (connectorId?: string) =>
  connectorId === 'injected';

export {
  nFormatter,
  truncateEthAddress,
  truncateENSAddress,
  isMobile,
  isAndroid,
  detectBrowser,
  detectOS,
  getWalletDownloadUri,
  isFamily,
  isMetaMask,
  isDawn,
  isCoinbaseWallet,
  isFrame,
  isPhantom,
  isRabby,
  isTrust,
  isTokenPocket,
  isFrontier,
  flattenChildren,
};
