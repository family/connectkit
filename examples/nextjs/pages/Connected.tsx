"use client";

import { useIsMounted, useOpenfort } from "connectkit";
import { useAccount, useEnsName } from "wagmi";

export const Connected = () => {
  const account = useAccount();
  const isMounted = useIsMounted();
  const { data: ensName } = useEnsName({
    address: account.address,
  })
  const { user, logout } = useOpenfort()

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
      </div>
      <div style={{ width: "100%" }}>
        player: {user?.id}
        <br />
        linked accounts: {user?.linkedAccounts.map((a) => a.provider).join(", ")}
      </div>
      <button
        onClick={() => logout()}
      >
        Log out
      </button>
    </div>
  );
};
