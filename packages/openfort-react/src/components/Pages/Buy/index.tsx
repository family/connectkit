import type { ReactNode } from 'react'
import { CardIcon, ExchangeIcon, WalletIcon } from '../../../assets/icons'
import useLocales from '../../../hooks/useLocales'
import { flattenChildren } from '../../../utils'
import { ModalBody, ModalContent, ModalH1, PageContent } from '../../Common/Modal/styles'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { HelpLink, HelpNotice, OptionButton, OptionContent, OptionsList, OptionTitle } from './styles'

const localeToString = (value: unknown): string => {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return value.toString()
  if (value === null || value === undefined) return ''
  return flattenChildren(value as ReactNode).join('')
}

const Buy = () => {
  const context = useOpenfort()
  const locales = useLocales()

  const cardUrl = context.uiConfig.buyWithCardUrl ?? localeToString(locales.buyScreen_payWithCard_url)
  const exchangeUrl = context.uiConfig.buyFromExchangeUrl ?? localeToString(locales.buyScreen_exchange_url)
  const helpUrl = context.uiConfig.buyTroubleshootingUrl ?? localeToString(locales.buyScreen_help_url)

  const openExternal = (url?: string) => {
    if (!url) return
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <PageContent>
      <ModalContent style={{ paddingBottom: 18, textAlign: 'left' }}>
        <ModalH1>{locales.buyScreen_heading}</ModalH1>
        <ModalBody>{locales.buyScreen_subheading}</ModalBody>
        <OptionsList>
          <OptionButton
            icon={<CardIcon />}
            arrow
            disabled={!cardUrl}
            onClick={() => openExternal(cardUrl)}
            textAlign="flex-start"
          >
            <OptionContent>
              <OptionTitle>{locales.buyScreen_payWithCard_title}</OptionTitle>
            </OptionContent>
          </OptionButton>
          <OptionButton
            icon={<ExchangeIcon />}
            arrow
            disabled={!exchangeUrl}
            onClick={() => openExternal(exchangeUrl)}
            textAlign="flex-start"
          >
            <OptionContent>
              <OptionTitle>{locales.buyScreen_exchange_title}</OptionTitle>
            </OptionContent>
          </OptionButton>
          <OptionButton
            icon={<WalletIcon />}
            arrow
            onClick={() => context.setRoute(routes.RECEIVE)}
            textAlign="flex-start"
          >
            <OptionContent>
              <OptionTitle>{locales.buyScreen_wallet_title}</OptionTitle>
            </OptionContent>
          </OptionButton>
        </OptionsList>
        {helpUrl && (
          <HelpNotice>
            {locales.buyScreen_help}{' '}
            <HelpLink href={helpUrl} target="_blank" rel="noopener noreferrer">
              {locales.buyScreen_help_cta}
            </HelpLink>
          </HelpNotice>
        )}
      </ModalContent>
    </PageContent>
  )
}

export default Buy
