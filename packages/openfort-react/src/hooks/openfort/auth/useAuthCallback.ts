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

/**
 * Hook for handling authentication callbacks from OAuth providers and email verification
 *
 * This hook automatically processes authentication callbacks when the page loads with
 * authentication parameters in the URL. It handles both OAuth provider callbacks
 * (with access tokens) and email verification callbacks (with state tokens).
 * The hook extracts parameters from the URL and automatically calls the appropriate
 * authentication methods, then cleans up the URL parameters.
 *
 * @param options - Optional configuration with callback functions and authentication options
 * @returns Current callback processing state and extracted information
 *
 * @example
 * ```tsx
 * const authCallback = useAuthCallback({
 *   enabled: true,
 *   onSuccess: (result) => {
 *     if (result.type === 'storeCredentials') {
 *       console.log('OAuth callback processed:', result.user);
 *     } else if (result.type === 'verifyEmail') {
 *       console.log('Email verified:', result.email);
 *     }
 *   },
 *   onError: (error) => console.error('Callback processing failed:', error),
 *   recoverWalletAutomatically: true,
 * });
 *
 * // Check callback processing state
 * if (authCallback.isLoading) {
 *   console.log('Processing authentication callback...');
 * } else if (authCallback.isError) {
 *   console.error('Callback error:', authCallback.error);
 * } else if (authCallback.isSuccess) {
 *   console.log('Callback processed successfully');
 * }
 *
 * // Access extracted information
 * if (authCallback.provider) {
 *   console.log('Authentication provider:', authCallback.provider);
 * }
 *
 * if (authCallback.email) {
 *   console.log('Email from callback:', authCallback.email);
 * }
 *
 * // Manually trigger verification (if needed)
 * const handleManualVerification = async () => {
 *   await authCallback.verifyEmail({
 *     email: 'user@example.com',
 *     state: 'verification-token',
 *   });
 * };
 *
 * // Manually store credentials (if needed)
 * const handleManualStore = async () => {
 *   await authCallback.storeCredentials({
 *     player: 'player-id',
 *     accessToken: 'access-token',
 *     refreshToken: 'refresh-token',
 *   });
 * };
 * ```
 */
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