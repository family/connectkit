import styled from '../../../styles/styled'

export const ProviderIconWrapper = styled.div`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const LinkedProviderContainer = styled.div`
  background-color: var(--ck-body-background-secondary);
  border: var(--ck-body-divider) 1px solid;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--ck-primary-button-border-radius);
  overflow: hidden;
  text-overflow: ellipsis;
`

export const LinkedProvidersGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const LinkedProviderText = styled.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ck-body-color-muted);
`
