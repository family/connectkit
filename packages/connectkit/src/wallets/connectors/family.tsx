import { WalletProps } from './../wallet';
import { isAndroid } from '../../utils';

const Logo = () => (
  <svg
    width="88"
    height="88"
    viewBox="0 0 88 88"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="88" height="88" fill="#1BBEBE" />
    <rect
      width="88"
      height="88"
      fill="url(#paint0_linear_4994_9762)"
      fill-opacity="0.2"
    />
    <g filter="url(#filter0_di_4994_9762)">
      <path
        d="M72 44.0075C72 39.4377 68.7281 35.6219 64.4006 34.7924V34.6114C68.7281 33.7818 72 29.9661 72 25.3962C72 20.2079 67.7932 16.0151 62.6214 16.0151C58.0829 16.0151 54.3134 19.2276 53.4238 23.4958H53.1976C52.308 19.2125 48.5234 16 44 16C39.4766 16 35.692 19.2125 34.8024 23.4807H34.5762C33.7017 19.2125 29.9171 16 25.3786 16C20.2068 16 16 20.2079 16 25.3811C16 29.951 19.2719 33.7668 23.5994 34.5963V34.7773C19.2719 35.6219 16 39.4226 16 44.0075C16 48.5925 19.2719 52.3932 23.5994 53.2227V53.4037C19.2719 54.2332 16 58.049 16 62.6189C16 67.8072 20.2068 72 25.3786 72C29.9171 72 33.7017 68.7875 34.5762 64.5042H34.8024C35.6769 68.7724 39.4615 72 44 72C48.5385 72 52.3231 68.7875 53.1976 64.5042H53.4238C54.2983 68.7724 58.0829 72 62.6214 72C67.8083 72 72 67.7921 72 62.6189C72 58.049 68.7281 54.2332 64.4006 53.4037V53.2227C68.7281 52.3932 72 48.5774 72 44.0075ZM59.063 56.8726C59.063 58.0943 58.0829 59.0746 56.8616 59.0746H31.1384C29.9171 59.0746 28.937 58.0943 28.937 56.8726V31.1425C28.937 29.9208 29.9171 28.9405 31.1384 28.9405H56.8616C58.0829 28.9405 59.063 29.9208 59.063 31.1425V56.8726Z"
        fill="white"
      />
    </g>
    <defs>
      <filter
        id="filter0_di_4994_9762"
        x="8"
        y="14"
        width="72"
        height="73"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="7" />
        <feGaussianBlur stdDeviation="4" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_4994_9762"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_4994_9762"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="-2" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
        />
        <feBlend
          mode="normal"
          in2="shape"
          result="effect2_innerShadow_4994_9762"
        />
      </filter>
      <linearGradient
        id="paint0_linear_4994_9762"
        x1="44"
        y1="0"
        x2="44"
        y2="88"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="white" />
        <stop offset="1" stop-color="white" stop-opacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

export const family = (): WalletProps => {
  return {
    id: 'family',
    name: 'Family',
    logos: {
      default: <Logo />,
    },
    logoBackground: '#C2C9D6',
    scannable: true,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/family',
      ios: 'https://family.co/download',
      website: 'https://family.co',
    },
    createUri: (uri: string) => {
      return isAndroid() ? uri : `family://wc?uri=${encodeURIComponent(uri)}`;
    },
  };
};
