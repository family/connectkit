import { useMemo } from 'react'
import { getAddress, parseAbi } from 'viem'
import {
  useAccount,
  useChains,
  useReadContract,
  useWriteContract
} from 'wagmi'
import { TruncateData } from '../../../components/ui/TruncateData';

const MintContract = () => {
  const { address } = useAccount()

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

  const { data: tokenSymbol } = useReadContract({
    address: '0xef147ed8bb07a2a0e7df4c1ac09e96dec459ffac',
    abi: [
      {
        type: 'function',
        name: 'symbol',
        stateMutability: 'view',
        outputs: [{ type: 'string' }],
      },
    ],
    functionName: 'symbol',
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
      onSettled: (data: unknown, error: Error | null) => {
        console.log('Settled', { data, error })
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
    <div>
      <h2>Mint contract</h2>
      <p className="mb-2 text-zinc-400 text-sm">
        Current balance: {balance?.toString()} {(tokenSymbol as string) || ''}
      </p>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          const amount = (e.target as HTMLFormElement).amount.value
          submit({ amount })
        }}
      >
        <input
          type="number"
          placeholder="Enter amount to mint"
          className="grow peer"
          name="amount"
        />
        <button className="btn" disabled={isPending || !address}>
          {isPending ? 'Minting...' : 'Mint Tokens'}
        </button>
      </form>
      <TruncateData data={hash} />
      <TruncateData data={error?.message} className="text-red-400" />
      <TruncateData data={balanceError?.message} className="text-red-400" />
    </div>
  )
}

export const Actions = () => {
  const hasSponsorPolicy = useMemo(() => !!import.meta.env.VITE_POLICY_ID, [])
  const chains = useChains()
  return (
    <div className="flex flex-col w-full">
      <h1>Actions</h1>
      <span className="mb-4 text-zinc-400 text-sm">
        Interact with smart contracts on the blockchain.
      </span>
      {!hasSponsorPolicy && (
        <div className="mb-3 p-3 bg-red-800 text-white rounded text-sm">
          <strong>Warning: Transactions are not sponsored.</strong> Minting may
          fail because transactions are not being sponsored. To sponsor
          transactions, go to the{' '}
          <a
            href="https://dashboard.openfort.xyz/policies"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Openfort Dashboard
          </a>{' '}
          and <b>create a policy</b> sponsoring transactions in{' '}
          <b>{chains[0].name}</b>. Set the <code>VITE_POLICY_ID</code>{' '}
          environment variable with the policy ID.
        </div>
      )}
      <MintContract />
    </div>
  )
}
