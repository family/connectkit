import { WalletProps } from '../wallet';

import Logos from '../../assets/logos';

import { isPhantom } from '../../utils/wallets';

export const xdefi = (): WalletProps => {
  const isInstalled = isXDEFI();
  return {
    id: 'xdefi',
    name: 'XDEFI',
    shortName: 'XDEFI',
    scannable: false,
    logos: {
      default: <Logos.XDEFI background />,
      transparent: <Logos.XDEFI />,
    },
    installed: Boolean(isInstalled),
  };
};
