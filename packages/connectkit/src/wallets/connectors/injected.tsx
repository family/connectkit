import { LegacyWalletProps } from './../wallet';

import { isMobile } from '../../utils';
import Logos from './../../assets/logos';

export const injected = (): LegacyWalletProps => {
  const isInstalled = typeof window !== 'undefined' && Boolean(window.ethereum);
  const shouldUseWalletConnect = isMobile() && !isInstalled;

  return {
    id: 'injected',
    name: 'Browser Wallet',
    shortName: 'browser',
    scannable: false,
    icon: <Logos.Injected />,
    installed: Boolean(!shouldUseWalletConnect ? isInstalled : false),
  };
};
