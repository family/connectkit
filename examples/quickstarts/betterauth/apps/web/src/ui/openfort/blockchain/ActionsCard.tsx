import { getAddress, parseAbi } from 'viem';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';

import { TruncateData } from '../../../components/ui/TruncateData';

const ERC20_ADDRESS = '0xef147ed8bb07a2a0e7df4c1ac09e96dec459ffac';

function MintContract() {
  const { address } = useAccount();

  const {
    data: balance,
    refetch,
    error: balanceError,
  } = useReadContract({
    address: ERC20_ADDRESS,
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
    args: address ? [address] : undefined,
  });

  const { data: tokenSymbol } = useReadContract({
    address: ERC20_ADDRESS,
    abi: [
      {
        type: 'function',
        name: 'symbol',
        stateMutability: 'view',
        outputs: [{ type: 'string' }],
      },
    ],
    functionName: 'symbol',
  });

  const {
    data: hash,
    isPending,
    writeContract,
    error,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        setTimeout(() => {
          refetch();
        }, 100);
      },
      onSettled: (data, settledError) => {
        console.log('Settled', { data, error: settledError });
      },
    },
  });

  async function submit({ amount }: { amount: string }) {
    if (!address) return;

    writeContract({
      address: getAddress(ERC20_ADDRESS),
      abi: parseAbi(['function mint(address to, uint256 amount)']),
      functionName: 'mint',
      args: [address, BigInt(amount)],
    });
  }

  return (
    <div>
      <h2>Mint contract</h2>
      <p className="mb-2 text-zinc-400 text-sm">
        Current balance: {balance?.toString()} {(tokenSymbol as string) || ''}
      </p>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          const amount = (event.target as HTMLFormElement).amount.value;
          submit({ amount });
        }}
      >
        <input
          type="number"
          placeholder="Enter amount to mint"
          className="grow peer"
          name="amount"
        />
        <button type="submit" className="btn" disabled={isPending || !address}>
          {isPending ? 'Minting...' : 'Mint Tokens'}
        </button>
      </form>
      <TruncateData data={hash} />
      <TruncateData data={error?.message} className="text-red-400" />
      <TruncateData data={balanceError?.message} className="text-red-400" />
    </div>
  );
}

export function ActionsCard() {
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
