import { WalletProps } from './../wallet';

import Logos from './../../assets/logos';

export const walletConnect = (): WalletProps => {
  return {
    id: 'walletConnect',
    name: 'Other Wallets',
    icon: <Logos.WalletConnect />,
    scannable: true,
    createUri: (uri: string) => uri,
  };
};
