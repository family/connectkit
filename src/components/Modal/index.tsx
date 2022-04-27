import React, { useEffect, useLayoutEffect, useRef } from 'react';

import { AnimatePresence, motion, Variants } from 'framer-motion';
import { Props } from 'framer-motion/types/types';

import { ResetContainer } from './../../styles';
import Portal from './../Portal';

import {
  Container,
  ModalContainer,
  CloseButton,
  PageContainer,
  InnerContainer,
  BackgroundOverlay,
} from './styles';

const CloseIcon = (props: Props) => (
  <motion.svg
    width={11}
    height={11}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.707 1.707A1 1 0 0 0 9.293.293L5.5 4.086 1.707.293A1 1 0 0 0 .293 1.707L4.086 5.5.293 9.293a1 1 0 1 0 1.414 1.414L5.5 6.914l3.793 3.793a1 1 0 0 0 1.414-1.414L6.914 5.5l3.793-3.793Z"
      fill="#3A3E51"
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
  onClose: (e: any) => void;
  pageId: string | undefined;
};
const Modal: React.FC<ModalProps> = ({ children, open, onClose, pageId }) => {
  const heightRef = useRef<any>(null);
  const listRef = useRef<any>(null);

  const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  const refreshLayout = () => {
    if (!listRef.current || !heightRef.current) return;

    const height = listRef.current.offsetHeight;
    const width = listRef.current.offsetWidth;
    heightRef.current.style.height = `${height}px`;
    heightRef.current.style.width = `${width}px`;
  };

  useIsomorphicLayoutEffect(refreshLayout, [open, children]);

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
          <ModalContainer>
            <BackgroundOverlay
              onClick={onClose}
              initial={'hidden'}
              animate={'visible'}
              exit={'hidden'}
              variants={overlayVariants}
            />
            <ResetContainer>
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
