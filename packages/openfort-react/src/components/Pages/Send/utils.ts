import { formatUnits } from 'viem'
import type { SendTokenOption } from '../../Openfort/types'

export const sanitizeAmountInput = (value: string) => value.replace(/,/g, '.')

export const sanitiseForParsing = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return null
  if (trimmed === '.') return null

  let normalised = trimmed
  if (normalised.startsWith('.')) normalised = `0${normalised}`
  if (normalised.endsWith('.')) normalised = normalised.slice(0, -1)
  if (!normalised) return null
  return normalised
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

export const isSameToken = (a: SendTokenOption, b: SendTokenOption) => {
  if (a.type !== b.type) return false
  if (a.type === 'native') return true
  // At this point, a.type === 'erc20' and b.type === 'erc20'
  if (a.type === 'erc20' && b.type === 'erc20') {
    return a.address.toLowerCase() === b.address.toLowerCase()
  }
  return false
}
