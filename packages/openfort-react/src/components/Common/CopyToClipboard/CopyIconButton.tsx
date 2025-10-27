import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard'
import styled from '../../../styles/styled'
import { CopyIcon } from './CopyIcon'

const StyledButton = styled.button`
  width: 48px;
  height: 48px;
  padding: 0;
  border: none;
  border-radius: var(--ck-secondary-button-border-radius);
  background: var(--ck-accent-color, rgba(26, 136, 248, 0.1));
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  --color: var(--ck-accent-text-color, #1a88f8);
  --bg: var(--ck-accent-color, rgba(26, 136, 248, 0.1));

  &:hover:not(:disabled) {
    background: var(--ck-accent-color, rgba(26, 136, 248, 0.2));
    --bg: var(--ck-accent-color, rgba(26, 136, 248, 0.2));
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

interface CopyIconButtonProps {
  value: string
}

export const CopyIconButton = ({ value }: CopyIconButtonProps) => {
  const { copied, copy } = useCopyToClipboard()

  return (
    <StyledButton onClick={() => copy(value)} disabled={!value} type="button">
      <CopyIcon copied={copied} size={24} />
    </StyledButton>
  )
}
