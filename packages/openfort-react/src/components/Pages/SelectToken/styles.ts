import styled from '../../../styles/styled'
import { PageContent } from '../../PageContent'

export const SelectTokenContent = styled(PageContent)`
  min-height: 320px;
  display: flex;
  flex-direction: column;
  padding-bottom: 16px;
`

export const TokenList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
  flex: 1;
`

export const TokenButton = styled.button`
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
  transition: background 150ms ease, border-color 150ms ease;

  &:hover {
    background: var(--ck-secondary-button-hover-background);
    border-color: var(--ck-body-color-muted);
  }
`

export const TokenInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
  text-align: left;
`

export const TokenSymbol = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: var(--ck-body-color);
`

export const TokenName = styled.span`
  font-size: 13px;
  color: var(--ck-body-color-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const TokenBalance = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--ck-body-color);
`

export const EmptyState = styled.div`
  margin-top: 28px;
  font-size: 13px;
  color: var(--ck-body-color-muted);
  text-align: center;
`
