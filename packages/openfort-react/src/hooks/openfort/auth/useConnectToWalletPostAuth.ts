import { EmbeddedAccount, RecoveryMethod } from "@openfort/openfort-js"
import { useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import { useOpenfort } from "../../../components/Openfort/useOpenfort"
import { embeddedWalletId } from "../../../constants/openfort"
import { UserWallet, useWallets } from "../useWallets"
import { useSignOut } from "./useSignOut"

export type CreateWalletPostAuthOptions = {
  /**
   * @default true
   * It will log out the user if there is an error while trying to create a wallet (automatic recovery).
   */
  logoutOnError?: boolean;

  /**
   * @default true
   * It will automatically try to recover the first wallet with automatic recovery.
   */
  recoverWalletAutomatically?: boolean;
};

// this hook is used to create a wallet after the user has authenticated
export const useConnectToWalletPostAuth = () => {
  const { createWallet, setActiveWallet } = useWallets()
  const { walletConfig } = useOpenfort();
  const { signOut } = useSignOut();
  const queryClient = useQueryClient();

  const tryUseWallet = useCallback(async ({ logoutOnError: signOutOnError = true, recoverWalletAutomatically = true }: CreateWalletPostAuthOptions): Promise<{ wallet?: UserWallet }> => {
    if ((!walletConfig?.createEncryptedSessionEndpoint && !walletConfig?.getEncryptionSession) || !recoverWalletAutomatically) {
      // If there is no encryption session, we cannot create a wallet
      return {};
    }

    const wallets = await queryClient.ensureQueryData<EmbeddedAccount[]>({ queryKey: ['openfortEmbeddedAccountsList'] });

    let wallet: UserWallet | undefined;

    if (wallets.length === 0) {
      const createWalletResult = await createWallet();
      if (createWalletResult.error && signOutOnError) {
        console.error("Error creating wallet:", createWalletResult.error);
        // If there was an error and we should log out, we can call the logout function
        await signOut();
        return {};
      }
      wallet = createWalletResult.wallet!;
    }

    // Has a wallet with automatic recovery
    if (wallets.some(w => w.recoveryMethod === RecoveryMethod.AUTOMATIC)) {
      const setWalletResult = await setActiveWallet({
        walletId: embeddedWalletId,
      });

      if (!setWalletResult.wallet || (setWalletResult.error && signOutOnError)) {
        console.error("Error recovering wallet:", setWalletResult.error);
        // If there was an error and we should log out, we can call the logout function
        await signOut();
      }
      wallet = setWalletResult.wallet!;
    }

    return { wallet };
  }, [walletConfig, setActiveWallet, signOut]);

  return {
    tryUseWallet,
  }
}