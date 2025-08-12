import { SignaturesCard } from '@/components/Showcase/app/Signatures';
import { SwitchChainCard } from '@/components/Showcase/app/SwitchChain';
import { WalletsCard } from '@/components/Showcase/app/Wallets';
import { WriteContractCard } from '@/components/Showcase/app/WriteContract';
import { SampleTooltipLink } from '@/components/Showcase/auth/SampleTooltipLink';
import { Button } from '@/components/Showcase/ui/Button';
import { useSignOut, useUser } from '@openfort/react';
import { useAccount } from 'wagmi';

export const App = () => {
  const { user } = useUser();
  const { address } = useAccount();
  const { signOut } = useSignOut();

  return (
    <div className="h-full w-full p-4 ">
      <div className='flex justify-between items-start mb-6'>
        <div className='space-y-1'>
          <h1 className='text-xl'>
            Welcome, {user?.id}
          </h1>
          <p className='text-muted-foreground'>
            Connected with {address}
          </p>
        </div>

        <SampleTooltipLink
          href='/auth/useSignOut'
          hook='useSignOut'
          fn='signOut'
        >
          <Button
            className='btn btn-accent btn-sm'
            onClick={() => {
              signOut();
            }}
          >
            Sign out
          </Button>
        </SampleTooltipLink>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <SignaturesCard />
        <WriteContractCard />
        <SwitchChainCard />
        <WalletsCard />
      </div>
    </div >
  )
}