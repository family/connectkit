import type { Config } from '@wagmi/core'
import { createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { useChainIsSupported } from './useChainIsSupported'

const ensFallbackConfig: Config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
})

export function useEnsFallbackConfig(): Config | undefined {
  return !useChainIsSupported(1) ? ensFallbackConfig : undefined
}
