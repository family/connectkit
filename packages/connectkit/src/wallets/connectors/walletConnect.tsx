import { WalletProps } from './../wallet';

import Logos from './../../assets/logos';

export const walletConnect = (): WalletProps => {
  return {
    id: 'walletConnect',
    name: 'Other Wallets',
    logos: {
      default: <Logos.WalletConnect />,
      mobile: <Logos.OtherWallets />,
      transparent: <Logos.WalletConnect background={false} />,
      connectorButton: <Logos.OtherWallets />,
      qrCode: <Logos.WalletConnect background={true} />,
    },
    logoBackground: 'var(--ck-brand-walletConnect)',
    scannable: true,
    createUri: (uri: string) => uri,
  };
};
