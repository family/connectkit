import { DialogLayout } from '@/components/Showcase/DialogLayout'
import { EmailLoginButton } from '@/components/Showcase/EmailLoginButton'
import { GuestLogin } from '@/components/Showcase/GuestLogin'
import { SocialLogin } from '@/components/Showcase/SocialLogin'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { AuthProvider, useSignOut, useStatus } from '@openfort/openfort-kit'
import { createFileRoute, Link } from '@tanstack/react-router'
import { PlayIcon, Wallet2Icon } from 'lucide-react'

export const Route = createFileRoute('/_showcase/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isConnected } = useStatus();
  const { signOut } = useSignOut();

  return (
    <>
      <DialogLayout>
        <div>
          <Logo className="h-12 px-2" />
        </div>
        <p className="text-sm text-center text-muted-foreground mb-5">
          Using openfort kit hooks to create a custom UI
        </p>

        {
          isConnected ? (
            <>
              <div className="flex flex-col items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold">You are logged in</h2>
                <p className="text-sm text-muted-foreground">Welcome back!</p>
              </div>

              <Link className='btn btn-accent' to="/showcase/app" >
                <PlayIcon className='w-5 h-5 mr-2' />
                Go to app
              </Link>

              <Button className='btn btn-accent' onClick={() => signOut()} >
                <Wallet2Icon className='w-5 h-5' />
                Log out
              </Button>

            </>
          ) : (
            <>

              <GuestLogin />

              <EmailLoginButton />

              <Link className='btn btn-accent' to="/showcase/auth/connect-wallet" >
                <Wallet2Icon className='w-5 h-5' />
                Continue with wallet
              </Link>

              <SocialLogin
                provider={AuthProvider.GOOGLE}
              />
            </>
          )
        }

      </DialogLayout >
    </>
  )
}
