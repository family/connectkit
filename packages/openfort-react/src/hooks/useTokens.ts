import { useEffect, useMemo, useState } from 'react'
import { useAccount, useBalance, useReadContracts } from 'wagmi'
import type { SendTokenOption } from '../components/Openfort/types'
import { erc20Abi } from '../constants/erc20'
import { ERC20_TOKEN_LIST } from '../constants/tokenList'
import { fetchTokenPrices, getCoingeckoId } from '../utils/priceService'
import { useTokenCache } from './useTokenCache'

export type TokenOptionWithBalance = SendTokenOption & {
  balanceValue?: bigint
  name?: string
}

export type TokenUsdPrices = Record<string, number>

export const useTokens = () => {
  const { address, chain } = useAccount()
  const chainId = chain?.id

  // Use token cache hook
  const { cachedNativeBalance, getCachedErc20Balance, cacheBalance, cachedPrices, cachePrices } = useTokenCache(
    address,
    chainId
  )

  const [prices, setPrices] = useState<TokenUsdPrices>(cachedPrices)

  const {
    data: nativeBalance,
    isLoading: isNativeLoading,
    isFetching: isNativeFetching,
  } = useBalance({
    address,
    query: {
      enabled: Boolean(address),
    },
  })

  // Cache native balance when it updates
  useEffect(() => {
    if (nativeBalance?.value) {
      cacheBalance(nativeBalance.value)
    }
  }, [nativeBalance?.value, cacheBalance])

  // ERC20 tokens
  const erc20Tokens = useMemo(() => {
    if (!chainId) return []
    return ERC20_TOKEN_LIST[chainId] ?? []
  }, [chainId])

  const erc20Contracts = useMemo(() => {
    if (!address || !erc20Tokens.length) return []
    return erc20Tokens.map((token) => ({
      abi: erc20Abi,
      address: token.address,
      functionName: 'balanceOf',
      args: [address] as const,
      chainId,
    }))
  }, [address, chainId, erc20Tokens])

  const {
    data: erc20Balances,
    isLoading: isErc20Loading,
    isFetching: isErc20Fetching,
  } = useReadContracts({
    allowFailure: true,
    contracts: erc20Contracts,
    query: {
      enabled: erc20Contracts.length > 0,
      staleTime: 15_000,
    },
  })

  // Cache ERC20 balances when they update
  useEffect(() => {
    if (!erc20Balances) return

    erc20Tokens.forEach((token, index) => {
      const balance = erc20Balances[index]?.result
      if (balance !== undefined && typeof balance === 'bigint') {
        cacheBalance(balance, token.address)
      }
    })
  }, [erc20Balances, erc20Tokens, cacheBalance])

  const erc20Options = useMemo(() => {
    return erc20Tokens.map((token, index) => {
      // Use fresh data if available, otherwise fall back to cache
      let balanceValue = erc20Balances?.[index]?.result as bigint | undefined

      // If fetching and no fresh data yet, use cached value
      if (!balanceValue) {
        const cached = getCachedErc20Balance(token.address)
        if (cached !== null) {
          balanceValue = cached
        }
      }

      return {
        type: 'erc20',
        symbol: token.symbol,
        address: token.address,
        decimals: token.decimals,
        name: token.name,
        balanceValue,
      } as TokenOptionWithBalance
    })
  }, [erc20Tokens, erc20Balances, getCachedErc20Balance])

  const nativeOption: TokenOptionWithBalance = useMemo(() => {
    const symbol = nativeBalance?.symbol ?? 'ETH'
    // Map common native token symbols to their full names
    const nameMap: Record<string, string> = {
      ETH: 'Ethereum',
      MATIC: 'Polygon',
      BNB: 'BNB',
      AVAX: 'Avalanche',
      FTM: 'Fantom',
      OP: 'Optimism',
      ARB: 'Arbitrum',
    }

    // Use fresh data if available, otherwise fall back to cache
    let balanceValue = nativeBalance?.value
    if (!balanceValue && cachedNativeBalance !== null) {
      balanceValue = cachedNativeBalance
    }

    return {
      type: 'native',
      symbol,
      decimals: nativeBalance?.decimals ?? 18,
      balanceValue,
      name: nameMap[symbol] ?? symbol,
    }
  }, [nativeBalance?.symbol, nativeBalance?.decimals, nativeBalance?.value, cachedNativeBalance])

  const tokenOptions = useMemo(() => [nativeOption, ...erc20Options], [nativeOption, erc20Options])

  const isErc20Pending = erc20Contracts.length > 0 && (isErc20Loading || isErc20Fetching)
  const isLoading = isNativeLoading || isNativeFetching || isErc20Pending

  // Fetch USD prices
  const coingeckoIds = useMemo(() => {
    const ids = new Set<string>()
    tokenOptions.forEach((token) => {
      const id = getCoingeckoId(token.symbol)
      if (id) ids.add(id)
    })
    return Array.from(ids)
  }, [tokenOptions])

  useEffect(() => {
    if (!coingeckoIds.length) {
      setPrices({})
      return
    }

    const controller = new AbortController()

    const loadPrices = async () => {
      const result = await fetchTokenPrices({
        coingeckoIds,
        signal: controller.signal,
      })

      if (!result.success || !result.data) {
        // Fall back to cached prices on failure
        if (Object.keys(cachedPrices).length > 0) {
          setPrices(cachedPrices)
        }
        return
      }

      const priceData = result.data

      // Map the price data to token symbols
      setPrices((prev) => {
        const next: TokenUsdPrices = {}
        tokenOptions.forEach((token) => {
          const symbolKey = token.symbol?.toUpperCase()
          if (!symbolKey) return
          const id = getCoingeckoId(token.symbol)
          const usd = id ? priceData[id]?.usd : undefined
          if (typeof usd === 'number') {
            next[symbolKey] = usd
          } else if (prev[symbolKey] !== undefined) {
            next[symbolKey] = prev[symbolKey]
          }
        })

        // Cache the prices
        cachePrices(next)

        return next
      })
    }

    void loadPrices()

    return () => {
      controller.abort()
    }
  }, [coingeckoIds, tokenOptions, cachedPrices, cachePrices])

  return {
    address,
    chainId,
    nativeBalance,
    nativeOption,
    tokenOptions,
    isLoading,
    prices,
  }
}
