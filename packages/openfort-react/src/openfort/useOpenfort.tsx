import React from 'react'
import { Context } from './context'
import { WalletFlowStatus } from '../hooks/openfort/useWallets'

export const useOpenfortCore = () => {
  const context = React.useContext(Context)
  if (!context) throw Error('useOpenfortContext Hook must be inside CoreOpenfortProvider.')
  return context
}

export const useWalletStatus = (): [WalletFlowStatus, (status: WalletFlowStatus) => void] => {
  const context = React.useContext(Context)
  if (!context) throw Error('useWalletStatus Hook must be inside CoreOpenfortProvider.')
  return [context.walletStatus, context.setWalletStatus]
}
