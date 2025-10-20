import { AuthPlayerResponse } from '@openfort/openfort-js'
import { useEffect, useState } from 'react'
import { useAccount, useAccountEffect } from 'wagmi'
import { useOpenfortCore } from '../openfort/useOpenfort'
import useIsMounted from './useIsMounted'

export type useConnectCallbackProps = {
  onConnect?: ({
    address,
    connectorId,
    user,
  }: {
    address?: string
    connectorId?: string
    user?: AuthPlayerResponse
  }) => void
  onDisconnect?: () => void
}

export const useConnectCallback = ({ onConnect, onDisconnect }: useConnectCallbackProps) => {
  const { user } = useOpenfortCore()
  const { address, connector } = useAccount()
  const hasAddress = !!address
  const [isConnected, setIsConnected] = useState(false)
  const isMounted = useIsMounted()

  useEffect(() => {
    if (hasAddress && user) {
      setIsConnected(true)
    } else {
      setIsConnected(false)
    }
  }, [user, hasAddress])

  useEffect(() => {
    if (!isMounted) return

    if (isConnected) {
      onConnect?.({
        address: address,
        connectorId: connector?.id,
        user: user || undefined,
      })
    } else {
      onDisconnect?.()
    }
  }, [isConnected])
}
