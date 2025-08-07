import { DialogLayout } from '@/components/Showcase/DialogLayout'
import { EmailPasswordForm } from '@/components/Showcase/EmailAndPassword'
import { Header } from '@/components/Showcase/ui/Header'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_showcase/showcase/auth/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  const nav = useNavigate()
  return (
    <DialogLayout>
      <Header onBack={(() => nav({ to: "/" }))} title="Sign up" />
      <EmailPasswordForm isSignUp />
    </DialogLayout>
  )
}
