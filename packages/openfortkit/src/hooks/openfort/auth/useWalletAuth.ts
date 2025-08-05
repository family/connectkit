import { useCallback, useState } from "react";
import { Connector, useDisconnect } from "wagmi";
import { BaseFlowState, mapStatus } from "./status";
import { useConnect } from "../../useConnect";
import { useOpenfortKit } from "../../../components/OpenfortKit/useOpenfortKit";
import { useOpenfort } from "../../../openfort/useOpenfort";
import { useConnectWithSiwe } from "../useConnectWithSiwe";
import { useWallets } from "../../../wallets/useWallets";
import { OpenfortHookOptions, OpenfortKitError, OpenfortKitErrorType } from "../../../types";
import { onError, onSuccess } from "../hookConsistency";


type ConnectWalletOptions = {
  connector: Connector | string;
}; // onConnect is handled by the hookOptions because useConnect needs to finish the connection process

export const useWalletAuth = (hookOptions: OpenfortHookOptions = {}) => {
  const { updateUser } = useOpenfort();
  const { log } = useOpenfortKit();
  const siwe = useConnectWithSiwe()
  const availableWallets = useWallets(); // TODO: Use this to get the wallet client type
  const { disconnect } = useDisconnect();

  const [status, setStatus] = useState<BaseFlowState>({
    status: "idle",
  });

  const { connect } = useConnect({
    mutation: {
      onError: (e) => {
        const error = new OpenfortKitError("Failed to connect with wallet", OpenfortKitErrorType.AUTHENTICATION_ERROR, { error: e });
        onError({
          error,
          options: hookOptions,
        })

        setStatus({
          status: 'error',
          error,
        });
      },
      onSuccess: () => {
        siwe({
          onError: (e) => {
            log("Error connecting with SIWE", e);
            disconnect();
            const error = new OpenfortKitError("Failed to connect with siwe", OpenfortKitErrorType.AUTHENTICATION_ERROR, { error: e });
            onError({
              error,
              options: hookOptions,
            })

            setStatus({
              status: 'error',
              error,
            });
          },
          onConnect: () => {
            log("Successfully connected with SIWE");
            setStatus({
              status: 'success',
            });
            updateUser();
            onSuccess({
              hookOptions,
              data: {},
            });
          },
        });
      }
    }
  });


  // const generateSiweMessage = useCallback(
  //   async (args) => {
  //     try {
  //       // setStatus({ status: 'generating-message' });

  //       // Get wallet address from the external wallet
  //       const walletAddress = typeof args.wallet === 'string' ? args.wallet : args.wallet.address;

  //       const result = await client.auth.initSIWE({
  //         address: walletAddress,
  //       });

  //       // Build the SIWE message
  //       const siweMessage = `${args.from.domain} wants you to sign in with your Ethereum account:\n${walletAddress}\n\nSign in to ${args.from.domain}\n\nURI: ${args.from.uri}\nVersion: 1\nChain ID: 1\nNonce: ${result.nonce}\nIssued At: ${new Date().toISOString()}`;

  //       setStatus({
  //         status: 'awaiting-input',
  //         type: 'siwe',
  //       });


  //       return siweMessage;
  //     } catch (error) {
  //       const errorObj = error instanceof Error ? error : new Error('Failed to generate SIWE message');
  //       setStatus({
  //         type: 'siwe',
  //         status: 'error',
  //         error: errorObj
  //       });
  //       throw errorObj;
  //     }
  //   },
  //   [client, setStatus]
  // );


  // const initSiwe = useCallback(
  //   async (opts: {
  //     signature: string;
  //     message?: string;
  //   }): Promise<OpenfortUser> => {
  //     try {
  //       setStatus({
  //         status: 'loading',
  //         type: 'siwe'
  //       });

  //       const message = opts.message || '';

  //       if (!message) {
  //         throw new Error('SIWE message is required. Call generateSiweMessage first.');
  //       }

  //       const result = await client.auth.authenticateWithSIWE({
  //         signature: opts.signature,
  //         message: message,
  //         walletClientType: 'unknown',
  //         connectorType: 'unknown'
  //       });

  //       setStatus({
  //         status: 'success',
  //         type: 'siwe',
  //       });
  //       const user = result.player;

  //       // Refresh user state in provider
  //       await updateUser(user);
  //       // callbacksRef.current?.onSuccess?.(user, false);

  //       return user;
  //     } catch (error) {
  //       const errorObj = error instanceof Error ? error : new Error('Failed to login with SIWE');
  //       setStatus({
  //         status: 'error',
  //         error: errorObj,
  //         type: 'siwe',
  //       });
  //       throw errorObj;
  //     }
  //   },
  //   [client, setStatus, updateUser]
  // );


  const connectWallet = useCallback(async (options: ConnectWalletOptions) => {
    setStatus({
      status: 'loading',
    });
    let connector: Connector | null = null;

    if (typeof options.connector === 'string') {
      const wallet = availableWallets.find(c => c.id === options.connector);
      if (wallet) {
        connector = wallet.connector;
      }
    } else {
      connector = options.connector;
    }

    if (!connector) {
      log("Connector not found", connector);
      return onError({
        hookOptions,
        error: new OpenfortKitError("Connector not found", OpenfortKitErrorType.AUTHENTICATION_ERROR),
      });
    }

    const hasDisconnected = new Promise<void>((resolve) => {
      disconnect(undefined, {
        onSuccess: () => {
          resolve();
        },
        onError: (e) => {
          console.error("Error disconnecting", e);

          const error = new OpenfortKitError("Failed to disconnect", OpenfortKitErrorType.AUTHENTICATION_ERROR, { error: e });
          onError({
            error,
            hookOptions,
          })

          setStatus({
            status: 'error',
            error,
          });

          resolve();
        },
      });
    });
    await hasDisconnected;

    connect({
      connector,
    });
  }, [siwe, disconnect, updateUser, availableWallets, log, setStatus, hookOptions]);

  return {
    connectWallet,
    linkWallet: connectWallet, // siwe() is in charge of linking the wallet if user is authenticated
    availableWallets,
    ...mapStatus(status),
    // generateSiweMessage,
    // initSiwe,
  };
}