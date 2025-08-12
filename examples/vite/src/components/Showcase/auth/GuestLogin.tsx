import { Button } from "@/components/Showcase/ui/Button";
import { useGuestAuth } from "@openfort/react";
import { UserIcon } from "lucide-react";

export function GuestLogin() {
  const { signUpGuest, isLoading } = useGuestAuth();

  return (
    <Button className='btn btn-accent' onClick={() => signUpGuest()}>
      {isLoading ? (
        "Creating wallet..."
      ) : (
        <>
          <UserIcon className='w-4.5 h-4.5 mr-2' />
          Continue as guest
        </>
      )}
    </Button >
  )
}