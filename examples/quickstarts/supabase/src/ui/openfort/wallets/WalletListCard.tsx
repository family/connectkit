import {
  FingerPrintIcon,
  KeyIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline'
import {
  RecoveryMethod,
  type UserWallet,
  useSignOut,
  useUser,
  useWallets,
} from '@openfort/react'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { CreateWallet, CreateWalletSheet } from './WalletCreation'
import { WalletRecoverPasswordSheet } from './WalletPasswordSheets'
import { supabase } from '../../../integrations/supabase'

function WalletRecoveryBadge({ wallet }: { wallet: UserWallet }) {
  let Icon = LockClosedIcon
  let label = 'Unknown'

  switch (wallet.recoveryMethod) {
    case RecoveryMethod.PASSWORD:
      Icon = KeyIcon
      label = 'Password'
      break
    case RecoveryMethod.AUTOMATIC:
      Icon = LockClosedIcon
      label = 'Automatic'
      break
    case RecoveryMethod.PASSKEY:
      Icon = FingerPrintIcon
      label = 'Passkey'
      break
  }

  return (
    <div className="flex items-center text-xs">
      <span>{label}</span>
      <Icon className="h-5 w-5 ml-2" />
    </div>
  )
}

export function WalletListCard() {
  const {
    wallets,
    isLoadingWallets,
    availableWallets,
    setActiveWallet,
    isConnecting,
  } = useWallets()
  const { user, isAuthenticated } = useUser()
  const { isConnected } = useAccount()                                                                                                                                                                          

  const [createWalletSheetOpen, setCreateWalletSheetOpen] = useState(false)
  const [walletToRecover, setWalletToRecover] = useState<UserWallet | null>(
    null,
  )

  if (isLoadingWallets || (!user && isAuthenticated)) {
    return <div>Loading wallets...</div>
  }

  if (availableWallets.length === 0) {
    return (
      <div className="flex gap-2 flex-col w-full">
        <h1>Create a wallet</h1>
        <p>You do not have any wallet yet.</p>
        <CreateWallet />
      </div>
    )
  }

  const handleWalletClick = (wallet: UserWallet) => {
    if (wallet.isActive || isConnecting) return

    if (wallet.recoveryMethod === RecoveryMethod.PASSWORD) {
      setWalletToRecover(wallet)
      return
    }

    setActiveWallet({
      walletId: 'xyz.openfort',
      address: wallet.address,
    })
  }

  return (
    <div className="flex flex-col w-full">
      <h1>Wallets</h1>
      <p className="mb-4 text-sm text-zinc-400">
        Select a wallet to connect to your account.
      </p>

      <div className="space-y-4 pb-4">
        <h2>Your Wallets</h2>
        <div className="flex flex-col space-y-2">
          {wallets.map((wallet) => (
            <button
              key={wallet.id + wallet.address}
              className="px-4 py-3 border data-[active=true]:border-zinc-300 border-zinc-700 rounded data-[active=false]:cursor-pointer data-[active=false]:hover:bg-zinc-700/20 hover:border-zinc-300 transition-colors flex-1 text-sm"
              onClick={() => handleWalletClick(wallet)}
              data-active={wallet.isActive}
              disabled={wallet.isActive || isConnecting}
            >
              {wallet.isConnecting ? (
                <p>Connecting...</p>
              ) : (
                <div className="flex justify-between items-center">
                  <p className="font-medium mr-2">
                    {wallet.address.substring(0, 6) +
                      '...' +
                      wallet.address.substring(wallet.address.length - 4)}
                  </p>
                  <WalletRecoveryBadge wallet={wallet} />
                </div>
              )}
            </button>
          ))}

          <button
            className="p-3 border border-zinc-700 rounded cursor-pointer hover:bg-zinc-700/20 hover:border-zinc-300 transition-colors flex-1"
            onClick={() => setCreateWalletSheetOpen(true)}
          >
            + Create Wallet
          </button>
        </div>
      </div>

      <WalletRecoverPasswordSheet
        wallet={walletToRecover}
        open={!!walletToRecover}
        onClose={() => setWalletToRecover(null)}
      />

      <CreateWalletSheet
        open={createWalletSheetOpen}
        onClose={() => setCreateWalletSheetOpen(false)}
      />

      {!isConnected && (
        <button
          onClick={async () => {
            await supabase.auth.signOut()
          }}
          className="mt-auto btn"
        >
          Sign Out
        </button>
      )}
    </div>
  )
}
