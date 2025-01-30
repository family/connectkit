"use client";

import { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";

export const Connected = () => {
  const { address } = useAccount();
  const [isClient, setIsClient] = useState(false);
  const { disconnect } = useDisconnect();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !address) return null; // Avoid mismatch by rendering nothing during SSR

  return (
    <div>
      <p>Connected with address: {address}</p>
      <button style={{ margin: "10px" }}>Mint... with wagmi</button>
      <button style={{ margin: "10px" }}>Sign... with wagmi</button>
      <button
        style={{ margin: "10px" }}
        onClick={() => disconnect()}
      >
        disconnect
      </button>
    </div>
  );
};
