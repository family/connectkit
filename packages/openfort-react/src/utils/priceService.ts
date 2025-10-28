const TOKEN_PRICE_IDS: Record<string, string> = {
  ETH: 'ethereum',
  MATIC: 'matic-network',
  BNB: 'binancecoin',
  AVAX: 'avalanche-2',
  FTM: 'fantom',
  OP: 'optimism',
  ARB: 'arbitrum',
  USDC: 'usd-coin',
  USDT: 'tether',
  DAI: 'dai',
}

export const getCoingeckoId = (symbol?: string): string | undefined => {
  if (!symbol) return undefined
  return TOKEN_PRICE_IDS[symbol.toUpperCase()]
}

interface PriceFetchState {
  lastAttempt: number
  failureCount: number
}

const fetchState = new Map<string, PriceFetchState>()

/**
 * Gets the exponential backoff delay based on failure count
 * 0 failures: 30s, 1: 60s, 2: 120s, 3+: 300s (5 min)
 */
const getBackoffDelay = (failureCount: number): number => {
  const delays = [30000, 60000, 120000, 300000]
  return delays[Math.min(failureCount, delays.length - 1)]
}

/**
 * Checks if enough time has passed since the last fetch attempt
 */
const canAttemptFetch = (key: string): boolean => {
  const state = fetchState.get(key)
  if (!state) return true

  const now = Date.now()
  const minDelay = getBackoffDelay(state.failureCount)
  return now - state.lastAttempt >= minDelay
}

/**
 * Updates the fetch state after an attempt
 */
const updateFetchState = (key: string, success: boolean): void => {
  const now = Date.now()
  const currentState = fetchState.get(key) || { lastAttempt: 0, failureCount: 0 }

  fetchState.set(key, {
    lastAttempt: now,
    failureCount: success ? 0 : currentState.failureCount + 1,
  })
}

export interface TokenPrices {
  [symbol: string]: number
}

interface FetchPricesOptions {
  coingeckoIds: string[]
  signal?: AbortSignal
}

interface FetchPricesResult {
  success: boolean
  data?: Record<string, { usd?: number }>
}

/**
 * Fetches token prices from CoinGecko API with rate limiting and exponential backoff
 * Silently handles errors without logging to console
 */
export const fetchTokenPrices = async ({ coingeckoIds, signal }: FetchPricesOptions): Promise<FetchPricesResult> => {
  if (!coingeckoIds.length) {
    return { success: false }
  }

  const cacheKey = coingeckoIds.sort().join(',')

  // Check if we should skip this fetch due to rate limiting
  if (!canAttemptFetch(cacheKey)) {
    return { success: false }
  }

  try {
    const params = new URLSearchParams({
      ids: coingeckoIds.join(','),
      vs_currencies: 'usd',
    })

    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?${params.toString()}`, {
      signal,
      mode: 'cors',
    })

    if (!response.ok) {
      // Update state with failure (rate limited or other HTTP error)
      updateFetchState(cacheKey, false)
      return { success: false }
    }

    const data: Record<string, { usd?: number }> = await response.json()

    // Update state with success
    updateFetchState(cacheKey, true)

    return { success: true, data }
  } catch (error) {
    // Silently handle errors - no console logging
    if ((error as Error).name !== 'AbortError') {
      updateFetchState(cacheKey, false)
    }
    return { success: false }
  }
}

/**
 * Resets the fetch state for testing or manual retry
 */
export const resetPriceFetchState = (coingeckoIds?: string[]): void => {
  if (coingeckoIds) {
    const cacheKey = coingeckoIds.sort().join(',')
    fetchState.delete(cacheKey)
  } else {
    fetchState.clear()
  }
}
