import { motion } from 'framer-motion'
import styled from '../../../styles/styled'
import { ButtonContainer, ButtonContainerInner, InnerContainer } from '../../Common/Button/styles'

export const ProviderInputInner = styled.div`
  // Styles from react-international-phone (imported here to avoid importing the whole CSS file for nextjs compatibility)
  .react-international-phone-country-selector{position:relative}.react-international-phone-country-selector-button{display:flex;height:var(--react-international-phone-height, 36px);box-sizing:border-box;align-items:center;justify-content:center;padding:0;border:1px solid var(--react-international-phone-country-selector-border-color, var(--react-international-phone-border-color, gainsboro));margin:0;appearance:button;-webkit-appearance:button;background-color:var(--react-international-phone-country-selector-background-color, var(--react-international-phone-background-color, white));cursor:pointer;text-transform:none;user-select:none}.react-international-phone-country-selector-button:hover{background-color:var(--react-international-phone-country-selector-background-color-hover, whitesmoke)}.react-international-phone-country-selector-button--hide-dropdown{cursor:auto}.react-international-phone-country-selector-button--hide-dropdown:hover{background-color:transparent}.react-international-phone-country-selector-button__button-content{display:flex;align-items:center;justify-content:center}.react-international-phone-country-selector-button__flag-emoji{margin:0 4px}.react-international-phone-country-selector-button__flag-emoji--disabled{opacity:.75}.react-international-phone-country-selector-button__dropdown-arrow{border-top:var(--react-international-phone-country-selector-arrow-size, 4px) solid var(--react-international-phone-country-selector-arrow-color, #777);border-right:var(--react-international-phone-country-selector-arrow-size, 4px) solid transparent;border-left:var(--react-international-phone-country-selector-arrow-size, 4px) solid transparent;margin-right:4px;transition:all .1s ease-out}.react-international-phone-country-selector-button__dropdown-arrow--active{transform:rotateX(180deg)}.react-international-phone-country-selector-button__dropdown-arrow--disabled{border-top-color:var(--react-international-phone-disabled-country-selector-arrow-color, #999)}.react-international-phone-country-selector-button--disabled,.react-international-phone-country-selector-button--disabled:hover{background-color:var(--react-international-phone-disabled-country-selector-background-color, var(--react-international-phone-disabled-background-color, whitesmoke))}.react-international-phone-country-selector-button--disabled{cursor:auto}.react-international-phone-flag-emoji{width:var(--react-international-phone-flag-width, 24px);height:var(--react-international-phone-flag-height, 24px);box-sizing:border-box}.react-international-phone-country-selector-dropdown{position:absolute;z-index:1;top:var(--react-international-phone-dropdown-top, 44px);left:var(--react-international-phone-dropdown-left, 0);display:flex;width:300px;max-height:200px;flex-direction:column;padding:4px 0;margin:0;background-color:var(--react-international-phone-dropdown-item-background-color, var(--react-international-phone-background-color, white));box-shadow:var(--react-international-phone-dropdown-shadow, 2px 2px 16px rgba(0, 0, 0, .25));color:var(--react-international-phone-dropdown-item-text-color, var(--react-international-phone-text-color, #222));list-style:none;overflow-y:scroll}.react-international-phone-country-selector-dropdown__preferred-list-divider{height:1px;border:none;margin:var(--react-international-phone-dropdown-preferred-list-divider-margin, 0);background:var(--react-international-phone-dropdown-preferred-list-divider-color, var(--react-international-phone-border-color, gainsboro))}.react-international-phone-country-selector-dropdown__list-item{display:flex;min-height:var(--react-international-phone-dropdown-item-height, 28px);box-sizing:border-box;align-items:center;padding:2px 8px}.react-international-phone-country-selector-dropdown__list-item-flag-emoji{margin-right:8px}.react-international-phone-country-selector-dropdown__list-item-country-name{overflow:hidden;margin-right:8px;font-size:var(--react-international-phone-dropdown-item-font-size, 14px);text-overflow:ellipsis;white-space:nowrap}.react-international-phone-country-selector-dropdown__list-item-dial-code{color:var(--react-international-phone-dropdown-item-dial-code-color, gray);font-size:var(--react-international-phone-dropdown-item-font-size, 14px)}.react-international-phone-country-selector-dropdown__list-item:hover{background-color:var(--react-international-phone-selected-dropdown-item-background-color, var(--react-international-phone-selected-dropdown-item-background-color, whitesmoke));cursor:pointer}.react-international-phone-country-selector-dropdown__list-item--selected,.react-international-phone-country-selector-dropdown__list-item--focused{background-color:var(--react-international-phone-selected-dropdown-item-background-color, whitesmoke);color:var(--react-international-phone-selected-dropdown-item-text-color, var(--react-international-phone-text-color, #222))}.react-international-phone-country-selector-dropdown__list-item--selected .react-international-phone-country-selector-dropdown__list-item-dial-code,.react-international-phone-country-selector-dropdown__list-item--focused .react-international-phone-country-selector-dropdown__list-item-dial-code{color:var(--react-international-phone-selected-dropdown-item-dial-code-color, var(--react-international-phone-dropdown-item-dial-code-color, gray))}.react-international-phone-country-selector-dropdown__list-item--focused{background-color:var(--react-international-phone-selected-dropdown-item-background-color, var(--react-international-phone-selected-dropdown-item-background-color, whitesmoke))}.react-international-phone-dial-code-preview{display:flex;align-items:center;justify-content:center;padding:0 8px;border:1px solid var(--react-international-phone-dial-code-preview-border-color, var(--react-international-phone-border-color, gainsboro));margin-right:-1px;background-color:var(--react-international-phone-dial-code-preview-background-color, var(--react-international-phone-background-color, white));color:var(--react-international-phone-dial-code-preview-text-color, var(--react-international-phone-text-color, #222));font-size:var(--react-international-phone-dial-code-preview-font-size, var(--react-international-phone-font-size, 13px))}.react-international-phone-dial-code-preview--disabled{background-color:var(--react-international-phone-dial-code-preview-disabled-background-color, var(--react-international-phone-disabled-background-color, whitesmoke));color:var(--react-international-phone-dial-code-preview-disabled-text-color, var(--react-international-phone-disabled-text-color, #666))}.react-international-phone-input-container{display:flex}.react-international-phone-input-container .react-international-phone-country-selector-button{border-radius:var(--react-international-phone-border-radius, 4px);margin-right:-1px;border-bottom-right-radius:0;border-top-right-radius:0}.react-international-phone-input-container .react-international-phone-input{overflow:visible;height:var(--react-international-phone-height, 36px);box-sizing:border-box;padding:0 8px;border:1px solid var(--react-international-phone-border-color, gainsboro);border-radius:var(--react-international-phone-border-radius, 4px);margin:0;background-color:var(--react-international-phone-background-color, white);border-bottom-left-radius:0;border-top-left-radius:0;color:var(--react-international-phone-text-color, #222);font-family:inherit;font-size:var(--react-international-phone-font-size, 13px)}.react-international-phone-input-container .react-international-phone-input:focus{outline:none}.react-international-phone-input-container .react-international-phone-input--disabled{background-color:var(--react-international-phone-disabled-background-color, whitesmoke);color:var(--react-international-phone-disabled-text-color, #666)}

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
    --react-international-phone-border-color: none;
    --react-international-phone-border-radius: var(--ck-secondary-button-border-radius);
    --react-international-phone-background-color: var(--ck-secondary-button-background);
    --react-international-phone-text-color: var(--ck-body-color);
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
