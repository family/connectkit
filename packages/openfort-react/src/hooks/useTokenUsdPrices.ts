import { useEffect, useMemo, useState } from 'react'
import type { TokenOptionWithBalance } from '../components/Pages/Send/useSendTokenOptions'

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

const getCoingeckoId = (symbol?: string) => {
  if (!symbol) return undefined
  return TOKEN_PRICE_IDS[symbol.toUpperCase()]
}

export type TokenUsdPrices = Record<string, number>

export const useTokenUsdPrices = (tokens: TokenOptionWithBalance[]) => {
  const [prices, setPrices] = useState<TokenUsdPrices>({})

  const coingeckoIds = useMemo(() => {
    const ids = new Set<string>()
    tokens.forEach((token) => {
      const id = getCoingeckoId(token.symbol)
      if (id) ids.add(id)
    })
    return Array.from(ids)
  }, [tokens])

  useEffect(() => {
    if (!coingeckoIds.length) {
      setPrices({})
      return
    }

    const controller = new AbortController()

    const fetchPrices = async () => {
      try {
        const params = new URLSearchParams({
          ids: coingeckoIds.join(','),
          vs_currencies: 'usd',
        })
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?${params.toString()}`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`Failed to fetch prices: ${response.status}`)
        const data: Record<string, { usd?: number }> = await response.json()

        setPrices((prev) => {
          const next: TokenUsdPrices = {}
          tokens.forEach((token) => {
            const symbolKey = token.symbol?.toUpperCase()
            if (!symbolKey) return
            const id = getCoingeckoId(token.symbol)
            const usd = id ? data[id]?.usd : undefined
            if (typeof usd === 'number') {
              next[symbolKey] = usd
            } else if (prev[symbolKey] !== undefined) {
              next[symbolKey] = prev[symbolKey]
            }
          })
          return next
        })
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setPrices({})
        }
      }
    }

    void fetchPrices()

    return () => {
      controller.abort()
    }
  }, [coingeckoIds, tokens])

  return prices
}
