import type { BuyProviderId, SendTokenOption } from '../../Openfort/types'
import type { CoinbaseQuote } from './coinbaseApi'
import { getCoinbaseQuote } from './coinbaseApi'

export type ProviderDefinition = {
  id: BuyProviderId
  name: string
  feeBps: number
  highlight?: 'best' | 'fast'
  url?: string
}

export type ProviderQuote = {
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

export const getProviderById = (id: BuyProviderId) => PROVIDERS.find((item) => item.id === id) ?? PROVIDERS[0]

/**
 * Fetch real-time quotes from Coinbase
 * Note: To get a quote, you must provide paymentMethod, country, and subdivision (for US)
 * Without these params, you'll get a one-click onramp URL without quote details
 */
export const fetchCoinbaseQuote = async (params: {
  token: SendTokenOption
  chainId: number
  publishableKey: string
  paymentAmount?: string
  paymentCurrency?: string
  destinationAddress: string
  paymentMethod?: 'CARD' | 'ACH' | 'APPLE_PAY' | 'PAYPAL'
  country?: string
  subdivision?: string
}): Promise<CoinbaseQuote | null> => {
  try {
    const quote = await getCoinbaseQuote({
      token: params.token,
      chainId: params.chainId,
      publishableKey: params.publishableKey,
      paymentAmount: params.paymentAmount,
      paymentCurrency: params.paymentCurrency,
      paymentMethod: params.paymentMethod,
      country: params.country,
      subdivision: params.subdivision,
      destinationAddress: params.destinationAddress,
      redirectUrl: window.location.origin,
    })
    return quote
  } catch (_error) {
    return null
  }
}

/**
 * Get provider quotes - for now returns mock data until real quote is fetched
 * The real quote should be fetched separately using fetchCoinbaseQuote
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
