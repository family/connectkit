import defaultTheme from '../../../constants/defaultTheme'
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

export const TokenOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`

export const TokenOptionButton = styled.button<{
  $selected?: boolean
}>`
  flex: 1 1 calc(50% - 4px);
  min-width: calc(50% - 4px);
  border-radius: 14px;
  padding: 12px;
  border: 1px solid ${(props) => (props.$selected ? 'var(--ck-body-color)' : 'var(--ck-body-divider)')};
  background: ${(props) => (props.$selected ? 'var(--ck-body-background-primary)' : 'var(--ck-body-background-secondary)')};
  color: ${(props) => (props.$selected ? 'var(--ck-body-color)' : 'var(--ck-body-color-muted)')};
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease, border-color 150ms ease;

  &:hover {
    color: var(--ck-body-color);
  }

  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    flex-basis: 100%;
    min-width: 100%;
  }
`

export const AmountInputWrapper = styled.div`
  position: relative;
`

export const MaxButton = styled.button`
  position: absolute;
  right: 18px;
  top: calc(12px + 24px);
  transform: translateY(-50%);
  padding: 4px 12px;
  border-radius: 16px;
  border: 1px solid var(--ck-body-divider);
  background: var(--ck-body-background);
  color: var(--ck-body-color);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease;

  &:hover {
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
