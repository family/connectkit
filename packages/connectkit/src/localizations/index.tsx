export type Languages =
  | 'en-US'
  | 'es-ES'
  | 'fr-FR'
  | 'ja-JP'
  | 'pt-BR'
  | 'zh-CN'
  | 'ca-AD';

import { default as enUS } from './locales/en-US';
import { default as esES } from './locales/es-ES';
import { default as frFR } from './locales/fr-FR';
import { default as jaJP } from './locales/ja-JP';
import { default as ptBR } from './locales/pt-BR';
import { default as zhCN } from './locales/zh-CN';
import { default as caAD } from './locales/ca-AD';

// TODO: tree-shaking
export const getLocale = (lang: Languages) => {
  switch (lang) {
    case 'es-ES':
      return esES;
    case 'fr-FR':
      return frFR;
    case 'ja-JP':
      return jaJP;
    case 'pt-BR':
      return ptBR;
    case 'zh-CN':
      return zhCN;
    case 'ca-AD':
      return caAD;
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
