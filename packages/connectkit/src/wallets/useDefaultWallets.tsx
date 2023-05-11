import { getWallets } from './';
import { WalletProps } from './wallet';

import { useConnect } from 'wagmi';

function useDefaultWallets(): WalletProps[] | any {
  const { connectors } = useConnect();

  let defaultWallets: string[] = [];

  // If missing metamask or coinbasewallet connector from wagmi config, add them to this list
  if (!connectors.find((c) => c.id === 'metaMask'))
    defaultWallets.push('metaMask');
  if (!connectors.find((c) => c.id === 'coinbaseWallet'))
    defaultWallets.push('coinbaseWallet');

  // define the order of the wallets
  defaultWallets.push(
    'rainbow',
    'argent',
    'trust',
    'ledger',
    'imToken',
    'brave',
    'steak',
    'unstoppable',
    //'slope',
    'onto',
    'gnosisSafe',
    'frontier',
    'zerion',
    'frame',
    'dawn',
  );

  const wallets = getWallets();
  return wallets.filter((wallet) => defaultWallets.includes(wallet.id));
}

export default useDefaultWallets;
