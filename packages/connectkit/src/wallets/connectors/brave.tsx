import { WalletProps } from './../wallet';

import Logos from './../../assets/logos';

export const brave = (): WalletProps => {
  const isInstalled =
    typeof window !== 'undefined' && window.ethereum?.isBraveWallet === true;

  return {
    id: 'brave',
    name: 'Brave Wallet',
    shortName: 'Brave',
    icon: <Logos.Brave />,
    scannable: false,
    downloadUrls: {},
    installed: isInstalled,
    createUri: (uri: string) => uri,
  };
};
