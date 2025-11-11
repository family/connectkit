import styled from '../../../styles/styled'
import { ButtonContainer } from '../../Common/Button/styles'

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  gap: 12px;
`

export const SectionLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--ck-body-color-muted);
`

export const AmountCard = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 18px 20px;
  border-radius: var(--ck-secondary-button-border-radius);
  border: 1px solid var(--ck-body-divider);
  background: var(--ck-secondary-button-background);
  color: var(--ck-body-color);
`

export const CurrencySymbol = styled.span`
  font-size: 28px;
  font-weight: 600;
  color: var(--ck-body-color-muted);
  line-height: 1;
`

export const AmountInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  color: var(--ck-body-color);
  font-size: 44px;
  font-weight: 600;
  line-height: 1;
  padding: 0;
  outline: none;
  width: 100%;

  &::placeholder {
    color: var(--ck-body-color-muted);
  }
`

export const PresetList = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
`

export const PresetButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 10px 14px;
  border-radius: 999px;
  border: none;
  background: ${({ $active }) => ($active ? 'var(--ck-accent-color)' : 'var(--ck-secondary-button-background)')};
  color: ${({ $active }) => ($active ? 'var(--ck-accent-text-color)' : 'var(--ck-body-color)')};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ $active }) => ($active ? 'var(--ck-accent-color)' : 'var(--ck-secondary-button-hover-background)')};
  }
`

export const SelectorButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px 16px;
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

export const SelectorContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
`

export const SelectorTitle = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: var(--ck-body-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const SelectorSubtitle = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: var(--ck-body-color-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const SelectorRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ck-body-color-muted);
`

export const ContinueButtonWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  gap: 12px;

  > button {
    flex: 1;
  }

  ${ButtonContainer} {
    margin: 0;
  }
`

export const StackedButtonWrapper = styled.div`
  display: flex;
  gap: 12px;

  > button {
    flex: 1;
  }
`

export const ProviderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
`

export const ProviderButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px 16px;
  border-radius: var(--ck-secondary-button-border-radius);
  border: 1px solid ${({ $active }) => ($active ? 'var(--ck-focus-color)' : 'var(--ck-body-divider)')};
  background: var(--ck-secondary-button-background);
  color: var(--ck-body-color);
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease, color 150ms ease, opacity 150ms ease;
  text-align: left;

  &:hover:not(:disabled) {
    background: var(--ck-secondary-button-hover-background);
    border-color: ${({ $active }) => ($active ? 'var(--ck-focus-color)' : 'var(--ck-body-color-muted)')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const ProviderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
`

export const ProviderNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const ProviderName = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: var(--ck-body-color);
`

export const ProviderBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  padding: 4px 8px;
  border-radius: 999px;
  background: var(--ck-secondary-button-hover-background);
  color: var(--ck-body-color-muted);
`

export const ProviderMeta = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--ck-body-color-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ProviderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  white-space: nowrap;
`

export const ProviderQuote = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: var(--ck-body-color);
`

export const ProviderFiat = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: var(--ck-body-color-muted);
`

export const PendingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto 32px;
  height: 120px;
`

// export const SuccessIconContainer = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   margin: 32px auto 24px;

//   svg {
//     width: 80px;
//     height: 80px;
//     color: var(--ck-body-color-valid);
//   }
// `
