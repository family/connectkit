import { useSignMessage } from 'wagmi'
import { Button } from '@/components/Showcase/ui/Button'
import { InputMessage } from '@/components/Showcase/ui/InputMessage'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/cn'

export const SignaturesCard = () => {
  const { data, signMessage } = useSignMessage()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signatures</CardTitle>
        <CardDescription>
          Sign messages with your wallet to prove ownership and perform actions in the app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault()
            const message = (e.target as HTMLFormElement).message.value
            signMessage({ message })
          }}
        >
          <label className={cn('input w-full')}>
            <input
              name="message"
              type="username"
              placeholder="Enter a message to sign"
              className="grow peer"
              defaultValue="Hello from Openfort!"
            />
          </label>
          <Button className="btn btn-accent w-full">Sign a message</Button>
          <InputMessage
            message={`Signed message: ${data?.slice(0, 10)}...${data?.slice(-10)}`}
            show={!!data}
            variant="success"
          />
        </form>
      </CardContent>
    </Card>
  )
}
