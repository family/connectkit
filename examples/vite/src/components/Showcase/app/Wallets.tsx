import { Button } from '@/components/Showcase/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/cn'
import { useWallets } from "@openfort/react"
import { Link } from '@tanstack/react-router'

export const WalletsCard = () => {
  const { wallets, setActiveWallet, isLoading, createWallet } = useWallets()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallets</CardTitle>
        <CardDescription>
          Create and use wallets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          {wallets.map((wallet, i) => (
            <Tooltip
              delayDuration={200}
              key={wallet.id + i}
            >
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    setActiveWallet({
                      connector: wallet.id,
                      address: wallet.address,
                    })
                  }}
                  className={cn('btn btn-accent w-full flex justify-between', {
                    'text-primary': wallet.isActive,
                  })}
                >
                  {wallet.id}
                  {
                    wallet.address &&
                    <span
                      className='text-xs text-muted-foreground'
                    >
                      {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                    </span>
                  }
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <div className='flex flex-col gap-1'>
                  <span className='font-semibold text-sm'>Wallet details:</span>
                  <pre className='flex text-xs flex-col gap-1'>
                    wallet: {
                      JSON.stringify(wallet, null, 2)
                    }
                  </pre>
                  {
                    wallet.isActive ?
                      <p className='text-xs text-green-700'>Active wallet</p>
                      :
                      <p className='text-xs opacity-70'>
                        Click to set this wallet as active.
                        (
                        <Link to="/wallet/useWallets" search={{ focus: 'setActiveWallet' }}>
                          useWallet
                        </Link>
                        )
                      </p>
                  }
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
          <Button
            className='btn btn-accent w-full flex'
            onClick={() => {
              createWallet()
            }}
          >
            <span className='mr-2'>
              +
            </span>
            Create new wallet
          </Button>
        </div>
        {isLoading && (
          <div className='text-sm text-muted-foreground mt-2'>
            Loading...
          </div>
        )}
      </CardContent>
    </Card >
  )
}
