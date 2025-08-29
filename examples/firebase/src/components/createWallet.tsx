import { ChevronLeftIcon, FingerPrintIcon, KeyIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

const Sheet = ({ open, onClose, title, description, children }: { open: boolean, onClose: () => void, title: string, description: string, children: React.ReactNode }) => {
  if (!open) return null;

  const [isClosing, setIsClosing] = useState(false);
  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(onClose, 300);
      return () => clearTimeout(timer);
    }
  }, [isClosing, onClose]);

  return (
    <div
      className="m-0 p-4 absolute inset-0 bg-zinc-800 data-[closing=false]:animate-sheet-in data-[closing=true]:animate-sheet-out"
      data-closing={isClosing}
    >
      <div className="flex items-center gap-2 mb-4">
        <button
          className="rounded p-2 hover:text-white transition-colors cursor-pointer"
          onClick={() => setIsClosing(true)}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <div>
          <h2>{title}</h2>
          <p className="text-sm">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

const PasswordSheet = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Enter Password"
      description="Please enter the password of your wallet."
    >
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto">
        <input
          type="password"
          placeholder="Enter your wallet's password"
          className="w-full mt-2 p-2 border border-gray-300 rounded"
        />
        <button
          className="mt-4 w-full bg-zinc-700 text-white p-2 rounded"
        >
          Create Wallet
        </button>
      </div>
    </Sheet>
  )
}

export const CreateWalletSheet = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Create Wallet"
      description="Choose a recovery method to create your wallet."
    >
      <CreateWallet />
    </Sheet>
  )
}

export const CreateWallet = () => {
  const [passwordSheetOpen, setPasswordSheetOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-4 wallet-option-group mb-4">
        <button
          className="wallet-option cursor-pointer"
        >
          <h4>Passkey</h4>
          <FingerPrintIcon />
          <p className="text-sm hover-description">Secure your wallet with biometric authentication.</p>
        </button>
        <button
          className="wallet-option cursor-pointer"
        // onClick={() => createWallet({
        //   password: "your-password"
        // })}
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
      <PasswordSheet open={passwordSheetOpen} onClose={() => setPasswordSheetOpen(false)} />
    </>
  )
}