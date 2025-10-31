import type { SendTokenOption } from '../../Openfort/types'

const COINBASE_API_URL = 'http://localhost:3000/v1/onramp/coinbase/sessions'
const COINBASE_ORDERS_API_URL = 'http://localhost:3000/v1/onramp/coinbase/orders'

export type CoinbaseQuote = {
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

export type CoinbaseOrderQuote = {
  order: {
    createdAt: string
    destinationAddress: string
    destinationNetwork: string
    exchangeRate: string
    fees: Array<{
      amount: string
      currency: string
      type: string
    }>
    orderId: string
    partnerUserRef: string
    paymentCurrency: string
    paymentMethod: string
    paymentSubtotal: string
    paymentTotal: string
    purchaseAmount: string
    purchaseCurrency: string
    status: string
    updatedAt: string
  }
}

type CoinbaseSession = {
  onrampUrl: string
}

export type CoinbaseOnrampResponse = {
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
  const requestBody: CreateCoinbaseSessionParams = {
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

  const response = await fetch(COINBASE_API_URL, {
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

/**
 * Get a quote only (without creating a session)
 * Note: To get a quote, you must provide paymentMethod, country, and subdivision (for US)
 */
export const getCoinbaseQuote = async (
  params: Omit<CreateCoinbaseSessionParams, 'purchaseCurrency' | 'destinationNetwork'> & {
    token: SendTokenOption
    chainId: number
    publishableKey: string
  }
): Promise<CoinbaseQuote | null> => {
  const response = await createCoinbaseSession(params)
  return response.quote || null
}

type GetOrderQuoteParams = {
  paymentCurrency: string
  purchaseCurrency: string
  paymentMethod: string
  destinationAddress: string
  destinationNetwork: string
  paymentAmount?: string
  purchaseAmount?: string
  paymentSubtotalTarget?: string
  phoneNumber?: string
  email?: string
  partnerUserRef?: string
  agreementAcceptedAt?: string
  phoneNumberVerifiedAt?: string
}

/**
 * Fetch a real quote from the orders endpoint
 * This endpoint returns actual fee calculations and purchase amounts
 */
export const getOrderQuote = async (
  params: Omit<GetOrderQuoteParams, 'purchaseCurrency' | 'destinationNetwork'> & {
    token: SendTokenOption
    chainId: number
    publishableKey: string
  }
): Promise<CoinbaseOrderQuote> => {
  const { token, chainId, publishableKey, ...rest } = params

  if (!publishableKey) {
    throw new Error('Publishable key is required for authentication')
  }

  // Build request body
  const requestBody: GetOrderQuoteParams & { isQuote: boolean } = {
    purchaseCurrency: getCurrencyCode(token),
    destinationNetwork: getNetworkName(chainId),
    destinationAddress: rest.destinationAddress,
    paymentCurrency: rest.paymentCurrency,
    paymentMethod: rest.paymentMethod,
    isQuote: true,
    // Add optional parameters
    phoneNumber: rest.phoneNumber || '+12055555555',
    email: rest.email || 'test@example.com',
    partnerUserRef: rest.partnerUserRef || 'sandbox-user-test-456',
    // Required timestamp fields for the API
    agreementAcceptedAt: rest.agreementAcceptedAt || '2025-10-30T00:00:00Z',
    phoneNumberVerifiedAt: rest.phoneNumberVerifiedAt || '2025-10-30T00:00:00Z',
  }

  // Add either paymentAmount, purchaseAmount, or paymentSubtotalTarget (one is required)
  if (rest.paymentAmount) {
    requestBody.paymentAmount = rest.paymentAmount
  }
  if (rest.purchaseAmount) {
    requestBody.purchaseAmount = rest.purchaseAmount
  }
  if (rest.paymentSubtotalTarget) {
    requestBody.paymentSubtotalTarget = rest.paymentSubtotalTarget
  }

  const response = await fetch(COINBASE_ORDERS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${publishableKey}`,
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || errorData.errorMessage || 'Failed to fetch quote')
  }

  return response.json()
}
