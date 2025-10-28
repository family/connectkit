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

export const AmountValue = styled(SummaryValue)<{ $completed?: boolean }>`
  color: var(--ck-body-color-danger);
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  text-decoration: ${(props) => (props.$completed ? 'line-through' : 'none')};
  opacity: ${(props) => (props.$completed ? 0.6 : 1)};
`

export const AddressValue = styled(SummaryValue)`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`

export const FeesValue = styled(SummaryValue)<{ $completed?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  text-decoration: ${(props) => (props.$completed ? 'line-through' : 'none')};
  opacity: ${(props) => (props.$completed ? 0.6 : 1)};
`

export const CheckIconWrapper = styled.span`
  color: var(--ck-body-color-valid);
  line-height: 0;
  display: inline-flex;
  align-items: center;
  
  svg {
    width: 16px;
    height: 16px;
  }
`

export const BalanceSpinnerWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
  
  svg {
    width: 14px;
    height: 14px;
  }
`

export const GasInfo = styled.div`
  margin-top: 4px;
  font-size: 13px;
  color: var(--ck-body-color-muted);
  text-align: right;
`

export const InfoIconWrapper = styled.span`
  color: var(--ck-body-color-muted);
  opacity: 0.6;
  line-height: 0;
  
  &:hover {
    opacity: 1;
  }
  
  svg {
    display: block;
    width: 14px;
    height: 14px;
    vertical-align: middle;
  }
`

export const ButtonRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 24px;
`

export const StatusMessage = styled.div<{
  $status: 'idle' | 'success' | 'error'
}>`
  margin-top: 16px;
  font-size: 14px;
  font-weight: ${(props) => (props.$status === 'idle' ? '600' : '500')};
  color: ${(props) => {
    if (props.$status === 'success') return 'var(--ck-body-color-valid)'
    if (props.$status === 'error') return 'var(--ck-body-color-danger)'
    return 'var(--ck-body-color)'
  }};
  text-align: center;
`

export const ErrorContainer = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: var(--ck-body-background-secondary);
  border-radius: 12px;
  border: 1px solid var(--ck-body-color-danger, rgba(255, 71, 71, 0.2));
`

export const ErrorTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: var(--ck-body-color-danger);
  margin-bottom: 8px;
`

export const ErrorMessage = styled.div`
  font-size: 14px;
  color: var(--ck-body-color);
  margin-bottom: 8px;
  line-height: 1.4;
`

export const ErrorAction = styled.div`
  font-size: 13px;
  color: var(--ck-body-color-muted);
  line-height: 1.4;
`

export const TransactionLink = styled.a`
  color: var(--ck-body-color-valid);
  text-decoration: underline;
  word-break: break-all;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`
