import { RecoveryMethod } from "@openfort/openfort-js"
import { useCallback } from "react"
import { useOpenfortKit } from "../../../components/Openfort/useOpenfortKit"
import { embeddedWalletId } from "../../../constants/openfort"
import { useWallets } from "../useWallets"

// this hook is used to create a wallet after the user has authenticated
export const useCreateWalletPostAuth = () => {
  const { setActiveWallet } = useWallets()
  const { walletConfig } = useOpenfortKit();

  const tryUseWallet = useCallback(async () => {
    if (!walletConfig || walletConfig.recoveryMethod !== RecoveryMethod.AUTOMATIC)
      return {};

    return await setActiveWallet({
      connector: embeddedWalletId,
    });
  }, [walletConfig])

  return {
    tryUseWallet,
  }
}