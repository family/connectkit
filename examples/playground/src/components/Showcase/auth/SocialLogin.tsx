import { useState } from "react";
import { Button } from "@/components/Showcase/ui/Button";
import { ProviderLogo } from "@/components/Showcase/ui/ProviderLogo";
import { AuthProvider, useOAuth } from "@openfort/react";


function getProviderName(provider: AuthProvider) {
  switch (provider) {
    case "google":
      return "Google";
    case "facebook":
      return "Facebook";
    case "twitter":
      return "Twitter";
    default:
      return provider;
  }
}

export function SocialLogin({ provider }: { provider: AuthProvider }) {
  const { initOAuth, error } = useOAuth({ redirectTo: "/showcase/auth/callback" });
  const [redirecting, setRedirecting] = useState(false);

  return (
    <Button
      className='btn btn-accent border border-[2px] '
      onClick={async () => {
        setRedirecting(true);
        await new Promise((resolve) => setTimeout(resolve, 200)); // UX
        await initOAuth({ provider });
      }}
    >
      {
        redirecting ? (
          "Redirecting..."
        ) : (
          <>
            <ProviderLogo provider={provider} className="w-4 h-4 mr-2" />
            Continue with {getProviderName(provider)}
          </>
        )
      }
      {
        error && (
          <span className="text-error text-xs ml-2">
            Please try again
          </span>
        )
      }
    </Button>
  )
}
