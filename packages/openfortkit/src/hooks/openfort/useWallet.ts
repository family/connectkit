import { useMemo } from "react";
import { AuthProvider, routes, useOpenfortKit } from "../../components/OpenfortKit";
import { useOpenfort } from "../../openfort/OpenfortProvider";
import { openfortWalletId } from "../../constants/openfort";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { EmbeddedState } from "@openfort/openfort-js";
import { useWallets as useWagmiWallets } from "../../wallets/useWallets";

export type UserWallet = {
  address?: `0x${string}`;
  connectorType?: string;
  walletClientType?: string;
  id?: string;
}

export function useWallets() {
  const { user, embeddedState, exportPrivateKey } = useOpenfort();
  const { walletConfig, log, setOpen, setRoute, setConnector } = useOpenfortKit();
  const { connector, isConnected, address } = useAccount();
  const wagmiWallets = useWagmiWallets();
  const { disconnect } = useDisconnect();

  const usesEmbeddedWallet = user && walletConfig.createEmbeddedSigner;
  const isEmbedded = embeddedState === EmbeddedState.READY;

  const wallets: UserWallet[] = useMemo(() => {
    const linkedWallets: UserWallet[] = user ? user.linkedAccounts
      .filter((a) => a.provider === AuthProvider.WALLET)
      .map((a) => {
        const id = wagmiWallets.find((c) => c.connector.name.toLowerCase() === a.walletClientType)?.id;
        return {
          address: a.address as `0x${string}`,
          connectorType: a.connectorType,
          walletClientType: a.walletClientType,
          id
        }
      }) : []
    if (usesEmbeddedWallet) {
      linkedWallets.push({
        connectorType: "embedded",
        walletClientType: "openfort",
        address: isEmbedded ? address : undefined,
        id: openfortWalletId
      });
    }

    return linkedWallets;
  }, [user]);

  const currentWallet = isConnected && connector ? wallets.find((w) => w.walletClientType === connector.name.toLowerCase()) : undefined;

  const setActiveWallet = (id: string) => {
    const walletToConnect = wallets.find((w) => w.id == id)
    if (!walletToConnect) {
      log("Wallet not found", id);
      return false;
    }

    // Disconnect and connect to the wallet, open modal with the proper screen
    disconnect();

    log("Connecting to wallet", walletToConnect);
    if (id === openfortWalletId) {
      setTimeout(() => {
        setRoute(routes.RECOVER);
        setOpen(true);
      });
    } else {
      setRoute(routes.CONNECT);
      setConnector({ id });
      setOpen(true);
    }
  }

  return {
    wallets,
    currentWallet,
    setActiveWallet,
    exportPrivateKey,
  }
}
