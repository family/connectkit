import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import Portal from './Portal';
import useMeasure from 'react-use-measure';
import { ResetContainer } from '../styles';
import { useContext } from './FamilyKit';

type tooltipSize = 'small' | 'large';

const TooltipWindow = styled(motion.div)`
  z-index: 2147483647;
  position: fixed;
  inset: 0;
  pointer-events: none;
`;
const TooltipContainer = styled(motion.div)<{ $size: tooltipSize }>`
  --shadow: 0px 2px 10px rgba(0, 0, 0, 0.08);
  z-index: 2147483647;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  gap: 8px;
  width: fit-content;
  max-width: 268px;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => (props.$size === 'small' ? 11 : 14)}px;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 19px;
  font-weight: 500;
  color: var(--tooltip-color);
  background: var(--tooltip-body);
  box-shadow: var(--shadow);
  > span {
    z-index: 3;
    position: relative;
  }
  > div {
    margin: -4px 0; // offset for icon
  }
`;

const TooltipTail = styled(motion.div)<{ $size: tooltipSize }>`
  z-index: 2;
  position: absolute;
  width: ${(props) => (props.$size === 'small' ? 14 : 18)}px;
  height: ${(props) => (props.$size === 'small' ? 14 : 18)}px;
  background: inherit;
  margin: 0;
  border-radius: ${(props) => (props.$size === 'small' ? 2 : 3)}px 0 0 0;
  right: 100%;
  margin: 0 !important;
  top: 50%;
  transform: translate(75%, -50%) rotate(-45deg);
`;

type TooltipProps = {
  message?: string | React.ReactNode;
  children?: React.ReactNode;
  open?: boolean;
  xOffset?: number;
  yOffset?: number;
};

const Tooltip: React.FC<TooltipProps> = ({
  children,
  message,
  open,
  xOffset = 0,
  yOffset = 0,
}) => {
  const context = useContext();
  const [isOpen, setIsOpen] = useState(false);
  const [size, setSize] = useState<tooltipSize>('small');

  const [ready, setReady] = useState(false);

  const targetRef = useRef<any>(null);
  const [ref, bounds] = useMeasure({
    debounce: !ready ? 220 : 0, // fix alignment initial state
    offsetSize: true,
  });

  const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  const refreshLayout = () => {
    if (!targetRef.current || bounds.height === 0) return;
    const x = xOffset + bounds.left + bounds.width;
    const y = yOffset + bounds.top + bounds.height * 0.5;
    if (!ready && x !== 0 && y !== 0) setReady(true);
    targetRef.current.style.left = `${x}px`;
    targetRef.current.style.top = `${y}px`;
    setSize(targetRef.current.offsetHeight <= 40 ? 'small' : 'large');
  };
  useIsomorphicLayoutEffect(refreshLayout, [bounds, open, isOpen]);

  return (
    <>
      <motion.div
        ref={ref}
        onHoverStart={() => setIsOpen(true)}
        onHoverEnd={() => setIsOpen(false)}
        onTap={() => setIsOpen(false)}
      >
        {children}
      </motion.div>
      <Portal>
        <AnimatePresence>
          {context.open && (open !== undefined ? open : isOpen) && (
            <ResetContainer theme={context.theme}>
              <TooltipWindow>
                <TooltipContainer
                  $size={size}
                  ref={targetRef}
                  initial={'collapsed'}
                  animate={ready ? 'open' : {}}
                  exit={'collapsed'}
                  variants={{
                    collapsed: {
                      transformOrigin: '20px 50%',
                      opacity: 0,
                      scale: 0.9,
                      z: 0.01,
                      y: '-50%',
                      x: 20,
                      transition: {
                        duration: 0.1,
                      },
                    },
                    open: {
                      willChange: 'opacity,transform',
                      opacity: 1,
                      scale: 1,
                      z: 0.01,
                      y: '-50%',
                      x: 20,
                      transition: {
                        ease: [0.76, 0, 0.24, 1],
                        duration: 0.15,
                        delay: 1.25,
                      },
                    },
                  }}
                >
                  {message}
                  <TooltipTail $size={size} />
                </TooltipContainer>
              </TooltipWindow>
            </ResetContainer>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
};
export default Tooltip;
