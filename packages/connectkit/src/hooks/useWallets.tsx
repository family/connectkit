import { Connector } from 'wagmi';
import { createMidp } from '../utils/midp';

import { useContext } from '../components/ConnectKit';
import useLocales from './useLocales';

import { useConnectors, useInjectedConnector } from './useConnectors';
import { isWalletConnectConnector } from '../utils';
import { getWallets } from '../wallets';
import { getInjectedNames } from './connectors/useInjectedWallet';
import { walletConfigs } from '../constants/walletConfigs';

const midp = createMidp();

interface WalletProps {
  id: string;
  rdns?: string;
  name: string;
  icon: React.ReactNode;
  connector: Connector<any, any>;
  isInstalled?: boolean;
  createUri?: (uri: string) => string;
  downloadUrls?: {
    [key: string]: string;
  };
}

const getWalletConfig = ({ rdns, name }: { rdns?: string; name?: string }) => {
  const wallet = Object.values(walletConfigs).find((w) => {
    if (rdns) return w.rdns === rdns;
    if (name) return w.name === name;
    return false;
  });
  if (wallet) return wallet;
  return null;
};

export const useWallet = (id: string, name?: string): WalletProps | null => {
  const wallets = useWallets();
  const wallet = wallets.find(
    (c) => c.id === id && (id === 'injected' ? c.name === name : true)
  );
  if (!wallet) return null;
  return wallet;
};

export const useWallets = (): WalletProps[] => {
  const connectors = useConnectors();
  const locales = useLocales();
  const context = useContext();

  const injectedConnector = useInjectedConnector();

  const wallets = connectors
    .map((c) => {
      if (c.id === 'injected') {
        const midpConnector = midp?.findConnectorByUUID(c.name);

        if (midpConnector) {
          return {
            id: midpConnector.uuid,
            rdns: midpConnector.rdns,
            name: midpConnector.name,
            icon: <img src={midpConnector.icon} alt={midpConnector.name} />,
            connector: c,
            isInstalled: true,
          };
        }
      }

      const wallet = getWallets().find((w) => w.id === c.id);

      if (wallet) {
        if (wallet.id === 'injected') {
          const names = getInjectedNames(c);

          return {
            id: wallet.id,
            name: names ? names.join(', ') : injectedConnector.name,
            icon:
              wallet.logos.mobile ??
              wallet.logos.appIcon ??
              wallet.logos.connectorButton ??
              wallet.logos.default,
            connector: c,
            isInstalled: wallet.installed,
            createUri: wallet?.createUri,
          };
        }

        return {
          id: wallet.id,
          name: wallet.name,
          icon:
            wallet.logos.mobile ??
            wallet.logos.appIcon ??
            wallet.logos.connectorButton ??
            wallet.logos.default,
          connector: c,
          isInstalled: wallet.installed,
          createUri: wallet?.createUri,
        };
      }

      return {
        id: c.id,
        name: c.name,
        icon: <img src="#" alt="" />,
        connector: c,
      };
    })
    .map((w: WalletProps) => {
      // MIDP overrides
      if (w.rdns) {
        const override = Object.values(walletConfigs).find(
          ({ rdns }) => rdns === w.rdns
        );
        if (override) {
          w.name = override?.name ?? w.name;
        }
      } else {
        const override = walletConfigs[w.id];
        if (override) {
          w.downloadUrls = override.downloadUrls;
        }
      }

      // WalletConnect overrides
      if (isWalletConnectConnector(w.connector.id)) {
        w.name = context.options?.walletConnectName ?? locales.otherWallets;
      }
      return w;
    });

  // check for duplicate names (favour one where id !== 'injected')
  const filteredWallets = wallets.filter((w) => {
    if (w.rdns) return true;
    if (w.name === '') return false;

    const index = wallets.find(
      (wallet) => wallet.name === w.name && wallet.rdns
    );
    return !index;
  });
  console.log(filteredWallets);

  return filteredWallets;
};
