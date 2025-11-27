import styled from '../../../styles/styled'
import Button from '../../Common/Button'

export const ProvidersHeader = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 20px 0 12px;
  color: var(--ck-body-color);
`

export const LinkedProviderContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`

export const LinkedProviderButton = styled(Button)`
  width: 64px;
  height: 64px;
  margin: 0;
  padding: 0;
  border-radius: 16px;
  font-size: 24px;
  font-weight: 500;
`
