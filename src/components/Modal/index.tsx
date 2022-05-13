import React, { useEffect, useLayoutEffect, useRef } from 'react';

import { AnimatePresence, motion, Variants } from 'framer-motion';
import { Props } from 'framer-motion/types/types';

import { ResetContainer } from './../../styles';
import Portal from './../Portal';

import {
  Container,
  ModalContainer,
  PageContainer,
  InnerContainer,
  BackgroundOverlay,
  CloseButton,
  BackButton,
  InfoButton,
  TextWithHr,
} from './styles';

import useMeasure from 'react-use-measure';
import { RemoveScroll } from 'react-remove-scroll';
import { useContext } from '../FamilyKit';

const InfoIcon = (props: Props) => (
  <svg
    aria-hidden="true"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 11C20 15.9706 15.9706 20 11 20C6.02944 20 2 15.9706 2 11C2 6.02944 6.02944 2 11 2C15.9706 2 20 6.02944 20 11ZM22 11C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11ZM11.6445 12.7051C11.6445 13.1348 11.3223 13.4678 10.7744 13.4678C10.2266 13.4678 9.92578 13.1885 9.92578 12.6191V12.4795C9.92578 11.4268 10.4951 10.8574 11.2686 10.3203C12.2031 9.67578 12.665 9.32129 12.665 8.59082C12.665 7.76367 12.0205 7.21582 11.043 7.21582C10.3232 7.21582 9.80762 7.57031 9.45312 8.16113C9.38282 8.24242 9.32286 8.32101 9.2667 8.39461C9.04826 8.68087 8.88747 8.8916 8.40039 8.8916C8.0459 8.8916 7.66992 8.62305 7.66992 8.15039C7.66992 7.96777 7.70215 7.7959 7.75586 7.61328C8.05664 6.625 9.27051 5.75488 11.1182 5.75488C12.9336 5.75488 14.5234 6.71094 14.5234 8.50488C14.5234 9.7832 13.7822 10.417 12.7402 11.1045C11.999 11.5986 11.6445 11.9746 11.6445 12.5762V12.7051ZM11.9131 15.5625C11.9131 16.1855 11.376 16.6797 10.7529 16.6797C10.1299 16.6797 9.59277 16.1748 9.59277 15.5625C9.59277 14.9395 10.1191 14.4453 10.7529 14.4453C11.3867 14.4453 11.9131 14.9287 11.9131 15.5625Z"
      fill="currentColor"
    />
  </svg>
);

const CloseIcon = (props: Props) => (
  <motion.svg
    width={14}
    height={14}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1 13L13 1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M1 0.999999L13 13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </motion.svg>
);
const BackIcon = (props: Props) => (
  <motion.svg
    width={9}
    height={16}
    viewBox="0 0 9 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 1L1 8L8 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </motion.svg>
);

const containerVariants: Variants = {
  initial: {
    //willChange: 'transform,opacity',
    y: 5,
    opacity: 0,
    scale: 0.92,
  },
  animate: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.22,
      ease: [0.175, 0.885, 0.32, 0.98],
      delay: 0.05,
    },
  },
  exit: {
    y: 10,
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: 0.22,
      ease: [0.45, 0, 0.55, 1],
    },
  },
};

export const contentVariants: Variants = {
  initial: {
    //willChange: 'transform,opacity',
    zIndex: 2,
    opacity: 0,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.15,
      delay: 0.05,
    },
  },
  exit: {
    zIndex: 1,
    opacity: 0,
    pointerEvents: 'none',
    position: 'absolute',
    transition: { duration: 0.2 },
  },
};

type ModalProps = {
  open: boolean | undefined;
  pages: any;
  pageId: string;
  onClose: (e: any) => void;
  onBack?: (e: any) => void | undefined;
};
const Modal: React.FC<ModalProps> = ({
  open,
  pages,
  pageId,
  onClose,
  onBack,
}) => {
  const context = useContext();
  const heightRef = useRef<any>(null);
  const [contentRef, bounds] = useMeasure({ debounce: 0, offsetSize: true });

  const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  const refreshLayout = () => {
    if (!heightRef.current || bounds.height === 0) return;
    console.log('effect');
    heightRef.current.style.height = `${bounds.height}px`;
    heightRef.current.style.width = `${bounds.width}px`;
  };
  useIsomorphicLayoutEffect(refreshLayout, [bounds]);

  useEffect(() => {
    if (!open) return;
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose(e);
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <Portal>
          <RemoveScroll removeScrollBar={false}>
            <ResetContainer theme={context.theme}>
              <ModalContainer role="dialog" exit={{ pointerEvents: 'auto' }}>
                <BackgroundOverlay
                  onClick={onClose}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{ ease: 'easeOut', duration: 0.2 }}
                />
                <Container
                  initial={'initial'}
                  animate={'animate'}
                  exit={'exit'}
                  variants={containerVariants}
                >
                  <CloseButton aria-label="Close" onClick={onClose}>
                    <CloseIcon />
                  </CloseButton>
                  <AnimatePresence>
                    {onBack && (
                      <BackButton
                        aria-label="Back"
                        key="backButton"
                        onClick={onBack}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                      >
                        <BackIcon />
                      </BackButton>
                      /* ) : (
                    <InfoButton
                      aria-label="More information"
                      key="infoButton"
                      //onClick={onInfo}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      <InfoIcon />
                    </InfoButton>
                  */
                    )}
                  </AnimatePresence>
                  <InnerContainer ref={heightRef}>
                    <AnimatePresence>
                      {Object.keys(pages)
                        .filter((key) => key === pageId)
                        .map((key) => {
                          const page = pages[key];
                          return (
                            <PageContainer
                              ref={contentRef}
                              key={key}
                              initial={'initial'}
                              animate={'animate'}
                              exit={'exit'}
                              variants={contentVariants}
                            >
                              {page}
                            </PageContainer>
                          );
                        })}
                    </AnimatePresence>
                  </InnerContainer>
                </Container>
              </ModalContainer>
            </ResetContainer>
          </RemoveScroll>
        </Portal>
      )}
    </AnimatePresence>
  );
};

export const OrDivider = ({ text = 'or' }) => {
  return (
    <TextWithHr>
      <span>{text}</span>
    </TextWithHr>
  );
};

export default Modal;
