import { LegacyWalletProps } from './../wallet';

import Logos from './../../assets/logos';

import { isDawn } from '../../utils/wallets';

export const dawn = (): LegacyWalletProps => {
  const isInstalled = isDawn();

  return {
    id: 'dawn',
    name: 'Dawn Wallet',
    shortName: 'Dawn',
    icon: <Logos.Dawn />,
    scannable: false,
    installed: Boolean(isInstalled),
    downloadUrls: {
      download:
        'https://apps.apple.com/us/app/dawn-ethereum-wallet/id1673143782',
      website: 'https://www.dawnwallet.xyz/',
      ios: 'https://apps.apple.com/us/app/dawn-ethereum-wallet/id1673143782',
    },
  };
};
