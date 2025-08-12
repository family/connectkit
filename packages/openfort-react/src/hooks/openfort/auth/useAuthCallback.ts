import { useCallback, useEffect, useState } from "react";
import { useOpenfortKit } from "../../../components/Openfort/useOpenfortKit";
import { BaseFlowState, mapStatus } from "./status";
import { useOpenfortCore } from "../../../openfort/useOpenfort";
import { OpenfortHookOptions, OpenfortError, OpenfortErrorType } from "../../../types";
import { onError, onSuccess } from "../hookConsistency";
import { AuthProvider } from "../../../components/Openfort/types";
import { useCreateWalletPostAuth } from "./useCreateWalletPostAuth";
import { UserWallet } from "../useWallets";
import { type AuthPlayerResponse as OpenfortUser } from '@openfort/openfort-js';


type CallbackResult = StoreCredentialsResult | EmailVerificationResult;

type EmailVerificationResult = {
  type: "verifyEmail";
  email?: string,
  error?: OpenfortError
}

type StoreCredentialsResult = {
  type: "storeCredentials";
  user?: OpenfortUser;
  wallet?: UserWallet;
  error?: OpenfortError;
}

type VerifyEmailOptions = {
  email: string;
  state: string;
} & OpenfortHookOptions<EmailVerificationResult>;

type StoreCredentialsOptions = {
  player: string;
  accessToken: string;
  refreshToken: string;
} & OpenfortHookOptions<StoreCredentialsResult>;

type UseAuthCallbackOptions = {
  automaticallyHandleCallback?: boolean;
} & OpenfortHookOptions<CallbackResult>;

export const useAuthCallback = ({
  automaticallyHandleCallback = true, // Automatically handle OAuth and email callback
  ...hookOptions
}: UseAuthCallbackOptions = {}) => {
  const { log } = useOpenfortKit();
  const [status, setStatus] = useState<BaseFlowState>({
    status: "idle",
  });
  const { client, updateUser } = useOpenfortCore();
  const [provider, setProvider] = useState<AuthProvider | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const { tryUseWallet } = useCreateWalletPostAuth();

  const verifyEmail = useCallback(async ({ email, state, ...options }: VerifyEmailOptions): Promise<EmailVerificationResult> => {
    setStatus({
      status: 'loading',
    });
    setEmail(email);

    try {
      await client.auth.verifyEmail({
        email,
        state,
      })
      setStatus({
        status: 'success',
      });

      return onSuccess({
        hookOptions,
        options,
        data: { email, type: "verifyEmail" },
      });

    } catch (e) {
      const error = new OpenfortError("Failed to verify email", OpenfortErrorType.AUTHENTICATION_ERROR, { error: e });

      setStatus({
        status: 'error',
        error,
      });

      log("Error verifying email", e);

      onError({
        hookOptions,
        options,
        error,
      });

      return { error, type: "verifyEmail" };
    }
  }, [client, log, hookOptions]);

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

      const { wallet } = await tryUseWallet();

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
      log("Error storing credentials", e);

      onError({
        hookOptions,
        options,
        error,
      });
      return { error, type: "storeCredentials" };
    }
  }, [client, log, hookOptions]);

  useEffect(() => {
    if (!automaticallyHandleCallback) return;

    (async () => {
      // redirectUrl is not working with query params OF-1013
      const fixedUrl = window.location.href.replaceAll("?", "&").replace("&", "?");
      const url = new URL(fixedUrl);
      const openfortAuthProvider = url.searchParams.get("openfortAuthProvider");

      if (!openfortAuthProvider) {
        return;
      }

      setProvider(openfortAuthProvider as AuthProvider);
      if (openfortAuthProvider === "email") {

        // Verify email flow
        const state = url.searchParams.get("state");
        const email = url.searchParams.get("email");

        if (!state || !email) {
          console.error("No state or email found in URL");
          onError({
            hookOptions,
            options: {},
            error: new OpenfortError("No state or email found in URL", OpenfortErrorType.AUTHENTICATION_ERROR),
          });
          return;
        }

        const removeParams = () => {
          ["state", "openfortAuthProvider", "email"].forEach((key) => url.searchParams.delete(key));
          window.history.replaceState({}, document.title, url.toString());
        }

        log("EmailVerification", state, email);
        await verifyEmail({ email, state });
        removeParams();
      } else {

        const player = url.searchParams.get("player_id");
        const accessToken = url.searchParams.get("access_token");
        const refreshToken = url.searchParams.get("refresh_token");

        if (!player || !accessToken || !refreshToken) {
          console.error(`Missing player id or access token or refresh token`, {
            player,
            accessToken: accessToken ? accessToken.substring(0, 10) + "..." : accessToken,
            refreshToken,
            fixedUrl
          });
          onError({
            hookOptions,
            options: {},
            error: new OpenfortError("Missing player id or access token or refresh token", OpenfortErrorType.AUTHENTICATION_ERROR),
          });

          return;
        }

        const removeParams = () => {
          [
            "openfortAuthProvider",
            "refresh_token",
            "access_token",
            "player_id",
          ].forEach((key) => url.searchParams.delete(key));
          window.history.replaceState({}, document.title, url.toString());
        }

        log("callback", { player, accessToken, refreshToken });

        const { wallet, user, error, type } = await storeCredentials({ player, accessToken, refreshToken });
        removeParams();
      }

    })();
  }, []);

  return {
    email,
    provider,
    verifyEmail,
    storeCredentials,
    ...mapStatus(status),
  };
}