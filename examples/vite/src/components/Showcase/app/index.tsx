import { SignaturesCard } from '@/components/Showcase/app/Signatures';
import { SwitchChainCard } from '@/components/Showcase/app/SwitchChain';
import { WriteContractCard } from '@/components/Showcase/app/WriteContract';
import { useUser } from '@openfort/openfort-kit';
import { useAccount } from 'wagmi';

export const App = () => {
  const { user } = useUser();
  const { address } = useAccount();

  return (
    <div className="h-full w-full p-4 ">
      <div className='space-y-1 mb-4'>
        <h1 className='text-xl'>
          Welcome, {user?.id}
        </h1>
        <p className='text-muted-foreground'>
          Connected with {address}
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <SignaturesCard />
        <WriteContractCard />
        <SwitchChainCard />
        {/* <Card>
          <CardHeader>
            This is the header
          </CardHeader>
          <CardContent>
            This is the content of the app showcase. You can add more components and functionality here.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            This is the header
          </CardHeader>
          <CardContent>
            This is the content of the app showcase. You can add more components and functionality here.
          </CardContent>
        </Card> */}
      </div>
    </div >
  )
}