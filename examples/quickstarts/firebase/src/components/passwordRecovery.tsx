import { useWallets, type UserWallet } from "@openfort/react";
import { Sheet } from "./ui/Sheet"
import { CheckCircleIcon } from "@heroicons/react/24/outline";

type CreateWalletPasswordSheetProps = {
  open: boolean,
  onClose: () => void
};
export const CreateWalletPasswordSheet = ({ open, onClose }: CreateWalletPasswordSheetProps) => {
  const { createWallet, error, isCreating, reset } = useWallets();

  return (
    <Sheet
      open={open}
      onClose={() => { onClose(); reset(); }}
      title="Enter Password"
      description="Please enter the password of your wallet."
    >

      <form
        className="flex-1 w-full flex flex-col justify-center max-w-md mx-auto"
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const password = formData.get("password") as string;

          const { error } = await createWallet({
            password,
          });

          if (!error) {
            onClose();
          }
        }}
      >
        <div className="flex flex-col gap-2 mr-4 mb-4">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-primary my-4 shrink-0" />
            <span>This password will be used to secure your account</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-primary my-4 shrink-0" />
            <span>If you lose this password, you will not be able to access your wallet</span>
          </div>
        </div>
        <input
          type="password"
          name="password"
          placeholder="Enter your wallet's password"
          className="w-full mt-2 p-2 border border-gray-300 rounded"
        />
        {
          error && (
            <span className="text-red-500 text-sm mt-2">
              {error?.message}
            </span>
          )
        }
        <button
          className="mt-4 w-full bg-zinc-700 text-white p-2 rounded cursor-pointer"
          type="submit"
          disabled={isCreating}
        >
          {
            isCreating ? "Creating wallet..." : "Create Wallet"
          }
        </button>
      </form>
    </Sheet>
  )
}


type WalletRecoverPasswordProps = {
  open: boolean,
  onClose: () => void,
  wallet: UserWallet | null
};

export const WalletRecoverPasswordSheet = ({ open, onClose, wallet }: WalletRecoverPasswordProps) => {
  const { setActiveWallet, error, isConnecting, reset } = useWallets();

  return (
    <Sheet
      open={open}
      onClose={() => { onClose(); reset(); }}
      title="Enter Password"
      description="Please enter the password of your wallet."
    >
      <form
        className="w-full flex-1 flex flex-col justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const password = formData.get("password") as string;
          if (!wallet) throw new Error("No wallet to recover");

          setActiveWallet({
            connector: "xyz.openfort",
            password,
            address: wallet.address,
          });
        }}
      >
        {
          wallet && (
            <p>Recover wallet {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)} with password</p>
          )
        }
        <input
          type="password"
          name="password"
          placeholder="Enter your wallet's password"
          className="w-full mt-2 p-2 border border-gray-300 rounded"
        />
        {
          error && (
            <span className="text-red-500 text-sm mt-2">
              {error?.message}
            </span>
          )
        }
        <button
          className="mt-4 w-full bg-zinc-700 text-white p-2 rounded cursor-pointer"
          type="submit"
          disabled={isConnecting}
        >
          {
            isConnecting ? "Recovering..." : "Recover Wallet"
          }
        </button>
      </form>
    </Sheet>
  )
}
