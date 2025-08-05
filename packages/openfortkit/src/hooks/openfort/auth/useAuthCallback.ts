import { useCallback, useEffect, useState } from "react";
import { useOpenfortKit } from "../../../components/OpenfortKit/useOpenfortKit";
import { BaseFlowState, mapStatus } from "./status";
import { useOpenfort } from "../../../openfort/useOpenfort";
import { OpenfortHookOptions, OpenfortKitError, OpenfortKitErrorType } from "../../../types";
import { onError, onSuccess } from "../hookConsistency";


type VerifyEmailOptions = {
  email: string;
  state: string;
} & OpenfortHookOptions;

type StoreCredentialsOptions = {
  player: string;
  accessToken: string;
  refreshToken: string;
} & OpenfortHookOptions;

type UseAuthCallbackOptions = {
  automaticallyHandleCallback?: boolean;
} & OpenfortHookOptions;

export const useAuthCallback = ({
  automaticallyHandleCallback = true, // Automatically handle OAuth and email callback
  ...hookOptions
}: UseAuthCallbackOptions = {}) => {
  const { log } = useOpenfortKit();
  const [status, setStatus] = useState<BaseFlowState>({
    status: "idle",
  });
  const { client } = useOpenfort();

  const verifyEmail = useCallback(async ({ email, state, ...options }: VerifyEmailOptions) => {
    setStatus({
      status: 'loading',
    });

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
        data: {},
      });

    } catch (e) {
      const error = new OpenfortKitError("Failed to verify email", OpenfortKitErrorType.AUTHENTICATION_ERROR, { error: e });

      setStatus({
        status: 'error',
        error,
      });

      log("Error verifying email", e);

      return onError({
        hookOptions,
        options,
        error,
      });
    }
  }, [client, log, hookOptions]);

  const storeCredentials = useCallback(async ({
    player,
    accessToken,
    refreshToken,
    ...options
  }: StoreCredentialsOptions) => {
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

      return onSuccess({
        hookOptions,
        options,
        data: {},
      });
    } catch (e) {
      const error = new OpenfortKitError("Failed to store credentials", OpenfortKitErrorType.AUTHENTICATION_ERROR, { error: e });

      setStatus({
        status: 'error',
        error,
      });
      log("Error storing credentials", e);

      return onError({
        hookOptions,
        options,
        error,
      });
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

      if (openfortAuthProvider === "email") {

        // Verify email flow
        const state = url.searchParams.get("state");
        const email = url.searchParams.get("email");

        if (!state || !email) {
          console.error("No state or email found in URL");
          onError({
            hookOptions,
            options: {},
            error: new OpenfortKitError("No state or email found in URL", OpenfortKitErrorType.AUTHENTICATION_ERROR),
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

        onSuccess({
          hookOptions,
          options: {},
          data: {},
        });

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
            error: new OpenfortKitError("Missing player id or access token or refresh token", OpenfortKitErrorType.AUTHENTICATION_ERROR),
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

        await storeCredentials({ player, accessToken, refreshToken });
        removeParams();
        onSuccess({
          hookOptions,
          options: {},
          data: {},
        });
      }

    })();
  }, []);

  return {
    verifyEmail,
    storeCredentials,
    ...mapStatus(status),
  };
}