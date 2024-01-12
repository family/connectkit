import { WalletProps } from '../wallet';
import Logos from '../../assets/logos';
import { isBloom } from '../../utils/wallets';

export const bloom = (): WalletProps => {
  const isInstalled = isBloom();
  return {
    id: 'bloom',
    name: 'Bloom Wallet',
    logos: {
      default: <Logos.Bloom />,
    },
    shortName: 'Bloom',
    logoBackground: '#FFFFFF',
    scannable: false,
    installed: isInstalled,
    downloadUrls: {
      download: 'https://bloomwallet.io/',
      website: 'https://bloomwallet.io/',
    },
    createUri: (uri: string) => {
      return `bloom://dapps/connect/wc?uri=${encodeURIComponent(uri)}`;
    },
  };
};
