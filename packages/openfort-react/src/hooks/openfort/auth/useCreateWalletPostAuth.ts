import { RecoveryMethod } from "@openfort/openfort-js"
import { useCallback } from "react"
import { useOpenfort } from "../../../components/Openfort/useOpenfort"
import { embeddedWalletId } from "../../../constants/openfort"
import { useWallets } from "../useWallets"
import { useSignOut } from "./useSignOut"

export type CreateWalletPostAuthOptions = {
  /**
   * @default true
   * It will log out the user if there is an error while trying to create a wallet (automatic recovery).
   */
  logoutOnError?: boolean;

  /**
   * 
   */
  automaticRecovery?: boolean;
};

// this hook is used to create a wallet after the user has authenticated
export const useCreateWalletPostAuth = () => {
  const { setActiveWallet } = useWallets()
  const { walletConfig } = useOpenfort();
  const { signOut } = useSignOut();

  const tryUseWallet = useCallback(async ({ logoutOnError: signOutOnError = true, automaticRecovery = true }: CreateWalletPostAuthOptions) => {
    if (!walletConfig || walletConfig.recoveryMethod !== RecoveryMethod.AUTOMATIC || !automaticRecovery) {
      return {};
    }

    const wallet = await setActiveWallet({
      connector: embeddedWalletId,
    });

    if (wallet.error && signOutOnError) {
      // If there was an error and we should log out, we can call the logout function
      await signOut();
    }

    return wallet;
  }, [walletConfig, setActiveWallet, signOut]);

  return {
    tryUseWallet,
  }
}