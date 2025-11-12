import { formatUnits } from 'viem'
import type { Asset } from '../../Openfort/types'

export const sanitizeAmountInput = (value: string) => value.replace(/,/g, '.')

export const sanitizeForParsing = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return null
  if (trimmed === '.') return null

  let normalized = trimmed
  if (normalized.startsWith('.')) normalized = `0${normalized}`
  if (normalized.endsWith('.')) normalized = normalized.slice(0, -1)
  if (!normalized) return null
  return normalized
}

export const formatBalance = (value: bigint | undefined, decimals: number) => {
  if (value === undefined) return '--'
  const formatted = formatUnits(value, decimals)
  const [integer, fraction] = formatted.split('.')
  if (!fraction) return integer

  const trimmedFraction = fraction.replace(/0+$/, '')
  if (!trimmedFraction) return integer

  return `${integer}.${trimmedFraction.slice(0, 6)}`
}

export const formatBalanceWithSymbol = (value: bigint | undefined, decimals: number, symbol: string) => {
  const balance = formatBalance(value, decimals)
  return balance === '--' ? '--' : `${balance} ${symbol}`
}

export const isSameToken = (a: Asset, b: Asset) => {
  if (a.type !== b.type) return false
  if (a.type === 'native') return true
  // At this point, a.type === 'erc20' and b.type === 'erc20'
  if (a.type === 'erc20' && b.type === 'erc20') {
    return a.address.toLowerCase() === b.address.toLowerCase()
  }
  return false
}

export const getAssetSymbol = (asset: Asset): string => {
  return asset.metadata?.symbol || (asset.type === 'native' ? 'ETH' : 'UNKNOWN')
}

export const getAssetDecimals = (asset: Asset): number => {
  return (asset.metadata?.decimals as number) ?? 18
}
