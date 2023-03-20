import { InnerContainer, PageContainer, PageContents } from './styles';
import { router } from '../../ConnectKit';
import { signal } from '@preact/signals-react';
import { useEffect, useRef, useState } from 'react';
import styled from '../../../styles/styled';
import {
  AnimatePresence,
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import defaultTheme from '../../../constants/defaultTheme';
import useTransition from 'react-transition-state';

type PageProps = {
  open: boolean;
  children?: React.ReactNode;
  width: MotionValue;
  height: MotionValue;
  widthBefore: MotionValue;
};

const Page: React.FC<PageProps> = ({
  children,
  open,
  width,
  height,
  widthBefore,
}) => {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (ref.current && open) {
      width.set(ref.current?.offsetWidth);
      height.set(ref.current?.offsetHeight);
    }
  }, [open, ref]);

  return (
    <AnimatePresence>
      {open && (
        <PageContainer
          ref={ref}
          initial={{
            opacity: 0,
            zIndex: 1,
            top: 0,
          }}
          animate={{
            opacity: 1,
            position: 'relative',
          }}
          exit={{
            opacity: 0,
            zIndex: 0,
            top: 0,
            position: 'absolute',
          }}
          transition={{
            default: { duration: 0.24 },
            top: { duration: 0 },
            left: { duration: 0 },
            x: { duration: 0 },
          }}
        >
          {children}
        </PageContainer>
      )}
    </AnimatePresence>
  );
};

type ModalContentProps = {
  pages: any;
  open?: boolean;
  children: React.ReactNode;
};

const PagesContainer = styled(motion.div)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    display: block;
    max-width: 100%;
    min-width: 100%;
  }
`;

const ModalInner: React.FC<ModalContentProps> = ({ pages, children }) => {
  const pageId = router.value;
  const contentRef = useRef<any>(null);
  const initial = useMotionValue(true);
  const widthBefore = useMotionValue(0);
  const width = useMotionValue(0);
  const height = useMotionValue(0);
  const springWidth = useSpring(width, {
    mass: 0.3,
    damping: 20,
    stiffness: 220,
  });
  const springHeight = useSpring(height, {
    mass: 0.3,
    damping: 20,
    stiffness: 220,
  });

  useEffect(() => {
    if (!contentRef.current) return;
    // const timeout = setTimeout(() => {
    // widthBefore.set(width.get());
    // width.set(contentRef.current?.offsetWidth);
    // height.set(contentRef.current?.offsetHeight);
    // }, 32);

    // This is just used to avoid the initial animation
    if (initial.get()) {
      setTimeout(() => {
        initial.set(false);
      }, 300);
    }
  }, [pageId]);

  return (
    <InnerContainer
      initial={false}
      style={{
        width: initial.get() ? width : springWidth,
        height: initial.get() ? height : springHeight,
      }}
    >
      {children}
      <PagesContainer ref={contentRef}>
        {Object.keys(pages).map((key) => {
          const page = pages[key];
          return (
            // TODO: We may need to use the follow check avoid unnecessary computations, but this causes a bug where the content flashes
            // (key === pageId || key === prevPage) && (
            <Page
              key={key}
              open={key === pageId}
              width={width}
              height={height}
              widthBefore={widthBefore}
            >
              <PageContents key={`inner-${key}`}>{page}</PageContents>
            </Page>
          );
        })}
      </PagesContainer>
    </InnerContainer>
  );
};

export default ModalInner;
