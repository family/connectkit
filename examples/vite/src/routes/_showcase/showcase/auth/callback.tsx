import { DialogLayout } from '@/components/Showcase/auth/DialogLayout'
import { Header } from '@/components/Showcase/ui/Header'
import { InputMessage } from '@/components/Showcase/ui/InputMessage'
import { useCommonEmail } from '@/components/Showcase/auth/useCommonEmail'
import { useAuthCallback } from '@openfort/openfort-kit'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_showcase/showcase/auth/callback')({
  component: RouteComponent,
})

function RouteComponent() {
  const { setEmail } = useCommonEmail();
  const { isSuccess, isError, error, provider, email } = useAuthCallback({
    onSuccess: (data) => {
      if (data.type === "verifyEmail" && data.email)
        setEmail(data.email);
    }
  });

  const nav = useNavigate();
  return (
    <DialogLayout>
      <Header title="Auth Callback" onBack={() => nav({ to: '/' })} />

      {isSuccess && (
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-4">Authentication Successful</h2>
          <p className="text-sm text-muted-foreground">
            You have successfully authenticated with {email || provider}.
          </p>
          {
            provider === 'email' ? (
              <Link className="btn btn-accent mt-4" to="/showcase/auth/login">
                Go to Login
              </Link>
            ) : (
              <Link className="btn btn-accent mt-4" to="/">
                Go to Home
              </Link>
            )
          }
        </div>
      )}
      {isError && (
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-4">Authentication Failed</h2>
          <p className="text-sm text-muted-foreground">
            There was an error authenticating with {provider}.
          </p>
          <InputMessage
            message={error?.message || 'An unknown error occurred.'}
            variant="error"
            show={!!error}
          />
        </div>
      )}
      {
        !isSuccess && !isError && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Processing your authentication...</p>
            <Link className="btn btn-accent mt-4" to="/">
              Go to Home
            </Link>
          </div>
        )
      }

    </DialogLayout>
  )
}
