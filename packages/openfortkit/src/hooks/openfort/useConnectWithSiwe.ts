import { useAccount, useChainId, useConfig, useDisconnect } from "wagmi";
import { useOpenfortKit } from '../../components/OpenfortKit/useOpenfortKit';
import { useOpenfort } from '../../openfort/useOpenfort';
import { createSIWEMessage } from "../../siwe/create-siwe-message";
import { AxiosError } from "axios";

import { signMessage } from '@wagmi/core';

export function useConnectWithSiwe() {
  const openfort = useOpenfort();
  const { log } = useOpenfortKit();
  const { address } = useAccount();
  const chainId = useChainId();
  const config = useConfig();

  const connectWithSiwe = async ({
    connectorType,
    walletClientType,
    onError,
    onConnect,
  }: {
    connectorType: string,
    walletClientType: string,
    onError?: (error: string, status?: number) => void,
    onConnect?: () => void,
  }) => {
    if (!address) {
      log("No address found");
      onError && onError("No address found");
      return;
    }

    try {
      const { nonce } = await openfort.initSIWE({ address });
      const SIWEMessage = createSIWEMessage(address, nonce, chainId);
      const signature = await signMessage(config, { message: SIWEMessage });

      // if has user, we link the wallet
      if (openfort.user) {
        const authToken = openfort.getAccessToken();
        if (!authToken) throw new Error('No access token found');

        log("Linking wallet", { signature, message: SIWEMessage, connectorType, walletClientType, authToken });
        await openfort.linkWallet({
          signature,
          message: SIWEMessage,
          connectorType,
          walletClientType,
          authToken,
        })
      }

      await openfort.authenticateWithSIWE({
        signature,
        message: SIWEMessage,
        connectorType,
        walletClientType,
      })

      await openfort.updateUser();

      onConnect && onConnect();
    }
    catch (err) {
      log("Failed to connect with SIWE", err);
      if (err instanceof AxiosError) {
        onError && onError("Failed to connect with SIWE", err.request.status);
      } else {
        onError && onError("Failed to connect with SIWE");
      }
    }
  }

  return connectWithSiwe;
}