import styled from '../../../styles/styled'

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`

export const FieldLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--ck-body-color);
`

export const TokenSelectorButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 12px;
  padding: 12px 16px;
  border-radius: var(--ck-secondary-button-border-radius);
  border: 1px solid var(--ck-body-divider);
  background: var(--ck-secondary-button-background);
  color: var(--ck-body-color);
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
  text-align: left;

  &:hover {
    background: var(--ck-secondary-button-hover-background);
    border-color: var(--ck-body-color-muted);
  }
`

export const TokenSelectorContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
`

export const TokenSelectorValue = styled.span<{
  $primary?: boolean
  $muted?: boolean
}>`
  font-size: ${(props) => (props.$primary ? '15px' : '13px')};
  font-weight: ${(props) => (props.$primary ? 600 : 500)};
  color: ${(props) => {
    if (props.$primary) return 'var(--ck-body-color)'
    if (props.$muted) return 'var(--ck-body-color-muted)'
    return 'var(--ck-body-color-muted)'
  }};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const TokenSelectorRight = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--ck-body-color-muted);
`

const TokenSelectorChevron = styled.span`
  font-size: 18px;
  line-height: 1;
  position: relative;
  top: -1px;
`

export const AmountInputWrapper = styled.div`
  position: relative;
  margin-top: 12px;

  > div {
    margin: 0;
  }
`

export const MaxButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  padding: 6px 14px;
  border-radius: 16px;
  border: 1px solid var(--ck-body-divider);
  background: var(--ck-body-background);
  color: var(--ck-body-color);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease, border-color 150ms ease;

  &:hover {
    background: var(--ck-secondary-button-hover-background);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--ck-body-background-secondary);
  }
`

export const HelperText = styled.span`
  display: block;
  margin-top: 8px;
  font-size: 13px;
  color: var(--ck-body-color-muted);
`

export const ErrorText = styled.span`
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: var(--ck-body-color-danger);
`
