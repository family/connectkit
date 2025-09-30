import { FingerPrintIcon, KeyIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { CreateWalletPasswordSheet } from "./passwordRecovery";
import { RecoveryMethod, useWallets } from "@openfort/react";
import { Sheet } from "./ui/Sheet";

export const CreateWalletSheet = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
  return (
    <Sheet
      open={open}
      onClose={() => { onClose(); }}
      title="Create Wallet"
      description="Please choose a recovery method for your new wallet."
    >
      <CreateWallet
        onWalletCreated={() => { onClose(); }}
      />
    </Sheet>
  );
}

export const CreateWallet = ({
  onWalletCreated,
}: {
  onWalletCreated?: () => void
}) => {
  const [passwordSheetOpen, setPasswordSheetOpen] = useState(false);

  const { isCreating, createWallet } = useWallets({
    onSuccess: () => {
      onWalletCreated?.();
    }
  });

  if (isCreating) {
    return <div>Creating wallet...</div>;
  }

  return (
    <>
      <div className="flex flex-wrap gap-4 wallet-option-group mb-4">
        <button
          className="wallet-option cursor-pointer"
          onClick={() => createWallet({
            recovery: {
              recoveryMethod: RecoveryMethod.PASSKEY
            }
          })}
        >
          <h4>Passkey</h4>
          <FingerPrintIcon />
          <p className="text-sm hover-description">Secure your wallet with biometric authentication.</p>
        </button>
        <button
          className="wallet-option cursor-pointer"
          onClick={() => createWallet({
            recovery: {
              recoveryMethod: RecoveryMethod.AUTOMATIC
            }
          })}
        >
          <h4>Automatic recovery</h4>
          <LockClosedIcon />
          <p className="text-sm hover-description">Uses encryption session to recover your wallet.</p>
        </button>
        <button
          className="wallet-option cursor-pointer"
          onClick={() => setPasswordSheetOpen(true)}
        >
          <h4>Password</h4>
          <KeyIcon />
          <p className="text-sm hover-description">Create a strong password to secure your wallet.</p>
        </button>
      </div>
      <p className="mb-4 text-xs text-zinc-400">
        Disclaimer: This is a demo of Openfort recovery methods. In production, it's best to choose one method for a smoother user experience.
      </p>
      <CreateWalletPasswordSheet open={passwordSheetOpen} onClose={() => setPasswordSheetOpen(false)} onCreateWallet={() => { onWalletCreated?.(); }} />
    </>
  )
}
