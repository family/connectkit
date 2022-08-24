import React from 'react';

import { ChainContainer, LoadingContainer } from './styles';
import { motion, AnimatePresence } from 'framer-motion';
import supportedChains from '../../../constants/supportedChains';

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
      fill-rule="evenodd"
      clip-rule="evenodd"
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
}> = ({ id }) => {
  const chain = supportedChains.find((c) => c.id === id);
  return (
    <ChainContainer>
      <AnimatePresence initial={false}>
        {id ? (
          <motion.div
            key={`${chain?.id}-${chain?.name}-${id}`}
            style={{
              position: 'absolute',
              inset: 0,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {chain?.logo}
          </motion.div>
        ) : (
          <LoadingContainer
            key="loading"
            style={{
              position: 'absolute',
              inset: 0,
            }}
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
