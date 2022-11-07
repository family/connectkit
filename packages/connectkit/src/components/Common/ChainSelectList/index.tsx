import React from 'react';

import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import supportedChains from '../../../constants/supportedChains';

import Alert from '../Alert';
import defaultTheme from '../../../constants/defaultTheme';

import { AnimatePresence, motion } from 'framer-motion';
import styled, { css } from 'styled-components';
import { isMobile } from '../../../utils';

import ChainIcons from '../../../assets/chains';
import localizations, { localize } from '../../../constants/localizations';
import { useContext } from '../../ConnectKit';

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
  background: var(--ck-body-background);
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
        color: var(--ck-body-color-muted);
        font-weight: bold;
        font-family: var(--ck-font-family);
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
const ChainButtonContainer = styled.div`
  position: relative;
  margin: -8px -8px;
  &:after {
    border-radius: var(--border-radius, 0);
    z-index: 2;
    content: '';
    pointer-events: none;
    position: absolute;
    inset: 0 2px;
    box-shadow: inset 0 16px 8px -12px var(--background, var(--ck-body-background)),
      inset 0 -16px 8px -12px var(--background, var(--ck-body-background));
  }
`;
const ChainButtons = styled(motion.div)`
  padding: 8px 8px 0;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 242px;

  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }

  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    padding: 8px 14px;
    margin: 2px -2px 0;
    max-height: 70vh;
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
  width: 100%;
  border-radius: 11px;
  margin: 0 0 1px;
  padding: 8px 0;
  padding-right: 154px;
  font-size: 15px;
  line-height: 18px;
  font-weight: 500;
  text-decoration: none;
  color: var(--ck-body-color);
  background: none;
  white-space: nowrap;
  transition: transform 100ms ease, background-color 100ms ease;
  transform: translateZ(0px);
  &:before {
    content: '';
    background: currentColor;
    position: absolute;
    z-index: -1;
    inset: 0 var(--ck-dropdown-active-inset, -8px);
    border-radius: var(--ck-dropdown-active-border-radius, 12px);
    opacity: 0;
    transition: opacity 180ms ease;
  }
  &:after {
    content: '';
    position: absolute;
    z-index: -1;
    inset: 0 -8px;
    border-radius: 12px;
    opacity: 0;
    transition: opacity 180ms ease;
    outline: 2px solid var(--ck-focus-color);
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
  &:focus-visible {
    outline: none !important;
    &:after {
      opacity: 1;
    }
  }
`;
const ChainButtonStatus = styled(motion.div)`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--ck-body-color-muted);
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
  position: absolute;
  z-index: -1;
  inset: 0 var(--ck-dropdown-active-inset, -8px);
  background: var(--ck-dropdown-active-background, rgba(26, 136, 248, 0.1));
  box-shadow var(--ck-dropdown-active-box-shadow);
  border-radius: var(--ck-dropdown-active-border-radius, 12px);
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
      fill="url(#paint0_linear_1288_18701)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_1288_18701"
        x1="2"
        y1="19.4884"
        x2="16.8752"
        y2="33.7485"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--ck-spinner-color)" />
        <stop offset="1" stopColor="var(--ck-spinner-color)" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

const ChainSelectList: React.FC = () => {
  const { connector } = useAccount();
  const { chain, chains } = useNetwork();
  const { isLoading, pendingChainId, switchNetwork } = useSwitchNetwork();

  const context = useContext();
  const warnings = localizations[context.lang].warnings;

  const mobile = isMobile();

  return (
    <SwitchNetworksContainer>
      <ChainButtonContainer>
        <ChainButtons>
          {chains.map((x) => {
            const c = supportedChains.find((ch) => ch.id === x.id);
            const ch = { ...c, ...x };
            return (
              <ChainButton
                key={`${ch?.id}-${ch?.name}`}
                disabled={
                  !switchNetwork ||
                  ch.id === chain?.id ||
                  (isLoading && pendingChainId === ch.id)
                }
                onClick={() => switchNetwork?.(ch.id)}
                style={{
                  opacity:
                    !switchNetwork && ch.id !== chain?.id ? 0.4 : undefined,
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 12,
                    color:
                      ch.id === chain?.id
                        ? 'var(--ck-dropdown-active-color, inherit)'
                        : 'inherit',
                  }}
                >
                  <ChainLogoContainer>
                    <ChainLogoSpinner
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: isLoading && pendingChainId === ch.id ? 1 : 0,
                      }}
                      transition={{
                        ease: [0.76, 0, 0.24, 1],
                        duration: 0.15,
                      }}
                    >
                      <motion.div
                        key={`${ch?.id}-${ch?.name}`}
                        animate={
                          // UI fix for Coinbase Wallet on mobile does not remove isLoading on rejection event
                          mobile &&
                          connector?.id === 'coinbaseWallet' &&
                          isLoading &&
                          pendingChainId === ch.id
                            ? {
                                opacity: [1, 0],

                                transition: { delay: 4, duration: 3 },
                              }
                            : { opacity: 1 }
                        }
                      >
                        {Spinner}
                      </motion.div>
                    </ChainLogoSpinner>
                    <ChainIcon>
                      {ch.logo ?? <ChainIcons.UnknownChain />}
                    </ChainIcon>
                  </ChainLogoContainer>
                  {ch.name}
                </span>
                <ChainButtonStatus>
                  <AnimatePresence initial={false} exitBeforeEnter>
                    {ch.id === chain?.id && (
                      <motion.span
                        key={'connectedText'}
                        style={{
                          color:
                            'var(--ck-dropdown-active-color, var(--ck-focus-color))',
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
                    {isLoading && pendingChainId === ch.id && (
                      <motion.span
                        key={'approveText'}
                        style={{
                          color: 'var(--ck-dropdown-pending-color, inherit)',
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
                        <motion.span
                          animate={
                            // UI fix for Coinbase Wallet on mobile does not remove isLoading on rejection event
                            mobile &&
                            connector?.id === 'coinbaseWallet' && {
                              opacity: [1, 0],
                              transition: { delay: 4, duration: 4 },
                            }
                          }
                        >
                          Approve in Wallet
                        </motion.span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </ChainButtonStatus>
                {
                  //hover === ch.name && (
                  ch.id === chain?.id && (
                    <ChainButtonBg
                      layoutId="activeChain"
                      layout="position"
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
      </ChainButtonContainer>
      {!switchNetwork && (
        <Alert>
          {localize(warnings.walletSwitchingUnsupported)}{' '}
          {localize(warnings.walletSwitchingUnsupportedResolve)}
        </Alert>
      )}
    </SwitchNetworksContainer>
  );
};

export default ChainSelectList;
