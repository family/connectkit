import { WalletProps, WalletOptions } from './../wallet';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { isMobile, isDawn } from '../../utils';
import Logos from './../../assets/logos';

export const dawn = ({
  chains,
}: WalletOptions): WalletProps => {
  const isInstalled = isDawn();

  return {
    id: 'dawn',
    name: 'Dawn Wallet',
    shortName: 'Dawn',
    logos: {
      default: <Logos.Dawn />,
      mobile: <Logos.Dawn background />,
      transparent: <Logos.Dawn background={false} />,
      appIcon: <Logos.Dawn background={false} />,
      connectorButton: <Logos.Dawn background={true} />,
      qrCode: <Logos.Dawn background={true} />,
    },
    logoBackground: 'var(--ck-brand-dawn)',
    scannable: true,
    installed: Boolean(isInstalled),
    downloadUrls: {
      download: 'https://testflight.apple.com/join/UHmOJnNy',
      website: 'https://www.dawnwallet.xyz/',
      ios: 'https://testflight.apple.com/join/UHmOJnNy',
    },
    createConnector: () => {
      const connector = new InjectedConnector({
        chains,
        options: {
          shimChainChangedDisconnect: true,
          shimDisconnect: true
        },
      });

      return {
        connector
      };
    },
  };
};