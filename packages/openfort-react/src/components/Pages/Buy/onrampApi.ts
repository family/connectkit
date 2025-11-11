import { SDKConfiguration } from '@openfort/openfort-js'
import type { Asset } from '../../Openfort/types'
import { getAssetSymbol } from '../Send/utils'

const getBackendUrl = (): string => {
  const sdkConfig = SDKConfiguration.getInstance()
  return sdkConfig?.backendUrl || 'https://api.openfort.io'
}

// Generic quote response type (matches backend OnrampQuoteResponse)
export type OnrampQuote = {
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

// Map chain IDs to network names
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

// Map token symbol to currency code
const getCurrencyCode = (token: Asset): string => {
  return getAssetSymbol(token).toLowerCase()
}

type GetAllQuotesParams = {
  token: Asset
  chainId: number
  publishableKey: string
  sourceCurrency: string
  sourceAmount: string
}

/**
 * Get quotes from all available providers
 * Calls the backend without specifying a provider to get quotes from all providers
 */
export const getAllQuotes = async (params: GetAllQuotesParams): Promise<OnrampQuote[]> => {
  const { token, chainId, publishableKey, sourceCurrency, sourceAmount } = params

  if (!publishableKey) {
    throw new Error('Publishable key is required for authentication')
  }

  // Build request body WITHOUT provider to get all quotes
  const requestBody = {
    destinationCurrency: getCurrencyCode(token),
    destinationNetwork: getNetworkName(chainId),
    sourceCurrency: sourceCurrency.toLowerCase(),
    sourceAmount,
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
    throw new Error(errorData.error || errorData.errorMessage || 'Failed to fetch quotes')
  }

  const data = await response.json()

  // Backend returns array when provider is not specified
  return Array.isArray(data) ? data : [data]
}
