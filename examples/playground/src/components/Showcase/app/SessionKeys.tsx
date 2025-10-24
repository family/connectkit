import { useGrantPermissions } from '@openfort/react'
import { useEffect, useMemo, useState } from 'react'
import type { Hex } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { useAccount, useChainId, useSignMessage } from 'wagmi'
import { Button } from '@/components/Showcase/ui/Button'
import { InputMessage } from '@/components/Showcase/ui/InputMessage'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSessionKeysStorage } from '@/lib/useSessionKeysStorage'

export const SessionKeysCard = () => {
  const { grantPermissions, isLoading, error } = useGrantPermissions()
  const [sessionKeys, setSessionKeys] = useState<Hex[]>([])
  const { addPrivateKey, getPrivateKeys /* removePrivateKey, clearChainKeys, clearAll */ } = useSessionKeysStorage()
  const chainId = useChainId()
  const { data /* signMessageAsync */ } = useSignMessage()
  const { address } = useAccount()
  // const { activeWallet } = useWallets()
  const key = useMemo(() => `${chainId}-${address}`, [chainId, address])

  const updateSessionKeys = () => {
    setSessionKeys(getPrivateKeys(key) as Hex[])
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
            const sessionKey = generatePrivateKey()
            const accountSession = privateKeyToAccount(sessionKey).address
            const { error } = await grantPermissions({
              sessionKey,
              request: {
                signer: {
                  type: 'account',
                  data: {
                    id: accountSession,
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
            if (!error) {
              addPrivateKey(key, sessionKey)
              setTimeout(() => {
                updateSessionKeys()
              }, 100)
            }
          }}
        >
          {/* <label className={cn('input w-full')}>
            <input
              name="message"
              type="username"
              placeholder="Enter a message to sign"
              className="grow peer"
              defaultValue="Hello from Openfort!"
            />
          </label> */}
          <Button className="btn btn-accent w-full" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create session key'}
          </Button>
          {sessionKeys.map((key) => (
            <div key={key} className="px-4 py-2 border rounded break-all flex justify-between items-center">
              <span className="text-muted-foreground">
                {key.slice(0, 6)}...{key.slice(-4)}
              </span>
              <div>
                {/* TODO: Sign with this session key */}
                {/* <button
                  type="button"
                  className="btn btn-sm btn-accent"
                  onClick={async () => {
                    const message = 'Sign with this session key'
                    signMessageAsync({
                      message,
                      connector: activeWallet?.connector,
                      account: privateKeyToAccount(key).address,
                    })
                      .then((value) => {
                        alert(`Message "${message}" signed successfully!: ${value}`)
                      })
                      .catch((e) => {
                        alert(`Failed to sign message: ${e.message}`)
                      })
                  }}
                >
                  Sign with this key
                </button> */}
                {/* TODO: Add functionality to revoke this session key */}
                {/* <button type="button" className="btn btn-sm btn-ghost text-error p-0 ml-2" onClick={() => {}}>
                  <TrashIcon size={16} />
                </button> */}
              </div>
            </div>
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
        </form>
      </CardContent>
    </Card>
  )
}
