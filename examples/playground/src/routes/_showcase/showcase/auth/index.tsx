import { AuthProvider } from '@openfort/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { WalletIcon } from 'lucide-react'
import styled from 'styled-components'
import { DialogLayout } from '@/components/Showcase/auth/DialogLayout'
import { EmailLoginButton } from '@/components/Showcase/auth/EmailLoginButton'
import { GuestLogin } from '@/components/Showcase/auth/GuestLogin'
import { SampleTooltipLink } from '@/components/Showcase/auth/SampleTooltipLink'
import { SocialLogin } from '@/components/Showcase/auth/SocialLogin'
import { Logo } from '@/components/ui/logo'

export const Route = createFileRoute('/_showcase/showcase/auth/')({
  component: RouteComponent,
})

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
`

function RouteComponent() {
  return (
    <DialogLayout>
      <StyledDiv>
        <Logo className="h-12 px-2" />
      </StyledDiv>
      <p className="text-sm text-center text-muted-foreground mb-5">Using openfort hooks to create a custom UI</p>

      <SampleTooltipLink href="/auth/useGuestAuth" hook="useGuestAuth" fn="signUpGuest">
        <GuestLogin />
      </SampleTooltipLink>

      <SampleTooltipLink href="/auth/useEmailAuth" hook="useEmailAuth" fn="signInEmail">
        <EmailLoginButton />
      </SampleTooltipLink>

      <SampleTooltipLink href="/auth/useWalletAuth" hook="useWalletAuth" fn="connectWallet">
        <Link className="btn btn-accent" to="/showcase/auth/connect-wallet">
          <WalletIcon className="w-4.5 h-4.5" />
          Continue with wallet
        </Link>
      </SampleTooltipLink>

      <SampleTooltipLink href="/auth/useOauth" hook="useOAuth" fn="initOAuth">
        <SocialLogin provider={AuthProvider.GOOGLE} />
      </SampleTooltipLink>
    </DialogLayout>
  )
}
