import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useContext } from './../FamilyKit';

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
} from './styles';

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
      stroke-width="2"
      stroke-linecap="round"
    />
    <path
      d="M1 0.999999L13 13"
      stroke="#999999"
      stroke-width="2"
      stroke-linecap="round"
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

const overlayVariants: Variants = {
  hidden: {
    opacity: 0,
    pointerEvents: 'none',
    transition: {
      ease: [0.16, 1, 0.3, 1],
      duration: 0.05,
    },
  },
  visible: {
    opacity: 1,
    pointerEvents: 'auto',
    transition: {
      ease: [0.16, 1, 0.3, 1],
      duration: 0.22,
    },
  },
};

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    pointerEvents: 'none',
    transition: {
      ease: [0.16, 1, 0.3, 1],
      duration: 0.3,
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    pointerEvents: 'auto',
    transition: {
      ease: [0.16, 1, 0.3, 1],
      duration: 0.4,
      delay: 0.05,
    },
  },
};

type ModalProps = {
  children: React.ReactNode;
  open: boolean | undefined;
  pageId: string | undefined;
  onClose: (e: any) => void;
  onBack?: (e: any) => void | undefined;
};
const Modal: React.FC<ModalProps> = ({
  children,
  open,
  pageId,
  onClose,
  onBack,
}) => {
  const context = useContext();

  const heightRef = useRef<any>(null);
  const listRef = useRef<any>(null);

  const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  const refreshLayout = () => {
    console.log(listRef, heightRef);
    if (!listRef.current || !heightRef.current) return;

    const height = listRef.current.offsetHeight;
    const width = listRef.current.offsetWidth;
    heightRef.current.style.height = `${height}px`;
    heightRef.current.style.width = `${width}px`;
    console.log(width, height);
  };

  useIsomorphicLayoutEffect(refreshLayout, [open, children]);

  useEffect(() => {
    function listener(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === 'Escape') onClose(e);
    }
    document.addEventListener('keydown', listener);
    window.addEventListener('resize', refreshLayout);
    return () => {
      document.removeEventListener('keydown', listener);
      window.removeEventListener('resize', refreshLayout);
    };
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <Portal>
          <ModalContainer>
            <ResetContainer>
              <BackgroundOverlay
                onClick={onClose}
                initial={'hidden'}
                animate={'visible'}
                exit={'hidden'}
                variants={overlayVariants}
              />
              <Container
                initial={'hidden'}
                animate={'visible'}
                exit={'hidden'}
                onAnimationComplete={refreshLayout}
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
                    <PageContainer
                      key={pageId}
                      ref={listRef}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{
                        opacity: 0,
                        position: 'absolute',
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                    >
                      {children}
                    </PageContainer>
                  </AnimatePresence>
                </InnerContainer>
              </Container>
            </ResetContainer>
          </ModalContainer>
        </Portal>
      )}
    </AnimatePresence>
  );
};

export default Modal;
