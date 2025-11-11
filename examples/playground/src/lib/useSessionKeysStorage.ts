import { useCallback, useEffect, useState } from 'react'
import type { Hex } from 'viem'

type Key = string
export type StoredData = {
  privateKey: Hex
  publicKey: Hex
  sessionKeyId: string
  active: boolean
}

type PrivateKeysMap = Record<Key, StoredData[]>

const STORAGE_KEY = 'openfort.playground.sessionkeys'

// Simulated backend storage for session keys using localStorage
// ----------------------------------------------------------------
// This is a simple simulation of backend storage for session keys.
// In a real application, you would implement secure storage on your backend server.
// DO NOT USE IN PRODUCTION. NEVER STORE PRIVATE KEYS IN LOCALSTORAGE IN A REAL APP.
// --------------------------------------------------------------
export function useSessionKeysStorage_backendSimulation() {
  const [keys, setKeys] = useState<PrivateKeysMap>(() => {
    if (typeof window === 'undefined') return {}
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  // persist to localStorage when keys change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
    } catch {
      // ignore write errors (e.g. quota exceeded)
    }
  }, [keys])

  const addPrivateKey = useCallback((chain: Key, privateKey: StoredData) => {
    setKeys((prev) => ({
      ...prev,
      [chain]: [...(prev[chain] ?? []), privateKey],
    }))
  }, [])

  const getPrivateKeys = useCallback(
    (chain: Key): StoredData[] => {
      if (typeof window === 'undefined') return []
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? (JSON.parse(stored)[chain] ?? []) : []
      } catch {
        return []
      }
    },
    [keys]
  )

  const updatePrivateKey = useCallback((chain: Key, privateKey: Partial<StoredData>) => {
    setKeys((prev) => {
      const updated = { ...prev }
      if (!updated[chain]) return prev
      updated[chain] = updated[chain].map((k) =>
        k.sessionKeyId === privateKey.sessionKeyId ? { ...k, ...privateKey } : k
      )
      return updated
    })
  }, [])

  const removePrivateKey = useCallback((chain: Key, sessionKeyId: string) => {
    setKeys((prev) => {
      const updated = { ...prev }
      if (!updated[chain]) return prev
      updated[chain] = updated[chain].filter((k) => k.sessionKeyId !== sessionKeyId)
      if (updated[chain].length === 0) delete updated[chain]
      return updated
    })
  }, [])

  const clearChainKeys = useCallback((chain: Key) => {
    setKeys((prev) => {
      const updated = { ...prev }
      delete updated[chain]
      return updated
    })
  }, [])

  const clearAll = useCallback(() => setKeys({}), [])

  return {
    addPrivateKey,
    getPrivateKeys,
    removePrivateKey,
    updatePrivateKey,
    clearChainKeys,
    clearAll,
  }
}
