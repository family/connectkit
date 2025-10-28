import styled from '../../../styles/styled'
import Button from '../../Common/Button'
import { ButtonContainerInner, IconContainer, InnerContainer } from '../../Common/Button/styles'

export const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
`

export const OptionButton = styled(Button)`
  margin: 0;
  text-align: left;
  height: auto;
  min-height: 60px;
  line-height: normal;
  padding: 0;

  ${ButtonContainerInner} {
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    gap: 14px;
    padding: 14px 12px;
  }

  ${InnerContainer} {
    max-width: none;
    width: 100%;
  }

  ${IconContainer} {
    color: var(--ck-accent-color, currentColor);
    width: 48px;
  }
`

export const OptionContent = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`

export const OptionTitle = styled.span`
  font-weight: 600;
  color: var(--ck-body-color);
  font-size: 16px;
`

export const HelpNotice = styled.p`
  margin: 18px 0 0;
  font-size: 13px;
  text-align: left;
  color: var(--ck-body-color-muted);
`

export const HelpLink = styled.a`
  color: var(--ck-accent-color, currentColor);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`
