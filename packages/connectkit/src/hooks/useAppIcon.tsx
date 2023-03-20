import { ChainIcon } from '..';
import LazyImage from '../components/Common/LazyImage';

import { getAppIcon } from '../defaultClient';

export type useAppIconProps = {
  size?: number | string;
};

export const useAppIcon = ({ size = '100%' }: useAppIconProps = {}) => {
  // We use the favicon as a fallback for the dApp logo because that's how the connectors do it
  const getFavicons = () => {
    const favicons: { svg: string | null; default: string | null } = {
      svg: null,
      default: null,
    };
    const nodeList: HTMLCollectionOf<HTMLLinkElement> =
      document.getElementsByTagName('link');
    Array.from(nodeList).forEach((node) => {
      if (
        (node.getAttribute('rel') === 'icon' ||
          node.getAttribute('rel') === 'shortcut icon') &&
        node.getAttribute('href')
      ) {
        if (node.getAttribute('type') === 'image/svg+xml') {
          favicons.svg = node.getAttribute('href');
        } else {
          favicons.default = node.getAttribute('href');
        }
      }
    });
    return favicons;
  };
  const favicons = getFavicons();
  const favicon = getAppIcon() ?? favicons.svg ?? favicons.default;

  return {
    src: favicon,
    component: favicon ? (
      <LazyImage src={favicon} alt={'app'} width={size} height={size} />
    ) : (
      <ChainIcon size={size} radius={0} id={-1} />
    ),
  };
};
