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

const isMetaMask = () => isWalletInstalled('MetaMask')
const isCoinbaseWallet = () => isWalletInstalled('CoinbaseWallet')
export const isFamily = () => isWalletInstalled('Family')
const isBrave = () => isWalletInstalled('BraveWallet')
const isTokenary = () => isWalletInstalled('Tokenary')
const isDawn = () => isWalletInstalled('Dawn')
const isFrame = () => isWalletInstalled('Frame')
export const isPhantom = () => isWalletInstalled('Phantom')
const isInfinityWallet = () => isWalletInstalled('InfinityWallet')
const isRabby = () => isWalletInstalled('Rabby')
export const isArgent = () => isWalletInstalled('Argent')
const isFrontier = () => isWalletInstalled('Frontier')
const isTrust = () => {
  if (typeof window === 'undefined') return false
  return isWalletInstalled('Trust') || window?.trustWallet?.isTrust || window?.trustwallet?.isTrust
}
const isTokenPocket = () => isWalletInstalled('TokenPocket')
const isTalisman = () => isWalletInstalled('Talisman')
const isFordefi = () => isWalletInstalled('Fordefi')
const isRainbow = () => isWalletInstalled('Rainbow')
const isZerion = () => isWalletInstalled('Zerion')
export const isSafe = () => isWalletInstalled('Safe')
