import { HookVariable } from '@/components/Variable/HookVariable'
import { embeddedWalletId, useWallets } from '@openfort/react'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Layout } from '../../../components/Layout'

export const Route = createFileRoute('/_hooks/wallet/useWallets')({
  component: RouteComponent,
})

function RouteComponent() {
  const wallets = useWallets()
  const connectorOptions = wallets.wallets.map(wallet => wallet.id)
  const [isOpenfortWallet, setIsOpenfortWallet] = useState(connectorOptions[0] === embeddedWalletId)

  return (
    <Layout>
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
                required: isOpenfortWallet,
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
              TODO: {
                type: 'text',
                required: true,
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
