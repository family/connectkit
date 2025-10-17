/**
 * Helpers for constructing default Wagmi transports for supported chains.
 *
 * These utilities favour convenience over granular control, making them suitable for
 * straightforward integrations where automatically configuring transports is preferable to
 * repeating boilerplate in every application.
 */

import type { CreateConfigParameters } from '@wagmi/core'
import type { HttpTransport, WebSocketTransport } from 'viem'
import { fallback, http, webSocket } from 'wagmi'
import { arbitrum, type Chain, mainnet, optimism, polygon } from 'wagmi/chains'

import { chainConfigs } from './constants/chainConfigs'

/**
 * Builds a transport based on the configured provider and chain.
 *
 * @param params - Provider information used to construct the transport.
 * @param params.chain - Wagmi chain to resolve RPC endpoints for.
 * @param params.provider - RPC provider strategy used to fetch chain URLs.
 * @param params.apiKey - Service specific API key appended to generated URLs.
 * @returns A configured HTTP or WebSocket transport for the provider, or a default HTTP transport when no matching endpoint exists.
 *
 * @internal
 */
const createTransport = ({
  chain,
  provider = 'public',
  apiKey,
}: {
  chain: Chain
  provider: 'alchemy' | 'infura' | 'public'
  apiKey: string
}): HttpTransport | WebSocketTransport => {
  const supportedChain = chainConfigs.find((c) => c.id === chain.id)
  if (supportedChain?.rpcUrls) {
    if (provider === 'alchemy') {
      if (supportedChain.rpcUrls?.alchemy?.http) {
        return http(supportedChain.rpcUrls?.alchemy?.http + apiKey)
      } else {
        return webSocket(supportedChain.rpcUrls?.alchemy?.webSocket + apiKey)
      }
    } else if (provider === 'infura') {
      if (supportedChain.rpcUrls?.infura?.http) {
        return http(supportedChain.rpcUrls?.infura?.http + apiKey)
      } else {
        return webSocket(supportedChain.rpcUrls?.infura?.webSocket + apiKey)
      }
    }
  }
  return http()
}

/**
 * Options for {@link getDefaultTransports}.
 */
type GetDefaultTransportsProps = {
  chains?: CreateConfigParameters['chains']
  alchemyId?: string
  infuraId?: string
}

/**
 * Creates a map of Wagmi transports for the provided chains.
 *
 * @param props - Configuration for the generated transports.
 * @param props.chains - Chains that require transports. Defaults to popular EVM chains.
 * @param props.alchemyId - Alchemy API key used to prioritise Alchemy transports when available.
 * @param props.infuraId - Infura API key used to prioritise Infura transports when available.
 * @returns A record mapping chain identifiers to their fallback transport configuration.
 *
 * @example
 * ```ts
 * import { createConfig } from 'wagmi';
 * import { getDefaultTransports } from '@openfort/openfort-react';
 *
 * const config = createConfig({
 *   chains: [mainnet],
 *   transports: getDefaultTransports({ alchemyId: process.env.ALCHEMY_ID ?? '' }),
 * });
 * ```
 */
export const getDefaultTransports = ({
  chains = [mainnet, polygon, optimism, arbitrum],
  alchemyId,
  infuraId,
}: GetDefaultTransportsProps): CreateConfigParameters['transports'] => {
  const transports: CreateConfigParameters['transports'] = {}
  Object.keys(chains).forEach((_key, index) => {
    const chain = chains[index]
    const urls: (HttpTransport | WebSocketTransport)[] = []
    if (alchemyId) urls.push(createTransport({ chain, provider: 'alchemy', apiKey: alchemyId }))
    if (infuraId) urls.push(createTransport({ chain, provider: 'infura', apiKey: infuraId }))

    urls.push(http())

    transports[chain.id] = fallback(urls)
  })

  return transports
}
