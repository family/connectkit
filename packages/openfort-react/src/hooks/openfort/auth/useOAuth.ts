import { OAuthProvider } from '@openfort/openfort-js';
import { useCallback, useState } from "react";
import { useOpenfortCore } from '../../../openfort/useOpenfort';
import { BaseFlowState, mapStatus } from './status';
import { OpenfortHookOptions, OpenfortError, OpenfortErrorType } from '../../../types';
import { buildCallbackUrl } from './requestEmailVerification';
import { onError, onSuccess } from '../hookConsistency';
import { CreateWalletPostAuthOptions, useConnectToWalletPostAuth } from './useConnectToWalletPostAuth';

import { UserWallet } from "../useWallets";
import { type AuthPlayerResponse as OpenfortUser } from '@openfort/openfort-js';

// TODO: Open auth in a new tab and use polling to check for completion
export type InitializeOAuthOptions = {
  provider: OAuthProvider,
  redirectTo?: string;
} & OpenfortHookOptions<InitOAuthReturnType>;

export type InitOAuthReturnType = {
  error?: OpenfortError;
}

export type StoreCredentialsResult = {
  // type: "storeCredentials";
  user?: OpenfortUser;
  wallet?: UserWallet;
  error?: OpenfortError;
}
export type StoreCredentialsOptions = {
  player: string;
  accessToken: string;
  refreshToken: string;
} & OpenfortHookOptions<StoreCredentialsResult> & CreateWalletPostAuthOptions;

export type AuthHookOptions = {
  redirectTo?: string;
} & OpenfortHookOptions<StoreCredentialsResult | InitOAuthReturnType> & CreateWalletPostAuthOptions;

export const useOAuth = (hookOptions: AuthHookOptions = {}) => {

  const { client, updateUser } = useOpenfortCore();
  const [status, setStatus] = useState<BaseFlowState>({
    status: "idle",
  });

  const { tryUseWallet } = useConnectToWalletPostAuth();

  const storeCredentials = useCallback(async ({
    player,
    accessToken,
    refreshToken,
    ...options
  }: StoreCredentialsOptions): Promise<StoreCredentialsResult> => {
    setStatus({
      status: 'loading',
    });

    try {
      await client.auth.storeCredentials({
        player,
        accessToken,
        refreshToken,
      });
      setStatus({
        status: 'success',
      });

      const user = await updateUser() || undefined;

      const { wallet } = await tryUseWallet({
        logoutOnError: options.logoutOnError || hookOptions.logoutOnError,
        automaticRecovery: options.automaticRecovery || hookOptions.automaticRecovery,
      });

      return onSuccess({
        data: { user, wallet, type: "storeCredentials" },
        hookOptions,
        options,
      });
    } catch (e) {
      const error = new OpenfortError("Failed to store credentials", OpenfortErrorType.AUTHENTICATION_ERROR, { error: e });

      setStatus({
        status: 'error',
        error,
      });

      return onError({
        hookOptions,
        options,
        error,
      });
    }
  }, [client, hookOptions]);

  const initOAuth = useCallback(async (options: InitializeOAuthOptions): Promise<InitOAuthReturnType> => {
    const authProvider = options.provider;

    try {
      setStatus({
        status: 'loading',
      });

      await client.auth.initOAuth({
        provider: authProvider,
        options: {
          redirectTo: buildCallbackUrl({
            provider: authProvider,
            callbackUrl: hookOptions?.redirectTo ?? options?.redirectTo,
          })
        },
      });

      return onSuccess<InitOAuthReturnType>({
        data: {},
        hookOptions,
        options,
      });
    } catch (e) {
      const error = new OpenfortError("Failed to login with OAuth",
        OpenfortErrorType.AUTHENTICATION_ERROR, { error: e });

      setStatus({
        status: 'error',
        error
      });

      return onError({
        hookOptions,
        options,
        error,
      });
    }
  }, [client, setStatus, updateUser, hookOptions]);

  const linkOauth = useCallback(async (options: InitializeOAuthOptions): Promise<InitOAuthReturnType> => {

    const authProvider = options.provider;

    try {
      setStatus({
        status: 'loading',
      });

      const authToken = await client.getAccessToken();

      if (!authToken) {
        throw new OpenfortError("No auth token found",
          OpenfortErrorType.AUTHENTICATION_ERROR);
      }

      await client.auth.initLinkOAuth({
        authToken,
        provider: authProvider,
        options: {
          redirectTo: buildCallbackUrl({
            provider: authProvider,
            callbackUrl: options?.redirectTo ?? hookOptions?.redirectTo,
          })
        },
      });

      return onSuccess<InitOAuthReturnType>({
        data: {},
        hookOptions,
        options,
      });
    } catch (e) {
      const error = new OpenfortError("Failed to link OAuth",
        OpenfortErrorType.AUTHENTICATION_ERROR, { error: e });

      setStatus({
        status: 'error',
        error
      });

      return onError({
        hookOptions,
        options,
        error,
      });
    }
  }, [client, setStatus, updateUser, hookOptions]);

  return {
    initOAuth,
    linkOauth,
    storeCredentials,
    ...mapStatus(status),
  }
}