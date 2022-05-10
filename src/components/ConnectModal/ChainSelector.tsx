import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { useContext } from './../FamilyKit';

import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';

import { useNetwork } from 'wagmi';
import useMeasure from 'react-use-measure';
import Portal from '../Portal';
import { ResetContainer } from '../../styles';
import ChainIcons from '../../assets/chains';
import supportedChains from '../../constants/supportedChains';

const Container = styled(motion.div)``;

const DropdownWindow = styled(motion.div)`
  z-index: 2147483647;
  position: fixed;
  inset: 0;
  pointer-events: none;
`;
const DropdownContainer = styled(motion.div)`
  pointer-events: auto;
  --shadow: 0px 2px 10px rgba(0, 0, 0, 0.08);
  z-index: 2147483647;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 15px;
  line-height: 18px;
  font-weight: 400;
  color: var(--tooltip-color);
  background: var(--tooltip-body);
  box-shadow: var(--shadow);
`;

const SwitchChainButton = styled(motion.button)`
  --background: var(--body-background-secondary);
  appearance: none;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  width: 52px;
  height: 30px;
  padding: 2px 6px 2px 2px;
  font-size: 16px;
  line-height: 19px;
  font-weight: 500;
  text-decoration: none;
  color: var(--body-color-muted);
  background: var(--background);
  white-space: nowrap;
  transition: transform 100ms ease, background-color 100ms ease;
  svg {
    position: relative;
  }

  &:hover {
    --background: var(--body-background-secondary-hover);
  }
  &:active {
    transform: scale(0.9);
  }
`;
const ChainIcon = styled(motion.div)`
  display: block;
  position: relative;
  margin: 0 4px 0 0;
  border-radius: 12px;
  width: 24px;
  height: 24px;
  background: var(--body-background);
  svg {
    width: 100%;
    height: auto;
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
  margin: 6px 0 0;
  padding: 8px 0;
  font-size: 15px;
  line-height: 17px;
  font-weight: 500;
  text-decoration: none;
  color: var(--body-color);
  background: none;
  white-space: nowrap;
  transition: transform 100ms ease, background-color 100ms ease;
  span:first-child {
  }
  span:last-child {
    color: var(--body-color-muted);
  }
  &:active {
    transform: scale(0.98);
  }
`;
const ChainButtonBg = styled(motion.div)`
  z-index: -1;
  background: var(--body-background-secondary-hover);
  position: absolute;
  inset: 0 -8px;
  border-radius: 12px;
`;

const ChevronDown = ({ ...props }) => (
  <svg
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
    debounce: 0,
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
    const x = -10 + bounds.left;
    const y = 8 + bounds.top + bounds.height;
    targetRef.current.style.left = `${x}px`;
    targetRef.current.style.top = `${y}px`;
  };
  useIsomorphicLayoutEffect(refreshLayout, [bounds, isOpen]);

  return (
    <>
      <Container>
        <SwitchChainButton ref={ref} onTap={() => setIsOpen(!isOpen)}>
          <ChainIcon>{ChainIcons.Ethereum}</ChainIcon>
          <ChevronDown style={{ top: 1, left: -1 }} />
        </SwitchChainButton>
      </Container>
      <Portal>
        <AnimatePresence>
          {context.open && isOpen && (
            <ResetContainer theme={context.theme}>
              <DropdownWindow>
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
                  Switch Networks (WIP)
                  {chains.map((x) => {
                    const chain = supportedChains.filter(
                      (c) => c.id === x.id
                    )[0];
                    return (
                      <ChainButton
                        disabled={!switchNetwork || x.id === activeChain?.id}
                        key={x.id}
                        onHoverStart={() => setHover(x.name)}
                        onClick={() => switchNetwork?.(x.id)}
                      >
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                          }}
                        >
                          <ChainIcon>{chain.logo}</ChainIcon>
                          {x.name}
                        </span>
                        <span>
                          {isLoading &&
                            pendingChainId === x.id &&
                            ' Approve in Wallet'}
                          {x.id === activeChain?.id && ' Connected'}
                        </span>
                        {hover === x.name && (
                          <ChainButtonBg
                            layoutId="hover"
                            transition={{
                              duration: 0.15,
                              type: 'spring',
                            }}
                          />
                        )}
                      </ChainButton>
                    );
                  })}
                  <div>{error && error.message}</div>
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
