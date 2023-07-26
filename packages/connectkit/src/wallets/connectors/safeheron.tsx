import { WalletProps } from '../wallet';

import { isSafeheron } from '../../utils';
import Logos from '../../assets/logos';

export const safeheron = (): WalletProps => {
  const isInstalled = isSafeheron();

  return {
    id: 'safeheron',
    name: 'Safeheron',
    logos: {
      default: <Logos.Safeheron />,
    },
    logoBackground: '#ffffff',
    scannable: false,
    downloadUrls: {
      website: 'https://safeheron.com/',
      chrome:
        'https://chrome.google.com/webstore/detail/safeheron/aiaghdjafpiofpainifbgfgjfpclngoh',
    },
    installed: isInstalled,
  };
};
