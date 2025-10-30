import type { SendTokenOption } from '../../Openfort/types'

const STRIPE_API_URL = 'http://localhost:3000/api/onramp/stripe/sessions'
const STRIPE_QUOTES_API_URL = 'http://localhost:3000/api/onramp/stripe/quotes'

export type StripeQuote = {
  destination_amount: string
  destination_currency: string
  destination_network: string
  fees: {
    network_fee_monetary: string
    transaction_fee_monetary: string
  }
  source_total_amount: string
}

export type StripeQuotesResponse = {
  id: string
  object: string
  destination_network_quotes: Record<string, StripeQuote[]>
  source_amount: string
  source_currency: string
}

export type StripeSession = {
  id: string
  client_secret: string
  status: string
  onrampUrl: string // crypto.link.com URL with client_secret
}

export type StripeOnrampResponse = {
  session: StripeSession
  quote?: StripeQuote
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

// Map token symbol to Stripe currency code
const getCurrencyCode = (token: SendTokenOption): string => {
  if (token.type === 'native') {
    return token.symbol || 'ETH'
  }
  return token.symbol || 'USDC'
}

/**
 * Create a Stripe onramp session
 * Returns a session with a client_secret that can be used to open crypto.link.com
 */
export const createStripeSession = async (
  params: Omit<CreateStripeSessionParams, 'destinationCurrency' | 'destinationNetwork'> & {
    token: SendTokenOption
    chainId: number
  }
): Promise<StripeOnrampResponse> => {
  const { token, chainId, ...rest } = params

  // Build request body
  const requestBody: CreateStripeSessionParams = {
    destinationCurrency: getCurrencyCode(token),
    destinationNetwork: getNetworkName(chainId),
    destinationAddress: rest.destinationAddress,
  }

  // Add optional parameters only if provided
  if (rest.sourceAmount) requestBody.sourceAmount = rest.sourceAmount
  if (rest.sourceCurrency) requestBody.sourceCurrency = rest.sourceCurrency
  if (rest.redirectUrl) requestBody.redirectUrl = rest.redirectUrl

  const response = await fetch(STRIPE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || errorData.errorMessage || 'Failed to create Stripe session')
  }

  return response.json()
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
export const getStripeQuote = async (
  params: Omit<GetStripeQuoteParams, 'destinationCurrency' | 'destinationNetwork'> & {
    token: SendTokenOption
    chainId: number
  }
): Promise<StripeQuote | null> => {
  const { token, chainId, ...rest } = params

  // Build request body
  const requestBody: GetStripeQuoteParams = {
    destinationCurrency: getCurrencyCode(token),
    destinationNetwork: getNetworkName(chainId),
    sourceCurrency: rest.sourceCurrency,
    sourceAmount: rest.sourceAmount,
  }

  const response = await fetch(STRIPE_QUOTES_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || errorData.errorMessage || 'Failed to fetch Stripe quote')
  }

  const quotesResponse: StripeQuotesResponse = await response.json()

  // Map network names to Stripe's response field names
  const networkToFieldMap: Record<string, string> = {
    ethereum: 'ethereum',
    base: 'base_network',
    polygon: 'polygon',
    arbitrum: 'arbitrum',
    optimism: 'optimism',
  }

  const networkName = getNetworkName(chainId)
  const networkField = networkToFieldMap[networkName] || networkName

  // Extract the quote for the requested network
  const quotes = quotesResponse.destination_network_quotes[networkField]
  if (!quotes || quotes.length === 0) {
    return null
  }

  // Return the first quote (there should only be one since we filtered by network and currency)
  return quotes[0]
}
