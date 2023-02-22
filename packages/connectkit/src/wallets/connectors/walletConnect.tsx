import {
  WalletProps,
  WalletOptions,
  getProviderUri,
  getDefaultWalletConnectConnector,
} from './../wallet';

import Logos from './../../assets/logos';

export const walletConnect = ({ chains }: WalletOptions): WalletProps => {
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
    createConnector: () => {
      const connector = getDefaultWalletConnectConnector(chains);

      return {
        connector,
        qrCode: {
          getUri: async () => await getProviderUri(connector),
        },
      };
    },
  };
};
