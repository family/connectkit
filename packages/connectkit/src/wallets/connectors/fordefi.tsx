import { LegacyWalletProps } from '../wallet';

import Logos from '../../assets/logos';

import { isFordefi } from '../../utils/wallets';

export const fordefi = (): LegacyWalletProps => {
  const isInstalled = isFordefi();

  return {
    id: 'fordefi',
    name: 'Fordefi',
    icon: <Logos.Fordefi />,
    scannable: false,
    downloadUrls: {},
    installed: isInstalled,
  };
};
