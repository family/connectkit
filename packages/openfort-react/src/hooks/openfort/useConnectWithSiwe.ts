import { AxiosError } from "axios";
import { useAccount, useChainId, useConfig, usePublicClient } from "wagmi";
import { useOpenfort } from '../../components/Openfort/useOpenfort';
import { useOpenfortCore } from '../../openfort/useOpenfort';
import { createSIWEMessage } from "../../siwe/create-siwe-message";

import { signMessage, switchChain } from '@wagmi/core';
import { useCallback } from "react";
import { isMobile } from "../../utils";
import { useWallet } from "../../wallets/useWallets";

// This hook assumes wagmi is already connected to a wallet
// It will use the connected wallet to sign the SIWE message and authenticate with Openfort
// If there is a user already, it will link the wallet to the user
export function useConnectWithSiwe() {
  const { client, user, updateUser } = useOpenfortCore();
  const { log } = useOpenfort();
  const { address, connector, chainId: accountChainId } = useAccount();
  const chainId = useChainId();
  const config = useConfig();
  const publicClient = usePublicClient();

  const connectWithSiwe = useCallback(async ({
    onError,
    onConnect,
    connectorType: propsConnectorType,
    walletClientType: propsWalletClientType,
  }: {
    connectorType?: string,
    walletClientType?: string,
    onError?: (error: string, status?: number) => void,
    onConnect?: () => void,
  } = {}) => {
    const connectorType = propsConnectorType ?? connector?.type;
    const walletClientType = propsWalletClientType ?? connector?.id;

    if (!address || !connectorType || !walletClientType) {
      log("No address found", { address, connectorType, walletClientType });
      onError && onError("No address found");
      return;
    }

    try {
      if (accountChainId !== chainId) {
        switchChain(config, {
          chainId,
        })
      }

      const { nonce } = await client.auth.initSIWE({ address });

      const SIWEMessage = createSIWEMessage(address, nonce, chainId);

      const signature = await signMessage(config, { message: SIWEMessage });

      // if has user, we link the wallet
      if (user) {
        const authToken = await client.getAccessToken();
        if (!authToken) throw new Error('No access token found');

        log("Linking wallet", { signature, message: SIWEMessage, connectorType, walletClientType, authToken });
        await client.auth.linkWallet({
          signature,
          message: SIWEMessage,
          connectorType,
          walletClientType,
          authToken,
        })
      }

      await client.auth.authenticateWithSIWE({
        signature,
        message: SIWEMessage,
        connectorType,
        walletClientType,
      })

      await updateUser();

      onConnect && onConnect();
    }
    catch (err) {
      log("Failed to connect with SIWE", err);
      if (!onError) return;

      let message = err instanceof Error ? err.message : err instanceof AxiosError ? err.message : String(err);

      if (message.includes("User rejected the request.")) {
        message = "User rejected the request.";
      } else if (message.includes("Invalid signature")) {
        message = "Invalid signature. Please try again.";
      } else if (message.includes("An error occurred when attempting to switch chain")) {
        message = `Failed to switch chain. Please switch your wallet to ${publicClient?.chain?.name ?? "the correct network"} and try again.`;
      } else {
        message = "Failed to connect with SIWE.";
      }

      onError(message, err instanceof AxiosError ? err.request.status : undefined);
    }
  }, [client, user, updateUser, log, address, chainId, config, connector]);

  return connectWithSiwe;
}