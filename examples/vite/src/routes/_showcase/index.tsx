import { App } from '@/components/Showcase/app'
import { DialogLayout } from '@/components/Showcase/auth/DialogLayout'
import { EmailLoginButton } from '@/components/Showcase/auth/EmailLoginButton'
import { GuestLogin } from '@/components/Showcase/auth/GuestLogin'
import { SampleTooltipLink } from '@/components/Showcase/auth/SampleTooltipLink'
import { SocialLogin } from '@/components/Showcase/auth/SocialLogin'
import { Logo } from '@/components/ui/logo'
import { AuthProvider, useStatus } from '@openfort/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { WalletIcon } from 'lucide-react'

export const Route = createFileRoute('/_showcase/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isConnected, isLoading } = useStatus();

  if (isLoading) return null;
  if (isConnected) {
    return (
      <App />
    )
  }
  return (
    <>
      <DialogLayout>
        <div>
          <Logo className="h-12 px-2" />
        </div>
        <p className="text-sm text-center text-muted-foreground mb-5">
          Using openfort hooks to create a custom UI
        </p>

        {
          isConnected ? (
            <>
              {/* <div className="flex flex-col items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold">You are logged in</h2>
                <p className="text-sm text-muted-foreground">Welcome back!</p>
              </div>

              <Link className='btn btn-accent' to="/showcase/app" >
                <PlayIcon className='w-5 h-5 mr-2' />
                Go to app
              </Link>

              <SampleTooltipLink
                href='/auth/useSignOut'
                hook='useSignOut'
                fn='signOut'
              >
                <Button className='btn btn-accent' onClick={() => signOut()} >
                  <Wallet2Icon className='w-5 h-5' />
                  Sign out
                </Button>
              </SampleTooltipLink> */}
            </>
          ) : (
            <>
              <SampleTooltipLink
                href='/auth/useGuestAuth'
                hook='useGuestAuth'
                fn='signUpGuest'
              >
                <GuestLogin />
              </SampleTooltipLink>

              <SampleTooltipLink
                href='/auth/useEmailAuth'
                hook='useEmailAuth'
                fn='signInEmail'
              >
                <EmailLoginButton />
              </SampleTooltipLink>

              <SampleTooltipLink
                href='/auth/useWalletAuth'
                hook='useWalletAuth'
                fn='connectWallet'
              >
                <Link className='btn btn-accent' to="/showcase/auth/connect-wallet" >
                  <WalletIcon className='w-4.5 h-4.5' />
                  Continue with wallet
                </Link>
              </SampleTooltipLink>

              <SampleTooltipLink
                href='/auth/useOauth'
                hook='useOAuth'
                fn='initOAuth'
              >
                <SocialLogin
                  provider={AuthProvider.GOOGLE}
                />
              </SampleTooltipLink>
            </>
          )
        }

      </DialogLayout >
    </>
  )
}
