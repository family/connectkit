import { MP } from '@/components/motion/motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/cn'
import { RecoveryMethod, RecoveryParams, UserWallet, useWallets } from "@openfort/react"
import { Link } from '@tanstack/react-router'
import { AnimatePresence } from 'framer-motion'
import { FingerprintIcon, KeyIcon, LockIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

const WalletRecoveryIcon = ({ recovery }: { recovery: RecoveryMethod | undefined }) => {
  switch (recovery) {
    case RecoveryMethod.PASSWORD:
      return <KeyIcon className='h-4 w-4' />
    case RecoveryMethod.PASSKEY:
      return <FingerprintIcon className='h-4 w-4' />
    case RecoveryMethod.AUTOMATIC:
      return <LockIcon className='h-4 w-4' />
    default:
      return null
  }
}

const CreateWalletButton = () => {
  const { isCreating, createWallet, error } = useWallets()
  const [chooseCreateMethodOpen, setChooseCreateMethodOpen] = useState(false)
  const [creatingMethod, setCreatingMethod] = useState<RecoveryMethod | null>(null)

  useEffect(() => {
    document.addEventListener('click', (e) => {
      if (!(e.target as HTMLElement).closest('.btn')) {
        setChooseCreateMethodOpen(false)
      }
    })
  }, [])

  return (
    <>
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <div
            className='flex w-full gap-2'
          >
            {
              chooseCreateMethodOpen ? (
                <>
                  <button
                    className='btn btn-accent flex flex-1'
                    onClick={() => {
                      createWallet()
                      setCreatingMethod(RecoveryMethod.AUTOMATIC)
                    }}
                    disabled={isCreating}
                  >
                    <WalletRecoveryIcon recovery={RecoveryMethod.AUTOMATIC} />
                    Automatic
                  </button>
                  <button
                    className='btn btn-accent flex flex-1'
                    onClick={() => {
                      setCreatingMethod(RecoveryMethod.PASSWORD)
                      createWallet({
                        recovery: {
                          password: 'example-password',
                          recoveryMethod: RecoveryMethod.PASSWORD,
                        }
                      })
                    }}
                    disabled={isCreating}
                  >
                    <WalletRecoveryIcon recovery={RecoveryMethod.PASSWORD} />
                    Password
                  </button>
                  <button
                    className='btn btn-accent flex flex-1'
                    onClick={() => {
                      setCreatingMethod(RecoveryMethod.PASSKEY)
                      createWallet({
                        recovery: {
                          recoveryMethod: RecoveryMethod.PASSKEY,
                        }
                      })
                    }}
                    disabled={isCreating}
                  >
                    <WalletRecoveryIcon recovery={RecoveryMethod.PASSKEY} />
                    Passkey
                  </button>
                </>
              ) : (
                <button
                  className='btn btn-accent w-full flex'
                  onClick={
                    () => {
                      setChooseCreateMethodOpen(true)
                    }
                  }
                  disabled={isCreating}
                >
                  <span className='mr-2'>
                    +
                  </span>
                  Create new wallet
                </button>
              )
            }
          </div >
        </TooltipTrigger >
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
      </Tooltip >
      <AnimatePresence
        mode='wait'
      >
        {
          isCreating && (
            <MP
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: 0.8,
                scale: 0.95,
              }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              Creating wallet {creatingMethod && `with ${creatingMethod} recovery`}...
              {
                creatingMethod === RecoveryMethod.PASSWORD && (
                  <span className='text-sm block mt-2 opacity-70'>
                    (using password: "example-password")
                  </span>
                )
              }
            </MP>
          )
        }
      </AnimatePresence>
      {
        error && (
          <span className='text-red-500 text-sm mt-2 block'>
            There was an error creating the wallet: {error.message}
          </span>
        )
      }
    </>
  )
}

export const SetActiveWalletsCard = () => {
  const { wallets, setActiveWallet } = useWallets()

  const handleSetActiveWallet = (wallet: UserWallet) => {
    let recoveryParams: RecoveryParams | undefined;
    switch (wallet.recoveryMethod) {
      case RecoveryMethod.PASSWORD:
        recoveryParams = {
          password: 'example-password',
          recoveryMethod: RecoveryMethod.PASSWORD,
        };
        break;
      case RecoveryMethod.PASSKEY:
        recoveryParams = {
          recoveryMethod: RecoveryMethod.PASSKEY,
        };
        break;
    }

    setActiveWallet({
      walletId: wallet.id,
      address: wallet.address,
      recovery: recoveryParams,
    });
  }

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
                    onClick={() => handleSetActiveWallet(wallet)}
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
                    <div className='flex items-center gap-2'>
                      {wallet.address && (
                        <span className='text-xs'>
                          {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                        </span>
                      )}
                      <WalletRecoveryIcon recovery={wallet.recoveryMethod} />
                    </div>
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
                      JSON.stringify(wallet, (key, value) => (key === "connector" ? "[Connector object]" : value), 2)
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

          <CreateWalletButton />
        </div>
      </CardContent>
    </Card >
  )
}
