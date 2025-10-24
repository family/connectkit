import { useCallback, useEffect, useState } from 'react'

type Key = string
type PrivateKey = string

type PrivateKeysMap = Record<Key, PrivateKey[]>

const STORAGE_KEY = 'openfort.playground.sessionkeys'

export function useSessionKeysStorage() {
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

  const addPrivateKey = useCallback((chain: Key, privateKey: PrivateKey) => {
    setKeys((prev) => ({
      ...prev,
      [chain]: [...(prev[chain] ?? []), privateKey],
    }))
  }, [])

  const getPrivateKeys = useCallback(
    (chain: Key): PrivateKey[] => {
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

  const removePrivateKey = useCallback((chain: Key, privateKey: PrivateKey) => {
    setKeys((prev) => {
      const updated = { ...prev }
      if (!updated[chain]) return prev
      updated[chain] = updated[chain].filter((k) => k !== privateKey)
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
    clearChainKeys,
    clearAll,
  }
}
