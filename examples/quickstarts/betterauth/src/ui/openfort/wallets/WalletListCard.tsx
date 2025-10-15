import { useState } from "react";
import { FingerPrintIcon, KeyIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { RecoveryMethod, useSignOut, useStatus, useUser, useWallets, type UserWallet } from "@openfort/react";

import { CreateWallet, CreateWalletSheet } from "./WalletCreation";
import { WalletRecoverPasswordSheet } from "./WalletPasswordSheets";
import { signOut as betterAuthSignOut } from "../../../integrations/betterauth";

function WalletRecoveryBadge({ wallet }: { wallet: UserWallet }) {
  let Icon = LockClosedIcon;
  let label = "Unknown";

  switch (wallet.recoveryMethod) {
    case RecoveryMethod.PASSWORD:
      Icon = KeyIcon;
      label = "Password";
      break;
    case RecoveryMethod.AUTOMATIC:
      Icon = LockClosedIcon;
      label = "Automatic";
      break;
    case RecoveryMethod.PASSKEY:
      Icon = FingerPrintIcon;
      label = "Passkey";
      break;
  }

  return (
    <div className="flex items-center text-xs">
      <span>{label}</span>
      <Icon className="h-5 w-5 ml-2" />
    </div>
  );
}

export function WalletListCard() {
  const { wallets, isLoadingWallets, hasWallet, setActiveWallet, isConnecting } = useWallets();
  const { user, isAuthenticated } = useUser();
  const { isConnected } = useStatus();
  const { signOut } = useSignOut();

  const [createWalletSheetOpen, setCreateWalletSheetOpen] = useState(false);
  const [walletToRecover, setWalletToRecover] = useState<UserWallet | null>(null);

  if (isLoadingWallets || (!user && isAuthenticated)) {
    return <div>Loading wallets...</div>;
  }

  if (!hasWallet) {
    return (
      <div className="flex gap-2 flex-col w-full">
        <h1>Create a wallet</h1>
        <p>You do not have any wallet yet.</p>
        <CreateWallet />
      </div>
    );
  }

  const handleWalletClick = (wallet: UserWallet) => {
    if (wallet.isActive || isConnecting) return;

    if (wallet.recoveryMethod === RecoveryMethod.PASSWORD) {
      setWalletToRecover(wallet);
      return;
    }

    setActiveWallet({
      walletId: "xyz.openfort",
      address: wallet.address,
    });
  };

  return (
    <div className="flex flex-col w-full">
      <h1>Wallets</h1>
      <p className="mb-4 text-sm text-zinc-400">Select a wallet to connect to your account.</p>

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
                    {wallet.address.substring(0, 6) + "..." + wallet.address.substring(wallet.address.length - 4)}
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

      <WalletRecoverPasswordSheet wallet={walletToRecover} open={!!walletToRecover} onClose={() => setWalletToRecover(null)} />

      <CreateWalletSheet open={createWalletSheetOpen} onClose={() => setCreateWalletSheetOpen(false)} />

      {!isConnected && (
        <button
          onClick={async () => {
            await betterAuthSignOut().catch((error) => {
              console.error("Better Auth - Failed to sign out", error);
            });
            await signOut();
          }}
          className="mt-auto btn"
        >
          Sign Out
        </button>
      )}
    </div>
  );
}
