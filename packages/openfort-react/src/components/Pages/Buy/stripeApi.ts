import { SDKConfiguration } from '@openfort/openfort-js'
import type { Asset } from '../../Openfort/types'
import { getAssetSymbol } from '../Send/utils'

const getBackendUrl = (): string => {
  const sdkConfig = SDKConfiguration.getInstance()
  return sdkConfig?.backendUrl || 'https://api.openfort.io'
}

type StripeQuote = {
  provider: string
  sourceAmount: string
  sourceCurrency: string
  destinationAmount: string
  destinationCurrency: string
  destinationNetwork: string
  fees: Array<{
    amount: string
    currency: string
    type: string
  }>
  exchangeRate: string
}

type StripeOnrampResponse = {
  provider: string
  sessionId: string
  clientSecret: string
  status: string
  onrampUrl: string // crypto.link.com URL with client_secret
}

type CreateStripeSessionParams = {
  destinationCurrency: string
  destinationNetwork: string
  destinationAddress: string
  sourceAmount?: string
  sourceCurrency?: string
  redirectUrl?: string
}

// Map chain IDs to Stripe network names
const getNetworkName = (chainId: number): string => {
  const networkMap: Record<number, string> = {
    1: 'ethereum',
    8453: 'base',
    137: 'polygon',
    42161: 'arbitrum',
    10: 'optimism',
  }
  return networkMap[chainId] || 'base'
}

// Stripe supported currencies
const STRIPE_SUPPORTED_CURRENCIES = ['btc', 'eth', 'xlm', 'matic', 'pol', 'sol', 'usdc', 'avax', 'wld'] as const

// Check if a token is supported by Stripe
export const isStripeSupported = (token: Asset): boolean => {
  const symbol = getAssetSymbol(token)
  return STRIPE_SUPPORTED_CURRENCIES.includes(symbol.toLowerCase() as any)
}

// Map token symbol to Stripe currency code
const getCurrencyCode = (token: Asset): string => {
  const symbol = getAssetSymbol(token)
  const lowercaseSymbol = symbol.toLowerCase()

  // Validate that the currency is supported by Stripe
  if (!STRIPE_SUPPORTED_CURRENCIES.includes(lowercaseSymbol as any)) {
    throw new Error(
      `Unsupported currency for Stripe: ${symbol}. Supported currencies are: ${STRIPE_SUPPORTED_CURRENCIES.join(', ')}`
    )
  }

  return lowercaseSymbol
}

/**
 * Create a Stripe onramp session
 * Calls backend API to create a prefilled session with wallet addresses and amounts
 */
export const createStripeSession = async (
  params: Omit<CreateStripeSessionParams, 'destinationCurrency' | 'destinationNetwork'> & {
    token: Asset
    chainId: number
    publishableKey: string
  }
): Promise<StripeOnrampResponse> => {
  const { token, chainId, publishableKey, destinationAddress, sourceAmount, sourceCurrency, redirectUrl } = params

  if (!publishableKey) {
    throw new Error('Publishable key is required for authentication')
  }

  const destinationCurrency = getCurrencyCode(token)
  const destinationNetwork = getNetworkName(chainId)

  // Build request body for backend API
  const requestBody: CreateStripeSessionParams & { provider: string } = {
    provider: 'stripe',
    destinationCurrency,
    destinationNetwork,
    destinationAddress,
    sourceAmount,
    sourceCurrency: sourceCurrency?.toLowerCase(),
    redirectUrl,
  }

  const response = await fetch(`${getBackendUrl()}/v1/onramp/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${publishableKey}`,
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || errorData.errorMessage || 'Failed to create Stripe session')
  }

  const data: StripeOnrampResponse = await response.json()
  return data
}

type GetStripeQuoteParams = {
  sourceCurrency: string
  destinationCurrency: string
  destinationNetwork: string
  sourceAmount: string
}

/**
 * Get a quote from Stripe
 * This provides fee estimates and exchange rates
 */
const _getStripeQuote = async (
  params: Omit<GetStripeQuoteParams, 'destinationCurrency' | 'destinationNetwork'> & {
    token: Asset
    chainId: number
    publishableKey: string
  }
): Promise<StripeQuote> => {
  const { token, chainId, publishableKey, ...rest } = params

  if (!publishableKey) {
    throw new Error('Publishable key is required for authentication')
  }

  // Build request body
  const requestBody: GetStripeQuoteParams & { provider: string } = {
    provider: 'stripe',
    destinationCurrency: getCurrencyCode(token),
    destinationNetwork: getNetworkName(chainId),
    sourceCurrency: rest.sourceCurrency.toLowerCase(),
    sourceAmount: rest.sourceAmount,
  }

  const response = await fetch(`${getBackendUrl()}/v1/onramp/quotes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${publishableKey}`,
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || errorData.errorMessage || 'Failed to fetch Stripe quote')
  }

  return response.json()
}
