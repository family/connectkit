export const createCurrencyFormatter = (currency: string) => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  } catch {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }
}

export const getCurrencySymbol = (currency: string) => {
  try {
    const parts = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).formatToParts(0)
    return parts.find((part) => part.type === 'currency')?.value ?? '$'
  } catch {
    return '$'
  }
}

/**
 * Formats a number with dynamic decimal places between 2 and 6
 * Removes trailing zeros but ensures at least 2 decimals
 */
export const formatWithDynamicDecimals = (amount: number): string => {
  const MIN_DECIMALS = 2
  const MAX_DECIMALS = 6

  // Format with max decimals, remove trailing zeros, then ensure min decimals
  const formatted = amount.toFixed(MAX_DECIMALS)
  const withoutTrailingZeros = Number.parseFloat(formatted).toString()

  // If it has a decimal point, check if we need to pad to MIN_DECIMALS
  if (withoutTrailingZeros.includes('.')) {
    const [integer, decimal] = withoutTrailingZeros.split('.')
    if (decimal.length < MIN_DECIMALS) {
      return `${integer}.${decimal.padEnd(MIN_DECIMALS, '0')}`
    }
    return withoutTrailingZeros
  }

  // No decimal point, add MIN_DECIMALS
  return amount.toFixed(MIN_DECIMALS)
}

/**
 * Formats a token amount with appropriate decimal places
 * Handles special cases: 0 shows as "0", values less than 0.000001 show as "<0.000001"
 */
export const formatTokenAmount = (amount: number, includeSymbol?: string): string => {
  // Handle zero case
  if (amount === 0) {
    return includeSymbol ? `0 ${includeSymbol}` : '0'
  }

  // Handle very small amounts
  if (amount > 0 && amount < 0.000001) {
    return includeSymbol ? `<0.000001 ${includeSymbol}` : '<0.000001'
  }

  const formatted = formatWithDynamicDecimals(amount)
  return includeSymbol ? `${formatted} ${includeSymbol}` : formatted
}
