import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { useContext } from '../ConnectKit';

import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';

import { useNetwork } from 'wagmi';
import useMeasure from 'react-use-measure';
import Portal from '../Common/Portal';
import { ResetContainer } from '../../styles';
import supportedChains from '../../constants/supportedChains';

const Container = styled(motion.div)``;

const DropdownWindow = styled(motion.div)`
  z-index: 2147483647;
  position: fixed;
  inset: 0;
`;
const DropdownOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
`;
const DropdownContainer = styled(motion.div)`
  pointer-events: auto;
  --shadow: 0px 2px 15px rgba(0, 0, 0, 0.15);
  z-index: 2147483647;
  position: absolute;
  top: 0;
  left: 0;
  min-width: 292px;
  border-radius: 12px;
  padding: 14px 20px 8px 16px;
  color: var(--tooltip-color);
  background: var(--tooltip-body);
  box-shadow: var(--shadow);
`;
const DropdownHeading = styled(motion.div)`
  padding: 0 0 6px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  user-select: none;
`;

const SwitchChainButton = styled(motion.button)`
  --background: var(--body-background-secondary);
  appearance: none;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 15px;
  width: 52px;
  height: 30px;
  padding: 2px 6px 2px 3px;
  font-size: 16px;
  line-height: 19px;
  font-weight: 500;
  text-decoration: none;
  color: var(--body-color-muted);
  background: var(--background);
  white-space: nowrap;
  transition: transform 100ms ease, background-color 100ms ease;
  transform: translateZ(0px);
  svg {
    position: relative;
    display: block;
  }

  &:hover {
    --background: var(--body-background-secondary-hover);
  }
  &:active {
    //transform: scale(0.96) translateZ(0px);
  }
`;
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

const ChevronDown = ({ ...props }) => (
  <svg
    aria-hidden="true"
    width="11"
    height="6"
    viewBox="0 0 11 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1.5 1L5.5 5L9.5 1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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

const ChainSelector: React.FC = () => {
  const context = useContext();
  const [isOpen, setIsOpen] = useState(false);
  const [hover, setHover] = useState('');
  const {
    activeChain,
    chains,
    error,
    isLoading,
    pendingChainId,
    switchNetwork,
  } = useNetwork();

  const targetRef = useRef<any>(null);
  const [ref, bounds] = useMeasure({
    offsetSize: true,
  });

  const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  const refreshLayout = () => {
    if (
      !targetRef.current ||
      bounds.top +
        bounds.bottom +
        bounds.left +
        bounds.right +
        bounds.height +
        bounds.width ===
        0
    )
      return;
    const x = -12 + bounds.left;
    const y = 10 + bounds.top + bounds.height;
    targetRef.current.style.left = `${x}px`;
    targetRef.current.style.top = `${y}px`;
  };
  useIsomorphicLayoutEffect(refreshLayout, [bounds, isOpen]);

  return (
    <>
      <Container>
        <SwitchChainButton
          ref={ref}
          aria-label="Change Network"
          onTap={() => setIsOpen(!isOpen)}
        >
          <ChainIcon>
            {chains
              .filter((x) => x.id === activeChain?.id)
              .map((x, i) => {
                const chain = supportedChains.filter((c) => c.id === x.id)[0];
                return <React.Fragment key={i}>{chain.logo}</React.Fragment>;
              })}
          </ChainIcon>
          <ChevronDown style={{ top: 1, left: -3 }} />
        </SwitchChainButton>
      </Container>
      <Portal>
        <AnimatePresence>
          {context.open && isOpen && (
            <ResetContainer theme={context.theme}>
              <DropdownWindow>
                <DropdownOverlay onClick={() => setIsOpen(false)} />
                <DropdownContainer
                  ref={targetRef}
                  initial={'collapsed'}
                  animate={'open'}
                  exit={'collapsed'}
                  variants={{
                    collapsed: {
                      transformOrigin: '0 0',
                      opacity: 0,
                      scale: 0.96,
                      z: 0.01,
                      y: -4,
                      x: 0,
                      transition: {
                        duration: 0.1,
                      },
                    },
                    open: {
                      transformOrigin: '0 0',
                      willChange: 'opacity,transform',
                      opacity: 1,
                      scale: 1,
                      z: 0.01,
                      y: 0,
                      x: 0,
                      transition: {
                        ease: [0.76, 0, 0.24, 1],
                        duration: 0.15,
                      },
                    },
                  }}
                >
                  <DropdownHeading>Switch Networks</DropdownHeading>
                  <ChainButtons>
                    {chains.map((x) => {
                      const chain = supportedChains.filter(
                        (c) => c.id === x.id
                      )[0];
                      return (
                        <ChainButton
                          disabled={
                            !switchNetwork ||
                            x.id === activeChain?.id ||
                            (isLoading && pendingChainId === x.id)
                          }
                          key={x.id}
                          onHoverStart={() => setHover(x.name)}
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
                                  opacity:
                                    isLoading && pendingChainId === x.id
                                      ? 1
                                      : 0,
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
                            <AnimatePresence exitBeforeEnter initial={false}>
                              {x.id === activeChain?.id && (
                                <motion.span
                                  style={{
                                    color: 'var(--focus-color)',
                                    display: 'block',
                                    position: 'relative',
                                  }}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{
                                    opacity: 0,
                                    scale: 0.8,
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
                                    scale: 0.8,
                                  }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
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
                  {/*<div>{error && error.message}</div>*/}
                </DropdownContainer>
              </DropdownWindow>
            </ResetContainer>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
};

export default ChainSelector;
