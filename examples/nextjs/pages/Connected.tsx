"use client";

import { useOpenfort } from "connectkit";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const Connected = () => {
  const { address } = useAccount();
  const [isClient, setIsClient] = useState(false);
  const { user, logout } = useOpenfort()

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !address) return null; // Avoid mismatch by rendering nothing during SSR

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
