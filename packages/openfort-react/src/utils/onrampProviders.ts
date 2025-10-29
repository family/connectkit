/**
 * Utility functions for building on-ramp provider checkout URLs.
 * Supports Coinbase Onramp, Stripe Crypto Onramp, and MoonPay.
 *
 * @example
 * ```typescript
 * // Configure providers in OpenfortProvider
 * <OpenfortProvider
 *   publishableKey="pk_..."
 *   uiConfig={{
 *     onRampProviders: {
 *       coinbase: {
 *         appId: 'your-coinbase-app-id',
 *       },
 *       moonpay: {
 *         apiKey: 'your-moonpay-api-key',
 *       },
 *     },
 *   }}
 * >
 *   {children}
 * </OpenfortProvider>
 * ```
 *
 * The Buy page will automatically generate checkout URLs with the user's
 * wallet address and current chain when these providers are configured.
 */

/**
 * Maps chain IDs to provider-specific blockchain identifiers.
 */
const CHAIN_ID_TO_BLOCKCHAIN: Record<number, string> = {
  // Ethereum Mainnet
  1: 'ethereum',
  // Ethereum Sepolia
  11155111: 'ethereum',
  // Polygon Mainnet
  137: 'polygon',
  // Polygon Amoy Testnet
  80002: 'polygon',
  // Base Mainnet
  8453: 'base',
  // Base Sepolia
  84532: 'base',
  // Arbitrum One
  42161: 'arbitrum',
  // Arbitrum Sepolia
  421614: 'arbitrum',
  // Optimism
  10: 'optimism',
  // Optimism Sepolia
  11155420: 'optimism',
  // Avalanche C-Chain
  43114: 'avalanche',
  // Avalanche Fuji Testnet
  43113: 'avalanche',
  // BNB Smart Chain
  56: 'bsc',
  // BNB Testnet
  97: 'bsc',
}

/**
 * Maps chain IDs to native token symbols.
 */
const CHAIN_ID_TO_NATIVE_ASSET: Record<number, string> = {
  1: 'ETH',
  11155111: 'ETH',
  137: 'MATIC',
  80002: 'MATIC',
  8453: 'ETH',
  84532: 'ETH',
  42161: 'ETH',
  421614: 'ETH',
  10: 'ETH',
  11155420: 'ETH',
  43114: 'AVAX',
  43113: 'AVAX',
  56: 'BNB',
  97: 'BNB',
}

/**
 * Get blockchain identifier for a given chain ID.
 */
export const getBlockchainForChain = (chainId?: number): string | undefined => {
  if (!chainId) return undefined
  return CHAIN_ID_TO_BLOCKCHAIN[chainId]
}

/**
 * Get native asset symbol for a given chain ID.
 */
export const getNativeAssetForChain = (chainId?: number): string | undefined => {
  if (!chainId) return undefined
  return CHAIN_ID_TO_NATIVE_ASSET[chainId]
}

/**
 * Build a Coinbase Onramp checkout URL.
 * @see https://docs.cloud.coinbase.com/onramp-&-offramp/introduction/quickstart
 */
export const buildCoinbaseOnrampUrl = (params: {
  appId: string
  walletAddress: string
  blockchain?: string
  asset?: string
}): string => {
  const { appId, walletAddress, blockchain, asset } = params

  const url = new URL('https://pay.coinbase.com/buy')
  url.searchParams.set('appId', appId)

  // Add destination wallet with blockchain if available
  if (blockchain) {
    const destinationWallets = JSON.stringify({
      [walletAddress]: [blockchain],
    })
    url.searchParams.set('destinationWallets', destinationWallets)
  } else {
    // Fallback to just address if blockchain is unknown
    url.searchParams.set('destinationWallets', JSON.stringify({ [walletAddress]: [] }))
  }

  // Set default asset if provided
  if (asset) {
    url.searchParams.set('defaultAsset', asset)
  }

  return url.toString()
}

/**
 * Build a Stripe Crypto Onramp checkout URL.
 * Note: Stripe requires server-side session creation for production use.
 * This is a simplified client-side URL for basic redirect.
 * @see https://stripe.com/docs/crypto
 */
export const buildStripeOnrampUrl = (params: {
  publishableKey: string
  walletAddress: string
  network?: string
}): string => {
  const { publishableKey, walletAddress, network } = params

  // Note: Stripe's crypto onramp typically requires server-side session creation
  // This is a simplified approach - developers should implement proper backend integration
  const url = new URL('https://crypto.link.com')
  url.searchParams.set('pk', publishableKey)
  url.searchParams.set('wallet_address', walletAddress)

  if (network) {
    url.searchParams.set('destination_network', network)
  }

  return url.toString()
}

/**
 * Build a MoonPay checkout URL.
 * @see https://docs.moonpay.com/
 */
export const buildMoonPayUrl = (params: {
  apiKey: string
  walletAddress: string
  currencyCode?: string
  colorCode?: string
}): string => {
  const { apiKey, walletAddress, currencyCode, colorCode } = params

  const url = new URL('https://buy.moonpay.com')
  url.searchParams.set('apiKey', apiKey)
  url.searchParams.set('walletAddress', walletAddress)

  // Set currency code (e.g., 'eth', 'matic', 'usdc')
  if (currencyCode) {
    url.searchParams.set('currencyCode', currencyCode.toLowerCase())
  }

  // Optional: set theme color
  if (colorCode) {
    url.searchParams.set('colorCode', colorCode.replace('#', ''))
  }

  return url.toString()
}

/**
 * Maps blockchain names to MoonPay currency codes for native tokens.
 */
const BLOCKCHAIN_TO_MOONPAY_CODE: Record<string, string> = {
  ethereum: 'eth',
  polygon: 'matic',
  base: 'eth_base',
  arbitrum: 'eth_arbitrum',
  optimism: 'eth_optimism',
  avalanche: 'avax_cchain',
  bsc: 'bnb_bsc',
}

/**
 * Get MoonPay currency code from blockchain name.
 */
export const getMoonPayCurrencyCode = (blockchain?: string): string | undefined => {
  if (!blockchain) return undefined
  return BLOCKCHAIN_TO_MOONPAY_CODE[blockchain.toLowerCase()]
}
