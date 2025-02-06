"use client";

import { useIsMounted, useOpenfort } from "connectkit";
import { useAccount, useEnsName } from "wagmi";
import { WriteContract } from "./WritteContract";

export const Connected = () => {
  const account = useAccount();
  const isMounted = useIsMounted();
  const { data: ensName } = useEnsName({
    address: account.address,
  })
  const { user, logout, signUpGuest, needsRecovery, isLoading } = useOpenfort()

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
      <WriteContract />
      <div>
        <h2>OPENFORT</h2>
        <div>Needs recover: {needsRecovery.toString()}</div>
        <div>Is loading: {isLoading.toString()}</div>
        <button
          onClick={() => signUpGuest()}
          type="button"
        >
          guest
        </button>
      </div>
      <button
        onClick={() => logout()}
      >
        Log out
      </button>
    </div>
  );
};
