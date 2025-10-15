import { getAddress, parseAbi } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { TruncateData } from "../ui/TruncateData";
import { useWallets } from "@openfort/react";

const MintContract = () => {

  const { address } = useAccount()
  const wallWallets = useWallets()
  console.log({ wallWallets })


  const { data: balance, refetch, error: balanceError } = useReadContract({
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

  const { data: hash, isPending, writeContract, error } = useWriteContract({
    mutation: {
      onSuccess: () => {
        setTimeout(() => {
          refetch()
        }, 100);
      },
      onSettled: (data, error) => {
        console.log('Settled', { data, error });
      }
    }
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
      <p className="mb-2 text-zinc-400 text-sm">Current balance: {balance?.toString()} {tokenSymbol as string || ""}</p>
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
        <button
          className='btn'
          disabled={isPending || !address}
        >
          {
            isPending ? 'Minting...' : 'Mint Tokens'
          }
        </button>
      </form>
      <TruncateData data={hash} />
      <TruncateData data={error?.message} className="text-red-400" />
      <TruncateData data={balanceError?.message} className="text-red-400" />
    </div>
  )
}

export const Actions = () => {

  return (
    <div className="flex flex-col w-full">
      <h1>Actions</h1>
      <span className="mb-4 text-zinc-400 text-sm">
        Interact with smart contracts on the blockchain.
      </span>
      <MintContract />
    </div>
  );
}