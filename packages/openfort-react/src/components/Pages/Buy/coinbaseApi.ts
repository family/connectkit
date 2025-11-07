import { SDKConfiguration } from '@openfort/openfort-js'
import type { SendTokenOption } from '../../Openfort/types'

const getBackendUrl = (): string => {
  const sdkConfig = SDKConfiguration.getInstance()
  return sdkConfig?.backendUrl || 'https://api.openfort.io'
}

export type CoinbaseQuoteResponse = {
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

export type CoinbaseOnrampResponse = {
  provider: string
  onrampUrl: string
}

type CreateCoinbaseSessionParams = {
  destinationCurrency: string
  destinationNetwork: string
  destinationAddress: string
  sourceAmount?: string
  sourceCurrency?: string
  paymentMethod?: 'CARD' | 'ACH' | 'APPLE_PAY' | 'PAYPAL' | 'FIAT_WALLET' | 'CRYPTO_WALLET'
  country?: string
  subdivision?: string
  redirectUrl?: string
  clientIp?: string
}

// Map chain IDs to Coinbase network names
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

// Coinbase supported currencies (more extensive than Stripe)
const COINBASE_SUPPORTED_CURRENCIES = [
  'btc',
  'eth',
  'usdc',
  'usdt',
  'matic',
  'pol', // Polygon native token (rebranded from MATIC)
  'sol',
  'avax',
  'atom',
  'dot',
  'link',
  'uni',
  'aave',
  'comp',
  'snx',
  'mkr',
  'dai',
  'wld',
  'xlm',
] as const

// Check if a token is supported by Coinbase
export const isCoinbaseSupported = (token: SendTokenOption): boolean => {
  const symbol = token.type === 'native' ? token.symbol || 'ETH' : token.symbol || 'USDC'
  return COINBASE_SUPPORTED_CURRENCIES.includes(symbol.toLowerCase() as any)
}

// Map token symbol to Coinbase currency code
const getCurrencyCode = (token: SendTokenOption): string => {
  const symbol = token.type === 'native' ? token.symbol || 'ETH' : token.symbol || 'USDC'
  const lowercaseSymbol = symbol.toLowerCase()

  // Validate that the currency is supported by Coinbase
  if (!COINBASE_SUPPORTED_CURRENCIES.includes(lowercaseSymbol as any)) {
    throw new Error(
      `Unsupported currency for Coinbase: ${symbol}. Supported currencies are: ${COINBASE_SUPPORTED_CURRENCIES.join(', ')}`
    )
  }

  return symbol
}

/**
 * Create a Coinbase onramp session
 * Supports three use cases based on provided parameters:
 * 1. Basic session: Only required params (destinationAddress, destinationCurrency, destinationNetwork)
 * 2. One-click URL: Required + sourceAmount + sourceCurrency
 * 3. One-click with quote: One-click + paymentMethod + country (+ subdivision for US)
 */
export const createCoinbaseSession = async (
  params: Omit<CreateCoinbaseSessionParams, 'destinationCurrency' | 'destinationNetwork'> & {
    token: SendTokenOption
    chainId: number
    publishableKey: string
  }
): Promise<CoinbaseOnrampResponse> => {
  const { token, chainId, publishableKey, ...rest } = params

  if (!publishableKey) {
    throw new Error('Publishable key is required for authentication')
  }

  // Build request body with only provided parameters
  const requestBody: CreateCoinbaseSessionParams & { provider: string } = {
    provider: 'coinbase',
    destinationCurrency: getCurrencyCode(token),
    destinationNetwork: getNetworkName(chainId),
    destinationAddress: rest.destinationAddress,
  }

  // Add optional parameters only if provided
  if (rest.sourceAmount) requestBody.sourceAmount = rest.sourceAmount
  if (rest.sourceCurrency) requestBody.sourceCurrency = rest.sourceCurrency
  if (rest.paymentMethod) requestBody.paymentMethod = rest.paymentMethod
  if (rest.country) requestBody.country = rest.country
  if (rest.subdivision) requestBody.subdivision = rest.subdivision
  if (rest.redirectUrl) requestBody.redirectUrl = rest.redirectUrl
  if (rest.clientIp) requestBody.clientIp = rest.clientIp

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
    throw new Error(errorData.error || errorData.errorMessage || 'Failed to create Coinbase session')
  }

  return response.json()
}

type GetCoinbaseQuoteParams = {
  sourceCurrency: string
  destinationCurrency: string
  destinationNetwork: string
  sourceAmount: string
  paymentMethod: string
  country?: string
  subdivision?: string
}

/**
 * Get a quote from Coinbase
 * This provides fee estimates and exchange rates
 */
export const getCoinbaseQuote = async (
  params: Omit<GetCoinbaseQuoteParams, 'destinationCurrency' | 'destinationNetwork'> & {
    token: SendTokenOption
    chainId: number
    publishableKey: string
  }
): Promise<CoinbaseQuoteResponse> => {
  const { token, chainId, publishableKey, ...rest } = params

  if (!publishableKey) {
    throw new Error('Publishable key is required for authentication')
  }

  // Build request body
  const requestBody: GetCoinbaseQuoteParams & { provider: string } = {
    provider: 'coinbase',
    destinationCurrency: getCurrencyCode(token),
    destinationNetwork: getNetworkName(chainId),
    sourceCurrency: rest.sourceCurrency,
    sourceAmount: rest.sourceAmount,
    paymentMethod: rest.paymentMethod,
  }

  // Add optional parameters only if provided
  if (rest.country) requestBody.country = rest.country
  if (rest.subdivision) requestBody.subdivision = rest.subdivision

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
    throw new Error(errorData.error || errorData.errorMessage || 'Failed to fetch Coinbase quote')
  }

  return response.json()
}
