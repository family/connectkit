import { useGrantPermissions, useRevokePermissions } from '@openfort/react'
import { CircleX, TrashIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { useAccount, useChainId, useSignMessage } from 'wagmi'
import { Button } from '@/components/Showcase/ui/Button'
import { InputMessage } from '@/components/Showcase/ui/InputMessage'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/cn'
import { type StoredData, useSessionKeysStorage_backendSimulation } from '@/lib/useSessionKeysStorage'

export const SessionKeysCard = () => {
  const { grantPermissions, isLoading, error } = useGrantPermissions()
  const { revokePermissions, isLoading: isRevoking, error: revokeError } = useRevokePermissions()
  const [sessionKeys, setSessionKeys] = useState<StoredData[]>([])
  const { addPrivateKey, getPrivateKeys, clearAll, removePrivateKey, updatePrivateKey } =
    useSessionKeysStorage_backendSimulation()
  const chainId = useChainId()
  const { data } = useSignMessage()
  const { address } = useAccount()
  const key = useMemo(() => `${chainId}-${address}`, [chainId, address])

  const updateSessionKeys = () => {
    const keys = getPrivateKeys(key)

    // handle backward compatibility where stored keys were just strings
    if (typeof keys[0] === 'string') {
      clearAll()
      window.location.reload()
      return
    }

    setSessionKeys(getPrivateKeys(key))
  }

  useEffect(() => {
    updateSessionKeys()
  }, [key])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session keys</CardTitle>
        <CardDescription>
          Grant session keys with specific permissions to enhance security and control over wallet actions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-2"
          onSubmit={async (e) => {
            e.preventDefault()
            const privateKey = generatePrivateKey()
            const accountSessionAddress = privateKeyToAccount(privateKey).address
            const { error, permissionsContext } = await grantPermissions({
              sessionKey: privateKey,
              request: {
                signer: {
                  type: 'account',
                  data: {
                    id: accountSessionAddress,
                  },
                },
                expiry: 60 * 60 * 24,
                permissions: [
                  {
                    type: 'contract-call',
                    data: {
                      address: '0x2522f4fc9af2e1954a3d13f7a5b2683a00a4543a',
                      calls: [],
                    },
                    policies: [],
                  },
                ],
              },
            })
            if (!error && permissionsContext) {
              addPrivateKey(key, {
                privateKey: privateKey,
                publicKey: accountSessionAddress,
                sessionKeyId: permissionsContext,
                active: true,
              })
              setTimeout(() => {
                updateSessionKeys()
              }, 100)
            }
          }}
        >
          <Button className="btn btn-accent w-full" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create session key'}
          </Button>
          {sessionKeys.map(({ privateKey, publicKey, sessionKeyId, active }) => (
            <Tooltip key={privateKey}>
              <TooltipTrigger asChild>
                <div className="px-4 py-2 border rounded break-all flex justify-between items-center">
                  <div className={cn('overflow-hidden text-muted-foreground inline-flex', !active && 'line-through')}>
                    <span className="truncate font-mono">
                      {publicKey.slice(0, 15)}...{publicKey.slice(-4)}
                    </span>
                  </div>
                  {/* TODO: Add functionality to revoke this session key */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost text-error! p-0 ml-2"
                        onClick={async () => {
                          if (!active) {
                            removePrivateKey(key, sessionKeyId)
                            setTimeout(() => {
                              updateSessionKeys()
                            })
                            return
                          }
                          const { error } = await revokePermissions({
                            sessionKey: publicKey,
                          })

                          updatePrivateKey(key, {
                            sessionKeyId,
                            active: false,
                          })

                          if (!error) {
                            setTimeout(() => {
                              updateSessionKeys()
                            }, 100)
                          }
                        }}
                      >
                        {active ? <CircleX size={16} /> : <TrashIcon size={16} />}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{active ? 'Revoke permissions' : 'Remove session key from list'}</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div>Public key: {publicKey}</div>
                <div>Private key: {privateKey}</div>
                <div>Session key ID: {sessionKeyId}</div>
                <div>
                  Status:{' '}
                  <span className={active ? '' : 'text-error'}>{active ? 'Active' : 'PERMISSIONS REVOKED'}</span>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
          <InputMessage
            message={`Signed message: ${data?.slice(0, 10)}...${data?.slice(-10)}`}
            show={!!data}
            variant="success"
          />
          <InputMessage
            message={error?.message || 'An error occurred while granting permissions.'}
            show={!!error}
            variant="error"
          />
          <InputMessage
            message={revokeError?.message || 'An error occurred while revoking permissions.'}
            show={!!revokeError}
            variant="error"
          />
          <InputMessage message={'Revoking permissions...'} show={!!isRevoking} variant="default" />
        </form>
      </CardContent>
    </Card>
  )
}
