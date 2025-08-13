import { MP } from '@/components/motion/motion'
import { Button } from '@/components/Showcase/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/cn'
import { useWallets } from "@openfort/react"
import { Link } from '@tanstack/react-router'

export const SetActiveWalletsCard = () => {
  const { wallets, setActiveWallet, isCreating, createWallet } = useWallets()

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
              delayDuration={500}
              key={wallet.id + i}
            >
              <TooltipTrigger asChild>
                <div>
                  <button
                    onClick={() => {
                      setActiveWallet({
                        connector: wallet.id,
                        address: wallet.address,
                      })
                    }}
                    disabled={!wallet.isAvailable}
                    className={cn('btn btn-accent w-full flex justify-between', {
                      'text-primary': wallet.isActive,
                      'animate-pulse': wallet.isConnecting,
                    })}
                  >
                    {wallet.id}
                    {
                      wallet.isConnecting && (
                        <MP
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{
                            opacity: 0.8,
                            scale: 0.95,
                          }}
                        >Connecting...</MP>
                      )
                    }
                    {
                      wallet.address &&
                      <span
                        className='text-xs text-muted-foreground'
                      >
                        {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                      </span>
                    }
                  </button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className='flex flex-col gap-1'>
                  <h3 className='text-base mb-1'>
                    useWallets
                  </h3>
                  <pre className='flex text-xs flex-col gap-1'>
                    wallets[{i}] = {
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
                          setActiveWallet
                        </Link>
                        )
                      </p>
                  }
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <div>
                <Button
                  className='btn btn-accent w-full flex'
                  onClick={() => {
                    createWallet()
                  }}
                  disabled={isCreating}
                >
                  {
                    isCreating ? (
                      "Creating wallet..."
                    ) : (
                      <>
                        <span className='mr-2'>
                          +
                        </span>
                        Create new wallet
                      </>
                    )
                  }
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <h3 className='text-base mb-1'>
                useWallets
              </h3>
              Create a new wallet using the
              <Link
                to='/wallet/useWallets'
                search={{ focus: 'createWallet' }}
                className='px-1 group'
              >
                createWallet
              </Link>
              function.
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card >
  )
}
