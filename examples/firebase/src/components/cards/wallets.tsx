import { KeyIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { RecoveryMethod, useStatus, useUser, useWallets, type UserWallet } from "@openfort/react";
import { useState } from "react";
import { CreateWallet, CreateWalletSheet } from "../createWallet";
import { WalletRecoverPasswordSheet } from "../passwordRecovery";
import { auth } from "../../lib/firebase";


export const Wallets = () => {
  const { wallets, isLoadingWallets, hasWallet, setActiveWallet, isConnecting } = useWallets();
  const { user, isAuthenticated } = useUser();
  const { isConnected } = useStatus();
  const [createWalletSheetOpen, setCreateWalletSheetOpen] = useState(false);
  const [walletToRecover, setWalletToRecover] = useState<UserWallet | null>(null);

  if (isLoadingWallets || (!user && isAuthenticated)) {
    return <div>Loading wallets...</div>
  }
  if (!hasWallet) {
    return (
      <>
        <p>You do not have any wallet yet.</p>
        {/* <p>Please create a wallet to continue.</p> */}
        <CreateWallet />
      </>
    )
  }

  const renderWalletRecovery = (wallet: UserWallet) => {
    let Icon = LockClosedIcon;
    let text = "Unknown";
    // TODO: replace with actual wallet type (Password, Automatic, etc)
    const method: RecoveryMethod = RecoveryMethod.PASSWORD as RecoveryMethod;

    console.log("Rendering wallet recovery method for wallet:", wallet, method);
    switch (method) { // TODO: replace with actual wallet type (Password, Automatic, etc)
      case RecoveryMethod.PASSWORD:
        Icon = KeyIcon;
        text = "Password";
        break;
      case RecoveryMethod.AUTOMATIC:
        Icon = LockClosedIcon;
        text = "Automatic";
        break;
      // case RecoveryMethod.:
      //   Icon = FingerPrintIcon;
      //   break;
    }

    return (
      <div className="flex items-center text-xs">
        <span>{text}</span>
        <Icon className="h-5 w-5 ml-2" />
      </div>
    )
  }

  const handleWalletClick = (wallet: UserWallet) => {
    if (wallet.isActive || isConnecting) return;
    // TODO: replace with actual wallet type (Password, Automatic, etc)
    const method: RecoveryMethod = RecoveryMethod.PASSWORD as RecoveryMethod;

    switch (method) { // TODO: replace with actual wallet type (Password, Automatic, etc)
      case RecoveryMethod.PASSWORD:
        setWalletToRecover(wallet);
        break;
      case RecoveryMethod.AUTOMATIC:
        setActiveWallet({
          connector: "xyz.openfort",
          address: wallet.address,
        })
        break;
    }
  }

  return (
    <div className="flex flex-col w-full">
      <h1>Wallets</h1>
      <p className="mb-4 text-sm text-zinc-400">
        Select a wallet to connect to your account.
      </p>
      <div className="space-y-4">
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
                <p>
                  Connecting...
                </p>
              ) : (
                <div className="flex justify-between items-center">
                  <p className="font-medium mr-2">
                    {wallet.address.substring(0, 6) + "..." + wallet.address.substring(wallet.address.length - 4)}
                  </p>
                  {renderWalletRecovery(wallet)}
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
        open={!!walletToRecover} // TODO: open based on wallet type
        onClose={() => setWalletToRecover(null)}
      />
      <CreateWalletSheet
        open={createWalletSheetOpen}
        onClose={() => setCreateWalletSheetOpen(false)}
      />

      {
        !isConnected &&
        <button
          onClick={() => {
            auth.signOut();
          }}
          className="mt-auto btn"
        >
          Sign Out
        </button>
      }
    </div>
  )
}
