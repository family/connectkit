import React from 'react';

import { useNetwork, useSwitchNetwork } from 'wagmi';
import supportedChains from '../../constants/supportedChains';

import Alert from '../Common/Alert';
import defaultTheme from '../../constants/defaultTheme';

import { AnimatePresence, motion } from 'framer-motion';
import styled, { css } from 'styled-components';

const SwitchNetworksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    flex-direction: column-reverse;
  }
`;

const ChainIcon = styled(motion.div)<{ $empty?: boolean }>`
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
    border-radius: inherit;
    display: block;
    position: relative;
    transform: translate3d(0, 0, 0);
    width: 100%;
    height: auto;
  }
  ${(props) =>
    props.$empty &&
    css`
      display: flex;
      align-items: center;
      justify-content: center;
      &:before {
        content: '?';
        color: var(--body-color-muted);
        font-weight: bold;
        font-family: var(--font-family);
      }
    `}
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    border-radius: 16px;
    width: 32px;
    height: 32px;
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
    display: block;
    position: relative;
    transform: translate3d(0, 0, 0);
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
const ChainButtons = styled(motion.div)`
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    padding: 0 6px;
    margin: 2px -2px 0;
  }
`;
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
    inset: 0 -8px;
    border-radius: 12px;
    opacity: 0;
    transition: opacity 180ms ease;
  }
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    font-size: 17px;
    padding: 8px 0;
  }
  @media only screen and (min-width: ${defaultTheme.mobileWidth}px) {
    &:hover {
      &:before {
        transition-duration: 80ms;
        opacity: 0.05;
      }
    }
  }
  &:active {
    transform: scale(0.99) translateZ(0px);
  }
  &:disabled {
    //opacity: 0.4;
    pointer-events: none;
  }
`;
const ChainButtonStatus = styled(motion.div)`
  color: var(--body-color-muted);
  font-size: 15px;
  line-height: 18px;
  font-weight: 500;
  padding-right: 4px;
  span {
    display: block;
    position: relative;
  }
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    font-size: 17px;
    padding: 0;
  }
`;
const ChainButtonBg = styled(motion.div)`
  background: var(--focus-color);
  position: absolute;
  z-index: -1;
  inset: 0 -8px;
  border-radius: 12px;
  opacity: 0.1;
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    inset: 0 -12px;
  }
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
  const { chain } = useNetwork();
  const { chains, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  const x = supportedChains.find((x) => x.id === chain?.id) || {
    logo: false,
  };
  const activeChain = { ...chain, ...x };

  if (!switchNetwork) {
    return (
      <SwitchNetworksContainer>
        <ChainButtons>
          <AnimatePresence exitBeforeEnter initial={false}>
            <ChainButton
              disabled
              key={activeChain.id}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
              }}
              exit={{ opacity: 0 }}
              transition={{
                ease: [0.76, 0, 0.24, 1],
                duration: 0.25,
              }}
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
                  {activeChain.logo ? (
                    <ChainIcon>{activeChain.logo}</ChainIcon>
                  ) : (
                    <ChainIcon $empty />
                  )}
                </ChainLogoContainer>
                {activeChain.name}
              </span>
              <ChainButtonStatus>
                <motion.span
                  style={{
                    color: activeChain.unsupported
                      ? 'var(--body-color-danger)'
                      : 'var(--focus-color)',
                    display: 'block',
                    position: 'relative',
                    paddingRight: 6,
                  }}
                >
                  {activeChain.unsupported ? 'Unsupported' : 'Connected'}
                </motion.span>
              </ChainButtonStatus>
            </ChainButton>
            );
          </AnimatePresence>
        </ChainButtons>
        <Alert>
          {`Your wallet does not support switching networks from this app. Try switching networks from within your wallet instead.`}
        </Alert>
      </SwitchNetworksContainer>
    );
  }

  return (
    <ChainButtons>
      {chains.map((x) => {
        const chain = supportedChains.find((c) => c.id === x.id);
        if (!chain) return null;
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
              {chain?.logo && (
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
              )}
              {x.name}
            </span>
            <ChainButtonStatus>
              <AnimatePresence initial={false} exitBeforeEnter>
                {x.id === activeChain?.id && (
                  <motion.span
                    key={'connectedText'}
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
                      transition: { duration: 0.1, delay: 0 },
                    }}
                    transition={{
                      ease: [0.76, 0, 0.24, 1],
                      duration: 0.3,
                      delay: 0.2,
                    }}
                  >
                    Connected
                  </motion.span>
                )}
                {isLoading && pendingChainId === x.id && (
                  <motion.span
                    key={'approveText'}
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
                      duration: 0.3,
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
