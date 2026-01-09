import styled from '../../../styles/styled'
import { ButtonContainer, ButtonContainerInner, InnerContainer } from '../../Common/Button/styles'
import { ProviderInputInner } from '../Providers/styles'

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

export const LinkedProviderButtonContainer = styled.div`
  ${ButtonContainer} {
    font-weight: var(--ck-primary-button-font-weight, 500);
  }

  &:first-of-type {
    ${ButtonContainer}, ${ProviderInputInner} {
      margin-top: 0;
    }
  }

  ${ButtonContainerInner} {
    padding: 0 20px;
  }

  ${InnerContainer} {
    width: 100%;
    max-width: 100%;
  }
`

export const LinkedProviderButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const LinkedProvidersGroupWrapper = styled.div`
`

export const LinkedProviderText = styled.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ck-body-color-muted);
  text-align: start;
  max-width: 210px;
`
