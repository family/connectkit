import { getWallets } from '.';
import { LegacyWalletProps } from './wallet';

import { useConnect } from 'wagmi';

function useLegacyWallets(): LegacyWalletProps[] {
  const { connectors } = useConnect();

  let legacyWallets: string[] = [];

  // If missing metamask or coinbasewallet connector from wagmi config, add them to this list
  if (!connectors.find((c) => c.id === 'metaMask'))
    legacyWallets.push('metaMask');
  if (!connectors.find((c) => c.id === 'coinbaseWallet'))
    legacyWallets.push('coinbaseWallet');

  // define the order of the wallets
  legacyWallets.push(
    'argent',
    'trust',
    'ledger',
    'infinityWallet',
    'family',
    'imToken',
    'rainbow',
    'unstoppable',
    'onto',
    'steak',
    'frontier',
    'zerion',
    'safe',
    'brave',
    //'slope',
    'frame',
    'phantom',
    'dawn',
    'rabby',
    'talisman',
    'fordefi',
    'tokenPocket'
  );

  const wallets = getWallets();
  return wallets.filter((wallet) => legacyWallets.includes(wallet.id));
}

export default useLegacyWallets;
