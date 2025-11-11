import type React from 'react'
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard'
import Button from '../Button'
import { CopyIcon } from './CopyIcon'

interface CopyButtonProps {
  value: string
  children: React.ReactNode
}

export const CopyButton = ({ value, children }: CopyButtonProps) => {
  const { copied, copy } = useCopyToClipboard()

  return (
    <Button disabled={!value} onClick={() => copy(value)} icon={<CopyIcon copied={copied} />}>
      {children}
    </Button>
  )
}
