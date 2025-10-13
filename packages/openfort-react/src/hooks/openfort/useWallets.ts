import { AccountTypeEnum, ChainTypeEnum, EmbeddedAccount, MissingRecoveryPasswordError, RecoveryMethod, RecoveryParams } from "@openfort/openfort-js";
import { useQueryClient } from "@tanstack/react-query";
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

  // From openfort embedded wallet
  recoveryMethod?: RecoveryMethod;
  accountId?: string;
  accountType?: AccountTypeEnum;
  ownerAddress?: Hex;
  implementationType?: string;
  createdAt?: number;
  salt?: string;
}

export type WalletRecovery = {
  recoveryMethod: RecoveryMethod;
  password?: string;
}

type SetActiveWalletResult = { error?: OpenfortError, wallet?: UserWallet }

type SetActiveWalletOptions = ({
  walletId: string;
  recovery?: WalletRecovery;
  address?: Hex | undefined;
  showUI?: boolean;
}) & OpenfortHookOptions<SetActiveWalletResult>

type CreateWalletResult = SetActiveWalletResult

type CreateWalletOptions = {
  recovery?: WalletRecovery;
  accountType?: AccountTypeEnum;
} & OpenfortHookOptions<CreateWalletResult>

type RecoverEmbeddedWalletResult = SetActiveWalletResult

type SetRecoveryOptions = {
  previousRecovery: RecoveryParams,
  newRecovery: RecoveryParams,
} & OpenfortHookOptions<CreateWalletResult>

type WalletOptions = OpenfortHookOptions<SetActiveWalletResult | CreateWalletResult>;

const parseEmbeddedAccount = (embeddedAccount: EmbeddedAccount, connector: Connector | undefined): UserWallet => ({
  connectorType: "embedded",
  walletClientType: "openfort",
  address: embeddedAccount.address as Hex,
  id: embeddedWalletId,
  isAvailable: true,
  recoveryMethod: embeddedAccount.recoveryMethod ?? RecoveryMethod.AUTOMATIC,

  accountId: embeddedAccount.id,
  accountType: embeddedAccount.accountType,
  ownerAddress: embeddedAccount.ownerAddress as Hex,
  implementationType: embeddedAccount.implementationType,
  salt: embeddedAccount.salt,
  createdAt: embeddedAccount.createdAt,
  connector,
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


/**
 * Hook for managing and interacting with user wallets
 *
 * This hook manages both embedded Openfort wallets and external wallets connected via Wagmi.
 * It handles wallet creation, recovery, connection, and switching between different wallet types.
 * The hook provides comprehensive wallet management functionality including creating embedded wallets,
 * recovering existing ones, and managing wallet connections across multiple providers.
 *
 * @param hookOptions - Optional configuration with callback functions and wallet options
 * @returns Current wallet state with management actions
 *
 * @example
 * ```tsx
 * const wallets = useWallets({
 *   onCreateWalletSuccess: (result) => console.log('Wallet created:', result.wallet),
 *   onCreateWalletError: (error) => console.error('Wallet creation failed:', error),
 *   onSetActiveWalletSuccess: (result) => console.log('Wallet activated:', result.wallet),
 * });
 *
 * // Check available wallets
 * if (wallets.hasWallet) {
 *   console.log('Available wallets:', wallets.wallets);
 *   console.log('Active wallet:', wallets.activeWallet);
 * }
 *
 * // Create a new embedded wallet with automatic recovery
 * await wallets.createWallet({
 *   recovery: { recoveryMethod: RecoveryMethod.AUTOMATIC },
 *   accountType: AccountTypeEnum.SMART_ACCOUNT,
 * });
 *
 * // Set active wallet by ID
 * await wallets.setActiveWallet('embedded-wallet-id');
 *
 * // Set active wallet with custom recovery
 * await wallets.setActiveWallet({
 *   walletId: 'embedded-wallet-id',
 *   recovery: { recoveryMethod: RecoveryMethod.PASSWORD, password: 'user-password' },
 *   showUI: true,
 * });
 *
 * // Set recovery method for existing wallet
 * await wallets.setRecovery({
 *   previousRecovery: { recoveryMethod: RecoveryMethod.AUTOMATIC },
 *   newRecovery: { recoveryMethod: RecoveryMethod.PASSWORD, password: 'new-password' },
 * });
 *
 * // Export private key from embedded wallet (requires authentication)
 * try {
 *   const privateKey = await wallets.exportPrivateKey();
 *   console.log('Private key exported:', privateKey);
 * } catch (error) {
 *   console.error('Failed to export private key:', error);
 * }
 * ```
 */
export function useWallets(hookOptions: WalletOptions = {}) {
  const { client, embeddedAccounts, isLoadingAccounts: isLoadingWallets } = useOpenfortCore();
  const { user } = useUser();
  const { walletConfig, log, setOpen, setRoute, setConnector, uiConfig } = useOpenfort();
  const { connector, isConnected, address } = useAccount();
  const chainId = useChainId();
  const availableWallets = useWagmiWallets(); // TODO: Map wallets object to be the same as wallets
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

  const openfortConnector = useMemo(() => availableWallets.find((c) => c.connector.id === embeddedWalletId)?.connector, [availableWallets]);

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


  const parseWalletRecovery = useMemo(() => async function parseWalletRecovery(
    recovery?: WalletRecovery, embeddedAccounts?: EmbeddedAccount[], walletAddress?: Hex
  ): Promise<RecoveryParams> {
    switch (recovery?.recoveryMethod) {
      case undefined:
      case RecoveryMethod.AUTOMATIC:
        const accessToken = await client.getAccessToken();
        if (!accessToken) {
          throw new OpenfortError("Openfort access token not found", OpenfortErrorType.AUTHENTICATION_ERROR);
        }
        return {
          recoveryMethod: RecoveryMethod.AUTOMATIC,
          encryptionSession: walletConfig?.getEncryptionSession ?
            await walletConfig.getEncryptionSession(accessToken) :
            await getEncryptionSession()
        };
      case RecoveryMethod.PASSWORD:
        if (!recovery.password) {
          throw new OpenfortError("Please enter your password", OpenfortErrorType.VALIDATION_ERROR);
        }
        return {
          recoveryMethod: RecoveryMethod.PASSWORD,
          password: recovery.password,
        }
      case RecoveryMethod.PASSKEY:
        if (!embeddedAccounts) {
          return {
            recoveryMethod: RecoveryMethod.PASSKEY,
          }
        }
        if (!walletAddress) {
          walletAddress = embeddedAccounts.find(w => w.recoveryMethod === RecoveryMethod.PASSKEY)?.address as Hex;
          if (!walletAddress) {
            throw new OpenfortError("No wallet address provided and no embedded wallet with passkey recovery found", OpenfortErrorType.VALIDATION_ERROR);
          }
        }

        const details = embeddedAccounts.find(w => w.address === walletAddress && w.recoveryMethod === RecoveryMethod.PASSKEY)?.recoveryMethodDetails;

        const passkeyId = details?.passkeyId;
        const passkeyEnv = details?.passkeyEnv;

        if (!passkeyId || !passkeyEnv) {
          throw new OpenfortError("No passkey details found for the wallet", OpenfortErrorType.VALIDATION_ERROR);
        }

        return {
          recoveryMethod: RecoveryMethod.PASSKEY,
          passkeyInfo: {
            passkeyId,
            passkeyEnv: passkeyEnv as string,
          },
        }
      default:
        throw new OpenfortError("Invalid recovery method", OpenfortErrorType.VALIDATION_ERROR);
    }
  }, [walletConfig, getEncryptionSession]);

  const rawWallets: UserWallet[] = useMemo(() => {
    const userWallets: UserWallet[] = user ? user.linkedAccounts
      .filter((a) => a.provider === UIAuthProvider.WALLET)
      .map((a) => {
        const wallet = availableWallets.find((c) => c.connector.id === a.walletClientType);
        return {
          address: a.address as `0x${string}`,
          connectorType: a.connectorType,
          walletClientType: a.walletClientType,
          id: wallet?.id || a.walletClientType || "unknown",
          isAvailable: !!wallet,
          connector: wallet?.connector,
        }
      }) : []

    embeddedAccounts?.forEach((embeddedAccount) => {
      // Remove duplicates (different chain ids)
      if (userWallets.find(w => w.address === (embeddedAccount.address))) return;

      userWallets.push(parseEmbeddedAccount(embeddedAccount, openfortConnector));
    });

    return userWallets;
  }, [user?.linkedAccounts, embeddedAccounts]);

  const wallets: UserWallet[] = useMemo(() => {
    // log("Mapping wallets", { rawWallets, status, address, isConnected, connector: connector?.id });
    return rawWallets.map((w) => ({
      ...w,
      isConnecting: status.status === 'connecting' && status.address === w.address,
      isActive: w.address === address && isConnected && connector?.id === w.id,
    }))
  }, [rawWallets.length, status.status, address, isConnected, connector?.id]);

  const activeWallet = isConnected && connector ? wallets.find((w) => w.isActive) : undefined;

  useEffect(() => {
    if (connectToConnector)
      connect({ connector: connectToConnector.connector });
  }, [connectToConnector])

  const setActiveWallet = useCallback(async (options: SetActiveWalletOptions | string):
    Promise<SetActiveWalletResult> => {
    const optionsObject: SetActiveWalletOptions = typeof options === "string" ? { walletId: options } : options;

    const { showUI } = optionsObject;
    const isEmbeddedWalletRequest = optionsObject.walletId === embeddedWalletId;

    let connector: Connector | null = null;

    if (typeof optionsObject.walletId === 'string') {
      const wallet = availableWallets.find(c => c.id === optionsObject.walletId);
      if (wallet) {
        log("Connecting to", wallet.connector)
        connector = wallet.connector;
      } else if (!isEmbeddedWalletRequest) {
        log("Connector not found", availableWallets, optionsObject.walletId);
        return { error: new OpenfortError("Connector not found", OpenfortErrorType.WALLET_ERROR) };
      }
    } else {
      connector = optionsObject.walletId;
    }

    if (!connector && !isEmbeddedWalletRequest) {
      log("Connector not found", availableWallets, optionsObject.walletId);
      return { error: new OpenfortError("Connector not found", OpenfortErrorType.WALLET_ERROR) };
    }

    if (connector && activeWallet?.id === connector.id && address === optionsObject.address) {
      log(`Already connected to ${connector.id} with address ${address}, skipping connection`);
      return { wallet: activeWallet };
    }

    await disconnectAsync();

    if (showUI) {
      if (isEmbeddedWalletRequest) {
        setTimeout(() => {
          setRoute(routes.RECOVER);
          setOpen(true);
        });
        return {};
      }

      if (!connector) {
        log("Connector not available for wallet", optionsObject.walletId);
        return onError({
          error: new OpenfortError("Wallet not found", OpenfortErrorType.AUTHENTICATION_ERROR),
          options: optionsObject,
          hookOptions
        });
      }

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
      setRoute(routes.CONNECT);
      setConnector({ id: connector.id });
      setOpen(true);
      return {};
    }

    log("Setting active wallet", { options: optionsObject, chainId });

    if (isEmbeddedWalletRequest) {
      setStatus({
        status: 'connecting',
        address: optionsObject.address,
      });



      if (!walletConfig) {
        return onError({
          error: new OpenfortError("Embedded signer not enabled", OpenfortErrorType.WALLET_ERROR),
          options: optionsObject,
          hookOptions
        });
      }

      try {
        const embeddedAccounts = await queryClient.ensureQueryData<EmbeddedAccount[]>({
          queryKey: ['openfortEmbeddedAccountsList'],
          queryFn: () => client.embeddedWallet.list({
            limit: 100,
            // If its EOA we want all accounts, otherwise we want only smart accounts
            accountType: walletConfig?.accountType === AccountTypeEnum.EOA ?
              undefined : AccountTypeEnum.SMART_ACCOUNT
          }),
        });
        let walletAddress = optionsObject.address;

        // Ensure that the embedded wallet is listed
        log("Embedded wallets", embeddedAccounts, chainId);
        let embeddedAccount: EmbeddedAccount | undefined;

        if (walletAddress) {
          const accountToRecover = embeddedAccounts.find(w => {
            if (walletConfig?.accountType === AccountTypeEnum.EOA) {
              return w.address === walletAddress;
            } else {
              return w.address === walletAddress && w.chainId === chainId
            }
          });
          if (!accountToRecover) {
            // TODO: Connect to wallet in the other chain and then switch chain
            return onError({
              error: new OpenfortError(`Embedded wallet not found for address ${walletAddress} and chainId ${chainId}`, OpenfortErrorType.WALLET_ERROR),
              options: optionsObject,
              hookOptions
            });
          }
          log("Found embedded wallet to recover", accountToRecover);
          if (optionsObject.recovery?.recoveryMethod && accountToRecover.recoveryMethod && optionsObject.recovery.recoveryMethod !== accountToRecover.recoveryMethod) {
            log("Recovery method does not match", optionsObject.recovery.recoveryMethod, accountToRecover.recoveryMethod);
            return onError({
              error: new OpenfortError("The recovery phrase you entered is incorrect and does not match the wallet's recovery method", OpenfortErrorType.WALLET_ERROR),
              options: optionsObject,
              hookOptions
            });
          }
          const recovery: WalletRecovery = {
            recoveryMethod: accountToRecover.recoveryMethod ?? RecoveryMethod.AUTOMATIC,
            password: optionsObject.recovery?.password,
          }
          const recoveryParams = await parseWalletRecovery(recovery, embeddedAccounts, walletAddress);

          embeddedAccount = await client.embeddedWallet.recover({
            account: accountToRecover.id,
            recoveryParams,
          })
        } else {
          if (walletConfig?.accountType === AccountTypeEnum.EOA) {
            // For EOAs, chain is not relevant; recover the first available EOA account
            const accountToRecover = embeddedAccounts[0];
            if (!accountToRecover) {
              return onError({
                error: new OpenfortError("No embedded EOA wallet available to recover", OpenfortErrorType.WALLET_ERROR),
                options: optionsObject,
                hookOptions
              });
            }
            log("Recovering EOA embedded wallet (without walletAddress)", accountToRecover);
            const recovery: WalletRecovery = {
              recoveryMethod: accountToRecover.recoveryMethod ?? RecoveryMethod.AUTOMATIC,
              password: optionsObject.recovery?.password,
            }
            const recoveryParams = await parseWalletRecovery(recovery, embeddedAccounts, accountToRecover.address as Hex);
            embeddedAccount = await client.embeddedWallet.recover({
              account: accountToRecover.id,
              recoveryParams,
            });
            walletAddress = accountToRecover.address as Hex;
          } else {
            // Smart Accounts: must match current chain
            if (embeddedAccounts.some((w) => w.chainId === chainId)) {
              const accountToRecover = embeddedAccounts.find((w) => w.chainId === chainId)!;
              log("Found embedded wallet to recover (without walletAddress)", accountToRecover);

              const recovery: WalletRecovery = {
                recoveryMethod: accountToRecover.recoveryMethod ?? RecoveryMethod.AUTOMATIC,
                password: optionsObject.recovery?.password,
              }
              const recoveryParams = await parseWalletRecovery(recovery, embeddedAccounts, walletAddress);

              embeddedAccount = await client.embeddedWallet.recover({
                account: accountToRecover.id,
                recoveryParams,
              });
              walletAddress = accountToRecover.address as Hex;
            } else {
              log("No embedded wallet found for the current chain");

              // Here it should check if there is a wallet that can recover in another chain and recover it in the current chain (its a different account so its not supported yet)
              // TODO: Connect to wallet in the other chain and then switch chain
              return onError({
                error: new OpenfortError("No embedded wallet found for the current chain", OpenfortErrorType.WALLET_ERROR),
                options: optionsObject,
                hookOptions
              });
            }
          }
        }

        if (!embeddedAccount) {
          return onError({
            error: new OpenfortError("Failed to recover embedded wallet", OpenfortErrorType.WALLET_ERROR),
            options: optionsObject,
            hookOptions
          });
        }

        setStatus({
          status: 'success',
        });

        return onSuccess({
          data: {
            wallet: parseEmbeddedAccount(embeddedAccount, openfortConnector),
          },
          options: optionsObject,
          hookOptions,
        });
      } catch (err) {
        let error: OpenfortError;

        if (err instanceof MissingRecoveryPasswordError) {
          error = new OpenfortError("Missing recovery password", OpenfortErrorType.WALLET_ERROR);
        } else if (err instanceof OpenfortError) {
          error = err;
        } else if (typeof err === 'string') {
          error = new OpenfortError(err, OpenfortErrorType.WALLET_ERROR);
        } else {
          error = new OpenfortError("Failed to recover embedded wallet", OpenfortErrorType.WALLET_ERROR, { error: err });
          if (error.message === "Wrong recovery password for this embedded signer") {
            error.message = "Wrong password, Please try again.";
          }
        }

        log('Error handling recovery with Openfort:', error, err);

        setStatus({
          status: 'error',
          error,
        });

        return onError({
          error,
          options: optionsObject,
          hookOptions,
        });
      }

    } else {
      setStatus({
        status: 'connecting',
        address: optionsObject.address,
      });
      if (!connector) {
        log("Connector not available for wallet", optionsObject.walletId);
        return {
          error: new OpenfortError("Connector not found", OpenfortErrorType.WALLET_ERROR),
        };
      }
      setConnectToConnector({
        address: optionsObject.address,
        connector,
      });
    }

    return {};
  }, [wallets, setOpen, setRoute, setConnector, disconnectAsync, log, address, client, walletConfig, chainId, hookOptions]);

  const queryClient = useQueryClient();
  const createWallet = useCallback(async ({
    recovery,
    ...options
  }: CreateWalletOptions = {}): Promise<CreateWalletResult> => {
    setStatus({
      status: 'creating',
    });

    log("Creating wallet", { recovery: recovery?.recoveryMethod || RecoveryMethod.AUTOMATIC, options });

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


      const recoveryParams = await parseWalletRecovery(recovery);

      const embeddedAccount = await client.embeddedWallet.create({
        chainId: uiConfig?.initialChainId ?? chainId,
        accountType: options?.accountType || walletConfig?.accountType || AccountTypeEnum.SMART_ACCOUNT,
        chainType: ChainTypeEnum.EVM,
        recoveryParams,
      });

      setStatus({
        status: 'success',
      });

      queryClient.invalidateQueries({ queryKey: ['openfortEmbeddedAccountsList'] })
      return onSuccess({
        hookOptions,
        options,
        data: {
          wallet: parseEmbeddedAccount(embeddedAccount, openfortConnector)
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

  }, [client, uiConfig, chainId]);

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
            wallet: parseEmbeddedAccount(embeddedAccount, openfortConnector),
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
    availableWallets,
    activeWallet,
    setRecovery,
    reset: () => setStatus({ status: 'idle' }),
    createWallet,
    setActiveWallet,
    ...mapWalletStatus(status),
    exportPrivateKey: () => client.embeddedWallet.exportPrivateKey(),
  }
}
