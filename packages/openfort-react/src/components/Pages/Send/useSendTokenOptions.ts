import { useMemo } from 'react'
import { useAccount, useBalance, useReadContracts } from 'wagmi'
import type { SendTokenOption } from '../../Openfort/types'
import { erc20Abi } from './erc20'
import { ERC20_TOKEN_LIST } from './tokenList'

export type TokenOptionWithBalance = SendTokenOption & {
  balanceValue?: bigint
  name?: string
}

export const useSendTokenOptions = () => {
  const { address, chain } = useAccount()
  const chainId = chain?.id

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

  return {
    address,
    chainId,
    nativeBalance,
    nativeOption,
    tokenOptions,
    isLoading,
  }
}
