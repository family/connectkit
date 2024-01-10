import { LegacyWalletProps } from './../wallet';

import Logos from './../../assets/logos';

export const walletConnect = (): LegacyWalletProps => {
  return {
    id: 'walletConnect',
    name: 'Other Wallets',
    icon: <Logos.WalletConnect />,
    scannable: true,
    createUri: (uri: string) => uri,
  };
};
