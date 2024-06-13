import React from 'react';

import {
  ChainContainer,
  LoadingContainer,
  LogoContainer,
  Unsupported,
} from './styles';
import { AnimatePresence } from 'framer-motion';
import { chainConfigs } from '../../../constants/chainConfigs';
import Chains from '../../../assets/chains';
import useIsMounted from '../../../hooks/useIsMounted';
import { useChainIsSupported } from '../../../hooks/useChainIsSupported';

const Spinner = (
  <svg
    aria-hidden="true"
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.3592 30.1654C10.0472 29.4491 8.85718 28.524 7.83713 27.424C6.81708 26.324 5.98425 25.0677 5.36889 23.7054C5.20157 23.335 5.05033 22.9567 4.91578 22.5717C4.51465 21.4237 4.26735 20.2308 4.17794 19.0239C4.16599 18.8626 4.13894 18.7041 4.09809 18.5507C3.85023 17.6197 3.09399 16.8738 2.11531 16.7999C0.975331 16.7138 -0.0310983 17.5702 0.0141657 18.7125C0.0223289 18.9185 0.0340286 19.1243 0.049253 19.3298C0.165374 20.8971 0.486545 22.4464 1.00749 23.9373C1.10424 24.2142 1.20764 24.4884 1.31755 24.7596C2.13617 26.7799 3.31595 28.6371 4.80146 30.239C6.28696 31.841 8.04998 33.1573 10.0029 34.1258C10.2651 34.2558 10.5307 34.3796 10.7995 34.4969C12.247 35.1287 13.7676 35.5656 15.3217 35.7995C15.5255 35.8301 15.7298 35.8573 15.9346 35.881C17.0703 36.0122 18.0001 35.0731 18.0001 33.9299C18.0001 32.9484 17.3133 32.1381 16.4036 31.8208C16.2537 31.7685 16.0977 31.7296 15.9377 31.7056C14.7411 31.5255 13.5702 31.1891 12.4556 30.7026C12.0818 30.5394 11.716 30.3601 11.3592 30.1654Z"
      fill="url(#paint0_linear_1288_1870)"
    />

    <defs>
      <linearGradient
        id="paint0_linear_1288_1870"
        x1="2"
        y1="19.4884"
        x2="16.8752"
        y2="33.7485"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          stopColor="var(--ck-connectbutton-balance-color,currentColor)"
          stopOpacity="0.7"
        />
        <stop
          offset="1"
          stopColor="var(--ck-connectbutton-balance-color,currentColor)"
          stopOpacity="0"
        />
      </linearGradient>
    </defs>
  </svg>
);

const Chain: React.FC<{
  id?: number;
  unsupported?: boolean;
  radius?: number | string;
  size?: number | string;
}> = ({
  id,
  unsupported: controlledUnsupported,
  radius = '50%',
  size = 24,
}) => {
  const isChainSupported = useChainIsSupported(id);
  const unsupported = controlledUnsupported ?? !isChainSupported;

  const chain = chainConfigs.find((c) => c.id === id);
  const isMounted = useIsMounted();
  if (!isMounted)
    return (
      <div
        style={{
          width: size,
          height: size,
        }}
      />
    );

  return (
    <ChainContainer size={size} radius={radius}>
      <AnimatePresence initial={false}>
        {unsupported && (
          <Unsupported
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <svg
              width="13"
              height="12"
              viewBox="0 0 13 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.61317 11.2501H9.46246C10.6009 11.2501 11.3256 10.3506 11.3256 9.3549C11.3256 9.05145 11.255 8.73244 11.0881 8.43303L7.65903 2.14708C7.659 2.14702 7.65897 2.14696 7.65893 2.1469C7.65889 2.14682 7.65884 2.14673 7.65879 2.14664C7.31045 1.50746 6.6741 1.17871 6.04 1.17871C5.41478 1.17871 4.763 1.50043 4.41518 2.14968L0.993416 8.43476C0.828865 8.72426 0.75 9.04297 0.75 9.3549C0.75 10.3506 1.47471 11.2501 2.61317 11.2501Z"
                fill="currentColor"
                stroke="var(--ck-body-background, #fff)"
                strokeWidth="1.5"
              />
              <path
                d="M6.03258 7.43916C5.77502 7.43916 5.63096 7.29153 5.62223 7.02311L5.55675 4.96973C5.54802 4.69684 5.74446 4.5 6.02821 4.5C6.3076 4.5 6.51277 4.70131 6.50404 4.9742L6.43856 7.01864C6.42546 7.29153 6.2814 7.43916 6.03258 7.43916ZM6.03258 9.11676C5.7401 9.11676 5.5 8.9065 5.5 8.60677C5.5 8.30704 5.7401 8.09678 6.03258 8.09678C6.32506 8.09678 6.56515 8.30256 6.56515 8.60677C6.56515 8.91097 6.32069 9.11676 6.03258 9.11676Z"
                fill="white"
              />
            </svg>
          </Unsupported>
        )}
        {id ? (
          <LogoContainer
            key={`${chain?.id}-${chain?.name}-${id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {chain?.logo ?? <Chains.UnknownChain />}
          </LogoContainer>
        ) : (
          <LoadingContainer
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {Spinner}
          </LoadingContainer>
        )}
      </AnimatePresence>
    </ChainContainer>
  );
};

export default Chain;
