import React from 'react'
import browsers from '../../../assets/browsers'
import { detectBrowser } from '../../../utils'
import { BrowserIconContainer } from './styles'
import type { BrowserIconProps } from './types'

const BrowserIcon = React.forwardRef(({ browser }: BrowserIconProps, _ref: React.Ref<HTMLElement>) => {
  const currentBrowser = browser ?? detectBrowser()

  let icon: React.ReactNode = null
  switch (currentBrowser) {
    case 'chrome':
      icon = browsers.Chrome
      break
    case 'firefox':
      icon = browsers.FireFox
      break
    case 'edge':
      icon = browsers.Edge
      break
    case 'brave':
      //   icon = browsers.Brave;
      break
  }
  if (!icon) return null
  return <BrowserIconContainer>{icon}</BrowserIconContainer>
})
BrowserIcon.displayName = 'BrowserIcon'

export default BrowserIcon
