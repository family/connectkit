import React, { useMemo } from 'react'
import Logos from '../assets/logos'

import { useOpenfort } from '../components/Openfort/useOpenfort'

import { getLocale } from './../localizations'
import type { LocaleProps } from '../localizations/locales'
import { logger } from '../utils/logger'

export default function useLocales(replacements?: any): LocaleProps {
  const context = useOpenfort()
  const language = context.uiConfig?.language ?? 'en-US'

  const translations = useMemo(() => {
    return getLocale(language)
  }, [language])

  if (!translations) {
    logger.error(`Missing translations for: ${language}`)
    throw new Error(`Missing translations for: ${language}`)
  }

  const translated = {}
  Object.keys(translations).map((key) => {
    const string = translations[key]
    return (translated[key] = localize(string, replacements))
  })

  return translated as LocaleProps
}

const localize = (text: string, replacements?: any[string]) => {
  let parsedText: string = text
  if (replacements) {
    Object.keys(replacements).forEach((key) => {
      // use `replace` instead of `replaceAll` to support Node 14
      parsedText = parsedText.replace(new RegExp(`({{ ${key} }})`, 'g'), replacements[key as keyof typeof replacements])
    })
  }
  return replaceMarkdown(parsedText)
}

const replaceMarkdown = (markdownText: string) => {
  let text: any = markdownText
  text = text.split('\n')
  text = text.map((t: string, i: number) => {
    return (
      <React.Fragment key={`line-${i}-${t.substring(0, 20)}`}>
        {wrapTags(t)}
        {i < text.length - 1 && <br />}
      </React.Fragment>
    )
  })
  return text
}

const wrapTags = (text: string) => {
  // Bold markdown handling
  const textArray = text.split(/(\*\*[^*]*\*\*)/g)
  const result = textArray.map((str, i) => {
    if (/(\*\*.*\*\*)/g.test(str)) {
      // use `replace` instead of `replaceAll` to support Node 14
      return <strong key={`bold-${i}-${str.substring(0, 10)}`}>{str.replace(/\*\*/g, '')}</strong>
    }
    return `${str}`
  })

  // Replace text with logo
  return result.map((r) => {
    if (typeof r === 'string') {
      return r.split(/(\[WALLETCONNECTLOGO\])/g).map((s) => {
        if (s === '[WALLETCONNECTLOGO]') {
          return (
            <span key={s} className="ck-tt-logo">
              <Logos.WalletConnect />
            </span>
          )
        }
        return s
      })
    }
    return r
  })
}
