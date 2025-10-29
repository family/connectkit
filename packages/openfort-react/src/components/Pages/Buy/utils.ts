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

export const formatTokenAmount = (amount: number, decimalsHint = 6) => {
  if (!Number.isFinite(amount)) return '--'

  const abs = Math.abs(amount)
  let maximumFractionDigits = Math.min(Math.max(decimalsHint, 2), 12)

  if (abs >= 1000) {
    maximumFractionDigits = Math.min(2, maximumFractionDigits)
  } else if (abs >= 1) {
    maximumFractionDigits = Math.min(4, maximumFractionDigits)
  } else if (abs >= 0.01) {
    maximumFractionDigits = Math.min(6, Math.max(4, maximumFractionDigits))
  } else {
    maximumFractionDigits = Math.min(8, Math.max(6, maximumFractionDigits))
  }

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  })

  return formatter.format(amount)
}
