declare global {
  interface Window {
    trustWallet: any
    trustwallet: any
  }
}

const isWalletInstalled = (name: string) => {
  if (typeof window === 'undefined') return false
  const { ethereum } = window
  return !!(ethereum?.[`is${name}`] || ethereum?.providers?.find((provider) => provider?.[`is${name}`]))
}

const _isMetaMask = () => isWalletInstalled('MetaMask')
const _isCoinbaseWallet = () => isWalletInstalled('CoinbaseWallet')
export const isFamily = () => isWalletInstalled('Family')
const _isBrave = () => isWalletInstalled('BraveWallet')
const _isTokenary = () => isWalletInstalled('Tokenary')
const _isDawn = () => isWalletInstalled('Dawn')
const _isFrame = () => isWalletInstalled('Frame')
export const isPhantom = () => isWalletInstalled('Phantom')
const _isInfinityWallet = () => isWalletInstalled('InfinityWallet')
const _isRabby = () => isWalletInstalled('Rabby')
export const isArgent = () => isWalletInstalled('Argent')
const _isFrontier = () => isWalletInstalled('Frontier')
const _isTrust = () => {
  if (typeof window === 'undefined') return false
  return isWalletInstalled('Trust') || window?.trustWallet?.isTrust || window?.trustwallet?.isTrust
}
const _isTokenPocket = () => isWalletInstalled('TokenPocket')
const _isTalisman = () => isWalletInstalled('Talisman')
const _isFordefi = () => isWalletInstalled('Fordefi')
const _isRainbow = () => isWalletInstalled('Rainbow')
const _isZerion = () => isWalletInstalled('Zerion')
export const isSafe = () => isWalletInstalled('Safe')
