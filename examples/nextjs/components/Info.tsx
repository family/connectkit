"use client";

import { useIsMounted, useModal, useOpenfort, useProviders, useWallets } from "@openfort/openfort-kit";
import { useAccount, useEnsName } from "wagmi";
import { WriteContract } from "./WriteContract";

export const Info = () => {
  const isMounted = useIsMounted();
  const account = useAccount();
  const { data: ensName } = useEnsName({ address: account.address })
  const { user, logout } = useOpenfort()
  const { linkedProviders, availableProviders } = useProviders()
  const { wallets, setActiveWallet, currentWallet } = useWallets()
  const { openSwitchNetworks, setOpen, openProviders, openWallets } = useModal();

  // Avoid mismatch by rendering nothing during SSR
  if (!isMounted) return null;

  return (
    <div className="demo" style={{ display: "flex", width: "90vw", flexDirection: "column", alignItems: "start", }}>
      <section style={{ width: "100%" }}>
        <h2 className="text-red-200">MODAL</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => { setOpen(true) }}
          >
            open modal
          </button>
          <button
            onClick={() => openSwitchNetworks()}
          >
            open switch networks page
          </button>
          <button
            onClick={() => openProviders()}
          >
            open providers page
          </button>
          <button
            onClick={() => openWallets()}
          >
            open wallets page
          </button>
        </div>
      </section>
      <section>
        <h2>ADDRESS</h2>
        <p>
          <b>account:</b> {account.address} {ensName}
        </p>
        <p>
          <b>chainId:</b> {account.chainId}
        </p>
        <p>
          <b>status:</b> {account.status}
        </p>
      </section>
      <section>
        <h2>OPENFORT USER</h2>
        <p>
          <b>player:</b> {user?.id}
        </p>
        <p>
          <b>linked providers:</b> {linkedProviders.join(", ")}
        </p>
        <p>
          <b>not linked providers:</b> {availableProviders.join(", ")}
        </p>
        <button
          onClick={() => logout()}
        >
          Log out
        </button>

        <section>
          <h3>Linked wallets</h3>
          <p>
            <b>current connector:</b> {account.connector?.name} {account.connector?.id}
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
            {
              <button
                onClick={() => openWallets()}
                disabled={!user}
              >
                +
              </button>
            }
          </div>

        </section>

      </section>
      <WriteContract />
    </div>
  );
};
