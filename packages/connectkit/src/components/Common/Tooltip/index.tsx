import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useContext } from '../../ConnectKit';
import useMeasure from 'react-use-measure';

import { TooltipProps, TooltipSizeProps } from './types';
import { TooltipWindow, TooltipContainer, TooltipTail } from './styles';

import { AnimatePresence, motion } from 'framer-motion';
import { ResetContainer } from '../../../styles';
import Portal from '../Portal';
import { useThemeContext } from '../../ConnectKitThemeProvider/ConnectKitThemeProvider';

const Tooltip: React.FC<TooltipProps> = ({
  children,
  message,
  open,
  xOffset = 0,
  yOffset = 0,
  delay,
}) => {
  const context = useContext();
  const themeContext = useThemeContext();

  if (context.options?.hideTooltips) return <>{children}</>;

  const [isOpen, setIsOpen] = useState(false);
  const [outOfBounds, setOutOfBounds] = useState(false);
  const [size, setSize] = useState<TooltipSizeProps>('small');

  const [ready, setReady] = useState(false);

  const [currentRoute] = useState(context.route);

  const targetRef = useRef<any>(null);
  const [ref, bounds] = useMeasure({
    debounce: !ready ? 220 : 0, // fix alignment initial state
    offsetSize: true,
    scroll: true,
  });

  const checkBounds = () => {
    let flag = false;
    const x = xOffset + bounds.left + bounds.width;
    const y = yOffset + bounds.top + bounds.height * 0.5;
    if (x > window.innerWidth || x < 0 || y > window.innerHeight || y < 0) {
      flag = true;
    }
    return flag;
  };

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
    const x = xOffset + bounds.left + bounds.width;
    const y = yOffset + bounds.top + bounds.height * 0.5;
    if (!ready && x !== 0 && y !== 0) setReady(true);
    targetRef.current.style.left = `${x}px`;
    targetRef.current.style.top = `${y}px`;
    setSize(targetRef.current.offsetHeight <= 40 ? 'small' : 'large');
    setOutOfBounds(checkBounds());
  };
  useIsomorphicLayoutEffect(refreshLayout, [bounds, open, isOpen]);

  useEffect(() => {
    if (!context.open) setIsOpen(false);
  }, [context.open]);

  useEffect(() => {
    setIsOpen(!!open);
  }, [open]);

  return (
    <>
      <motion.div
        ref={ref}
        style={
          open === undefined
            ? {
                cursor: 'help',
              }
            : {}
        }
        onHoverStart={() => setIsOpen(true)}
        onHoverEnd={() => setIsOpen(false)}
        onClick={() => setIsOpen(false)}
      >
        {children}
      </motion.div>
      <Portal>
        <AnimatePresence>
          {currentRoute === context.route && !outOfBounds && isOpen && (
            <ResetContainer
              $useTheme={themeContext.theme}
              $useMode={themeContext.mode}
              $customTheme={themeContext.customTheme}
            >
              <TooltipWindow>
                <TooltipContainer
                  role="tooltip"
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
                        delay: delay ? delay : 0.5,
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
