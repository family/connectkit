import {
  LogoContainer,
  Logo,
  Spinner,
  SpinnerContainer,
  ExpiringSpinner,
} from './styles';

import { AnimatePresence } from 'framer-motion';
import React from 'react';

const CircleSpinner = ({
  logo,
  smallLogo,
  connecting = true,
  unavailable = false,
  countdown = false,
}: {
  logo?: React.ReactNode;
  smallLogo?: boolean;
  connecting?: boolean;
  unavailable?: boolean;
  countdown?: boolean;
}) => {
  return (
    <LogoContainer
      transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 0.98] }}
    >
      <Logo
        $small={!unavailable && smallLogo}
        style={unavailable ? { borderRadius: 0 } : undefined}
      >
        {logo}
      </Logo>
      <SpinnerContainer>
        <AnimatePresence>
          {connecting && (
            <Spinner
              key="Spinner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: {
                  duration: countdown ? 1 : 0,
                },
              }}
            >
              <svg
                aria-hidden="true"
                width="102"
                height="102"
                viewBox="0 0 102 102"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M52 100C24.3858 100 2 77.6142 2 50"
                  stroke="url(#paint0_linear_1943_4139)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_1943_4139"
                    x1="2"
                    y1="48.5"
                    x2="53"
                    y2="100"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="var(--ck-spinner-color)" />
                    <stop
                      offset="1"
                      stopColor="var(--ck-spinner-color)"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
              </svg>
            </Spinner>
          )}
          {countdown && (
            <ExpiringSpinner
              key="ExpiringSpinner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div />
              <div />
            </ExpiringSpinner>
          )}
        </AnimatePresence>
      </SpinnerContainer>
    </LogoContainer>
  );
};

export default CircleSpinner;
