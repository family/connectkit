import type { Address } from 'viem'

export type TokenConfig = {
  symbol: string
  address: Address
  decimals: number
  name?: string
}

export const ERC20_TOKEN_LIST: Record<number, TokenConfig[]> = {
  1: [
    {
      symbol: 'USDC',
      address: '0xA0b86991C6218b36C1d19D4a2e9Eb0cE3606eB48' as Address,
      decimals: 6,
      name: 'USD Coin',
    },
    {
      symbol: 'USDT',
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as Address,
      decimals: 6,
      name: 'Tether USD',
    },
    {
      symbol: 'DAI',
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' as Address,
      decimals: 18,
      name: 'Dai',
    },
  ],
}
