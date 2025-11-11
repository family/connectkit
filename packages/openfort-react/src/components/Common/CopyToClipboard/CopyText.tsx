import type React from 'react'
import type { ComponentProps } from 'react'
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard'
import styled from '../../../styles/styled'
import { CopyIcon } from './CopyIcon'

const Container = styled.div<{ $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.$disabled ? 0.4 : 1)};
  transition: all 220ms ease;

  --color: var(--ck-copytoclipboard-stroke);

  &:hover:not([disabled]) {
    --color: var(--ck-body-color-muted);
  }
`

interface CopyTextProps {
  value: string
  children: React.ReactNode
  size?: ComponentProps<typeof CopyIcon>['size']
}

export const CopyText = ({ value, children, size = '1.5rem' }: CopyTextProps) => {
  const { copied, copy } = useCopyToClipboard()

  return (
    <Container onClick={() => copy(value)} $disabled={!value}>
      {children}
      <CopyIcon copied={copied} size={size} />
    </Container>
  )
}
