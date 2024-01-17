import { Connector } from 'wagmi';
import { createMipd } from '../utils/mipd';

import { useContext } from '../components/ConnectKit';
import useLocales from './useLocales';

import { useConnectors, useInjectedConnector } from './useConnectors';
import { isWalletConnectConnector } from '../utils';
import { getWallets } from '../wallets';
import { getInjectedNames } from './connectors/useInjectedWallet';
import { walletConfigs, WalletConfigProps } from '../constants/walletConfigs';

const mipd = createMipd();

type WalletProps = {
  id: string;
  connector: Connector<any, any>;
  isInstalled?: boolean;
  createUri?: (uri: string) => string;
} & WalletConfigProps;

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

const compareWallets = (wallet_a: WalletProps, wallet_b: WalletProps) => {
  // remove " wallet" from name
  const a = {
    name: wallet_a.name?.toLowerCase().replace(' wallet', '').split(', ')[0], // split for multiple legacy injected wallets
    shortName: wallet_a.shortName?.toLowerCase().replace(' wallet', ''),
  };
  const b = {
    name: wallet_b.name?.toLowerCase().replace(' wallet', '').split(', ')[0], // split for multiple legacy injected wallets
    shortName: wallet_b.shortName?.toLowerCase().replace(' wallet', ''),
  };

  return a.name === b.name || a.name === b.shortName || a.shortName === b.name;
};

export const useWallets = (): WalletProps[] => {
  const connectors = useConnectors();
  const locales = useLocales();
  const context = useContext();

  const injectedConnector = useInjectedConnector();

  const wallets = connectors.map((c): WalletProps => {
    if (c.id === 'injected') {
      const mipdConnector = mipd?.findConnectorByUUID(c.name);

      if (mipdConnector) {
        return {
          id: mipdConnector.uuid,
          rdns: mipdConnector.rdns,
          name: mipdConnector.name,
          icon: <img src={mipdConnector.icon} alt={mipdConnector.name} />,
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
          icon: wallet.icon,
          connector: c,
          isInstalled: wallet.installed,
          createUri: wallet?.createUri,
        };
      }

      return {
        id: wallet.id,
        name: wallet.name,
        icon: wallet.icon,
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
  });

  // Remove duplicate wallets, prefering wallets with rdns
  const filtered: WalletProps[] = [];

  wallets.forEach((wallet, i) => {
    // if already in filtered, skip
    if (filtered.find((w) => w.id === wallet.id)) return;
    // if wallet name is empty, skip
    if (wallet.name === '') return;

    // find duplicates
    const duplicates = wallets.filter(
      (wallet_b, j) => i !== j && compareWallets(wallet, wallet_b)
    );

    // if no duplicates, add to filtered
    if (!duplicates.length) {
      filtered.push(wallet);
    } else if (wallet.rdns) {
      filtered.push(wallet);
    } else if (duplicates.filter((d) => d.rdns).length === 0) {
      filtered.push(wallet);
    } else {
      // do nothing
    }
  });

  return filtered.map((w: WalletProps) => {
    // MIPD overrides
    if (w.rdns) {
      const override = Object.values(walletConfigs).find(
        ({ rdns }) => rdns === w.rdns
      );
      if (override) {
        w = { ...w, ...override };
      }
    } else {
      const override = walletConfigs[w.id];
      if (override) {
        if (w.id === 'injected') {
          w = { ...override, ...w }; // Injected connector more important
        } else {
          w = { ...w, ...override };
        }
      }
    }

    // WalletConnect overrides
    if (isWalletConnectConnector(w.connector.id)) {
      w.name = context.options?.walletConnectName ?? locales.otherWallets;
    }

    return w;
  });
};
