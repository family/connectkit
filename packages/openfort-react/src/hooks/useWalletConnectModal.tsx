import { useState } from 'react'
import type { Connector } from 'wagmi'

import { isWalletConnectConnector } from '../utils'
import { logger } from '../utils/logger'
import { useConnect } from './useConnect'

export function useWalletConnectModal() {
  const { connectAsync, connectors } = useConnect()
  const [isOpen, setIsOpen] = useState(false)

  return {
    isOpen,
    open: async () => {
      // add modal styling because wagmi does not let you add styling to the modal
      const w3mcss = document.createElement('style')
      w3mcss.innerHTML = `w3m-modal, wcm-modal{ --wcm-z-index: 2147483647; --w3m-z-index:2147483647; }`
      document.head.appendChild(w3mcss)

      const removeChild = () => {
        if (document.head.contains(w3mcss)) {
          document.head.removeChild(w3mcss)
        }
      }

      const clientConnector: Connector | undefined = connectors.find((c) => isWalletConnectConnector(c.id))

      if (clientConnector) {
        try {
          setIsOpen(true)
          try {
            await connectAsync({ connector: clientConnector })
          } catch (err) {
            logger.log('WalletConnect', err)
            return {
              error: 'Connection failed',
            }
          }

          setIsOpen(false)

          removeChild()
          return {}
        } catch (err) {
          logger.log('Could not get WalletConnect provider', err)
          removeChild()
          return {
            error: 'Could not get WalletConnect provider',
          }
        }
      } else {
        removeChild()
        logger.log('Configuration error: Please provide a WalletConnect Project ID in your wagmi config.')
        return {
          error: 'Configuration error: Please provide a WalletConnect Project ID in your wagmi config.',
        }
      }
    },
  }
}
