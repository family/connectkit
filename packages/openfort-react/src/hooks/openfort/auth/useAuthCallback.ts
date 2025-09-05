import { useCallback, useEffect, useState } from "react";
import { useOpenfort } from "../../../components/Openfort/useOpenfort";
import { BaseFlowState, mapStatus } from "./status";
import { useOpenfortCore } from "../../../openfort/useOpenfort";
import { OpenfortHookOptions, OpenfortError, OpenfortErrorType } from "../../../types";
import { onError, onSuccess } from "../hookConsistency";
import { UIAuthProvider } from "../../../components/Openfort/types";
import { CreateWalletPostAuthOptions, useConnectToWalletPostAuth } from "./useConnectToWalletPostAuth";
import { EmailVerificationResult, useEmailAuth } from "./useEmailAuth";
import { StoreCredentialsResult, useOAuth } from "./useOAuth";


type CallbackResult = (
  StoreCredentialsResult
  & {
    type: "storeCredentials";
  }
) | (
    EmailVerificationResult
    & {
      type: "verifyEmail";
    }
  );

type UseAuthCallbackOptions = {
  enabled?: boolean;
} & OpenfortHookOptions<CallbackResult> & CreateWalletPostAuthOptions;

export const useAuthCallback = ({
  enabled = true, // Automatically handle OAuth and email callback
  ...hookOptions
}: UseAuthCallbackOptions = {}) => {
  const { log } = useOpenfort();

  const [provider, setProvider] = useState<UIAuthProvider | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const {
    verifyEmail,
    isSuccess: isEmailSuccess,
    isLoading: isEmailLoading,
    isError: isEmailError,
    error: emailError,
  } = useEmailAuth()

  const {
    storeCredentials,
    isSuccess: isOAuthSuccess,
    isLoading: isOAuthLoading,
    isError: isOAuthError,
    error: oAuthError,
  } = useOAuth();

  useEffect(() => {
    if (!enabled) return;

    (async () => {
      // redirectUrl is not working with query params OF-1013
      const fixedUrl = window.location.href.replaceAll("?", "&").replace("&", "?");
      const url = new URL(fixedUrl);
      const openfortAuthProvider = url.searchParams.get("openfortAuthProvider");

      if (!openfortAuthProvider) {
        return;
      }

      setProvider(openfortAuthProvider as UIAuthProvider);
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

        const options: OpenfortHookOptions<Omit<CallbackResult, "type">> = {
          onSuccess: (data) => {
            hookOptions.onSuccess?.({
              ...data,
              type: "verifyEmail",
            });
          },
          onSettled: (data, error) => {
            hookOptions.onSettled?.({
              ...data,
              type: "verifyEmail",
            }, error);
          },
          onError: hookOptions.onError,
          throwOnError: hookOptions.throwOnError,
        }

        await verifyEmail({ email, state, ...options });
        setEmail(email);
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

        const options: OpenfortHookOptions<Omit<CallbackResult, "type">> = {
          onSuccess: (data) => {
            hookOptions.onSuccess?.({
              ...data,
              type: "storeCredentials",
            });
          },
          onSettled: (data, error) => {
            hookOptions.onSettled?.({
              ...data,
              type: "storeCredentials",
            }, error);
          },
          onError: hookOptions.onError,
          throwOnError: hookOptions.throwOnError,
        }

        await storeCredentials({ player, accessToken, refreshToken, ...options });
        removeParams();
      }

    })();
  }, []);

  return {
    email,
    provider,
    verifyEmail,
    storeCredentials,
    isLoading: isEmailLoading || isOAuthLoading,
    isError: isEmailError || isOAuthError,
    isSuccess: isEmailSuccess || isOAuthSuccess,
    error: emailError || oAuthError,
  };
}