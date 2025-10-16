import { FingerPrintIcon, KeyIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { RecoveryMethod, useWallets } from '@openfort/react';
import { useState } from 'react';

import { Sheet } from '../../../components/ui/Sheet';
import { CreateWalletPasswordSheet } from './WalletPasswordSheets';

type CreateWalletSheetProps = {
  open: boolean;
  onClose: () => void;
  onWalletCreated?: () => void;
};

export function CreateWalletSheet({ open, onClose, onWalletCreated }: CreateWalletSheetProps) {
  return (
    <Sheet
      open={open}
      onClose={() => {
        onClose();
      }}
      title="Create Wallet"
      description="Please choose a recovery method for your new wallet."
    >
      <CreateWallet
        onWalletCreated={() => {
          onClose();
          onWalletCreated?.();
        }}
      />
    </Sheet>
  );
}

export function CreateWallet({ onWalletCreated }: { onWalletCreated?: () => void }) {
  const [passwordSheetOpen, setPasswordSheetOpen] = useState(false);

  const { isCreating, createWallet, error } = useWallets({
    onSuccess: () => {
      onWalletCreated?.();
    },
  });

  if (isCreating) {
    return <div>Creating wallet...</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-4 wallet-option-group mb-4">
        <button
          type="button"
          className="wallet-option cursor-pointer"
          onClick={() =>
            createWallet({
              recovery: {
                recoveryMethod: RecoveryMethod.PASSKEY,
              },
            })
          }
        >
          <FingerPrintIcon />
          <div className="flex flex-col text-start">
            <h4>Passkey</h4>
            <p className="text-sm hover-description">
              Secure your wallet with biometric authentication.
            </p>
          </div>
        </button>
        <button
          type="button"
          className="wallet-option cursor-pointer"
          onClick={() =>
            createWallet({
              recovery: {
                recoveryMethod: RecoveryMethod.AUTOMATIC,
              },
            })
          }
        >
          <LockClosedIcon />
          <div className="flex flex-col text-start">
            <h4>Automatic recovery</h4>
            <p className="text-sm hover-description">
              Uses encryption session to recover your wallet.
            </p>
          </div>
        </button>
        <button
          type="button"
          className="wallet-option cursor-pointer"
          onClick={() => setPasswordSheetOpen(true)}
        >
          <KeyIcon />
          <div className="flex flex-col text-start">
            <h4>Password</h4>
            <p className="text-sm hover-description">
              Create a strong password to secure your wallet.
            </p>
          </div>
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mb-2">Error: {error.message}</p>}
      <p className="mb-4 text-xs text-zinc-400">
        Disclaimer: This is a demo of Openfort recovery methods. In production, it's best to choose
        one method for a smoother user experience.
      </p>
      <CreateWalletPasswordSheet
        open={passwordSheetOpen}
        onClose={() => setPasswordSheetOpen(false)}
        onCreateWallet={() => {
          onWalletCreated?.();
        }}
      />
    </>
  );
}
