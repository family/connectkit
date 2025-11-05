import { SDKConfiguration } from '@openfort/openfort-js'
import type { SendTokenOption } from '../../Openfort/types'

const getBackendUrl = (): string => {
  const sdkConfig = SDKConfiguration.getInstance()
  return sdkConfig?.backendUrl || 'https://api.openfort.io'
}

type CoinbaseQuote = {
  destinationNetwork: string
  exchangeRate: string
  fees: Array<{
    amount: string
    currency: string
    type: string
  }>
  paymentCurrency: string
  paymentSubtotal: string
  paymentTotal: string
  purchaseAmount: string
  purchaseCurrency: string
}

export type CoinbaseQuoteResponse = {
  provider: string
  quote: {
    destinationNetwork: string
    exchangeRate: string
    fees: Array<{
      amount: string
      currency: string
      type: string
    }>
    paymentCurrency: string
    paymentSubtotal: string
    paymentTotal: string
    purchaseAmount: string
    purchaseCurrency: string
  }
}

type CoinbaseSession = {
  onrampUrl: string
}

export type CoinbaseOnrampResponse = {
  provider: string
  session: CoinbaseSession
  quote?: CoinbaseQuote // Only present when paymentMethod, country, and subdivision are provided
}

type CreateCoinbaseSessionParams = {
  purchaseCurrency: string
  destinationNetwork: string
  destinationAddress: string
  paymentAmount?: string
  paymentCurrency?: string
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

// Map token symbol to Coinbase currency code
const getCurrencyCode = (token: SendTokenOption): string => {
  if (token.type === 'native') {
    return token.symbol || 'ETH'
  }
  return token.symbol || 'USDC'
}

/**
 * Fetch a quote and create a Coinbase onramp session
 * Supports three use cases based on provided parameters:
 * 1. Basic session: Only required params (destinationAddress, purchaseCurrency, destinationNetwork)
 * 2. One-click URL: Required + paymentAmount + paymentCurrency
 * 3. One-click with quote: One-click + paymentMethod + country (+ subdivision for US)
 */
export const createCoinbaseSession = async (
  params: Omit<CreateCoinbaseSessionParams, 'purchaseCurrency' | 'destinationNetwork'> & {
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
    purchaseCurrency: getCurrencyCode(token),
    destinationNetwork: getNetworkName(chainId),
    destinationAddress: rest.destinationAddress,
  }

  // Add optional parameters only if provided
  if (rest.paymentAmount) requestBody.paymentAmount = rest.paymentAmount
  if (rest.paymentCurrency) requestBody.paymentCurrency = rest.paymentCurrency
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
  paymentCurrency: string
  purchaseCurrency: string
  paymentMethod: string
  destinationAddress: string
  destinationNetwork: string
  paymentAmount?: string
  purchaseAmount?: string
  paymentSubtotalTarget?: string
  country?: string
  subdivision?: string
}

/**
 * Get a quote from Coinbase
 * This provides fee estimates and exchange rates
 */
export const getCoinbaseQuote = async (
  params: Omit<GetCoinbaseQuoteParams, 'purchaseCurrency' | 'destinationNetwork'> & {
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
    purchaseCurrency: getCurrencyCode(token),
    destinationNetwork: getNetworkName(chainId),
    destinationAddress: rest.destinationAddress,
    paymentCurrency: rest.paymentCurrency,
    paymentMethod: rest.paymentMethod,
  }

  // Add optional parameters only if provided
  if (rest.paymentAmount) requestBody.paymentAmount = rest.paymentAmount
  if (rest.purchaseAmount) requestBody.purchaseAmount = rest.purchaseAmount
  if (rest.paymentSubtotalTarget) requestBody.paymentSubtotalTarget = rest.paymentSubtotalTarget
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
