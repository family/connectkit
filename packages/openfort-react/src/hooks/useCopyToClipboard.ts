import { useCallback, useEffect, useRef, useState } from 'react'

export function useCopyToClipboard(resetDelay = 1000) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const copy = useCallback(
    (text: string) => {
      if (!text) return

      const trimmed = text.trim()
      if (navigator.clipboard) {
        navigator.clipboard.writeText(trimmed)
      }

      setCopied(true)
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setCopied(false), resetDelay)
    },
    [resetDelay]
  )

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return { copied, copy }
}
