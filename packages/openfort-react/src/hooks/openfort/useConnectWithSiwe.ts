import { AxiosError } from "axios";
import { useAccount, useChainId, useConfig } from "wagmi";
import { useOpenfortKit } from '../../components/Openfort/useOpenfortKit';
import { useOpenfortCore } from '../../openfort/useOpenfort';
import { createSIWEMessage } from "../../siwe/create-siwe-message";

import { signMessage } from '@wagmi/core';
import { useCallback } from "react";

export function useConnectWithSiwe() {
  const { client, user, updateUser } = useOpenfortCore();
  const { log } = useOpenfortKit();
  const { address } = useAccount();
  const chainId = useChainId();
  const config = useConfig();
  const { connector } = useAccount()

  const connectWithSiwe = useCallback(async ({
    onError,
    onConnect,
  }: {
    onError?: (error: string, status?: number) => void,
    onConnect?: () => void,
  }) => {
    const connectorType = connector?.type;
    const walletClientType = connector?.id;

    if (!address || !connectorType || !walletClientType) {
      log("No address found", { address, connectorType, walletClientType });
      onError && onError("No address found");
      return;
    }

    try {
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
      if (err instanceof AxiosError) {
        onError && onError("Failed to connect with SIWE", err.request.status);
      } else {
        onError && onError("Failed to connect with SIWE");
      }
    }
  }, [client, user, updateUser, log, address, chainId, config, connector]);

  return connectWithSiwe;
}