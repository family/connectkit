import styled from '../../../styles/styled'

export const SummaryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0;
`

export const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  text-align: left;
`

export const SummaryLabel = styled.span`
  font-size: 14px;
  color: var(--ck-body-color-muted);
`

export const SummaryValue = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: var(--ck-body-color);
  text-align: right;
  word-break: break-all;
`

export const AddressValue = styled(SummaryValue)`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`

export const GasInfo = styled.div`
  margin-top: 4px;
  font-size: 13px;
  color: var(--ck-body-color-muted);
  text-align: right;
`

export const ButtonRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
`

export const StatusMessage = styled.div<{
  $status: 'idle' | 'success' | 'error'
}>`
  margin-top: 16px;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => {
    if (props.$status === 'success') return 'var(--ck-body-color-valid)'
    if (props.$status === 'error') return 'var(--ck-body-color-danger)'
    return 'var(--ck-body-color-muted)'
  }};
  text-align: center;
`
