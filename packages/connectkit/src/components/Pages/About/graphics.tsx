import { motion, EasingFunction } from 'framer-motion';
import styled from './../../../styles/styled';
import { keyframes } from 'styled-components';

export type Easing =
  | [number, number, number, number]
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'circIn'
  | 'circOut'
  | 'circInOut'
  | 'backIn'
  | 'backOut'
  | 'backInOut'
  | 'anticipate'
  | EasingFunction;

const pulseAnim = { scale: [0.9, 1.25, 1.6], opacity: [0, 0.11, 0] };
const pulseTransition = { ease: 'linear', duration: 2, repeat: Infinity };

const Center = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
`;

const spin = keyframes`
  from{ transform: rotate(0deg); }
  to{ transform: rotate(360deg); }
`;
const SpinContainer = styled(motion.div)`
  z-index: -1;
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 100%;
  animation: ${spin} 16s linear infinite;
`;

const BgLighten = styled(motion.div)`
  overflow: hidden;
  border-radius: inherit;
  z-index: 0;
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
`;
const MainCircle = styled(motion.div)`
  z-index: 2;
  position: relative;
  border-radius: 50%;
  background: var(--ck-body-background);
`;

const MainCircleInner = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`;

const Compass = (
  <svg
    width="34"
    height="34"
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17 34C26.3 34 34 26.2833 34 17C34 7.7 26.2833 0 16.9833 0C7.7 0 0 7.7 0 17C0 26.2833 7.71667 34 17 34ZM9.83333 25.6833C8.68333 26.2333 7.8 25.3333 8.33333 24.2L13.1667 14.3333C13.45 13.75 13.8167 13.3833 14.35 13.1333L24.1833 8.33333C25.4 7.75 26.25 8.65 25.6833 9.81667L20.8833 19.6667C20.6167 20.2 20.2333 20.6 19.6833 20.85L9.83333 25.6833ZM17.0167 19.1333C18.1833 19.1333 19.1333 18.1833 19.1333 17.0167C19.1333 15.85 18.1833 14.9167 17.0167 14.9167C15.8667 14.9167 14.9167 15.85 14.9167 17.0167C14.9167 18.1833 15.8667 19.1333 17.0167 19.1333Z"
      fill="var(--ck-graphic-compass-color, var(--ck-body-color))"
    />
    <path
      d="M17 34C26.3 34 34 26.2833 34 17C34 7.7 26.2833 0 16.9833 0C7.7 0 0 7.7 0 17C0 26.2833 7.71667 34 17 34ZM9.83333 25.6833C8.68333 26.2333 7.8 25.3333 8.33333 24.2L13.1667 14.3333C13.45 13.75 13.8167 13.3833 14.35 13.1333L24.1833 8.33333C25.4 7.75 26.25 8.65 25.6833 9.81667L20.8833 19.6667C20.6167 20.2 20.2333 20.6 19.6833 20.85L9.83333 25.6833ZM17.0167 19.1333C18.1833 19.1333 19.1333 18.1833 19.1333 17.0167C19.1333 15.85 18.1833 14.9167 17.0167 14.9167C15.8667 14.9167 14.9167 15.85 14.9167 17.0167C14.9167 18.1833 15.8667 19.1333 17.0167 19.1333Z"
      fill="url(#ck-compass-gradient)"
    />
    <defs>
      <linearGradient
        id="ck-compass-gradient"
        x1="17"
        y1="0"
        x2="17"
        y2="34"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="rgba(0,0,0,0)" />
        <stop offset="1" stopColor="rgba(0,0,0,0.05)" />
      </linearGradient>
    </defs>
  </svg>
);

const Wallet = ({ inverted = false }) => (
  <svg
    width="58"
    height="50"
    viewBox="0 0 58 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M57.9332 20.3335V42.1113C57.9332 46.4069 54.451 49.8891 50.1555 49.8891H8.15546C3.85991 49.8891 0.377686 46.4069 0.377686 42.1113V25.0002V7.8891C0.377686 3.59355 3.85991 0.111328 8.15546 0.111328H47.0444C48.7626 0.111328 50.1555 1.50422 50.1555 3.22244C50.1555 4.94066 48.7626 6.33355 47.0443 6.33355H9.71102C7.9928 6.33355 6.59991 7.72644 6.59991 9.44466C6.59991 11.1629 7.9928 12.5558 9.71102 12.5558H50.1555C54.451 12.5558 57.9332 16.038 57.9332 20.3335ZM46.2667 34.3337C48.4145 34.3337 50.1556 32.5926 50.1556 30.4448C50.1556 28.297 48.4145 26.5559 46.2667 26.5559C44.1189 26.5559 42.3778 28.297 42.3778 30.4448C42.3778 32.5926 44.1189 34.3337 46.2667 34.3337Z"
      fill={
        inverted
          ? 'var(--ck-graphic-primary-color, var(--ck-body-background))'
          : 'var(--ck-graphic-primary-color, var(--ck-body-color))'
      }
    />
    <defs>
      <linearGradient
        id="paint0_linear_2501_7732"
        x1="29.1555"
        y1="0.111328"
        x2="29.1555"
        y2="49.8891"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          stopColor={
            inverted
              ? 'var(--ck-body-color-muted)'
              : 'var(--ck-body-background-transparent, transparent)'
          }
        />
        <stop
          offset="1"
          stopColor={
            inverted ? 'var(--ck-body-color)' : 'var(--ck-body-background)'
          }
        />
      </linearGradient>
    </defs>
  </svg>
);

const Send = (
  <svg
    width="41"
    height="41"
    viewBox="0 0 41 41"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M35.4446 0.839914L2.14484 10.7065C0.0395033 11.3303 -0.632966 13.9786 0.919705 15.5313L7.9624 22.574C9.47585 24.0874 11.8661 24.273 13.5951 23.0114L25.2866 14.4797C25.5558 14.2832 25.9281 14.3121 26.1638 14.5478C26.3998 14.7838 26.4285 15.1567 26.2313 15.426L17.6874 27.0937C16.4213 28.8228 16.6052 31.2168 18.1206 32.7322L25.1811 39.7926C26.7337 41.3453 29.382 40.6728 30.0058 38.5675L39.8724 5.2677C40.6753 2.55794 38.1544 0.037024 35.4446 0.839914Z"
      fill="var(--ck-graphic-secondary-color, white)"
    />
  </svg>
);

const Receive = (
  <svg
    width="38"
    height="44"
    viewBox="0 0 38 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 0.875C21.4853 0.875 23.5 2.88972 23.5 5.375V27.761L30.068 21.193C31.8254 19.4357 34.6746 19.4357 36.432 21.193C38.1893 22.9504 38.1893 25.7996 36.432 27.557L22.182 41.807C20.4246 43.5643 17.5754 43.5643 15.818 41.807L1.56802 27.557C-0.18934 25.7996 -0.18934 22.9504 1.56802 21.193C3.32538 19.4357 6.17462 19.4357 7.93198 21.193L14.5 27.761V5.375C14.5 2.88972 16.5147 0.875 19 0.875Z"
      fill="var(--ck-graphic-secondary-color, white)"
    />
  </svg>
);

const Key = ({ ...props }) => {
  const id = props?.id ?? '';
  return (
    <svg
      {...props}
      width="81"
      height="81"
      viewBox="0 0 81 81"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M81 27C81 41.9117 68.9117 54 54 54C51.2722 54 48.6389 53.5955 46.1568 52.8432L36 63H27V72H18V81H4.5C2.01472 81 0 78.9853 0 76.5V64.864C0 63.6705 0.474103 62.5259 1.31802 61.682L28.1568 34.8432C27.4045 32.3611 27 29.7278 27 27C27 12.0883 39.0883 0 54 0C68.9117 0 81 12.0883 81 27ZM60.75 25.875C63.8566 25.875 66.375 23.3566 66.375 20.25C66.375 17.1434 63.8566 14.625 60.75 14.625C57.6434 14.625 55.125 17.1434 55.125 20.25C55.125 23.3566 57.6434 25.875 60.75 25.875Z"
        fill={`url(#${id}paint0_linear_2509_6177)`}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M81 27C81 41.9117 68.9117 54 54 54C51.2722 54 48.6389 53.5955 46.1568 52.8432L36 63H27V72H18V81H4.5C2.01472 81 0 78.9853 0 76.5V64.864C0 63.6705 0.474103 62.5259 1.31802 61.682L28.1568 34.8432C27.4045 32.3611 27 29.7278 27 27C27 12.0883 39.0883 0 54 0C68.9117 0 81 12.0883 81 27ZM60.75 25.875C63.8566 25.875 66.375 23.3566 66.375 20.25C66.375 17.1434 63.8566 14.625 60.75 14.625C57.6434 14.625 55.125 17.1434 55.125 20.25C55.125 23.3566 57.6434 25.875 60.75 25.875Z"
        fill={`url(#${id}paint1_radial_2509_6177)`}
        fillOpacity="0.2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M44.5658 51.2522C45.1527 50.6653 46.0151 50.4492 46.8095 50.6899C49.0823 51.3788 51.4958 51.75 54 51.75C67.6691 51.75 78.75 40.669 78.75 27C78.75 13.331 67.6691 2.25 54 2.25C40.331 2.25 29.25 13.331 29.25 27C29.25 29.5042 29.6212 31.9177 30.3101 34.1905C30.5508 34.9849 30.3347 35.8473 29.7478 36.4342L2.90901 63.273C2.48705 63.6949 2.25 64.2672 2.25 64.864V76.5C2.25 77.7426 3.25736 78.75 4.5 78.75H15.75V72C15.75 70.7574 16.7574 69.75 18 69.75H24.75V63C24.75 61.7574 25.7574 60.75 27 60.75H35.068L44.5658 51.2522ZM36 63H27V72H18V81H4.5C2.01472 81 0 78.9853 0 76.5V64.864C0 63.6705 0.474103 62.5259 1.31802 61.682L28.1568 34.8432C27.4045 32.3611 27 29.7278 27 27C27 12.0883 39.0883 0 54 0C68.9117 0 81 12.0883 81 27C81 41.9117 68.9117 54 54 54C51.2722 54 48.6389 53.5955 46.1568 52.8432L36 63ZM68.625 20.25C68.625 24.5992 65.0992 28.125 60.75 28.125C56.4008 28.125 52.875 24.5992 52.875 20.25C52.875 15.9008 56.4008 12.375 60.75 12.375C65.0992 12.375 68.625 15.9008 68.625 20.25ZM66.375 20.25C66.375 23.3566 63.8566 25.875 60.75 25.875C57.6434 25.875 55.125 23.3566 55.125 20.25C55.125 17.1434 57.6434 14.625 60.75 14.625C63.8566 14.625 66.375 17.1434 66.375 20.25Z"
        fill="black"
        fillOpacity="0.1"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.4205 47.5795C33.8598 48.0188 33.8598 48.7312 33.4205 49.1705L3.0455 79.5455C2.60616 79.9848 1.89384 79.9848 1.4545 79.5455C1.01517 79.1062 1.01517 78.3938 1.4545 77.9545L31.8295 47.5795C32.2688 47.1402 32.9812 47.1402 33.4205 47.5795Z"
        fill="#A5A9AD"
      />
      <defs>
        <linearGradient
          id={`${id}paint0_linear_2509_6177`}
          x1="72"
          y1="5.625"
          x2="2.25"
          y2="78.75"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D4DFE6" />
          <stop offset="0.0967282" stopColor="#C6CACD" />
          <stop offset="0.526645" stopColor="#BDBAC4" />
          <stop offset="1" stopColor="#939CA1" />
        </linearGradient>
        <radialGradient
          id={`${id}paint1_radial_2509_6177`}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(52.875 12.375) rotate(93.2705) scale(39.4392)"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" />
        </radialGradient>
      </defs>
    </svg>
  );
};

const VitalikAddress = (
  <svg
    width="131"
    height="14"
    viewBox="0 0 131 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.74805 13.2549C8.86816 13.2549 10.7227 10.6973 10.7227 6.63672C10.7227 2.57617 8.85059 0.0625 5.74805 0.0625C2.63672 0.0625 0.755859 2.59375 0.755859 6.64551C0.755859 10.7148 2.61914 13.2549 5.74805 13.2549ZM5.74805 11.4004C4.02539 11.4004 3.04102 9.64258 3.04102 6.63672C3.04102 3.68359 4.04297 1.91699 5.74805 1.91699C7.44434 1.91699 8.4375 3.6748 8.4375 6.64551C8.4375 9.65137 7.46191 11.4004 5.74805 11.4004Z"
      fill="var(--ck-body-color)"
    />
    <path
      d="M13.0869 13.1758C13.4561 13.1758 13.6934 13.0439 13.9658 12.6221L15.9697 9.66016H16.0137L18.0264 12.6572C18.2549 13.0088 18.4922 13.1758 18.8965 13.1758C19.4854 13.1758 19.9424 12.7891 19.9424 12.209C19.9424 11.9805 19.8633 11.7695 19.7051 11.541L17.376 8.28906L19.6963 5.16016C19.8896 4.90527 19.9688 4.68555 19.9688 4.43066C19.9688 3.88574 19.5381 3.49902 18.9229 3.49902C18.5361 3.49902 18.2988 3.6748 18.0176 4.10547L16.1191 6.95312H16.0752L14.1328 4.08789C13.8516 3.64844 13.6318 3.49902 13.2012 3.49902C12.6035 3.49902 12.1465 3.91211 12.1465 4.44824C12.1465 4.70312 12.2256 4.92285 12.3838 5.13379L14.7129 8.35059L12.3486 11.5498C12.1641 11.8135 12.0762 12.0156 12.0762 12.2705C12.0762 12.7979 12.498 13.1758 13.0869 13.1758Z"
      fill="var(--ck-body-color)"
    />
    <path
      d="M26.2441 13.2549C29.1445 13.2549 31.1924 11.7432 31.1924 9.57227C31.1924 7.9375 30.0146 6.68066 28.3184 6.3291V6.27637C29.7773 5.87207 30.7178 4.7998 30.7178 3.45508C30.7178 1.48633 28.8633 0.0625 26.2441 0.0625C23.625 0.0625 21.7617 1.49512 21.7617 3.44629C21.7617 4.80859 22.7109 5.88965 24.1699 6.27637V6.3291C22.4736 6.67188 21.3047 7.92871 21.3047 9.57227C21.3047 11.7344 23.335 13.2549 26.2441 13.2549ZM26.2441 5.55566C24.9258 5.55566 24.0029 4.78223 24.0029 3.6748C24.0029 2.55859 24.9258 1.77637 26.2441 1.77637C27.5537 1.77637 28.4854 2.5498 28.4854 3.6748C28.4854 4.78223 27.5537 5.55566 26.2441 5.55566ZM26.2441 11.5234C24.7236 11.5234 23.6514 10.6357 23.6514 9.40527C23.6514 8.1748 24.7236 7.28711 26.2441 7.28711C27.7646 7.28711 28.8369 8.16602 28.8369 9.40527C28.8369 10.6357 27.7646 11.5234 26.2441 11.5234Z"
      fill="var(--ck-body-color)"
    />
    <path
      d="M36.3164 13.1494C37.7578 13.1494 38.7598 12.4199 39.208 11.3477H39.252V12.0771C39.252 12.7891 39.7266 13.1758 40.3594 13.1758C40.9922 13.1758 41.4404 12.7803 41.4404 12.0771V1.29297C41.4404 0.554688 40.9834 0.141602 40.3418 0.141602C39.7002 0.141602 39.252 0.554688 39.252 1.29297V5.24805H39.1992C38.707 4.21973 37.6523 3.52539 36.3164 3.52539C33.9697 3.52539 32.4492 5.38867 32.4492 8.33301C32.4492 11.2949 33.9697 13.1494 36.3164 13.1494ZM36.9756 11.3564C35.5605 11.3564 34.6904 10.1963 34.6904 8.3418C34.6904 6.49609 35.5693 5.32715 36.9756 5.32715C38.3555 5.32715 39.2607 6.51367 39.2607 8.3418C39.2607 10.1875 38.3555 11.3564 36.9756 11.3564Z"
      fill="var(--ck-body-color)"
    />
    <path
      d="M44.0508 13.1494C44.6396 13.1494 44.9736 12.8594 45.1846 12.1738L46.0195 9.76562H50.7568L51.5918 12.1914C51.7939 12.8682 52.1367 13.1494 52.752 13.1494C53.4111 13.1494 53.8857 12.7188 53.8857 12.1035C53.8857 11.9014 53.8418 11.6992 53.7363 11.4092L50.0449 1.38965C49.7285 0.537109 49.2188 0.167969 48.3838 0.167969C47.5576 0.167969 47.0479 0.554688 46.7402 1.39844L43.0576 11.4092C42.9521 11.6816 42.9082 11.9277 42.9082 12.1035C42.9082 12.7451 43.3564 13.1494 44.0508 13.1494ZM46.5557 7.97266L48.3398 2.55859H48.4014L50.2031 7.97266H46.5557Z"
      fill="var(--ck-body-color)"
    />
    <path
      d="M60.1172 13.2549C62.8594 13.2549 64.8545 11.4004 64.8545 8.8252C64.8545 6.42578 63.1406 4.66797 60.6973 4.66797C58.9746 4.66797 57.709 5.54688 57.208 6.71582H57.1641V6.58398C57.208 3.66602 58.2275 1.89941 60.1436 1.89941C61.084 1.89941 61.7607 2.26855 62.3496 3.07715C62.7012 3.52539 62.9824 3.73633 63.4307 3.73633C64.0283 3.73633 64.3975 3.34082 64.3975 2.82227C64.3975 2.57617 64.3359 2.35645 64.1953 2.10156C63.5625 0.897461 62.0859 0.0537109 60.1523 0.0537109C56.9268 0.0537109 54.9932 2.57617 54.9932 6.80371C54.9932 8.24512 55.2305 9.45801 55.6963 10.4336C56.5752 12.2881 58.1396 13.2549 60.1172 13.2549ZM60.082 11.4092C58.667 11.4092 57.5508 10.293 57.5508 8.86914C57.5508 7.4541 58.6494 6.41699 60.1084 6.41699C61.5674 6.41699 62.6309 7.4541 62.6221 8.91309C62.6221 10.3018 61.4971 11.4092 60.082 11.4092Z"
      fill="var(--ck-body-color)"
    />
    <path
      d="M68.1328 8.83398C68.8447 8.83398 69.416 8.27148 69.416 7.55078C69.416 6.83008 68.8447 6.25879 68.1328 6.25879C67.4121 6.25879 66.8408 6.83008 66.8408 7.55078C66.8408 8.27148 67.4121 8.83398 68.1328 8.83398Z"
      fill="var(--ck-body-color)"
    />
    <path
      d="M73.3359 8.83398C74.0479 8.83398 74.6191 8.27148 74.6191 7.55078C74.6191 6.83008 74.0479 6.25879 73.3359 6.25879C72.6152 6.25879 72.0439 6.83008 72.0439 7.55078C72.0439 8.27148 72.6152 8.83398 73.3359 8.83398Z"
      fill="var(--ck-body-color)"
    />
    <path
      d="M78.5391 8.83398C79.251 8.83398 79.8223 8.27148 79.8223 7.55078C79.8223 6.83008 79.251 6.25879 78.5391 6.25879C77.8184 6.25879 77.2471 6.83008 77.2471 7.55078C77.2471 8.27148 77.8184 8.83398 78.5391 8.83398Z"
      fill="var(--ck-body-color)"
    />
    <path
      d="M83.7422 8.83398C84.4541 8.83398 85.0254 8.27148 85.0254 7.55078C85.0254 6.83008 84.4541 6.25879 83.7422 6.25879C83.0215 6.25879 82.4502 6.83008 82.4502 7.55078C82.4502 8.27148 83.0215 8.83398 83.7422 8.83398Z"
      fill="var(--ck-body-color)"
    />
    <path
      d="M92.2148 13.2549C94.957 13.2549 96.9521 11.4004 96.9521 8.8252C96.9521 6.42578 95.2383 4.66797 92.7949 4.66797C91.0723 4.66797 89.8066 5.54688 89.3057 6.71582H89.2617V6.58398C89.3057 3.66602 90.3252 1.89941 92.2412 1.89941C93.1816 1.89941 93.8584 2.26855 94.4473 3.07715C94.7988 3.52539 95.0801 3.73633 95.5283 3.73633C96.126 3.73633 96.4951 3.34082 96.4951 2.82227C96.4951 2.57617 96.4336 2.35645 96.293 2.10156C95.6602 0.897461 94.1836 0.0537109 92.25 0.0537109C89.0244 0.0537109 87.0908 2.57617 87.0908 6.80371C87.0908 8.24512 87.3281 9.45801 87.7939 10.4336C88.6729 12.2881 90.2373 13.2549 92.2148 13.2549ZM92.1797 11.4092C90.7646 11.4092 89.6484 10.293 89.6484 8.86914C89.6484 7.4541 90.7471 6.41699 92.2061 6.41699C93.665 6.41699 94.7285 7.4541 94.7197 8.91309C94.7197 10.3018 93.5947 11.4092 92.1797 11.4092Z"
      fill="var(--ck-body-color)"
    />
    <path
      d="M103.377 13.2549C106.497 13.2549 108.352 10.6973 108.352 6.63672C108.352 2.57617 106.479 0.0625 103.377 0.0625C100.266 0.0625 98.3848 2.59375 98.3848 6.64551C98.3848 10.7148 100.248 13.2549 103.377 13.2549ZM103.377 11.4004C101.654 11.4004 100.67 9.64258 100.67 6.63672C100.67 3.68359 101.672 1.91699 103.377 1.91699C105.073 1.91699 106.066 3.6748 106.066 6.64551C106.066 9.65137 105.091 11.4004 103.377 11.4004Z"
      fill="var(--ck-body-color)"
    />
    <path
      d="M117.167 13.1758C117.8 13.1758 118.248 12.7715 118.248 12.0596V10.5654H119.127C119.733 10.5654 120.094 10.1875 120.094 9.63379C120.094 9.08887 119.733 8.70215 119.136 8.70215H118.248V1.81152C118.248 0.756836 117.554 0.141602 116.385 0.141602C115.453 0.141602 114.899 0.52832 114.073 1.75879C112.553 3.99121 111.111 6.16211 110.224 7.75293C109.872 8.38574 109.731 8.79883 109.731 9.29102C109.731 10.0469 110.268 10.5654 111.085 10.5654H116.086V12.0596C116.086 12.7715 116.543 13.1758 117.167 13.1758ZM116.121 8.75488H111.788V8.69336C112.816 6.82129 114.073 4.92285 116.086 2.04004H116.121V8.75488Z"
      fill="var(--ck-body-color)"
    />
    <path
      d="M126.105 13.2549C128.918 13.2549 130.869 11.4355 130.869 8.78125C130.869 6.35547 129.138 4.6416 126.712 4.6416C125.438 4.6416 124.392 5.13379 123.855 5.9248H123.812L124.146 2.17188H129.27C129.85 2.17188 130.228 1.80273 130.228 1.24023C130.228 0.686523 129.85 0.317383 129.27 0.317383H123.803C122.81 0.317383 122.3 0.72168 122.221 1.72363L121.816 6.51367C121.808 6.56641 121.808 6.60156 121.808 6.6543C121.79 7.26953 122.15 7.78809 122.88 7.78809C123.398 7.78809 123.618 7.67383 124.146 7.14648C124.629 6.67188 125.323 6.34668 126.123 6.34668C127.617 6.34668 128.681 7.38379 128.681 8.84277C128.681 10.3457 127.617 11.4092 126.114 11.4092C124.893 11.4092 124.049 10.8027 123.618 9.77441C123.381 9.30859 123.091 9.12402 122.616 9.12402C122.019 9.12402 121.641 9.49316 121.641 10.082C121.641 10.4072 121.72 10.6709 121.843 10.9434C122.467 12.3232 124.154 13.2549 126.105 13.2549Z"
      fill="var(--ck-body-color)"
    />
  </svg>
);

type Slide = {
  layoutId?: string;
  duration: number;
  ease: Easing;
};

export const SlideOne = ({ layoutId }: Slide) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ rotate: 90, scale: 0.2, x: '100%' }}
        animate={{ rotate: 0, scale: 1, x: 0 }}
        exit={{ rotate: 40, scale: 0.1, x: '70%' }}
        style={{
          zIndex: 4,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 76,
          height: 76,
          background: 'var(--ck-graphic-secondary-background, #6366F1)',
          borderRadius: '50%',
          boxShadow:
            'var(--ck-graphic-secondary-box-shadow, 0px 2px 10px rgba(99, 102, 241, 0.3))',
        }}
      >
        {Receive}
      </motion.div>
      <MainCircle
        key={layoutId}
        layoutId={layoutId}
        style={{
          position: 'relative',
          zIndex: 10,
          margin: '0 -8px',
          width: 112,
          height: 112,
        }}
      >
        <MainCircleInner
          key={'SlideOneInner'}
          style={{
            background:
              'var(--ck-graphic-primary-background, var(--ck-body-background))',
            boxShadow:
              'var(--ck-graphic-primary-box-shadow, 0px 3px 15px rgba(0, 0, 0, 0.1))',
          }}
          initial={{
            opacity: 0,
          }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <BgLighten />
          <motion.div style={{ zIndex: 2, position: 'relative' }}>
            <Wallet />
          </motion.div>
        </MainCircleInner>
      </MainCircle>

      <motion.div
        initial={{ rotate: -90, scale: 0.2, x: '-100%' }}
        animate={{ rotate: 0, scale: 1, x: 0 }}
        exit={{ rotate: -40, scale: 0.1, x: '-70%' }}
        style={{
          zIndex: 4,
          position: 'relative',
          width: 76,
          height: 76,
          background: 'var(--ck-graphic-secondary-background, #3897FB)',
          borderRadius: '50%',
          boxShadow:
            'var(--ck-graphic-secondary-box-shadow, 0px 2px 10px rgba(56, 151, 251, 0.3))',
        }}
      >
        <Center>
          <div style={{ position: 'relative', left: -2, top: 3 }}>{Send}</div>
        </Center>
      </motion.div>
    </div>
  );
};

export const SlideTwo = ({ layoutId }: Slide) => {
  return (
    <>
      <div
        style={{
          position: 'relative',
          left: -14,
        }}
      >
        <MainCircle
          key={layoutId}
          layoutId={layoutId}
          style={{
            zIndex: 10,
            position: 'absolute',
            left: 15,
            top: 12,
            width: 32,
            height: 32,
          }}
        >
          <MainCircleInner
            key={'SlideTwoInner'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background:
                'var(--ck-graphic-primary-background, var(--ck-body-background))',
              boxShadow:
                'var(--ck-graphic-primary-box-shadow, 0px 2px 5px rgba(37, 41, 46, 0.16))',
            }}
          >
            <Center>
              <Wallet />
            </Center>
          </MainCircleInner>
        </MainCircle>
        <motion.div
          initial={{ scale: 0.2 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.2 }}
          style={{
            zIndex: 7,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            padding: '21px 56px',
            paddingRight: 52,
            background:
              'var(--ck-graphic-primary-background, var(--ck-body-background))',
            boxShadow:
              'var(--ck-graphic-primary-box-shadow, 0px 2px 9px rgba(0, 0, 0, 0.07))',
            borderRadius: 'var(--ck-border-radius, 16px)',
          }}
        >
          <BgLighten />
          <div style={{ position: 'relative', zIndex: 2, top: 1, left: 1 }}>
            {VitalikAddress}
          </div>
        </motion.div>
        <motion.div
          style={{
            zIndex: 8,
            position: 'absolute',
            top: -16,
            right: -28,
          }}
          initial={{ rotate: 90, x: -70, scale: 0.4 }}
          animate={{ rotate: 0, x: 0, scale: 1 }}
          exit={{ rotate: 0, x: -70, scale: 0.4 }}
        >
          <Key id={layoutId} />
        </motion.div>
      </div>
    </>
  );
};

export const SlideThree = ({ layoutId }: Slide) => {
  const id = Math.random(); // TODO: Better unique ID handling
  return (
    <>
      <motion.div
        key={'SlideThree'}
        style={{
          position: 'relative',
        }}
      >
        <MainCircle
          key={layoutId}
          layoutId={layoutId}
          initial={{ rotate: 80 }}
          style={{
            zIndex: 10,
            position: 'relative',
            width: 128,
            height: 128,
          }}
        >
          <MainCircleInner
            key={'SlideThreeInner'}
            initial={{ opacity: 0, rotate: 100 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              overflow: 'hidden',
              background: `var(--ck-graphic-globe-background, radial-gradient(
              82.42% 82.42% at 50% 86.72%,
              rgba(255, 255, 255, 0.2) 0%,
              rgba(0, 0, 0, 0) 100%
            ),
            linear-gradient(180deg, #3897FB 0%, #5004F1 100%))`,
              boxShadow:
                'var(--ck-graphic-globe-box-shadow, 0px -6px 20px rgba(56, 151, 251, 0.23))',
            }}
          >
            <SpinContainer
              style={
                !Boolean(layoutId)
                  ? {
                      animationPlayState: 'paused',
                    }
                  : undefined
              }
            >
              <svg
                width="128"
                height="128"
                viewBox="0 0 128 128"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <circle
                    cx="30"
                    cy="141"
                    r="64"
                    stroke={`url(#networkRadialA-${id})`}
                    strokeWidth="3"
                  />
                  <circle
                    cx="78.8515"
                    cy="131.123"
                    r="54.1005"
                    transform="rotate(-37.4016 78.8515 131.123)"
                    stroke={`url(#networkRadialB-${id})`}
                    strokeWidth="3"
                  />
                  <circle
                    cx="63.6053"
                    cy="2.12794"
                    r="50.8338"
                    transform="rotate(134.702 63.6053 2.12794)"
                    stroke={`url(#networkRadialC-${id})`}
                    strokeWidth="3"
                  />
                  <circle
                    cx="126.658"
                    cy="56.6577"
                    r="50.3433"
                    transform="rotate(-105 126.658 56.6577)"
                    stroke={`url(#networkRadialD-${id})`}
                    strokeWidth="3"
                  />
                  <circle
                    cx="13.6619"
                    cy="18.9603"
                    r="46.0247"
                    transform="rotate(107.362 13.6619 18.9603)"
                    stroke={`url(#networkRadialE-${id})`}
                    strokeWidth="3"
                  />
                </g>
                <defs>
                  <radialGradient
                    id={`networkRadialA-${id}`}
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(60.5 84) rotate(104.668) scale(77.0097)"
                  >
                    <stop stopColor="var(--ck-graphic-globe-lines, white)" />
                    <stop
                      offset="1"
                      stopColor="var(--ck-graphic-globe-lines, white)"
                      stopOpacity="0"
                    />
                  </radialGradient>
                  <radialGradient
                    id={`networkRadialB-${id}`}
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(96.1805 81.6717) rotate(97.125) scale(64.7443)"
                  >
                    <stop stopColor="var(--ck-graphic-globe-lines, white)" />
                    <stop
                      offset="1"
                      stopColor="var(--ck-graphic-globe-lines, white)"
                      stopOpacity="0"
                    />
                  </radialGradient>
                  <radialGradient
                    id={`networkRadialC-${id}`}
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(96.3816 -36.4455) rotate(114.614) scale(57.7177)"
                  >
                    <stop stopColor="var(--ck-graphic-globe-lines, white)" />
                    <stop
                      offset="1"
                      stopColor="var(--ck-graphic-globe-lines, white)"
                      stopOpacity="0"
                    />
                  </radialGradient>
                  <radialGradient
                    id={`networkRadialD-${id}`}
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(137.86 7.73234) rotate(92.3288) scale(62.743)"
                  >
                    <stop stopColor="var(--ck-graphic-globe-lines, white)" />
                    <stop
                      offset="1"
                      stopColor="var(--ck-graphic-globe-lines, white)"
                      stopOpacity="0"
                    />
                  </radialGradient>
                  <radialGradient
                    id={`networkRadialE-${id}`}
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(35.3203 -21.566) rotate(104.513) scale(54.8617)"
                  >
                    <stop stopColor="var(--ck-graphic-globe-lines, white)" />
                    <stop
                      offset="1"
                      stopColor="var(--ck-graphic-globe-lines, white)"
                      stopOpacity="0"
                    />
                  </radialGradient>
                </defs>
              </svg>
            </SpinContainer>
          </MainCircleInner>
          <motion.div exit={{ opacity: 0 }}>
            <motion.div
              key="pulseA"
              initial={!Boolean(layoutId) ? { scale: 1.1 } : undefined}
              animate={Boolean(layoutId) ? pulseAnim : undefined}
              transition={{ ...pulseTransition }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                boxShadow:
                  '0 0 0 2px var(--ck-graphic-globe-lines, rgba(126, 112, 243, 1))',
              }}
            />
            <motion.div
              key="pulseB"
              initial={
                !Boolean(layoutId) ? { scale: 1.2, opacity: 0.25 } : undefined
              }
              animate={Boolean(layoutId) ? pulseAnim : undefined}
              transition={{ ...pulseTransition, delay: 0.5 }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                boxShadow:
                  '0 0 0 2px var(--ck-graphic-globe-lines, rgba(126, 112, 243, 1))',
              }}
            />
          </motion.div>
        </MainCircle>

        <motion.div
          initial={{ rotate: -20, scale: 0.1, y: -10, x: -10 }}
          animate={{ rotate: 0, scale: 1, y: 0, x: 0 }}
          exit={{ zIndex: 3, scale: 0.2, y: -25, x: 15 }}
          style={{
            zIndex: 12,
            borderRadius: '50%',
            position: 'absolute',
            bottom: -4,
            right: -4,
            width: 54,
            height: 54,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 13,
            background:
              'var(--ck-graphic-compass-background, var(--ck-body-background))',
            boxShadow:
              'var(--ck-graphic-compass-box-shadow, 0px 2px 9px rgba(0, 0, 0, 0.15))',
          }}
        >
          <BgLighten />
          <motion.div
            style={{ zIndex: 2, position: 'absolute' }}
            initial={{ rotate: -170 }}
            animate={{ rotate: 0 }}
            exit={{
              rotate: -180,
              transition: { duration: 0 }, // needed to avoid AnimatePresence taking too long to unmount the animation which causes issues on page close
            }}
            transition={{
              type: 'spring',
              stiffness: 6,
              damping: 0.9,
              mass: 0.2,
            }}
          >
            {Compass}
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};
