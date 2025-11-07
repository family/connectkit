import { getAddress, parseAbi } from 'viem'
import { useAccount, useChainId, useChains, useReadContract, useWriteContract } from 'wagmi'
import { Button } from '@/components/Showcase/ui/Button'
import { InputMessage } from '@/components/Showcase/ui/InputMessage'
import { TruncatedText } from '@/components/TruncatedText'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/cn'

export const WriteContractCard = () => {
  const { address } = useAccount()
  const chains = useChains()
  const chainId = useChainId()
  // const { data: client } = useWalletClient()

  const {
    data: balance,
    refetch,
    error: balanceError,
  } = useReadContract({
    address: '0xef147ed8bb07a2a0e7df4c1ac09e96dec459ffac',
    abi: [
      {
        type: 'function',
        name: 'balanceOf',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ type: 'uint256' }],
      },
    ],
    functionName: 'balanceOf',
    args: [address!],
  })

  const {
    data: hash,
    isPending,
    writeContract,
    error,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        setTimeout(() => {
          refetch()
        }, 100)
      },
    },
  })

  async function submit({ amount }: { amount: string }) {
    writeContract({
      address: getAddress('0xef147ed8bb07a2a0e7df4c1ac09e96dec459ffac'),
      abi: parseAbi(['function mint(address to, uint256 amount)']),
      functionName: 'mint',
      args: [address!, BigInt(amount)],
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write Contract</CardTitle>
        <CardDescription>Interact with smart contracts on the blockchain.</CardDescription>
        <CardDescription>
          Contract Address: <TruncatedText text="0xef147ed8bb07a2a0e7df4c1ac09e96dec459ffac" />
        </CardDescription>
        {!balanceError && <CardDescription>Balance: {balance?.toString() || 0}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault()
            const amount = (e.target as HTMLFormElement).amount.value || '1'
            submit({ amount })
          }}
        >
          <label className={cn('input w-full')}>
            <input
              type="number"
              placeholder="Enter amount to mint"
              className="grow peer placeholder:text-muted-foreground"
              name="amount"
            />
          </label>
          <Button className="btn btn-accent w-full" disabled={isPending || !address}>
            {isPending ? 'Minting...' : 'Mint Tokens'}
          </Button>
          <InputMessage message={`Transaction hash: ${hash}`} show={!!hash} variant="success" />
          {hash && (
            <a
              href={`${chains.find((c) => c.id === chainId)?.blockExplorers?.default.url}/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-400"
            >
              View on Etherscan
            </a>
          )}
          <InputMessage message={`Error: ${error?.message}`} show={!!error} variant="error" />
        </form>
        {/* <button
          type="button"
          onClick={async () => {
            if (!client) {
              console.error('No client found')
              return
            }
            if (!connector) {
              console.error('No connector found')
              return
            }

            // const connectorClient = await connector.getClient?.()
            // if (!connectorClient) {
            //   console.error('Connector client not available')
            //   return
            // }
            // Convert the wagmi wallet client to a viem wallet client
            const extendedClient = client.extend(erc7811Actions())

            // const extendedClient = connectorClient.extend(erc7811Actions())
            const assets = await extendedClient.getAssets()
            console.log(assets)
            assets[0]
          }}
        >
          get assets
        </button> */}
      </CardContent>
    </Card>
  )
}
