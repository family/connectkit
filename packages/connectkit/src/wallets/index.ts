import * as wallets from './exports';
import { WalletProps } from './wallet';

export const defaultWallets: WalletProps[] = [
  wallets.injected(),
  wallets.metaMask(),
  wallets.coinbaseWallet(),
  wallets.walletConnect(),
  wallets.argent(),
  wallets.brave(),

  wallets.family(),
  wallets.frontier(),
  wallets.imToken(),
  wallets.rainbow(),
  wallets.ledger(),
  wallets.onto(),
  wallets.safe(),
  wallets.slope(),
  wallets.steak(),
  wallets.trust(),
  wallets.unstoppable(),
  wallets.zerion(),
]; //.sort((a, b) => a.id.localeCompare(b.id));
