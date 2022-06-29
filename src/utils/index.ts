import { detect } from 'detect-browser';
import supportedConnectors from '../constants/supportedConnectors';

const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

const truncateEthAddress = (address?: string) => {
  if (!address) return '';
  const match = address.match(truncateRegex);
  if (!match) return address;
  return `${match[1]}••••${match[2]}`;
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

  const isTokenary = Boolean(ethereum.isTokenary);
  if (isTokenary) return false;

  return true;
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

export {
  truncateEthAddress,
  isMobile,
  isAndroid,
  detectBrowser,
  detectOS,
  getWalletDownloadUri,
  isMetaMask,
  isCoinbaseWallet,
};
