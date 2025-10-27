import styled from '../../../styles/styled'

export const QRWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 24px 0 16px;
`

export const AddressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
`

export const Label = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--ck-body-color);
`

export const AddressRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

export const AddressField = styled.div`
  flex: 1;
  padding: 12px;
  border-radius: var(--ck-secondary-button-border-radius);
  background: var(--ck-secondary-button-background);
  box-shadow: var(--ck-secondary-button-box-shadow);
  font-size: 14px;
  color: var(--ck-body-color);
  word-break: break-all;
`

export const NetworkInfo = styled.div`
  margin-top: 12px;
  font-size: 13px;
  color: var(--ck-body-color-muted);
  text-align: center;
`
