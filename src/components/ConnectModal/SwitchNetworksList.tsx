import React from 'react';

import { useNetwork } from 'wagmi';
import supportedChains from '../../constants/supportedChains';

import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
const ChainIcon = styled(motion.div)`
  display: block;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  background: var(--body-background);
  svg {
    width: 100%;
    height: auto;
  }
`;
const ChainLogoContainer = styled(motion.div)`
  position: relative;
`;
const ChainLogoSpinner = styled(motion.div)`
  position: absolute;
  inset: -6px;
  animation: rotateSpinner 1200ms linear infinite;
  pointer-events: none;
  svg {
    width: 100%;
    height: auto;
  }
  @keyframes rotateSpinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
const ChainButtons = styled(motion.div)``;
const ChainButton = styled(motion.button)`
  appearance: none;
  cursor: pointer;
  user-select: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  border-radius: 11px;
  margin: 0 0 1px;
  padding: 8px 0;
  font-size: 15px;
  line-height: 18px;
  font-weight: 500;
  text-decoration: none;
  color: var(--body-color);
  background: none;
  white-space: nowrap;
  transition: transform 100ms ease, background-color 100ms ease;
  transform: translateZ(0px);
  &:before {
    content: '';
    background: currentColor;
    position: absolute;
    z-index: -1;
    inset: 0 -12px 0 -8px;
    border-radius: 12px;
    opacity: 0;
    transition: opacity 180ms ease;
  }
  &:hover {
    &:before {
      transition-duration: 80ms;
      opacity: 0.05;
    }
  }
  &:active {
    transform: scale(0.99) translateZ(0px);
  }
  &:disabled {
    pointer-events: none;
  }
`;
const ChainButtonStatus = styled(motion.div)`
  color: var(--body-color-muted);
  font-size: 15px;
  line-height: 18px;
  font-weight: 400;
  span {
    display: block;
    position: relative;
  }
`;
const ChainButtonBg = styled(motion.div)`
  background: var(--focus-color);
  position: absolute;
  z-index: -1;
  inset: 0 -12px 0 -8px;
  border-radius: 12px;
  opacity: 0.1;
`;

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
      d="M2 16.75C2.69036 16.75 3.25 17.3096 3.25 18V19C3.25 26.5939 9.40609 32.75 17 32.75V35.25C8.02537 35.25 0.75 27.9746 0.75 19V18C0.75 17.3096 1.30964 16.75 2 16.75Z"
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
        <stop stopColor="var(--spinner-color)" />
        <stop offset="1" stopColor="var(--spinner-color)" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

const SwitchNetworksList: React.FC = () => {
  const { activeChain, chains, isLoading, pendingChainId, switchNetwork } =
    useNetwork();

  return (
    <ChainButtons>
      {chains.map((x) => {
        const chain = supportedChains.filter((c) => c.id === x.id)[0];
        return (
          <ChainButton
            disabled={
              !switchNetwork ||
              x.id === activeChain?.id ||
              (isLoading && pendingChainId === x.id)
            }
            key={x.id}
            onClick={() => switchNetwork?.(x.id)}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 12,
              }}
            >
              <ChainLogoContainer>
                <ChainLogoSpinner
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: isLoading && pendingChainId === x.id ? 1 : 0,
                  }}
                  transition={{
                    ease: [0.76, 0, 0.24, 1],
                    duration: 0.15,
                  }}
                >
                  {Spinner}
                </ChainLogoSpinner>
                <ChainIcon>{chain.logo}</ChainIcon>
              </ChainLogoContainer>
              {x.name}
            </span>
            <ChainButtonStatus>
              <AnimatePresence initial={false}>
                {x.id === activeChain?.id && (
                  <motion.span
                    style={{
                      color: 'var(--focus-color)',
                      display: 'block',
                      position: 'relative',
                    }}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{
                      opacity: 0,
                      x: 4,
                      transition: { duration: 0.1 },
                    }}
                    transition={{
                      ease: [0.76, 0, 0.24, 1],
                      duration: 0.3,
                    }}
                  >
                    Connected
                  </motion.span>
                )}
                {isLoading && pendingChainId === x.id && (
                  <motion.span
                    style={{
                      display: 'block',
                      position: 'relative',
                    }}
                    initial={{
                      opacity: 0,
                      x: -4,
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 4 }}
                    transition={{
                      ease: [0.76, 0, 0.24, 1],
                      duration: 0.15,
                    }}
                  >
                    Approve in Wallet
                  </motion.span>
                )}
              </AnimatePresence>
            </ChainButtonStatus>
            {
              //hover === x.name && (
              x.id === activeChain?.id && (
                <ChainButtonBg
                  layoutId="activeChain"
                  layout="position"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.1 }}
                  transition={{
                    duration: 0.3,
                    ease: 'easeOut',
                  }}
                />
              )
            }
          </ChainButton>
        );
      })}
    </ChainButtons>
  );
};

export default SwitchNetworksList;
