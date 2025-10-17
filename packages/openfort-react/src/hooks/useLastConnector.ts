import { useEffect, useState } from 'react'
import { useConfig } from 'wagmi'

export const useLastConnector = () => {
  const { storage } = useConfig()
  const [lastConnectorId, setLastConnectorId] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const id = await storage?.getItem('recentConnectorId')
      setLastConnectorId(id ?? '')
    }
    init()
    // biome-ignore lint/correctness/useExhaustiveDependencies: storage is a stable ref, intentionally using empty deps to run only once
  }, [])

  const update = (id: string) => {
    storage?.setItem('recentConnectorId', id)
  }

  return {
    lastConnectorId,
    updateLastConnectorId: update,
  }
}
