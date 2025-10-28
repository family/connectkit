import { useCallback, useMemo, useState } from 'react'
import type { SendTokenOption } from '../components/Openfort/types'
import type { TokenUsdPrices } from './useTokens'

// Cache keys
const CACHE_KEY_PREFIX = 'openfort_token_cache_'
const PRICE_CACHE_KEY = 'openfort_token_prices'
const SELECTED_TOKEN_CACHE_KEY = 'openfort_selected_token'
const CACHE_DURATION = 60_000 // 1 minute

type CachedBalance = {
  value: string // bigint as string
  timestamp: number
}

type CachedPrices = {
  prices: TokenUsdPrices
  timestamp: number
}

type CachedToken = {
  token: SendTokenOption
  timestamp: number
}

const getCacheKey = (address: string, chainId: number, tokenAddress?: string) => {
  return `${CACHE_KEY_PREFIX}${address}_${chainId}_${tokenAddress || 'native'}`
}

const getSelectedTokenCacheKey = (address: string, chainId: number) => {
  return `${SELECTED_TOKEN_CACHE_KEY}_${address}_${chainId}`
}

// Balance caching
export const getCachedBalance = (address: string, chainId: number, tokenAddress?: string): bigint | null => {
  try {
    const key = getCacheKey(address, chainId, tokenAddress)
    const cached = localStorage.getItem(key)
    if (!cached) return null

    const data: CachedBalance = JSON.parse(cached)
    if (Date.now() - data.timestamp > CACHE_DURATION) {
      localStorage.removeItem(key)
      return null
    }

    return BigInt(data.value)
  } catch {
    return null
  }
}

export const setCachedBalance = (address: string, chainId: number, balance: bigint, tokenAddress?: string) => {
  try {
    const key = getCacheKey(address, chainId, tokenAddress)
    const data: CachedBalance = {
      value: balance.toString(),
      timestamp: Date.now(),
    }
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    // Ignore localStorage errors
  }
}

// Price caching
export const getCachedPrices = (): TokenUsdPrices | null => {
  try {
    const cached = localStorage.getItem(PRICE_CACHE_KEY)
    if (!cached) return null

    const data: CachedPrices = JSON.parse(cached)
    if (Date.now() - data.timestamp > CACHE_DURATION) {
      localStorage.removeItem(PRICE_CACHE_KEY)
      return null
    }

    return data.prices
  } catch {
    return null
  }
}

export const setCachedPrices = (prices: TokenUsdPrices) => {
  try {
    const data: CachedPrices = {
      prices,
      timestamp: Date.now(),
    }
    localStorage.setItem(PRICE_CACHE_KEY, JSON.stringify(data))
  } catch {
    // Ignore localStorage errors
  }
}

// Token selection caching
export const getCachedSelectedToken = (address: string, chainId: number): SendTokenOption | null => {
  try {
    const key = getSelectedTokenCacheKey(address, chainId)
    const cached = localStorage.getItem(key)
    if (!cached) return null

    const data: CachedToken = JSON.parse(cached)
    // Don't expire selected token cache, keep it until changed
    return data.token
  } catch {
    return null
  }
}

export const setCachedSelectedToken = (address: string, chainId: number, token: SendTokenOption) => {
  try {
    const key = getSelectedTokenCacheKey(address, chainId)
    const data: CachedToken = {
      token,
      timestamp: Date.now(),
    }
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    // Ignore localStorage errors
  }
}

export const clearCachedSelectedToken = (address: string, chainId: number) => {
  try {
    const key = getSelectedTokenCacheKey(address, chainId)
    localStorage.removeItem(key)
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Hook for managing token-related caching including balances, prices, and selected token
 */
export const useTokenCache = (address?: string, chainId?: number) => {
  const [cachedPrices, setCachedPricesState] = useState<TokenUsdPrices>(() => getCachedPrices() || {})

  const cachedNativeBalance = useMemo(() => {
    if (!address || !chainId) return null
    return getCachedBalance(address, chainId)
  }, [address, chainId])

  const getCachedErc20Balance = useCallback(
    (tokenAddress: string) => {
      if (!address || !chainId) return null
      return getCachedBalance(address, chainId, tokenAddress)
    },
    [address, chainId]
  )

  const cacheBalance = useCallback(
    (balance: bigint, tokenAddress?: string) => {
      if (!address || !chainId) return
      setCachedBalance(address, chainId, balance, tokenAddress)
    },
    [address, chainId]
  )

  const cachePrices = useCallback((prices: TokenUsdPrices) => {
    setCachedPrices(prices)
    setCachedPricesState(prices)
  }, [])

  const cachedSelectedToken = useMemo(() => {
    if (!address || !chainId) return null
    return getCachedSelectedToken(address, chainId)
  }, [address, chainId])

  const cacheSelectedToken = useCallback(
    (token: SendTokenOption) => {
      if (!address || !chainId) return
      setCachedSelectedToken(address, chainId, token)
    },
    [address, chainId]
  )

  const clearSelectedToken = useCallback(() => {
    if (!address || !chainId) return
    clearCachedSelectedToken(address, chainId)
  }, [address, chainId])

  return {
    // Balances
    cachedNativeBalance,
    getCachedErc20Balance,
    cacheBalance,
    // Prices
    cachedPrices,
    cachePrices,
    // Selected token
    cachedSelectedToken,
    cacheSelectedToken,
    clearSelectedToken,
  }
}
