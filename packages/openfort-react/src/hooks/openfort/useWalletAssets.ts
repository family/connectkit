import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { getAssets } from 'viem/_types/experimental/erc7811/actions/getAssets'
import { erc7811Actions } from 'viem/experimental'
import { useAccount, useChainId, useWalletClient } from 'wagmi'
import type { Asset } from '../../components/Openfort/types'
import { useOpenfort } from '../../components/Openfort/useOpenfort'
import { OpenfortError, OpenfortReactErrorType, type OpenfortWalletConfig } from '../../types'

type WalletAssetsHookOptions = {
  assets?: OpenfortWalletConfig['assets']
  staleTime?: number
}

export const useWalletAssets = ({ assets: hookCustomAssets, staleTime = 30000 }: WalletAssetsHookOptions = {}) => {
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
        throw new OpenfortError('No wallet client available', OpenfortReactErrorType.UNEXPECTED_ERROR, {
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
                  address: a,
                  type: 'erc20' as const,
                })),
              },
            })
          : Promise.resolve({ [chainId]: [] as getAssets.Asset<false>[] })

      const [defaultAssetsRaw, customAssets] = await Promise.all([defaultAssetsPromise, customAssetsPromise])

      // Merge assets, avoiding duplicates
      const defaultAssets = defaultAssetsRaw[chainId].map<Asset>((a) => {
        let asset: Asset
        if (a.type === 'erc20') {
          asset = {
            type: 'erc20' as const,
            address: a.address,
            balance: a.balance,
            metadata: {
              name: a.metadata?.name || 'Unknown Token',
              symbol: a.metadata?.symbol || 'UNKNOWN',
              decimals: a.metadata?.decimals,
              fiat: (a.metadata as any)?.fiat,
            },
            raw: a,
          }
        } else if (a.type === 'native') {
          const notStandardMetadata = a.metadata as any
          asset = {
            type: 'native' as const,
            address: 'native',
            balance: a.balance,
            metadata: {
              name: notStandardMetadata?.name,
              symbol: notStandardMetadata?.symbol,
              decimals: notStandardMetadata?.decimals,
              fiat: notStandardMetadata?.fiat,
            },
            raw: a,
          }
        } else {
          throw new OpenfortError('Unsupported asset type', OpenfortReactErrorType.UNEXPECTED_ERROR, { asset: a })
        }
        return asset
      })

      const mergedAssets = defaultAssets
      const customAssetsForChain: Asset[] = customAssets[chainId].map((asset: getAssets.Asset<false>) => {
        if (asset.type !== 'erc20') return { ...asset, raw: asset } as unknown as Asset
        if (!walletConfig?.assets) return { ...asset, raw: asset }

        const configAsset = walletConfig.assets[chainId].find((a) => a.toLowerCase() === asset.address.toLowerCase())
        if (!configAsset) return { ...asset, raw: asset }

        const safeAsset: Asset = {
          type: 'erc20' as const,
          address: asset.address,
          balance: asset.balance,
          metadata: asset.metadata,
          raw: asset,
        }
        return safeAsset
      })

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
    staleTime, // Data fresh for 30 seconds
    throwOnError: false,
  })

  // Map TanStack Query error to OpenfortError
  const mappedError = useMemo(() => {
    if (!error) return undefined

    if (error instanceof OpenfortError) {
      return error
    }

    return new OpenfortError('Failed to fetch wallet assets', OpenfortReactErrorType.UNEXPECTED_ERROR, { error })
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
