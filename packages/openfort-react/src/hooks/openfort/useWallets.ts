import { AccountTypeEnum, ChainTypeEnum, MissingRecoveryPasswordError, RecoveryMethod, RecoveryParams } from "@openfort/openfort-js";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Hex } from "viem";
import { Connector, useAccount, useChainId, useConnect, useDisconnect } from "wagmi";
import { UIAuthProvider, routes } from "../../components/Openfort/types";
import { useOpenfort } from '../../components/Openfort/useOpenfort';
import { embeddedWalletId } from "../../constants/openfort";
import { useOpenfortCore } from '../../openfort/useOpenfort';
import { OpenfortError, OpenfortErrorType, OpenfortHookOptions } from "../../types";
import { useWallets as useWagmiWallets } from "../../wallets/useWallets";
import { BaseFlowState } from "./auth/status";
import { onError, onSuccess } from "./hookConsistency";
import { useUser } from "./useUser";

export type UserWallet = {
  address: Hex;
  connectorType?: string;
  walletClientType?: string;
  connector?: Connector;
  id: string;
  isAvailable: boolean;
  isActive?: boolean;
  isConnecting?: boolean;
  recoveryMethod?: RecoveryMethod;
}


type SetActiveWalletResult = { error?: OpenfortError, wallet?: UserWallet }

type SetActiveWalletOptions = ({
  showUI?: boolean;
  address?: Hex | undefined;
} & ({
  connector: string;
} | {
  connector: typeof embeddedWalletId;
  password?: string;
} | {
  connector: Connector;
})) & OpenfortHookOptions<SetActiveWalletResult>

type CreateWalletResult = SetActiveWalletResult

type CreateWalletOptions = {
  password?: string;
  accountType?: AccountTypeEnum;
} & OpenfortHookOptions<CreateWalletResult>

type RecoverEmbeddedWalletResult = SetActiveWalletResult

type SetRecoveryOptions = {
  previousRecovery: RecoveryParams,
  newRecovery: RecoveryParams,
} & OpenfortHookOptions<CreateWalletResult>

type WalletOptions = OpenfortHookOptions<SetActiveWalletResult | CreateWalletResult>;

const parseOpenfortWallet = ({
  address,
  recoveryMethod,
}: {
  address: Hex;
  recoveryMethod?: RecoveryMethod;
}): UserWallet => ({
  connectorType: "embedded",
  walletClientType: "openfort",
  address,
  id: embeddedWalletId,
  isAvailable: true,
  recoveryMethod,
});

type WalletFlowStatus = BaseFlowState | {
  status: "creating" | "connecting";
  address?: Hex;
  error?: never;
}

const mapWalletStatus = (status: WalletFlowStatus) => {
  return {
    error: status.error,
    isError: status.status === 'error',
    isSuccess: status.status === 'success',
    isCreating: status.status === 'creating',
    isConnecting: status.status === 'connecting',
  }
}


export function useWallets(hookOptions: WalletOptions = {}) {
  const { client } = useOpenfortCore();
  const { user } = useUser();
  const { walletConfig, log, setOpen, setRoute, setConnector, uiConfig } = useOpenfort();
  const { connector, isConnected, address } = useAccount();
  const chainId = useChainId();
  const deviceWallets = useWagmiWallets(); // TODO: Map wallets object to be the same as wallets
  const { disconnect, disconnectAsync } = useDisconnect();
  const [status, setStatus] = useState<WalletFlowStatus>({
    status: "idle",
  })
  const [connectToConnector, setConnectToConnector] = useState<{ address?: Hex, connector: Connector } | undefined>(undefined);
  const { connect } = useConnect({
    mutation: {
      onError: (e) => {
        console.error("Error connecting ---", e);
        const error = new OpenfortError("Failed to connect with wallet: ", OpenfortErrorType.AUTHENTICATION_ERROR, e)
        setStatus({
          status: 'error',
          error,
        });
        onError({
          error,
          options: hookOptions,
        });
      },
      onSuccess: (data) => {
        setConnectToConnector(undefined);
        log("Connected with wallet", data, connectToConnector);
        if (connectToConnector?.address && !data.accounts.some((a) => a === connectToConnector.address)) {
          setStatus({
            status: 'error',
            error: new OpenfortError("Failed to connect with wallet: Address mismatch", OpenfortErrorType.AUTHENTICATION_ERROR),
          });
          disconnect();
          return;
        }
        setStatus({
          status: 'success',
        });
      }
    }
  });

  // will reset on logout
  const { data: embeddedWallets, refetch, isPending: isLoadingWallets } = useQuery({
    queryKey: ['openfortEmbeddedWalletList'],
    queryFn: () => client.embeddedWallet.list(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const getEncryptionSession = useCallback(async (): Promise<string> => {
    if (!walletConfig || !walletConfig.createEncryptedSessionEndpoint) {
      throw new Error("No createEncryptedSessionEndpoint set in walletConfig");
    }

    const resp = await fetch(walletConfig.createEncryptedSessionEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!resp.ok) {
      throw new Error("Failed to create encryption session");
    }

    const respJSON = await resp.json();
    return respJSON.session;
  }, [walletConfig]);

  const rawWallets: UserWallet[] = useMemo(() => {
    const userWallets: UserWallet[] = user ? user.linkedAccounts
      .filter((a) => a.provider === UIAuthProvider.WALLET)
      .map((a) => {
        const wallet = deviceWallets.find((c) => c.connector.id === a.walletClientType);
        return {
          address: a.address as `0x${string}`,
          connectorType: a.connectorType,
          walletClientType: a.walletClientType,
          id: wallet?.id || a.walletClientType || "unknown",
          isAvailable: !!wallet,
        }
      }) : []

    embeddedWallets?.forEach((wallet) => {
      // Remove duplicates (different chain ids)
      if (userWallets.find(w => w.address === (wallet.address))) return;

      userWallets.push(parseOpenfortWallet({
        address: wallet.address as Hex,
        recoveryMethod: wallet.recoveryMethod,
      }));
    });

    return userWallets;
  }, [user?.linkedAccounts, embeddedWallets]);

  const wallets: UserWallet[] = useMemo(() => {
    // if (!isConnected || !address) return rawWallets;

    log("Mapping wallets", { rawWallets, status, address, isConnected, connector });
    return rawWallets.map((w) => ({
      ...w,
      isConnecting: status.status === 'connecting' && status.address === w.address,
      isActive: w.address === address && isConnected && connector?.id === w.id,
    }))
  }, [rawWallets, status, address, isConnected, connector]);

  const activeWallet = isConnected && connector ? wallets.find((w) => w.isActive) : undefined;

  useEffect(() => {
    if (connectToConnector)
      connect({ connector: connectToConnector.connector });
  }, [connectToConnector])

  const setActiveWallet = useCallback(async (options: SetActiveWalletOptions | string):
    Promise<SetActiveWalletResult> => {
    const optionsObject = typeof options === "string" ? { connector: options } : options;

    const { showUI } = optionsObject;

    let connector: Connector | null = null;

    if (typeof optionsObject.connector === 'string') {
      const wallet = deviceWallets.find(c => c.id === optionsObject.connector);
      if (!wallet) {
        log("Connector not found", connector);
        return { error: new OpenfortError("Connector not found", OpenfortErrorType.WALLET_ERROR) };
      }
      log("Connecting to", wallet.connector)
      connector = wallet.connector;
    } else {
      connector = optionsObject.connector;
    }

    if (!connector) {
      log("Connector not found", deviceWallets, optionsObject.connector);
      return { error: new OpenfortError("Connector not found", OpenfortErrorType.WALLET_ERROR) };
    }

    if (activeWallet?.id === connector.id && address === optionsObject.address) {
      log(`Already connected to ${connector.id} with address ${address}, skipping connection`);
      return { wallet: activeWallet };
    }

    await disconnectAsync();

    if (showUI) {
      const walletToConnect = wallets.find((w) => w.id == connector.id)
      if (!walletToConnect) {
        log("Wallet not found", connector);
        return onError({
          error: new OpenfortError("Wallet not found", OpenfortErrorType.AUTHENTICATION_ERROR),
          options: optionsObject,
          hookOptions
        });
      }

      log("Connecting to wallet", walletToConnect);
      if (connector.id === embeddedWalletId) {
        setTimeout(() => {
          setRoute(routes.RECOVER);
          setOpen(true);
        });
      } else {
        setRoute(routes.CONNECT);
        setConnector({ id: connector.id });
        setOpen(true);
      }
      return {};
    }

    function isOpenfortWallet(
      opts: SetActiveWalletOptions
    ): opts is Extract<SetActiveWalletOptions, { connector: typeof embeddedWalletId }> {
      return opts.connector === embeddedWalletId;
    }

    log("Setting active wallet", { options: optionsObject, chainId });

    if (isOpenfortWallet(optionsObject)) {
      setStatus({
        status: 'connecting',
        address: optionsObject.address,
      });

      const { password } = optionsObject;

      if (!walletConfig) {
        return onError({
          error: new OpenfortError("Embedded signer not enabled", OpenfortErrorType.WALLET_ERROR),
          options: optionsObject,
          hookOptions
        });
      }

      const accessToken = await client.getAccessToken();
      if (!accessToken) {
        return onError({
          error: new OpenfortError("Openfort access token not found", OpenfortErrorType.WALLET_ERROR),
          hookOptions,
          options: optionsObject,
        })
      }

      log(`Handling recovery with Openfort: ${password ? "with password" : "without password"}, chainId=${chainId}`);
      try {
        const recoveryParams: RecoveryParams = password ? {
          recoveryMethod: RecoveryMethod.PASSWORD,
          password,
        } : {
          recoveryMethod: RecoveryMethod.AUTOMATIC,
          encryptionSession: walletConfig.getEncryptionSession ?
            await walletConfig.getEncryptionSession(accessToken) :
            await getEncryptionSession()
        };

        // Ensure that the embedded wallet is listed
        const embeddedWallets = await client.embeddedWallet.list();
        log("Recovery params", optionsObject.address);
        log("Embedded wallets", embeddedWallets, chainId);

        let walletAddress = optionsObject.address;
        if (walletAddress) {
          const walletId = embeddedWallets?.find((w) => w.address === walletAddress && w.chainId === chainId)?.id;
          if (!walletId) {
            return onError({
              error: new OpenfortError("Embedded wallet not found for address", OpenfortErrorType.WALLET_ERROR),
              options: optionsObject,
              hookOptions
            });
          }

          await client.embeddedWallet.recover({
            account: walletId,
            recoveryParams,
          })
        } else {
          // Check if the embedded wallet is already created in the current chain
          if (embeddedWallets.some((w) => w.chainId === chainId)) {
            const walletToRecover = embeddedWallets.find((w) => w.chainId === chainId)!;
            await client.embeddedWallet.recover({
              account: walletToRecover.id,
              recoveryParams,
            });
            walletAddress = walletToRecover.address as Hex;
          } else {
            // Here it should check if there is a wallet that can recover in another chain and recover it in the current chain (its a different account so its not supported yet)
            return onError({
              error: new OpenfortError("No embedded wallet found for the current chain", OpenfortErrorType.WALLET_ERROR),
              options: optionsObject,
              hookOptions
            });
          }
        }

        setStatus({
          status: 'success',
        });

        return onSuccess({
          data: {
            wallet: parseOpenfortWallet({
              address: walletAddress,
              recoveryMethod: recoveryParams.recoveryMethod,
            }),
          },
          options: optionsObject,
          hookOptions,
        });
      } catch (err) {
        log('Error handling recovery with Openfort:', err);
        if (err instanceof MissingRecoveryPasswordError) {
          const error = new OpenfortError("Missing recovery password", OpenfortErrorType.WALLET_ERROR);
          setStatus({
            status: 'error',
            error,
          });
          return onError({
            error,
            options: optionsObject,
            hookOptions
          });
        }
        if (typeof err === 'string') {
          const error = new OpenfortError(err, OpenfortErrorType.WALLET_ERROR);
          setStatus({
            status: 'error',
            error,
          });
          return onError({
            error,
            options: optionsObject,
            hookOptions
          });
        }
        const error = new OpenfortError("The recovery phrase you entered is incorrect.", OpenfortErrorType.WALLET_ERROR);
        setStatus({
          status: 'error',
          error,
        });
        return onError({
          error,
          options: optionsObject,
          hookOptions
        });
      }

    } else {
      setStatus({
        status: 'connecting',
        address: optionsObject.address,
      });
      setConnectToConnector({
        address: optionsObject.address,
        connector,
      });
    }

    return {};
  }, [wallets, setOpen, setRoute, setConnector, disconnectAsync, log, address, client, walletConfig, chainId, refetch, hookOptions]);

  const createWallet = useCallback(async ({
    password,
    ...options
  }: CreateWalletOptions = {}): Promise<CreateWalletResult> => {
    setStatus({
      status: 'creating',
    });

    log("Creating wallet", { password: !!password, options });

    try {
      const accessToken = await client.getAccessToken();
      if (!accessToken) {
        return onError({
          error: new OpenfortError("Openfort access token not found", OpenfortErrorType.WALLET_ERROR),
          hookOptions,
          options,
        })
      }
      if (!walletConfig) {
        return onError({
          error: new OpenfortError("Embedded signer not enabled", OpenfortErrorType.WALLET_ERROR),
          hookOptions,
          options,
        });
      }


      const recoveryParams: RecoveryParams = password ? {
        recoveryMethod: RecoveryMethod.PASSWORD,
        password,
      } : {
        recoveryMethod: RecoveryMethod.AUTOMATIC,
        encryptionSession: walletConfig.getEncryptionSession ?
          await walletConfig.getEncryptionSession(accessToken) :
          await getEncryptionSession()
      };

      const wallet = await client.embeddedWallet.create({
        chainId: uiConfig?.initialChainId ?? chainId,
        accountType: options?.accountType || walletConfig?.accountType || AccountTypeEnum.SMART_ACCOUNT,
        chainType: ChainTypeEnum.EVM,
        recoveryParams,
      });

      setStatus({
        status: 'success',
      });

      refetch();
      return onSuccess({
        data: {
          wallet: parseOpenfortWallet({
            address: wallet.address as Hex,
            recoveryMethod: wallet.recoveryMethod,
          })
        }
      });
    } catch (e) {
      const errorObj = e instanceof Error ? e : new Error('Failed to create wallet');
      const error = new OpenfortError('Failed to create wallet', OpenfortErrorType.WALLET_ERROR, { error: errorObj });
      setStatus({
        status: 'error',
        error,
      });
      return onError({
        error,
        hookOptions,
        options,
      });
    }

  }, [refetch, client, uiConfig, chainId]);

  const setRecovery = useCallback(
    async (params: SetRecoveryOptions): Promise<RecoverEmbeddedWalletResult> => {
      try {
        setStatus({
          status: 'loading',
        });

        // Set embedded wallet recovery method
        await client.embeddedWallet.setRecoveryMethod(params.previousRecovery, params.newRecovery);

        // Get the updated embedded account
        const embeddedAccount = await client.embeddedWallet.get();

        setStatus({ status: 'success' });
        return onSuccess({
          hookOptions,
          options: params,
          data: {
            wallet: parseOpenfortWallet({
              address: embeddedAccount.address as Hex,
              recoveryMethod: embeddedAccount.recoveryMethod,
            }),
          }
        });
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error('Failed to set wallet recovery');
        return onError({
          hookOptions,
          options: params,
          error: new OpenfortError('Failed to set wallet recovery', OpenfortErrorType.WALLET_ERROR, { error: errorObj }),
        });
      }
    },
    [client, setStatus, hookOptions]
  );

  return {
    hasWallet: wallets.length > 0,
    isLoadingWallets,
    wallets,
    availableWallets: deviceWallets,
    activeWallet,
    setRecovery,
    reset: () => setStatus({ status: 'idle' }),
    createWallet,
    setActiveWallet,
    ...mapWalletStatus(status),
    exportPrivateKey: client.embeddedWallet.exportPrivateKey,
  }
}
