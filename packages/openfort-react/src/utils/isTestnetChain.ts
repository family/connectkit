/**
 * List of known testnet chain IDs
 * Includes testnets for Ethereum, Optimism, Polygon, Arbitrum, Base, and other chains
 */
const TESTNET_CHAIN_IDS = new Set([
  // Ethereum testnets
  3, // Rinkeby
  4, // Ropsten
  5, // Görli
  42, // Kovan
  11155111, // Sepolia

  // Local development
  31337, // Hardhat
  1337, // Localhost

  // Optimism testnets
  69, // Optimism Kovan
  420, // Optimism Goerli
  11155420, // Optimism Sepolia

  // Polygon testnets
  80001, // Polygon Mumbai

  // Arbitrum testnets
  421611, // Arbitrum Rinkeby
  421613, // Arbitrum Goerli

  // Telos testnets
  41, // Telos Testnet

  // Aurora testnets
  1313161555, // Aurora Testnet

  // Avalanche testnets
  43113, // Avalanche Fuji

  // Evmos testnets
  9000, // Evmos Testnet

  // Binance Smart Chain testnets
  97, // Binance Smart Chain Testnet

  // Taraxa testnets
  842, // Taraxa Testnet

  // zkSync testnets
  280, // zkSync Testnet

  // Celo testnets
  44787, // Celo Alfajores

  // Fantom testnets
  4002, // Fantom Testnet

  // Filecoin testnets
  3141, // Filecoin Hyperspace
  314159, // Filecoin Calibration

  // Metis testnets
  599, // Metis Goerli

  // IoTeX testnets
  4690, // IoTeX Testnet

  // Base testnets
  84531, // Base Goerli
  84532, // Base Sepolia

  // Zora testnets
  999999999, // Zora Sepolia
  999, // Zora Goerli Testnet

  // Lens testnets
  37111, // Lens Chain Testnet

  // Flare testnets
  114, // Coston2
])

/**
 * Check if a chain is a testnet
 * @param chainId - The chain ID to check
 * @returns true if the chain is a testnet, false otherwise
 */
export function isTestnetChain(chainId: number): boolean {
  return TESTNET_CHAIN_IDS.has(chainId)
}
