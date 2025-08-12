import { useCallback, useState } from "react";
import { type AuthPlayerResponse as OpenfortUser } from '@openfort/openfort-js';
import { OpenfortHookOptions, OpenfortError, OpenfortErrorType } from "../../../types";
import { BaseFlowState, mapStatus } from "./status";
import { useOpenfortCore } from "../../../openfort/useOpenfort";
import { onError, onSuccess } from "../hookConsistency";
import { useCreateWalletPostAuth } from "./useCreateWalletPostAuth";
import { UserWallet } from "../useWallets";

export type GuestHookResult = {
  error?: OpenfortError;
  user?: OpenfortUser;
  wallet?: UserWallet;
};

export type GuestHookOptions = OpenfortHookOptions<OpenfortUser>;

export const useGuestAuth = (hookOptions: GuestHookOptions = {}) => {

  const { client, updateUser } = useOpenfortCore();
  const [status, setStatus] = useState<BaseFlowState>({
    status: "idle",
  });
  const { tryUseWallet } = useCreateWalletPostAuth();

  const signUpGuest = useCallback(async (options: GuestHookOptions = {}): Promise<GuestHookResult> => {
    try {
      setStatus({
        status: 'loading',
      });

      const result = await client.auth.signUpGuest();

      const user = result.player;
      await updateUser(user);

      const { wallet } = await tryUseWallet();

      setStatus({
        status: 'success',
      });

      onSuccess({
        hookOptions,
        options,
        data: user,
      });

      return { user, wallet };
    } catch (error) {
      const openfortError = new OpenfortError("Failed to signup guest", OpenfortErrorType.AUTHENTICATION_ERROR, { error });

      setStatus({
        status: 'error',
        error: openfortError,
      });

      return onError({
        hookOptions,
        options,
        error: openfortError,
      });
    }
  }, [client, setStatus, updateUser, hookOptions]);

  return {
    signUpGuest,
    ...mapStatus(status),
  }
}