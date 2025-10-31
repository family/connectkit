import type { BuyProviderId } from '../../Openfort/types'

type ProviderDefinition = {
  id: BuyProviderId
  name: string
  feeBps: number
  highlight?: 'best' | 'fast'
  url?: string
}

type ProviderQuote = {
  provider: ProviderDefinition
  netAmount: number | null
  feeAmount: number | null
  onrampUrl?: string
}

const PROVIDERS: ProviderDefinition[] = [
  {
    id: 'coinbase',
    name: 'Coinbase',
    feeBps: 250,
    highlight: 'best',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    feeBps: 405,
    highlight: 'fast',
  },
]

export const getProviders = () => PROVIDERS

/**
 * Get provider quotes - for now returns mock data until real quote is fetched
 */
export const getProviderQuotes = (amount: number | null): ProviderQuote[] => {
  return PROVIDERS.map((provider) => {
    if (amount === null || Number.isNaN(amount) || amount <= 0) {
      return {
        provider,
        netAmount: null,
        feeAmount: null,
      }
    }

    const feeAmount = +(amount * (provider.feeBps / 10_000)).toFixed(2)
    const netAmount = Math.max(amount - feeAmount, 0)

    return {
      provider,
      netAmount,
      feeAmount,
    }
  })
}
