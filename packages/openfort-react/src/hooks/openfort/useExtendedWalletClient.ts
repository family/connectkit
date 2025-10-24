import { createWalletClient, custom } from 'viem'
import { erc7715Actions } from 'viem/experimental'
import { useWalletClient } from 'wagmi'

export function useExtendedWalletClient() {
  const { data: wagmiWalletClient } = useWalletClient()

  if (!wagmiWalletClient) return undefined

  // Convert the wagmi wallet client to a viem wallet client
  const client = createWalletClient({
    account: wagmiWalletClient.account,
    chain: wagmiWalletClient.chain,
    transport: custom(wagmiWalletClient.transport),
  }).extend(erc7715Actions())

  return client
}
