import { WalletProps } from './../wallet';
import { isDawn } from '../../utils';
import Logos from './../../assets/logos';

export const dawn = (): WalletProps => {
  const isInstalled = isDawn();

  return {
    id: 'dawn',
    name: 'Dawn Wallet',
    shortName: 'Dawn',
    logos: {
      default: <Logos.Dawn />,
    },
    logoBackground: '#000000',
    scannable: false,
    installed: Boolean(isInstalled),
    downloadUrls: {
      download: 'https://testflight.apple.com/join/UHmOJnNy',
      website: 'https://www.dawnwallet.xyz/',
      ios: 'https://testflight.apple.com/join/UHmOJnNy',
    },
  };
};