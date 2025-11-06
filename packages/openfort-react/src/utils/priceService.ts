import type { Openfort } from '@openfort/openfort-js'

interface TokenPriceRequest {
  chainId: number
  tokenAddress: string
  symbol: string
}

interface FetchPricesOptions {
  tokenRequests: TokenPriceRequest[]
  openfortClient: Openfort
  signal?: AbortSignal
}

interface FetchPricesResult {
  success: boolean
  data?: Record<string, number>
}

/**
 * Fetches token prices using Openfort's Exchange Quote API with rate limiting and exponential backoff
 * Silently handles errors without logging to console
 *
 * TODO: There's a missing exchange quote endpoint, an alternative price fetching mechanism.
 * Possible alternatives:
 * - Use a third-party price API (CoinGecko, CoinMarketCap, etc.)
 * - Use on-chain price oracles
 * - Implement a different pricing service
 */
export const fetchTokenPrices = async ({
  tokenRequests: _tokenRequests,
  openfortClient: _openfortClient,
  signal: _signal,
}: FetchPricesOptions): Promise<FetchPricesResult> => {
  // TODO: Implement price fetching once we have a working endpoint/service
  return { success: false }
}
