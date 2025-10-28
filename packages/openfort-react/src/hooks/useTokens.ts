import { useEffect, useMemo, useState } from 'react'
import { useAccount, useBalance, useReadContracts } from 'wagmi'
import type { SendTokenOption } from '../components/Openfort/types'
import { erc20Abi } from '../constants/erc20'
import { ERC20_TOKEN_LIST } from '../constants/tokenList'

export type TokenOptionWithBalance = SendTokenOption & {
  balanceValue?: bigint
  name?: string
}

export type TokenUsdPrices = Record<string, number>

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

export const useTokens = () => {
  const { address, chain } = useAccount()
  const chainId = chain?.id
  const [prices, setPrices] = useState<TokenUsdPrices>({})

  // Native balance
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

  const erc20Options = useMemo(() => {
    return erc20Tokens.map((token, index) => {
      const balanceValue = erc20Balances?.[index]?.result
      return {
        type: 'erc20',
        symbol: token.symbol,
        address: token.address,
        decimals: token.decimals,
        name: token.name,
        balanceValue: balanceValue as bigint | undefined,
      } as TokenOptionWithBalance
    })
  }, [erc20Tokens, erc20Balances])

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

    return {
      type: 'native',
      symbol,
      decimals: nativeBalance?.decimals ?? 18,
      balanceValue: nativeBalance?.value,
      name: nameMap[symbol] ?? symbol,
    }
  }, [nativeBalance?.symbol, nativeBalance?.decimals, nativeBalance?.value])

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
          tokenOptions.forEach((token) => {
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
  }, [coingeckoIds, tokenOptions])

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
