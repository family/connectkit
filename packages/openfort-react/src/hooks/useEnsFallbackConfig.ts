// import { createConfig, http } from 'wagmi'
// import { mainnet } from 'wagmi/chains'
// import { useChainIsSupported } from './useChainIsSupported'

// const ensFallbackConfig = createConfig({
//   chains: [mainnet],
//   transports: {
//     [mainnet.id]: http(),
//   },
// })

export function useEnsFallbackConfig() {
  return /* !useChainIsSupported(1) ? ensFallbackConfig :  */ undefined
}
