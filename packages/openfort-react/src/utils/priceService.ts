import { type Openfort, SDKConfiguration } from '@openfort/openfort-js'

// USDC address on various chains for price conversion
const USDC_ADDRESSES: Record<number, string> = {
  1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // Ethereum Mainnet
  137: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', // Polygon
  10: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', // Optimism
  42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // Arbitrum
  8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Base
  43114: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', // Avalanche
  56: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', // BSC
}

interface TokenPriceRequest {
  chainId: number
  tokenAddress: string
  symbol: string
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
 */
export const fetchTokenPrices = async ({
  tokenRequests,
  openfortClient,
  signal,
}: FetchPricesOptions): Promise<FetchPricesResult> => {
  if (!tokenRequests.length) {
    return { success: false }
  }

  const cacheKey = tokenRequests
    .map((r) => `${r.chainId}-${r.tokenAddress}`)
    .sort()
    .join(',')

  // Check if we should skip this fetch due to rate limiting
  if (!canAttemptFetch(cacheKey)) {
    return { success: false }
  }

  try {
    const pricePromises = tokenRequests.map(async (request) => {
      const { chainId, tokenAddress, symbol } = request

      // Skip if we don't have USDC for this chain
      const usdcAddress = USDC_ADDRESSES[chainId]
      if (!usdcAddress) {
        return { symbol, usd: undefined }
      }

      try {
        // Get access token
        const accessToken = await openfortClient.getAccessToken()
        if (!accessToken) {
          return { symbol, usd: undefined }
        }

        // Get backend URL from SDK configuration
        const sdkConfig = SDKConfiguration.getInstance()
        const backendUrl = sdkConfig?.backendUrl || 'https://api.openfort.io'

        // Create the quote request
        const quoteRequest = {
          chainId,
          fromAddress: 'player', // Use a placeholder address for quote
          tokenInAddress: tokenAddress === 'native' ? 'native' : tokenAddress,
          tokenOutAddress: usdcAddress,
          amount: '1000000000000000000', // 1 token in wei (18 decimals)
          tradeType: 'EXACT_INPUT' as const,
        }

        // Make the API call directly
        const response = await fetch(`${backendUrl}/v1/exchange/quote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(quoteRequest),
          signal,
        })

        if (!response.ok) {
          return { symbol, usd: undefined }
        }

        const data = await response.json()

        // Extract the amount out and convert to USD
        // data.amount contains the output amount in USDC (6 decimals)
        if (data?.amount?.value) {
          // USDC has 6 decimals, so divide by 1e6
          const usdValue = Number(data.amount.value) / 1e6
          return { symbol, usd: usdValue }
        }

        return { symbol, usd: undefined }
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          throw error
        }
        return { symbol, usd: undefined }
      }
    })

    const results = await Promise.all(pricePromises)

    // Convert results to the expected format
    const data: Record<string, number> = {}
    for (const result of results) {
      if (result.usd !== undefined) {
        data[result.symbol.toUpperCase()] = result.usd
      }
    }

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
