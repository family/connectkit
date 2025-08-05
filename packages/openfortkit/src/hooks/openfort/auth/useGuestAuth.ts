import { useCallback, useState } from "react";
import { type AuthPlayerResponse as OpenfortUser } from '@openfort/openfort-js';
import { OpenfortHookOptions, OpenfortKitError, OpenfortKitErrorType } from "../../../types";
import { BaseFlowState, mapStatus } from "./status";
import { useOpenfort } from "../../../openfort/useOpenfort";
import { onError, onSuccess } from "../hookConsistency";

export type GuestHookResult = {
  error?: OpenfortKitError;
  user?: OpenfortUser;
};

export type GuestHookOptions = OpenfortHookOptions<OpenfortUser>;

export const useGuestAuth = (hookOptions: GuestHookOptions = {}) => {

  const { client, updateUser } = useOpenfort();
  const [status, setStatus] = useState<BaseFlowState>({
    status: "idle",
  });


  const signUpGuest = useCallback(async (options: GuestHookOptions = {}): Promise<GuestHookResult> => {
    try {
      setStatus({
        status: 'loading',
      });

      const result = await client.auth.signUpGuest();

      setStatus({
        status: 'success',
      });
      const user = result.player;
      await updateUser(user);

      onSuccess({
        hookOptions,
        options,
        data: user,
      });

      return { user };
    } catch (error) {
      const openfortKitError = new OpenfortKitError("Failed to signup guest", OpenfortKitErrorType.AUTHENTICATION_ERROR, { error });

      setStatus({
        status: 'error',
        error: openfortKitError,
      });

      return onError({
        hookOptions,
        options,
        error: openfortKitError,
      });
    }
  }, [client, setStatus, updateUser, hookOptions]);

  return {
    signUpGuest,
    ...mapStatus(status),
  }
}