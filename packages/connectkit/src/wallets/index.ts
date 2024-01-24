import { CreateConnectorFn } from 'wagmi';
import { injected } from '@wagmi/connectors';

import { walletConfigs } from './walletConfigs';

type TargetId = any; // wagmi doesn't export this type

export const wallets: {
  [key: string]: CreateConnectorFn;
} = Object.keys(walletConfigs).reduce((acc, key) => {
  const config = walletConfigs[key];
  if (!config?.getWalletConnectDeeplink) return acc;
  const target = key.split(',')[0].trim();
  // Warning: This is deprecated from wagmi and may not be supported in the future
  const connector = injected({ target: target as TargetId });
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
