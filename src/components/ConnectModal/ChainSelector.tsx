import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { routes, useContext } from '../ConnectKit';

import { useNetwork } from 'wagmi';
import supportedChains from '../../constants/supportedChains';

import useMeasure from 'react-use-measure';
import { isMobile } from '../../utils';

import SwitchNetworksList from './SwitchNetworksList';

import Portal from '../Common/Portal';
import { ResetContainer } from '../../styles';

import styled, { css } from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import Tooltip from '../Common/Tooltip';
import defaultTheme from '../../constants/defaultTheme';

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
  width: 100%;
  max-width: 292px;
  border-radius: 12px;
  padding: 14px 16px 8px;
  color: var(--tooltip-color);
  background: var(--tooltip-background);
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
  --background: var(--tooltip-background-secondary);
  --shadow: 0 0 0 1px rgba(0, 0, 0, 0.01), 0px 0px 7px rgba(0, 0, 0, 0.05);
  appearance: none;
  user-select: none;
  position: relative;
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
  box-shadow: var(--shadow);
  svg {
    position: relative;
    display: block;
  }

  ${(props) =>
    props.disabled
      ? css`
          width: auto;
          padding: 3px;
          position: relative;
          left: -22px;
        `
      : css`
          cursor: pointer;
          &:hover {
            --background: var(--body-background-secondary-hover);
          }
          &:active {
            //transform: scale(0.96) translateZ(0px);
          }
        `}
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
  color: var(--body-color-muted);
  svg {
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
        font-weight: bold;
        font-family: var(--font-family);
      }
    `}
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

const ChainSelector: React.FC = () => {
  const context = useContext();
  const [isOpen, setIsOpen] = useState(false);
  const { activeChain, chains } = useNetwork();

  const mobile = isMobile() || window?.innerWidth < defaultTheme.mobileWidth;

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
    const y = 9 + bounds.top + bounds.height;
    targetRef.current.style.left = `${x}px`;
    targetRef.current.style.top = `${y}px`;
  };
  useIsomorphicLayoutEffect(refreshLayout, [bounds, isOpen]);

  const disabled = chains.length <= 1;
  const ChainSelectorButton = (
    <ChainIcon
      $empty={chains.filter((x) => x.id === activeChain?.id).length === 0}
    >
      <AnimatePresence initial={false}>
        {chains
          .filter((x) => x.id === activeChain?.id)
          .map((x, i) => {
            const chain = supportedChains.filter((c) => c.id === x.id)[0];
            return (
              <motion.div
                key={chain.id}
                style={{
                  position: 'absolute',
                  inset: 0,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {chain.logo}
              </motion.div>
            );
          })}
      </AnimatePresence>
    </ChainIcon>
  );

  return (
    <>
      <Container>
        <SwitchChainButton
          ref={ref}
          aria-label="Change Network"
          disabled={disabled}
          onClick={() => {
            if (mobile) {
              context.setRoute(routes.SWITCHNETWORKS);
            } else {
              setIsOpen(!isOpen);
            }
          }}
        >
          {disabled ? (
            <Tooltip message={`${activeChain?.name} Network`} xOffset={-6}>
              {ChainSelectorButton}
            </Tooltip>
          ) : (
            ChainSelectorButton
          )}
          {!disabled && <ChevronDown style={{ top: 1, left: -3 }} />}
        </SwitchChainButton>
      </Container>
      <Portal>
        <AnimatePresence>
          {!mobile && context.open && isOpen && (
            <ResetContainer
              $useTheme={context.theme}
              $customTheme={context.customTheme}
            >
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
                  <SwitchNetworksList />
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
