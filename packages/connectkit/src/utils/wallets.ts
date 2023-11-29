declare global {
  interface Window {
    trustWallet: any;
    trustwallet: any;
  }
}

export const isWalletInstalled = (name: string) => {
  if (typeof window === 'undefined') return false;
  const { ethereum } = window;
  return !!(
    ethereum?.[`is${name}`] ||
    (ethereum?.providers &&
      ethereum?.providers.find((provider) => provider?.[`is${name}`]))
  );
};

export const isMetaMask = () => isWalletInstalled('MetaMask');
export const isCoinbaseWallet = () => isWalletInstalled('CoinbaseWallet');
export const isFamily = () => isWalletInstalled('Family');
export const isBrave = () => isWalletInstalled('BraveWallet');
export const isTokenary = () => isWalletInstalled('Tokenary');
export const isDawn = () => isWalletInstalled('Dawn');
export const isFrame = () => isWalletInstalled('Frame');
export const isPhantom = () => isWalletInstalled('Phantom');
export const isInfinityWallet = () => isWalletInstalled('InfinityWallet');
export const isRabby = () => isWalletInstalled('Rabby');
export const isFrontier = () => isWalletInstalled('Frontier');
export const isTrust = () => {
  if (typeof window === 'undefined') return false;
  return (
    isWalletInstalled('Trust') ||
    window?.trustWallet?.isTrust ||
    window?.trustwallet?.isTrust
  );
};
export const isTokenPocket = () => isWalletInstalled('TokenPocket');
export const isTalisman = () => isWalletInstalled('Talisman');
export const isFordefi = () => isWalletInstalled('Fordefi');
export const isRainbow = () => isWalletInstalled('Rainbow');
export const isZerion = () => isWalletInstalled('Zerion');
