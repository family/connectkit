import { type AuthPlayerResponse as OpenfortUser } from '@openfort/openfort-js';
import { useCallback, useState } from "react";
import { useOpenfortKit } from "../../../components/OpenfortKit/useOpenfortKit";
import { useOpenfort } from "../../../openfort/useOpenfort";
import { OpenfortHookOptions, OpenfortKitError, OpenfortKitErrorType } from "../../../types";
import { buildCallbackUrl } from "./requestEmailVerification";
import { BaseFlowState, mapStatus } from "./status";
import { onError, onSuccess } from '../hookConsistency';


export type EmailAuthResult = {
  error?: OpenfortKitError;
  user?: OpenfortUser;
  requiresEmailVerification?: boolean;
};

export type SignInEmailOptions = {
  email: string;
  password: string;
  emailVerificationRedirectTo?: string;
} & OpenfortHookOptions<EmailAuthResult>;

export type SignUpEmailOptions = {
  email: string;
  password: string;
  name?: string;
  emailVerificationRedirectTo?: string;
} & OpenfortHookOptions<EmailAuthResult>;

export type RequestResetPasswordOptions = {
  email: string;
  emailVerificationRedirectTo?: string;
} & OpenfortHookOptions<EmailAuthResult>;

export type ResetPasswordOptions = {
  email: string;
  password: string;
  state: string;
} & OpenfortHookOptions<EmailAuthResult>;

export type LinkEmailOptions = {
  email: string;
  password: string;
  emailVerificationRedirectTo?: string;
} & OpenfortHookOptions<EmailAuthResult>;

export type UseEmailHookOptions = {
  emailVerificationRedirectTo?: string;
} & OpenfortHookOptions<EmailAuthResult>;


export const useEmailAuth = (hookOptions: UseEmailHookOptions = {}) => {
  const { log } = useOpenfortKit();
  const { client, updateUser } = useOpenfort();
  const [status, setStatus] = useState<BaseFlowState>({
    status: "idle",
  });

  const signInEmail = useCallback(async (options: SignInEmailOptions): Promise<EmailAuthResult> => {
    try {
      setStatus({
        status: 'loading',
      });

      const result = await client.auth.logInWithEmailPassword({
        email: options.email,
        password: options.password,
      });

      if ('action' in result) {
        setStatus({
          status: 'awaiting-input',
        });

        client.auth.requestEmailVerification({
          email: options.email,
          redirectUrl: buildCallbackUrl({
            email: options.email,
            callbackUrl: options.emailVerificationRedirectTo ?? hookOptions?.emailVerificationRedirectTo,
            provider: "email"
          })
        })

        return onSuccess<EmailAuthResult>({
          data: { requiresEmailVerification: true },
          hookOptions,
          options,
        })
      } else {

        setStatus({
          status: 'success',
        });
        const user = result.player;

        await updateUser();

        return onSuccess<EmailAuthResult>({
          data: { user },
          hookOptions,
          options,
        });
      }
    } catch (e) {
      const error = new OpenfortKitError("Failed to login with email and password", OpenfortKitErrorType.AUTHENTICATION_ERROR, { error: e });

      setStatus({
        status: 'error',
        error: error
      });

      return onError({
        hookOptions,
        options,
        error: error,
      })
    }
  }, [client, setStatus, updateUser, hookOptions]);


  const requestResetPassword = useCallback(async (options: RequestResetPasswordOptions): Promise<EmailAuthResult> => {

    try {
      setStatus({
        status: 'loading',
      });

      await client.auth.requestResetPassword({
        email: options.email,
        redirectUrl: buildCallbackUrl({
          email: options.email,
          callbackUrl: options.emailVerificationRedirectTo ?? hookOptions?.emailVerificationRedirectTo,
          provider: "password"
        })
      })

      setStatus({
        status: 'success',
      });

      return onSuccess<EmailAuthResult>({
        data: { requiresEmailVerification: true },
        hookOptions,
        options,
      });
    } catch (e) {
      const error = new OpenfortKitError("Failed to reset password", OpenfortKitErrorType.AUTHENTICATION_ERROR, { error: e });
      setStatus({
        status: 'error',
        error
      });

      return onError({
        hookOptions,
        options,
        error: error,
      });
    }
  }, [client, setStatus, updateUser, hookOptions]);

  const resetPassword = useCallback(async (options: ResetPasswordOptions): Promise<EmailAuthResult> => {

    try {
      setStatus({
        status: 'loading',
      });

      await client.auth.resetPassword({
        email: options.email,
        password: options.password,
        state: options.state,
      })

      setStatus({
        status: 'success',
      });

      return onSuccess<EmailAuthResult>({
        data: { requiresEmailVerification: true },
        hookOptions,
        options,
      });
    } catch (e) {
      const error = new OpenfortKitError("Failed to reset password", OpenfortKitErrorType.AUTHENTICATION_ERROR, { error: e });
      setStatus({
        status: 'error',
        error
      });

      return onError({
        hookOptions,
        options,
        error: error,
      });
    }
  }, [client, setStatus, updateUser, hookOptions]);


  const signUpEmail = useCallback(async (options: SignUpEmailOptions): Promise<EmailAuthResult> => {

    try {
      setStatus({
        status: 'loading',
      });

      const result = await client.auth.signUpWithEmailPassword({
        email: options.email,
        password: options.password,
        ...(options.name && { name: options.name }),
      });

      if ('action' in result) {
        setStatus({
          status: 'awaiting-input',
        });


        client.auth.requestEmailVerification({
          email: options.email,
          redirectUrl: buildCallbackUrl({
            email: options.email,
            callbackUrl: options.emailVerificationRedirectTo ?? hookOptions?.emailVerificationRedirectTo,
            provider: "email"
          })
        })

        return onSuccess<EmailAuthResult>({
          data: { requiresEmailVerification: true },
          hookOptions,
          options,
        });
      } else {
        setStatus({
          status: 'success',
        });
        const user = result.player;
        await updateUser(user);

        return onSuccess<EmailAuthResult>({
          data: { user },
          hookOptions,
          options,
        });
      }
    } catch (e) {
      const error = new OpenfortKitError("Failed to login with email and password", OpenfortKitErrorType.AUTHENTICATION_ERROR, { error: e });
      setStatus({
        status: 'error',
        error
      });

      return onError({
        hookOptions,
        options,
        error: error,
      });
    }
  }, [client, setStatus, updateUser, hookOptions]);

  const linkEmail = useCallback(async (options: LinkEmailOptions): Promise<EmailAuthResult> => {
    try {

      await client.validateAndRefreshToken();
      const authToken = await client.getAccessToken();
      if (!authToken) {
        log("No token found");
        const error = new OpenfortKitError("No token found", OpenfortKitErrorType.AUTHENTICATION_ERROR);
        setStatus({
          status: 'error',
          error
        });
        return onError<EmailAuthResult>({
          hookOptions,
          options,
          error,
        });
      }

      const result = await client.auth.linkEmailPassword({
        email: options.email,
        password: options.password,
        authToken,
      })
      log("Email linked successfully");

      if ('action' in result) {
        setStatus({
          status: 'awaiting-input',
        });

        client.auth.requestEmailVerification({
          email: options.email,
          redirectUrl: buildCallbackUrl({
            email: options.email,
            callbackUrl: options.emailVerificationRedirectTo ?? hookOptions?.emailVerificationRedirectTo,
            provider: "email"
          })
        })

        updateUser();
        return onSuccess<EmailAuthResult>({
          data: { requiresEmailVerification: true },
          hookOptions,
          options,
        });
      } else {
        return onSuccess<EmailAuthResult>({
          data: {},
          hookOptions,
          options,
        });
      }
    } catch (e) {
      const error = new OpenfortKitError("Failed to link email", OpenfortKitErrorType.AUTHENTICATION_ERROR, { error: e });

      setStatus({
        status: 'error',
        error: error
      });

      return onError({
        hookOptions,
        options,
        error: error
      });
    }
  }, [client, setStatus, updateUser, log, hookOptions]);


  return {
    signInEmail,
    signUpEmail,
    linkEmail,
    requestResetPassword,
    resetPassword,
    ...mapStatus(status),
    isAwaitingInput: status.status === 'awaiting-input',
  };
}