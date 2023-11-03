import { WalletProps } from './../wallet';

import Logos from './../../assets/logos';
import { isTokenary } from '../../utils/wallets';

export const tokenary = (): WalletProps => {
  const isInstalled = isTokenary();

  return {
    id: 'tokenary',
    name: 'tokenary',
    logos: {
      default: <Logos.Tokenary />,
    },
    logoBackground: '#ffffff',
    scannable: false,
    downloadUrls: {
      download: 'https://tokenary.io/get',
      ios: 'https://tokenary.io/get',
      website: 'https://tokenary.io/',
    },
    installed: isInstalled,
  };
};
