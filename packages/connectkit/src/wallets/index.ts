import { CreateConnectorFn } from 'wagmi';
import { injected } from '@wagmi/connectors';

import { walletConfigs } from './walletConfigs';

type WalletIds = Extract<keyof typeof walletConfigs, string>;

export const wallets: {
  [key: WalletIds]: CreateConnectorFn;
} = Object.keys(walletConfigs).reduce((acc, key) => {
  const config = walletConfigs[key];
  if (!config?.getWalletConnectDeeplink) return acc;
  const target = key.split(',')[0].trim();
  const connector = injected({
    target: {
      id: target,
      name: config.name ?? config.shortName ?? key,
      provider: (w) => w?.ethereum,
    },
  });
  const name = (config.name ?? config.shortName ?? key)
    .toLowerCase()
    // capitalize first letter
    .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase())
    // remove spaces
    .replace(/\s/g, '')
    // lowercase first letter
    .replace(/(?:^|\s)\S/g, (a) => a.toLowerCase());

  acc[name] = connector;
  return acc;
}, {});
