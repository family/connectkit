import { motion } from 'framer-motion'
import styled from '../../../styles/styled'
import { ButtonContainer, ButtonContainerInner, InnerContainer } from '../../Common/Button/styles'

export const ProviderInputInner = styled.div`
  border-radius: var(--ck-secondary-button-border-radius);
  font-size: 1rem;
  color: var(--ck-body-color);
  transition: all 0.2s;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;

  box-shadow: var(--ck-secondary-button-box-shadow);
  background: var(--ck-secondary-button-background);

  padding-right: 20px;

  &:focus-within {
    box-shadow: var(--ck-secondary-button-hover-box-shadow);
  }

  input {
    padding-left: 20px;
    padding-right: 10px;

    border: none !important;
    outline: none !important;
    background: transparent !important;
    box-shadow: none !important;

    ::placeholder {
      color: var(--ck-body-color-muted);
    }
    
    width: 100%;
    height: 100%;
  }

  .react-international-phone-country-selector-button {
    padding-left: 20px;
    padding-right: 10px;
    border-radius: var(--ck-secondary-button-border-radius) 0px 0px var(--ck-secondary-button-border-radius);
    transition: all .2s ease-out;
  }

  .react-international-phone-country-selector-dropdown {
    box-shadow: var(--ck-secondary-button-hover-box-shadow);
  }
    
  .react-international-phone-country-selector-button__dropdown-arrow {
    border-top: var(--react-international-phone-country-selector-arrow-size, 4px) solid var(--react-international-phone-country-selector-arrow-color, #777) !important;
    border-right: var(--react-international-phone-country-selector-arrow-size, 4px) solid transparent !important;
    border-left: var(--react-international-phone-country-selector-arrow-size, 4px) solid transparent !important;
    margin-right: 4px;
    transition: all .1s ease-out;
  }
`

export const EmailInnerButton = styled(motion.button)`
  color: var(--ck-body-action-color);
  transition: background-color 200ms ease, transform 100ms ease, color 200ms ease, transition 200ms ease, opacity 200ms ease;
  border-radius: 16px;
  
  svg {
    display: block;
    position: relative;
    padding: 4px;
  }

  &:enabled {
    cursor: pointer;
    &:hover {
      background: var(--ck-body-background-secondary);
      color: var(--ck-body-action-hover-color);
    }
    &:active {
      transform: scale(0.9);
    }
  }
`

export const ProvidersButton = styled.div`
  ${ButtonContainer} {
    height: 64px;
    font-size: 17px;
    font-weight: var(--ck-primary-button-font-weight, 500);
    line-height: 20px;
  }

  ${ProviderInputInner} {
    height: 64px;
  }

  &:first-of-type {
    ${ButtonContainer}, ${ProviderInputInner} {
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
  flex-shrink: 0;
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
