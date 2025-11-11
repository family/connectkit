import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { getAssets } from 'viem/_types/experimental/erc7811/actions/getAssets'
import { erc7811Actions } from 'viem/experimental'
import { useAccount, useChainId, useWalletClient } from 'wagmi'
import type { Asset } from '../../components/Openfort/types'
import { useOpenfort } from '../../components/Openfort/useOpenfort'
import { OpenfortError, OpenfortErrorType, type OpenfortWalletConfig } from '../../types'

type WalletAssetsHookOptions = {
  assets?: OpenfortWalletConfig['assets']
}

export const useWalletAssets = ({ assets: hookCustomAssets }: WalletAssetsHookOptions = {}) => {
  const chainId = useChainId()
  const { data: walletClient } = useWalletClient()
  const { walletConfig } = useOpenfort()
  const { address } = useAccount()

  const customAssetsToFetch = useMemo(() => {
    const assetsFromConfig = walletConfig?.assets ? walletConfig.assets[chainId] || [] : []
    const assetsFromHook = hookCustomAssets ? hookCustomAssets[chainId] || [] : []
    const allAssets = [...assetsFromConfig, ...assetsFromHook]
    return allAssets
  }, [walletConfig?.assets, hookCustomAssets, chainId])

  const { data, error, isLoading, isError, isSuccess, refetch } = useQuery({
    queryKey: ['wallet-assets', chainId, customAssetsToFetch, address],
    queryFn: async () => {
      if (!walletClient) {
        throw new OpenfortError('No wallet client available', OpenfortErrorType.UNEXPECTED_ERROR, {
          error: new Error('Wallet client not initialized'),
        })
      }

      const extendedClient = walletClient.extend(erc7811Actions())

      // Fetch default assets
      const defaultAssetsPromise = extendedClient.getAssets({
        chainIds: [chainId],
      })

      // Fetch custom ERC20 assets
      const customAssetsPromise =
        customAssetsToFetch.length > 0
          ? extendedClient.getAssets({
              chainIds: [chainId],
              assets: {
                [chainId]: customAssetsToFetch.map((a) => ({
                  address: a.address,
                  type: 'erc20' as const,
                })),
              },
            })
          : Promise.resolve({ [chainId]: [] as Asset[] })

      const [defaultAssets, customAssets] = await Promise.all([defaultAssetsPromise, customAssetsPromise])

      // Merge assets, avoiding duplicates
      const mergedAssets = [...defaultAssets[chainId]]
      const customAssetsForChain: getAssets.Asset<false>[] = customAssets[chainId].map(
        (asset: getAssets.Asset<false>) => {
          if (asset.type !== 'erc20') return asset
          if (!walletConfig?.assets) return asset

          const configAsset = walletConfig.assets[chainId].find(
            (a) => a.address.toLowerCase() === asset.address.toLowerCase()
          )
          if (!configAsset) return asset

          return {
            ...asset,
            type: 'erc20' as const,
            metadata: {
              ...asset.metadata,
              name: configAsset.name ?? asset.metadata?.name,
              symbol: configAsset.symbol ?? asset.metadata?.symbol,
              decimals: configAsset.decimals ?? asset.metadata?.decimals ?? 18,
            },
          }
        }
      )

      if (customAssetsForChain) {
        customAssetsForChain.forEach((asset) => {
          if (!mergedAssets.find((a) => a.address === asset.address)) {
            mergedAssets.push(asset)
          }
        })
      }

      return mergedAssets as readonly Asset[]
    },
    enabled: !!walletClient,
    retry: 2,
    staleTime: 30000, // Data fresh for 30 seconds
    throwOnError: false,
  })

  // Map TanStack Query error to OpenfortError
  const mappedError = useMemo(() => {
    if (!error) return undefined

    if (error instanceof OpenfortError) {
      return error
    }

    return new OpenfortError('Failed to fetch wallet assets', OpenfortErrorType.UNEXPECTED_ERROR, { error })
  }, [error])

  return {
    data: data ?? null,
    isLoading,
    isError,
    isSuccess,
    isIdle: !walletClient,
    error: mappedError,
    refetch,
  }
}
