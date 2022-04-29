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
  TextWithHr,
} from './styles';

import useMeasure from 'react-use-measure';

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
      stroke="#999999"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M1 0.999999L13 13"
      stroke="#999999"
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
      stroke="#999999"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </motion.svg>
);

const containerVariants: Variants = {
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      ease: [0.16, 1, 0.3, 1],
      duration: 0.4,
      delay: 0.05,
    },
  },
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: {
      ease: [0.16, 1, 0.3, 1],
      duration: 0.3,
    },
  },
};

const contentVariants: Variants = {
  initial: {
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
  theme?: string;
  open: boolean | undefined;
  pages: any;
  pageId: string | undefined;
  onClose: (e: any) => void;
  onBack?: (e: any) => void | undefined;
};
const Modal: React.FC<ModalProps> = ({
  theme,
  open,
  pages,
  pageId,
  onClose,
  onBack,
}) => {
  const heightRef = useRef<any>(null);
  const [contentRef, bounds] = useMeasure({ debounce: 55, offsetSize: true });

  const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  const refreshLayout = () => {
    if (!heightRef.current || bounds.height === 0) return;
    heightRef.current.style.height = `${bounds.height}px`;
    heightRef.current.style.width = `${bounds.width}px`;
  };
  useIsomorphicLayoutEffect(refreshLayout, [bounds]);

  useEffect(() => {
    function listener(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === 'Escape') onClose(e);
    }
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <Portal>
          <ResetContainer theme={theme}>
            <ModalContainer exit={{ pointerEvents: 'auto' }}>
              <BackgroundOverlay
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: {
                    ease: [0.16, 1, 0.3, 1],
                    duration: 0.4,
                  },
                }}
                exit={{
                  opacity: 0,
                  transition: {
                    ease: 'linear',
                    duration: 0.3,
                  },
                }}
              />
              <Container
                initial={'hidden'}
                animate={'visible'}
                exit={'hidden'}
                variants={containerVariants}
              >
                <CloseButton onClick={onClose}>
                  <CloseIcon />
                </CloseButton>
                <AnimatePresence>
                  {onBack && (
                    <BackButton
                      onClick={onBack}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.05 }}
                    >
                      <BackIcon />
                    </BackButton>
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
        </Portal>
      )}
    </AnimatePresence>
  );
};

export const OrDivider = () => {
  return (
    <TextWithHr>
      <span>or</span>
    </TextWithHr>
  );
};

export default Modal;
