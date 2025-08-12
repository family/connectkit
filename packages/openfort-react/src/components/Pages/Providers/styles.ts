import styled from "../../../styles/styled";
import Button from "../../Common/Button";
import { ButtonContainer, ButtonContainerInner, InnerContainer } from "../../Common/Button/styles";

export const ProvidersButton = styled.div`

  ${ButtonContainer} {
    height: 64px;
    font-size: 17px;
    font-weight: var(--ck-primary-button-font-weight, 500);
    line-height: 20px;
  }

  &:first-of-type {
    ${ButtonContainer} {
      margin-top: 0;
    }
  }

  ${ButtonContainerInner} {
    padding: 0 20px;
    justify-content: space-between;
  }

  ${InnerContainer} {
    justify-content: space-between;
    width: 100%;
    max-width: 100%;
  }
`

export const ProviderLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 2px 0;
`

export const ProviderIcon = styled.div`
  width: 32px;
  height: 32px;
  svg,
  img {
    display: block;
    position: relative;
    pointer-events: none;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  &[data-shape='squircle'] {
    border-radius: 22.5%;
  }
  &[data-shape='circle'] {
    border-radius: 100%;
  }
  &[data-shape='square'] {
    border-radius: 0;
  }
`
