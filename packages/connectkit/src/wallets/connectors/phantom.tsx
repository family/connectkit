import { WalletProps } from '../wallet';

import Logos from '../../assets/logos';

import { isPhantom } from '../../utils/wallets';

export const phantom = (): WalletProps => {
  const isInstalled = isPhantom();
  return {
    id: 'phantom',
    name: 'Phantom',
    shortName: 'Phantom',
    scannable: false,
    logos: {
      default: <Logos.Phantom background />,
      transparent: <Logos.Phantom />,
    },
    installed: Boolean(isInstalled),
  };
};
