import type { Hex } from 'viem'

type TokenConfig = {
  symbol: string
  address: Hex
  decimals: number
  name?: string
}

export const ERC20_TOKEN_LIST: Record<number, TokenConfig[]> = {
  // Ethereum Mainnet
  1: [
    {
      symbol: 'USDC',
      address: '0xA0b86991C6218b36C1d19D4a2e9Eb0cE3606eB48',
      decimals: 6,
      name: 'USD Coin',
    },
    {
      symbol: 'USDT',
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      decimals: 6,
      name: 'Tether USD',
    },
  ],
  // Polygon
  137: [
    {
      symbol: 'USDC',
      address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
      decimals: 6,
      name: 'USD Coin',
    },
    {
      symbol: 'USDT',
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      decimals: 6,
      name: 'Tether USD',
    },
  ],
  // Arbitrum One
  42161: [
    {
      symbol: 'USDC',
      address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      decimals: 6,
      name: 'USD Coin',
    },
    {
      symbol: 'USDT',
      address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      decimals: 6,
      name: 'Tether USD',
    },
  ],
  // Optimism
  10: [
    {
      symbol: 'USDC',
      address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
      decimals: 6,
      name: 'USD Coin',
    },
    {
      symbol: 'USDT',
      address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      decimals: 6,
      name: 'Tether USD',
    },
  ],
  // Base
  8453: [
    {
      symbol: 'USDC',
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      decimals: 6,
      name: 'USD Coin',
    },
  ],
  // Base Sepolia (Testnet)
  84532: [
    {
      symbol: 'USDC',
      address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
      decimals: 6,
      name: 'USD Coin',
    },
  ],
  // BNB Smart Chain
  56: [
    {
      symbol: 'USDC',
      address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      decimals: 18,
      name: 'USD Coin',
    },
    {
      symbol: 'USDT',
      address: '0x55d398326f99059fF775485246999027B3197955',
      decimals: 18,
      name: 'Tether USD',
    },
  ],
  // Avalanche C-Chain
  43114: [
    {
      symbol: 'USDC',
      address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
      decimals: 6,
      name: 'USD Coin',
    },
    {
      symbol: 'USDT',
      address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
      decimals: 6,
      name: 'Tether USD',
    },
  ],
}
