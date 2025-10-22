import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { DialogLayout } from '@/components/Showcase/auth/DialogLayout'
import { EmailPasswordForm } from '@/components/Showcase/auth/EmailAndPassword'
import { Header } from '@/components/Showcase/ui/Header'

export const Route = createFileRoute('/_showcase/showcase/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const nav = useNavigate()
  return (
    <DialogLayout>
      <Header onBack={() => nav({ to: '/' })} title="Sign in" />
      <EmailPasswordForm />
    </DialogLayout>
  )
}
