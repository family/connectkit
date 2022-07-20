import { getWallets } from '.';
import { WalletProps } from './wallet';

import { useConnect } from 'wagmi';

function useDefaultWallets(): WalletProps[] | any {
  const { connectors } = useConnect();

  // TODO: Find a better way to get configuration chains
  const chains = connectors[0].chains;

  let defaultWallets: string[] = [];

  // If missing metamask or coinbasewallet connector from wagmi config, add them to this list
  if (!connectors.find((c) => c.id === 'metaMask'))
    defaultWallets.push('metaMask');
  if (!connectors.find((c) => c.id === 'coinbaseWallet'))
    defaultWallets.push('coinbaseWallet');

  // Add default wallets
  defaultWallets.push(
    'rainbow',
    'argent',
    'trust',
    'ledger',
    'imToken',
    'brave',
    'steak',
    'unstoppable',
    'slope',
    'onto',
    'gnosisSafe',
    'frontier'
  );

  const wallets = getWallets({ chains });
  return wallets.filter((wallet) => defaultWallets.includes(wallet.id));
}

export default useDefaultWallets;
