import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useContext } from './../../ConnectKit';

import useMeasure from 'react-use-measure';

import ChainSelectList from './../ChainSelectList';

import Portal from './../Portal';
import { ResetContainer } from './../../../styles';

import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { useThemeContext } from './../../ConnectKitThemeProvider/ConnectKitThemeProvider';
import FocusTrap from './../../../hooks/useFocusTrap';
import useLockBodyScroll from './../../../hooks/useLockBodyScroll';

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
  --shadow: 0px 2px 15px rgba(0, 0, 0, 0.15);
  --background: var(--ck-dropdown-background, var(--ck-tooltip-background));
  --border-radius: var(
    --ck-dropdown-border-radius,
    var(--ck-tooltip-border-radius, 12px)
  );

  pointer-events: auto;
  z-index: 2147483647;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: fit-content;
  padding: 14px 16px 16px;
  color: var(--ck-dropdown-color, var(--ck-tooltip-color));
  background: var(--background);
  box-shadow: var(
    --ck-dropdown-box-shadow,
    var(--ck-tooltip-shadow, var(--shadow))
  );
  border-radius: var(--border-radius);
`;
const DropdownHeading = styled(motion.div)`
  padding: 0 0 6px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  user-select: none;
  color: var(--ck-dropdown-color, var(--ck-tooltip-color));
`;

const ChainSelectDropdown: React.FC<{
  children?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  offsetX?: number;
  offsetY?: number;
}> = ({ children, open, onClose, offsetX = 0, offsetY = 8 }) => {
  const context = useContext();
  const themeContext = useThemeContext();

  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useLockBodyScroll(open);

  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') onClose();

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (!contentRef.current) return;
        e.preventDefault();

        const focusableEls: any = contentRef.current?.querySelectorAll(`
            a[href]:not(:disabled),
            button:not(:disabled),
            textarea:not(:disabled),
            input[type="text"]:not(:disabled),
            input[type="radio"]:not(:disabled),
            input[type="checkbox"]:not(:disabled),
            select:not(:disabled)
          `),
          firstFocusableEl: any = focusableEls[0],
          lastFocusableEl: any = focusableEls[focusableEls.length - 1];

        if (e.key === 'ArrowUp') {
          if (document.activeElement === firstFocusableEl) {
            lastFocusableEl.focus();
          } else {
            let focusItem: any = document?.activeElement?.previousSibling;
            if (!focusItem) focusItem = lastFocusableEl;
            while (focusItem.disabled) focusItem = focusItem.previousSibling;
            focusItem.focus();
          }
        } else {
          if (document.activeElement === lastFocusableEl) {
            firstFocusableEl.focus();
          } else {
            let focusItem: any = document?.activeElement?.nextSibling;
            if (!focusItem) focusItem = firstFocusableEl;
            while (focusItem.disabled) focusItem = focusItem.nextSibling;
            focusItem.focus();
          }
        }
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [open]);

  const targetRef = useRef<any>(null);
  const innerRef = useCallback(
    (node: any) => {
      if (!node) return;
      targetRef.current = node;
      refresh();
    },
    [open]
  );
  const [ref, bounds] = useMeasure({
    debounce: 120, // waits until modal transition has finished before measuring
    offsetSize: true,
    scroll: true,
  });

  const refresh = () => {
    if (
      !targetRef.current ||
      bounds.top +
        bounds.bottom +
        bounds.left +
        bounds.right +
        bounds.height +
        bounds.width ===
        0
    ) {
      return;
    }

    let x = bounds.left + offsetX;
    let y = bounds.top + bounds.height + offsetY;

    targetRef.current.style.left = `${x}px`;
    targetRef.current.style.top = `${y}px`;

    /*
    const contentRect = targetRef.current.getBoundingClientRect();

    const w = contentRect.width;
    const h = contentRect.height;

    if (x + w > window.innerWidth) {
      x = bounds.left + bounds.width - contentRect.width - offsetX;
    }
    if (y + h > window.innerHeight - 24) {
      y = bounds.top - contentRect.height - offsetY;
    }

    setOffset({
      x: x,
      y: y,
    });
    */
  };

  const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;
  useIsomorphicLayoutEffect(refresh, [targetRef.current, bounds, open]);

  useEffect(refresh, [open, targetRef.current]);

  const onScroll = onClose;
  const onResize = onClose;
  useEffect(() => {
    refresh();
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      <div ref={ref}>{children}</div>
      <AnimatePresence>
        {open && (
          <Portal>
            <ResetContainer
              $useTheme={themeContext.theme ?? context.theme}
              $useMode={themeContext.mode ?? context.mode}
              $customTheme={themeContext.customTheme ?? context.customTheme}
            >
              <FocusTrap>
                <DropdownWindow ref={contentRef}>
                  <DropdownOverlay onClick={onClose} />
                  <DropdownContainer
                    ref={innerRef}
                    style={{
                      left: offset.x,
                      top: offset.y,
                    }}
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
                    <ChainSelectList />
                  </DropdownContainer>
                </DropdownWindow>
              </FocusTrap>
            </ResetContainer>
          </Portal>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChainSelectDropdown;
