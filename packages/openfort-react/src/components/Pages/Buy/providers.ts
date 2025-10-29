import type { BuyProviderId } from '../../Openfort/types'

export type ProviderDefinition = {
  id: BuyProviderId
  name: string
  tagline: string
  feeBps: number
  highlight?: 'best' | 'fast'
  url?: string
}

export type ProviderQuote = {
  provider: ProviderDefinition
  netAmount: number | null
  feeAmount: number | null
}

const PROVIDERS: ProviderDefinition[] = [
  {
    id: 'moonpay',
    name: 'MoonPay',
    tagline: 'Fastest',
    feeBps: 120,
    highlight: 'fast',
    url: 'https://www.moonpay.com/buy',
  },
  {
    id: 'coinbase',
    name: 'Coinbase',
    tagline: 'Best price',
    feeBps: 80,
    highlight: 'best',
    url: 'https://www.coinbase.com/buy',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    tagline: 'Card friendly',
    feeBps: 160,
    url: 'https://stripe.com/payments/payment-links',
  },
]

export const getProviders = () => PROVIDERS

export const getProviderById = (id: BuyProviderId) => PROVIDERS.find((item) => item.id === id) ?? PROVIDERS[0]

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
