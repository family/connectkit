export interface UserAccount {
  provider: string
  createdAt: number
  updatedAt: number
  accountId: string
  chainType: 'SVM' | 'EVM'
  chainId: number
  connectorType: string
  walletClientType: string
}

// OPT_TODO: Wallet type from openfort-js. this could break client if not updated
