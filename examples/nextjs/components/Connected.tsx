"use client";

import { useIsMounted, useModal, useOpenfort, useProviders, useWallet } from "@openfort/openfort-kit";
import { useAccount, useDisconnect, useEnsName } from "wagmi";
import { WriteContract } from "./WritteContract";

export const Connected = () => {
  const account = useAccount();
  const { disconnect } = useDisconnect();
  const isMounted = useIsMounted();
  const { data: ensName } = useEnsName({
    address: account.address,
  })
  const { user, logout } = useOpenfort()
  const { linkedProviders, availableProviders } = useProviders()
  const { wallets, setActiveWallet } = useWallet()
  const { openSwitchNetworks } = useModal()

  // Avoid mismatch by rendering nothing during SSR
  if (!isMounted) return null;

  return (
    <div style={{ display: "flex", width: "90vw", flexDirection: "column", alignItems: "start", gap: "10px" }}>
      <div style={{ width: "100%" }}>
        account: {account.address} {ensName}
        <br />
        chainId: {account.chainId}
        <br />
        status: {account.status}
        <br />
        connector: {account.connector?.name} {account.connector?.id}
      </div>
      <div>
        <h2>OPENFORT</h2>
        player: {user?.id}
        <br />
        linked providers: {linkedProviders.join(", ")}
        <br />
        not linked providers: {availableProviders.join(", ")}
      </div>
      <button
        onClick={() => logout()}
      >
        Log out
      </button>
      {
        wallets.map((wallet) => (
          <div key={wallet.id}>
            {wallet.id} {wallet.connectorType} {wallet.walletClientType} {wallet.address}

            <button
              onClick={() => setActiveWallet(wallet.id!)}
            >
              connectWith {wallet.walletClientType}
            </button>
          </div>
        ))
      }

      <button
        onClick={() => disconnect()}
      >
        disconnect
      </button>
      <button
        onClick={() => openSwitchNetworks()}
      >
        open switch networks
      </button>

      <WriteContract />
    </div>
  );
};
