import type { SendTokenOption } from '../../Openfort/types'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const ONRAMP_SESSIONS_URL = `${BACKEND_URL}/v1/onramp/sessions`
const ONRAMP_QUOTES_URL = `${BACKEND_URL}/v1/onramp/quotes`

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

type StripeQuotesResponse = {
  id: string
  object: string
  destination_network_quotes: Record<string, StripeQuote[]>
  source_amount: string
  source_currency: string
}

type StripeSession = {
  id: string
  client_secret: string
  status: string
  onrampUrl: string // crypto.link.com URL with client_secret
}

export type StripeOnrampResponse = {
  provider: string
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
 * Calls backend API to create a prefilled session with wallet addresses and amounts
 */
export const createStripeSession = async (
  params: Omit<CreateStripeSessionParams, 'destinationCurrency' | 'destinationNetwork'> & {
    token: SendTokenOption
    chainId: number
    publishableKey: string
  }
): Promise<StripeOnrampResponse> => {
  const { token, chainId, publishableKey, destinationAddress, sourceAmount, sourceCurrency, redirectUrl } = params

  if (!publishableKey) {
    throw new Error('Publishable key is required for authentication')
  }

  const destinationCurrency = getCurrencyCode(token).toLowerCase()
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

  const response = await fetch(ONRAMP_SESSIONS_URL, {
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
export const getStripeQuote = async (
  params: Omit<GetStripeQuoteParams, 'destinationCurrency' | 'destinationNetwork'> & {
    token: SendTokenOption
    chainId: number
    publishableKey: string
  }
): Promise<StripeQuote | null> => {
  const { token, chainId, publishableKey, ...rest } = params

  if (!publishableKey) {
    throw new Error('Publishable key is required for authentication')
  }

  // Build request body
  const requestBody: GetStripeQuoteParams & { provider: string } = {
    provider: 'stripe',
    destinationCurrency: getCurrencyCode(token),
    destinationNetwork: getNetworkName(chainId),
    sourceCurrency: rest.sourceCurrency,
    sourceAmount: rest.sourceAmount,
  }

  const response = await fetch(ONRAMP_QUOTES_URL, {
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
