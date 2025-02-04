import { createSiweMessage } from "viem/siwe";
import { sepolia } from "wagmi/chains";

export const createSIWEMessage = (address: `0x${string}`, nonce: string, chainId?: number) =>
  createSiweMessage({
    domain: window.location.host,
    address,
    statement:
      "By signing, you are proving you own this wallet and logging in. This does not initiate a transaction or cost any fees.",
    uri: window.location.origin,
    version: "1",
    chainId: chainId ?? sepolia.id,
    nonce,
  })