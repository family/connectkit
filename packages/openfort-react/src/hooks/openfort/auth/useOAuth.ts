import { OAuthProvider } from '@openfort/openfort-js';
import { useCallback, useState } from "react";
import { AuthProvider } from '../../../components/Openfort/types';
import { useOpenfortCore } from '../../../openfort/useOpenfort';
import { BaseFlowState, mapStatus } from './status';
import { OpenfortHookOptions, OpenfortError, OpenfortErrorType } from '../../../types';
import { buildCallbackUrl } from './requestEmailVerification';
import { onError, onSuccess } from '../hookConsistency';

// TODO: Open auth in a new tab and use polling to check for completion
export type InitializeOAuthOptions = {
  provider: AuthProvider,
  redirectTo?: string;
} & OpenfortHookOptions;

export type AuthHookOptions = {
  redirectTo?: string;
} & OpenfortHookOptions;

export type InitOAuthReturnType = {
  error?: OpenfortError;
}

const providerToAuthProvider: Partial<Record<AuthProvider, OAuthProvider>> = {
  // [OAuthProvider.APPLE]: AuthProvider.,
  // [OAuthProvider.DISCORD]: AuthProvider.,
  // [OAuthProvider.EPIC_GAMES]: AuthProvider.,
  [AuthProvider.FACEBOOK]: OAuthProvider.FACEBOOK,
  [AuthProvider.GOOGLE]: OAuthProvider.GOOGLE,
  // [OAuthProvider.LINE]: AuthProvider.,
  [AuthProvider.TWITTER]: OAuthProvider.TWITTER,
}


function getOAuthProvider(provider: AuthProvider): OAuthProvider {
  if (!providerToAuthProvider[provider]) {
    throw new Error(`Unsupported OAuth provider: ${provider}`);
  }

  return providerToAuthProvider[provider];
}

export const useOAuth = (hookOptions: AuthHookOptions = {}) => {

  const { client, updateUser } = useOpenfortCore();
  const [status, setStatus] = useState<BaseFlowState>({
    status: "idle",
  });

  const initOAuth = useCallback(async (options: InitializeOAuthOptions): Promise<InitOAuthReturnType> => {
    const authProvider = options.provider;

    try {
      setStatus({
        status: 'loading',
      });

      await client.auth.initOAuth({
        provider: getOAuthProvider(authProvider),
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
        provider: getOAuthProvider(authProvider),
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
    ...mapStatus(status),
  }
}