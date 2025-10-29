import type { BuyProviderId, SendTokenOption } from '../../Openfort/types'

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
  tokenAmount: number | null
  totalFiatAmount: number | null
  feeFiatAmount: number | null
  rate: number | null
  raw?: unknown
  error?: string
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

export const createEmptyQuote = (provider: ProviderDefinition): ProviderQuote => ({
  provider,
  tokenAmount: null,
  totalFiatAmount: null,
  feeFiatAmount: null,
  rate: null,
})

export const createUnsupportedTokenQuote = (provider: ProviderDefinition, token: SendTokenOption): ProviderQuote => ({
  ...createEmptyQuote(provider),
  error: `${provider.name} does not support ${token.symbol ?? 'this token'}`,
})
