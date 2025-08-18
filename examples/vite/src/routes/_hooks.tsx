import { TruncatedText } from '@/components/TruncatedText';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { BaseVariable } from '@/components/Variable/Variable';
import { cn } from '@/lib/cn';
import { useAppStore } from '@/lib/useAppStore';
import { RecoveryMethod, useUser, useWallets } from '@openfort/react';
import { Link, Outlet, createFileRoute } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { PropsWithChildren, useMemo } from 'react';
import { useAccount, useChainId, useChains } from 'wagmi';

export const Route = createFileRoute('/_hooks')({
  component: RouteComponent,
})


const ConfigurationVariables = () => {

  const { providerOptions, setProviderOptions } = useAppStore()
  return (
    <>
      <BaseVariable
        name='recoveryMethod'
        value={providerOptions.walletConfig?.recoveryMethod || 'automatic'}

        variables={{
          recoveryMethod: {
            description: 'The recovery method to use for the embedded wallet.',
            type: 'select',
            options: ['automatic', 'password'],
            onEdit: (value) => {
              setProviderOptions({
                ...providerOptions,
                walletConfig: {
                  ...providerOptions.walletConfig,
                  // @ts-expect-error ts is not aware of the walletConfig type
                  recoveryMethod: value as RecoveryMethod,
                }
              })
            }
          }
        }}
      />
    </>

  )

}

const SidebarLink = ({ children, href, cta = "View in hook" }: PropsWithChildren<{ href: string, cta?: string }>) => {
  return (
    <Link
      to={href}
      className='text-inherit group'
    >
      {children}
      <Tooltip>
        <TooltipTrigger>
          <ArrowUpRight className='text-gray-500 dark:text-gray-400 inline-block size-3.5 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200' />
        </TooltipTrigger>
        <TooltipContent>
          <span className='text-xs'>{cta}</span>
        </TooltipContent>
      </Tooltip>
    </Link>
  )
}

const SidebarInfo = () => {

  const { user } = useUser();
  const { activeWallet } = useWallets();
  const { address } = useAccount()
  const chainId = useChainId()
  const chains = useChains()

  const connectedChain = useMemo(() => (
    chains.find(c => c.id === chainId)
  ), [chains, chainId])

  const renderSuggestedActions = () => {
    if (!user) {
      return (
        <div className='text-sm flex flex-col gap-1'>
          <p className='text-gray-500 dark:text-gray-400 mb-2'>You are not authenticated.</p>
          <SidebarLink href='/auth/useGuestAuth?focus=signUpGuest'>
            Sign up as a guest
          </SidebarLink>
          <SidebarLink href='/auth/useEmailAuth?focus=signUpEmail'>
            Sign up with email
          </SidebarLink>
          <SidebarLink href='/auth/useOauth?focus=initOAuth'>
            Sign up with OAuth
          </SidebarLink>
          <SidebarLink href='/auth/useWalletAuth?focus=connectWallet'>
            Continue with your wallet
          </SidebarLink>
        </div>
      )
    }
    if (!address) {
      return (
        <div className='text-sm flex flex-col gap-1'>
          <p className='text-gray-500 dark:text-gray-400 mb-2'>You are authenticated, but no wallet is connected.</p>
          <SidebarLink href='/app/useWallets?focus=setActiveWallet'>
            Connect a wallet
          </SidebarLink>
          <SidebarLink href='/auth/useSignOut?focus=signOut'>
            Sign out
          </SidebarLink>
        </div>
      )
    }
    return (
      <div className='text-sm flex flex-col gap-1'>
        <p className='text-gray-500 dark:text-gray-400 mb-2'>You are authenticated and have a wallet connected. Good job!</p>
        <SidebarLink href='/wagmi/useBalance?focus=data'>
          Check balance
        </SidebarLink>
        <SidebarLink href='/wagmi/useDisconnect?focus=disconnect'>
          Disconnect wallet
        </SidebarLink>
        <SidebarLink href='/auth/useSignOut?focus=signOut'>
          Sign out
        </SidebarLink>
      </div>
    )
  }

  return (
    <div className='p-4 space-y-4 overflow-y-auto h-full'>
      <div className='text-sm'>
        <p className='text-gray-500 dark:text-gray-400 mb-4'>
          Openfort Playground is a demo application to showcase the Openfort.
        </p>
        <h3 className='text-lg font-semibold mb-2'>
          Relevant information
        </h3>
        <div className='flex flex-col gap-1'>
          <SidebarLink href='/app/useUser?focus=user'>User ID: <span className='text-gray-500 dark:text-gray-400'>{user ? <TruncatedText text={user.id} /> : "No user"}</span>
          </SidebarLink>
          <SidebarLink href='/app/useUser?focus=user'>
            User linked accounts: <span className='text-gray-500 dark:text-gray-400'>{user ? (<>[{user.linkedAccounts.map(a => a.provider).join(",")}]</>) : "No user"}</span>
          </SidebarLink>
          <SidebarLink href='/app/useWallets?focus=activeWallet'>
            Wallet address: <span className='text-gray-500 dark:text-gray-400'>{address ? <TruncatedText text={address} /> : "No wallet connected"}</span>
          </SidebarLink>
          <SidebarLink href='/app/useWallets?focus=activeWallet'>
            Wallet ID: <span className='text-gray-500 dark:text-gray-400'>{activeWallet?.id || "No wallet connected"}</span>
          </SidebarLink>
          <SidebarLink href='/wagmi/useAccount?focus=chainId'>
            Chain: <span className='text-gray-500 dark:text-gray-400'>{address ? connectedChain?.name : "No wallet connected"}</span>
          </SidebarLink>
        </div>
      </div>

      <div>
        <h3 className='text-lg font-semibold mb-2'>
          Common configuration
        </h3>
        <ConfigurationVariables />
      </div>
      <div>
        <h3 className='text-lg font-semibold mb-1 relative'>
          Suggested actions
          <div className={cn((!address || !user) ? "size-2 ml-1 mb-2 inline-block relative" : "hidden")} >
            <div className='absolute inset-0 rounded-full border border-primary animate-ping' />
            <div className='absolute inset-0 rounded-full bg-primary' />
          </div>
        </h3>
        {renderSuggestedActions()}
      </div>
    </div >
  )
}
function RouteComponent() {
  return (
    <div className="flex-1 flex max-w-(--max-screen-width) mx-auto w-full">
      <div className='fixed max-w-(--sidebar-width) border-r min-h-full h-full overflow-hidden pt-(--nav-height)'>
        <SidebarInfo />
      </div>
      <div className='flex-1 overflow-hidden flex flex-col pl-(--sidebar-width) pt-(--nav-height)'>
        <Outlet />
      </div>
    </div>
  )
}
