export type Languages =
  | 'en-US'
  | 'es-ES'
  | 'fa-IR'
  | 'fr-FR'
  | 'ja-JP'
  | 'pt-BR'
  | 'zh-CN'
  | 'tr-TR'
  | 'vi-VN';

import { default as enUS } from './locales/en-US';
import { default as esES } from './locales/es-ES';
import { default as faIR } from './locales/fa-IR';
import { default as frFR } from './locales/fr-FR';
import { default as jaJP } from './locales/ja-JP';
import { default as ptBR } from './locales/pt-BR';
import { default as zhCN } from './locales/zh-CN';
import { default as trTR } from './locales/tr-TR';
import { default as viVN } from './locales/vi-VN';

// TODO: tree-shaking
export const getLocale = (lang: Languages) => {
  switch (lang) {
    case 'es-ES':
      return esES;
    case 'fa-IR':
      return faIR;
    case 'fr-FR':
      return frFR;
    case 'ja-JP':
      return jaJP;
    case 'pt-BR':
      return ptBR;
    case 'zh-CN':
      return zhCN;
    case 'tr-TR':
      return trTR;
    case 'vi-VN':
      return viVN;
    default:
      return enUS;
  }
};

/*
// Could be useful for locale files to use these keys rather than hard-coded into the objects
export const keys = {
  connectorName: '{{ CONNECTORNAME }}',
  connectorShortName: '{{ CONNECTORSHORTNAME }}',
  suggestedExtensionBrowser: '{{ SUGGESTEDEXTENSIONBROWSER }}',
  walletConnectLogo: '{{ WALLETCONNECTLOGO }}',
};
*/
