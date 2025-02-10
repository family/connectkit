"use client";

import { useIsMounted, useModal, useOpenfort, useProviders, useWallets } from "@openfort/openfort-kit";
import { useAccount, useDisconnect, useEnsName } from "wagmi";
import { WriteContract } from "./WritteContract";

export const Connected = () => {
  const account = useAccount();
  const isMounted = useIsMounted();
  const { data: ensName } = useEnsName({
    address: account.address,
  })
  const { user, logout } = useOpenfort()
  const { linkedProviders, availableProviders } = useProviders()
  const { wallets, setActiveWallet, currentWallet } = useWallets()
  const { openSwitchNetworks } = useModal();

  // Avoid mismatch by rendering nothing during SSR
  if (!isMounted) return null;

  return (
    <div className="demo" style={{ display: "flex", width: "90vw", flexDirection: "column", alignItems: "start", }}>
      <section style={{ width: "100%" }}>
        <h2>ADDRESS</h2>
        <p>
          account: {account.address} {ensName}
        </p>
        <p>
          chainId: {account.chainId}
        </p>
        <p>
          status: {account.status}
        </p>
        <p>
          connector: {account.connector?.name} {account.connector?.id}
        </p>
        <button
          onClick={() => openSwitchNetworks()}
        >
          open switch networks
        </button>
      </section>
      <section>
        <h2>OPENFORT</h2>
        <p>
          player: {user?.id}
        </p>
        <p>
          linked providers: {linkedProviders.join(", ")}
        </p>
        <p>
          not linked providers: {availableProviders.join(", ")}
        </p>
        <button
          onClick={() => logout()}
        >
          Log out
        </button>

        <section>
          <h3>Linked wallets:</h3>
          {
            wallets.map((wallet) => (
              <div key={wallet.id}>
                <button
                  onClick={() => setActiveWallet(wallet.id!)}
                  disabled={currentWallet?.id === wallet.id}
                >
                  {wallet.walletClientType} ({wallet.id})
                </button>
              </div>
            ))
          }

        </section>

      </section>
      <WriteContract />
    </div>
  );
};
