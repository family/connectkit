import styled from '../../../styles/styled'
import { PageContent } from '../../PageContent'

export const ProviderSelectContent = styled(PageContent)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
  padding-bottom: 16px;
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
  border: 1px solid ${({ $active }) => ($active ? 'var(--ck-accent-color)' : 'var(--ck-body-divider)')};
  background: ${({ $active }) =>
    $active ? 'var(--ck-secondary-button-hover-background)' : 'var(--ck-secondary-button-background)'};
  color: var(--ck-body-color);
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
  text-align: left;

  &:hover {
    background: var(--ck-secondary-button-hover-background);
    border-color: ${({ $active }) => ($active ? 'var(--ck-accent-color)' : 'var(--ck-body-color-muted)')};
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

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  border-radius: var(--ck-secondary-button-border-radius);
  border: 1px solid var(--ck-body-divider);
  background: var(--ck-secondary-button-background);
  color: var(--ck-body-color-muted);
  font-size: 14px;
`
