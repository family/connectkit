import { WalletProps } from './../wallet';

import Logos from './../../assets/logos';

export const walletConnect = (): WalletProps => {
  return {
    id: 'walletConnect',
    name: 'Other Wallets',
    icon: <Logos.WalletConnect />,
    iconBackground: 'var(--ck-brand-walletConnect)',
    scannable: true,
    createUri: (uri: string) => uri,
  };
};
