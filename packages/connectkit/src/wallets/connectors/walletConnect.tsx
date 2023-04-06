import { WalletProps } from './../wallet';

import Logos from './../../assets/logos';

export const walletConnect = (): WalletProps => {
  return {
    id: 'walletConnect',
    name: `WalletConnect`,
    shortName: `WalletConnect`,
    logos: {
      default: <Logos.WalletConnect background={true} />,
      mobile: <Logos.WalletConnect background={true} />,
      transparent: <Logos.WalletConnect background={true} />,
      connectorButton: <Logos.WalletConnect background={true} />,
      qrCode: <Logos.WalletConnect background={true} />,
    },
    logoBackground: 'var(--ck-brand-walletConnect)',
    scannable: true,
    createUri: (uri: string) => uri,
  };
};
