import { WalletProps } from '../wallet';

import { isFordefi } from '../../utils';
import Logos from '../../assets/logos';

export const fordefi = (): WalletProps => {
  const isInstalled = isFordefi();

  return {
    id: 'fordefi',
    name: 'Fordefi',
    logos: {
      default: <Logos.Fordefi />
    },
    logoBackground: '#ffffff',
    scannable: false,
    downloadUrls: {},
    installed: isInstalled,
  };
};