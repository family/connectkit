import { DialogLayout } from '@/components/Showcase/auth/DialogLayout';
import { Button } from '@/components/Showcase/ui/Button';
import { Header } from '@/components/Showcase/ui/Header';
import { InputMessage } from '@/components/Showcase/ui/InputMessage';
import { useWalletAuth } from '@openfort/openfort-kit';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_showcase/showcase/auth/connect-wallet',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const nav = useNavigate();

  const { availableWallets, connectWallet, isLoading, walletConnectingTo, error, isError } = useWalletAuth({
    onSuccess: () => nav({
      to: "/"
    }),
  });

  return (
    <DialogLayout>
      <Header
        title="Connect Wallet"
        onBack={() => window.history.back()}
      />
      {
        availableWallets.map((wallet) => (
          <Button
            key={wallet.id}
            className="btn btn-accent"
            onClick={() => {
              connectWallet({
                connector: wallet.id,
              });
            }}
          // onClick={() => wallet.connect()}
          >
            {walletConnectingTo === wallet.id && isLoading ?
              <span>Loading...</span>
              :
              wallet.name
            }
          </Button>
        ))
      }
      <InputMessage
        message={error?.message || 'An error occurred while connecting to the wallet.'}
        show={isError}
        variant='error'
      />
    </DialogLayout >
  )
}
