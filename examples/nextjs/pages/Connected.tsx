"use client";

import { useIsMounted, useOpenfort } from "connectkit";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const Connected = () => {
  const { address } = useAccount();
  const isMounted = useIsMounted();
  const { user, logout } = useOpenfort()

  // Avoid mismatch by rendering nothing during SSR
  if (!isMounted || !address) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <p>Connected with address: {address}</p>
      {user && <p>Connected with user: {user.id}</p>}
      <button
        style={{ margin: "10px" }}
        onClick={() => logout()}
      >
        Log out
      </button>
    </div>
  );
};
