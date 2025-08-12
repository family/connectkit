import { HookVariable } from '@/components/Variable/HookVariable'
import { embeddedWalletId, useWallets } from '@openfort/react'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Layout } from '../../../components/Layout'
import { useAccount } from 'wagmi'

export const Route = createFileRoute('/_hooks/wallet/useWallets')({
  component: RouteComponent,
})

function RouteComponent() {
  const wallets = useWallets()
  const connectorOptions = wallets.wallets.map(wallet => wallet.id).reduce((acc, id) => {
    if (!acc.includes(id)) {
      acc.push(id)
    }
    return acc
  }, [] as string[])

  const [isOpenfortWallet, setIsOpenfortWallet] = useState(connectorOptions[0] === embeddedWalletId)

  useEffect(() => {
    setIsOpenfortWallet(connectorOptions[0] === embeddedWalletId);
  }, [connectorOptions]);

  const { address } = useAccount();
  return (
    <Layout>
      address: {address}
      connectorOptions[0]: {connectorOptions[0]}
      embeddedWalletId: {embeddedWalletId}
      <HookVariable
        name='useWallets'
        hook={useWallets}
        description='This hook provides access to the wallets available in the application.'
        variables={{
          setActiveWallet: {
            description: 'Set the active wallet for the application.',
            inputs: {
              showUI: {
                type: 'boolean',
                defaultValue: "false",
                required: true,
              },
              connector: {
                type: 'select',
                options: connectorOptions,
                required: true,
                onChange: (value) => {
                  setIsOpenfortWallet(value === embeddedWalletId);
                }
              },
              password: {
                type: 'password',
                hidden: !isOpenfortWallet,
              },
              address: {
                type: 'text',
                placeholder: '0x1234...',
              },
            }
          },
          exportPrivateKey: {
            description: 'Export the private key of the active wallet.',
          },
          createWallet: {
            description: 'Create a new wallet.',
            inputs: {
              password: {
                type: 'password',
              },
            },
          },
          availableWallets: {
            description: 'List of available wallets in the application.',
          },
          activeWallet: {
            description: 'The currently active wallet in the application.',
            typescriptType: 'Wallet',
          },
          wallets: {
            description: 'List of the wallets of the user.',
            typescriptType: 'Wallet[]',
          },
        }}
      />
    </Layout>
  )
}
