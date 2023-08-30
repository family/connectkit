export const isMetaMask = () => {
  if (typeof window === 'undefined') return false;
  /*
  if (isBrave()) return false;
  if (isDawn()) return false;
  if (isTokenary()) return false;
  if (isFrame()) return false;
  if (isInfinityWallet()) return false;
  if (isRabby()) return false;
  if (isTokenPocket()) return false;
  if (isTalisman()) return false;
  if (isPhantom()) return false;
  if (isFordefi()) return false;
  if (isTrust()) return false;
  if (isRainbow()) return false;
  */
  return window?.ethereum?.isMetaMask;
};

export const isCoinbaseWallet = () => {
  if (typeof window === 'undefined') return false;
  const { ethereum } = window;

  return !!(
    ethereum?.isCoinbaseWallet ||
    (ethereum?.providers &&
      ethereum?.providers.find((provider) => provider.isCoinbaseWallet))
  );
};

export const isFamily = () => {
  if (typeof window === 'undefined') return false;
  return window?.ethereum?.isFamily;
};

export const isBrave = () => {
  if (typeof window === 'undefined') return false;
  return window?.ethereum?.isBraveWallet; //&& !ethereum._events && !ethereum._state
};

export const isTokenary = () => {
  if (typeof window === 'undefined') return false;
  return window?.ethereum?.isTokenary;
};

export const isDawn = () => {
  if (typeof window === 'undefined') return false;
  return window?.ethereum?.isDawn;
};

export const isFrame = () => {
  if (typeof window === 'undefined') return false;
  const { ethereum } = window;

  return !!(
    ethereum?.isFrame ||
    (ethereum?.providers &&
      ethereum?.providers.find((provider) => provider.isFrame))
  );
};

export const isPhantom = () => {
  if (typeof window === 'undefined') return false;
  const { phantom } = window as any;
  return phantom?.ethereum?.isPhantom;
};

export const isInfinityWallet = () => {
  if (typeof window === 'undefined') return false;
  const { ethereum } = window;
  return !!(
    ethereum?.isInfinityWallet ||
    (ethereum?.providers &&
      ethereum?.providers.find((provider) => provider.isInfinityWallet))
  );
};

export const isRabby = () => {
  if (typeof window === 'undefined') return false;
  const { ethereum } = window;
  return !!(
    ethereum?.isRabby ||
    (ethereum?.providers &&
      ethereum?.providers.find((provider) => provider.isRabby))
  );
};

export const isFrontier = () => {
  if (typeof window === 'undefined') return false;
  const { phantom } = window as any;
  return phantom?.ethereum?.isFrontier;
};

export const isTrust = () => {
  if (typeof window === 'undefined') return false;
  const { ethereum } = window;

  return !!(
    ethereum?.isTrust ||
    (ethereum?.providers &&
      ethereum?.providers.find((provider) => provider.isTrust)) ||
    window?.trustWallet?.isTrust ||
    window?.trustwallet?.isTrust
  );
};

export const isTokenPocket = () => {
  if (typeof window === 'undefined') return false;
  return window?.ethereum?.isTokenPocket;
};

export const isTalisman = () => {
  if (typeof window === 'undefined') return false;
  const { talismanEth } = window as any;
  return !!talismanEth?.isTalisman;
};

export const isFordefi = () => {
  if (typeof window === 'undefined') return false;
  return window?.ethereum?.isFordefi;
};

export const isRainbow = () => {
  if (typeof window === 'undefined') return false;
  const { ethereum } = window;
  return !!(
    ethereum?.isRainbow ||
    (ethereum?.providers &&
      ethereum?.providers.find((provider) => provider.isRainbow))
  );
};
