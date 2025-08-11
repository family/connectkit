import { Input } from "@/components/Form/Input"
import { CommonEmailProvider } from "@/components/Showcase/auth/CommonEmailProvider"
import { EmailLoginButton } from "@/components/Showcase/auth/EmailLoginButton"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { Link } from "@tanstack/react-router"


export const Showcase = () => {
  return (
    <CommonEmailProvider>

      <div className="w-full h-full flex flex-col items-center justify-center min-h-full">
        <Logo className="h-12 mb-10" />
        <div>
          <p className="text-lg text-muted-foreground mb-6">
            This is a showcase of the Openfort kit hooks.
          </p>
        </div>
        <div className="p-4 w-md flex flex-col bg-background-100 rounded-lg mb-30 gap-3 child-in-animate">
          <h2 className="text-center text-2xl font-semibold mb-4">
            Log In to Openfort
          </h2>
          <Link to="/auth">
            View hooks
          </Link>

          <EmailLoginButton />
          <Input
            className="px-2 py-1 rounded-md"

          />
        </div>
      </div>
    </CommonEmailProvider>
  )
}