import { useMemo } from "react";
import { KitOAuthProvider, routes, useOpenfortKit } from "../../components/FortKit";
import { useOpenfort } from "../../openfort/OpenfortProvider";
import { openfortWalletId } from "../../constants/openfort";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { EmbeddedState } from "@openfort/openfort-js";
import { useWallets } from "../../wallets/useWallets";

type UserWallet = {
  address?: `0x${string}`;
  connectorType?: string;
  walletClientType?: string;
  id?: string;
}

export function useWallet() {
  const { user, embeddedState } = useOpenfort();
  const { walletConfig, log, setOpen, setRoute, setConnector } = useOpenfortKit();
  const { connector, isConnected, address } = useAccount();
  const wallets2 = useWallets();
  const { disconnect } = useDisconnect();

  const usesEmbeddedWallet = user && walletConfig.createEmbeddedSigner;
  const isEmbedded = embeddedState === EmbeddedState.READY;

  const currentWallet = isConnected && connector ? connector.name.toLowerCase() : undefined;

  const wallets: UserWallet[] = useMemo(() => {
    const linkedWallets: UserWallet[] = user ? user.linkedAccounts
      .filter((a) => a.provider === KitOAuthProvider.WALLET)
      .map((a) => {
        const id = wallets2.find((c) => c.connector.name.toLowerCase() === a.walletClientType)?.id;
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
        walletClientType: "Openfort",
        address: isEmbedded ? address : undefined,
        id: openfortWalletId
      });
    }

    return linkedWallets;
  }, [user]);


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
  }
}
