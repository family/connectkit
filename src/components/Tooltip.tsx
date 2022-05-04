import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import Portal from './Portal';
import useMeasure from 'react-use-measure';
import { ResetContainer } from '../styles';

const TooltipWindow = styled(motion.div)`
  z-index: 2147483647;
  position: fixed;
  inset: 0;
  pointer-events: none;
`;
const TooltipContainer = styled(motion.div)`
  --shadow: 0px 4px 15px rgba(0, 0, 0, 0.14);
  pointer-events: auto;
  z-index: 2147483647;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: auto;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  padding: 14px 18px;
  font-size: 16px;
  line-height: 19px;
  font-weight: 500;
  color: var(--tooltip-color);
  background: var(--tooltip-body);
  box-shadow: var(--shadow);
`;

const TooltipTail = styled(motion.div)<{ position?: string }>`
  z-index: 2;
  position: absolute;
  width: 12px;
  height: 12px;
  background: inherit;
  border-radius: 3px 0 0 0;
  right: 100%;
  top: 50%;
  transform: translate(50%, -50%) rotate(-45deg);
`;

type TooltipProps = {
  message?: string | React.ReactNode;
  children?: React.ReactNode;
};

const Tooltip: React.FC<TooltipProps> = ({ children, message }) => {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const targetRef = useRef<any>(null);
  const [ref, bounds] = useMeasure({ debounce: 220, offsetSize: true });

  const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  const refreshLayout = () => {
    if (!targetRef.current || bounds.height === 0) return;
    const x = bounds.left + bounds.width;
    const y = bounds.top + bounds.height * 0.5;
    if (!ready && x !== 0 && y !== 0) setReady(true);
    targetRef.current.style.left = `${x}px`;
    targetRef.current.style.top = `${y}px`;
  };
  useIsomorphicLayoutEffect(refreshLayout, [bounds, open]);

  return (
    <>
      <motion.div
        ref={ref}
        onHoverStart={() => setOpen(true)}
        onHoverEnd={() => setOpen(false)}
        onTap={() => setOpen(false)}
      >
        {children}
      </motion.div>
      <Portal>
        <AnimatePresence>
          {open && (
            <ResetContainer>
              <TooltipWindow>
                <TooltipContainer
                  ref={targetRef}
                  initial={'collapsed'}
                  animate={ready ? 'open' : {}}
                  exit={'collapsed'}
                  variants={{
                    collapsed: {
                      opacity: 0,
                      scale: 0.9,
                      z: 0.01,
                      y: '-50%',
                      x: 8,
                      transition: {
                        delay: 0.025,
                        duration: 0.1,
                      },
                    },
                    open: {
                      willChange: 'opacity,transform',
                      opacity: 1,
                      scale: 1,
                      z: 0.01,
                      y: '-50%',
                      x: 18,
                      transition: {
                        ease: [0.76, 0, 0.24, 1],
                        duration: 0.1,
                      },
                    },
                  }}
                >
                  {message}
                  <TooltipTail />
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
