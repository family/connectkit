import { EmbeddedState, MissingRecoveryPasswordError, RecoveryMethod, ShieldAuthentication, ShieldAuthType } from "@openfort/openfort-js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Connector, useAccount, useCall, useChainId, useConnect, useDisconnect } from "wagmi";
import { useOpenfortKit } from '../../components/OpenfortKit/useOpenfortKit';
import { AuthProvider, routes } from "../../components/OpenfortKit/types";
import { embeddedWalletId } from "../../constants/openfort";
import { useOpenfort } from '../../openfort/useOpenfort';
import { useWallets as useWagmiWallets, useWallet } from "../../wallets/useWallets";
import { Hex } from "viem";
import { BaseFlowState, mapStatus } from "./auth/status";
import { OpenfortKitError, OpenfortKitErrorType } from "../../types";

export type UserWallet = {
  address?: `0x${string}`;
  connectorType?: string;
  walletClientType?: string;
  connector?: Connector;
  id: string;
  isAvailable: boolean;
  isActive: boolean;
}

type SetActiveWalletOptions = {
  showUI?: boolean;
  address?: Hex | undefined;
} & ({
  connector: string;
} | {
  connector: typeof embeddedWalletId;
  password?: string;
})

const createOpenfortWallet = ({
  connector,
  isEmbedded,
  address,
}: {
  connector: Connector | undefined;
  isEmbedded: boolean;
  address?: Hex | undefined;
}): UserWallet => ({
  connectorType: "embedded",
  walletClientType: "openfort",
  address: isEmbedded ? address : undefined,
  id: embeddedWalletId,
  isAvailable: true,
  isActive: isEmbedded && connector?.id === embeddedWalletId,
});

export function useWallets() {
  const { user, embeddedState, client } = useOpenfort();
  const { walletConfig, log, setOpen, setRoute, setConnector, uiConfig: openfortKitOptions } = useOpenfortKit();
  const { connector, isConnected, address } = useAccount();
  const chain = useChainId();
  const deviceWallets = useWagmiWallets(); // TODO: Map wallets object to be the same as wallets
  const { disconnect } = useDisconnect();
  const [status, setStatus] = useState<BaseFlowState>({
    status: "idle",
  })
  const [connectToConnector, setConnectToConnector] = useState<{ address?: Hex, connector: Connector } | undefined>(undefined);
  const { connect } = useConnect({
    mutation: {
      onError: (error) => {
        console.error("Error connecting ---", error);
        setStatus({
          status: 'error',
          error: new OpenfortKitError("Failed to connect with wallet: ", OpenfortKitErrorType.AUTHENTICATION_ERROR, error),
        });
      },
      onSuccess: (data) => {
        setConnectToConnector(undefined);
        console.log("Connected with wallet", data, connectToConnector);
        if (connectToConnector?.address && !data.accounts.some((a) => a === connectToConnector.address)) {
          setStatus({
            status: 'error',
            error: new OpenfortKitError("Failed to connect with wallet: Address mismatch", OpenfortKitErrorType.AUTHENTICATION_ERROR),
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


  const usesEmbeddedWallet = user && walletConfig;
  const isEmbedded = embeddedState === EmbeddedState.READY;

  const wallets: UserWallet[] = useMemo(() => {
    const linkedWallets: UserWallet[] = user ? user.linkedAccounts
      .filter((a) => a.provider === AuthProvider.WALLET)
      .map((a) => {
        const wallet = deviceWallets.find((c) => c.connector.id === a.walletClientType);
        return {
          address: a.address as `0x${string}`,
          connectorType: a.connectorType,
          walletClientType: a.walletClientType,
          id: wallet?.id || a.walletClientType || "unknown",
          isAvailable: !!wallet,
          isActive: connector?.id === a.walletClientType && address === a.address,
        }
      }) : []

    // TODO: List user wallets with embeddedWallet.list
    if (usesEmbeddedWallet) {
      linkedWallets.push(createOpenfortWallet({
        connector,
        isEmbedded,
        address
      }));
    }

    return linkedWallets;
  }, [user, address, connector?.id]);

  const activeWallet = isConnected && connector ? wallets.find((w) => w.isActive) : undefined;

  useEffect(() => {
    if (connectToConnector)
      connect({ connector: connectToConnector.connector });
  }, [connectToConnector])

  const setActiveWallet = useCallback(async (options: SetActiveWalletOptions | string):
    Promise<{ error?: string, wallet?: UserWallet }> => {
    const optionsObject = typeof options === "string" ? { connector: options } : options;

    const { showUI } = optionsObject;

    let connector: Connector | null = null;

    if (typeof optionsObject.connector === 'string') {
      const wallet = deviceWallets.find(c => c.id === optionsObject.connector);
      if (!wallet) {
        log("Connector not found", connector);
        return { error: "Connector not found" };
      }
      log("Connecting to", wallet.connector)
      connector = wallet.connector;
    } else {
      connector = connector;
    }

    if (!connector) {
      log("Connector not found", deviceWallets, optionsObject.connector);
      return { error: "Connector not found" };
    }

    if (activeWallet?.id === connector.id && address === optionsObject.address) {
      log(`Already connected to ${connector.id} with address ${address}, skipping connection`);
      return { wallet: activeWallet };
    }


    const hasDisconnected = new Promise<void>((resolve) => {
      disconnect(undefined, {
        onSuccess: () => {
          resolve();
        },
        onError: (error) => {
          console.error("Error disconnecting", error);
          // setStatus({
          //   status: 'error',
          //   error: new Error("Failed to disconnect: " + error),
          // });

          resolve();
        },
      });
    });
    await hasDisconnected;

    if (showUI) {
      const walletToConnect = wallets.find((w) => w.id == connector.id)
      if (!walletToConnect) {
        log("Wallet not found", connector);
        return {};
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

    const chainId = openfortKitOptions?.initialChainId ?? chain;
    console.log("Setting active wallet", { options: optionsObject, chainId });

    if (isOpenfortWallet(optionsObject)) {
      const getEncryptionSession = async (): Promise<string> => {
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
      }
      setStatus({
        status: 'loading',
      });

      const { password } = optionsObject;

      // -----
      //
      // HERE WOULD GO THE LOGIC TO CONNECT TO WALLET A OR B
      //
      // -----

      if (!walletConfig) {
        return {
          error: "Embedded signer not enabled",
        }
      }

      log(`Handling recovery with Openfort: password=${password}, chainId=${chainId}`);
      try {
        const accessToken = await client.getAccessToken();
        if (!accessToken) {
          throw new Error("Openfort access token not found");
        }

        if (!password) {

          const shieldAuth: ShieldAuthentication = {
            auth: ShieldAuthType.OPENFORT,
            token: accessToken,
            encryptionSession: walletConfig.getEncryptionSession ?
              await walletConfig.getEncryptionSession() :
              await getEncryptionSession(),
          };
          log("Configuring embedded signer with automatic recovery");
          await client.embeddedWallet.configure({
            chainId,
            recoveryParams: {
              recoveryMethod: RecoveryMethod.AUTOMATIC,
            },
            shieldAuthentication: shieldAuth,
          });
        } else {
          if (!password || password.length < 4) {
            throw "Password recovery must be at least 4 characters";
          }
          const shieldAuth: ShieldAuthentication = {
            auth: ShieldAuthType.OPENFORT,
            token: accessToken,
          };
          await client.embeddedWallet.configure({
            chainId,
            recoveryParams: {
              recoveryMethod: RecoveryMethod.PASSWORD,
              password,
            },
            shieldAuthentication: shieldAuth,
          });
        }

        setStatus({
          status: 'success',
        });

        return {
          wallet: createOpenfortWallet({
            connector,
            isEmbedded,
            address,
          }),
        };
      } catch (err) {
        log('Error handling recovery with Openfort:', err);
        if (err instanceof MissingRecoveryPasswordError) {
          return {
            error: "Missing recovery password",
          }
        }
        if (typeof err === 'string') {
          return {
            error: err,
          }
        }
        // setStatus({
        //   status: 'error',
        //   error: new Error("Failed to connect with embedded wallet: " + err),
        // });
        return {
          error: "The recovery phrase you entered is incorrect.",
        };
      }

    } else {
      setStatus({
        status: 'loading',
      });
      setConnectToConnector({
        address: optionsObject.address,
        connector,
      });
    }

    return {};

  }, [wallets, setOpen, setRoute, setConnector, disconnect, log, isConnected, address, usesEmbeddedWallet, isEmbedded]);

  const createWallet = useCallback(() => {
    throw new Error("createWallet is not implemented in useWallets. Use setActiveWallet instead.");
  }, [])

  return {
    wallets,
    availableWallets: deviceWallets,
    activeWallet,
    setActiveWallet,
    // createWallet,
    ...mapStatus(status),
    exportPrivateKey: client.embeddedWallet.exportPrivateKey,
  }
}


