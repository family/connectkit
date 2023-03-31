import * as wallets from './exports';

export const getWallets = () => {
  return [
    wallets.metaMask(),
    wallets.coinbaseWallet(),
    wallets.walletConnect(),
    wallets.injected(),
    wallets.rainbow(),
    wallets.argent(),
    wallets.trust(),
    wallets.ledger(),
    wallets.imToken(),
    wallets.brave(),
    wallets.gnosisSafe(),
    wallets.unstoppable(),
    wallets.steak(),
    //wallets.slope(),
    wallets.onto(),
    wallets.frontier(),
    wallets.zerion(),
  ];
};
